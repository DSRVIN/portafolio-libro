/* ============================================================
   Flipbook v1.0 — motor de revista "peel" con arquitectura OO
   Sin dependencias. Diseñado para integrarse en otros proyectos.

   ARQUITECTURA (una clase = una responsabilidad):
     - FoldMath : geometría pura del pliegue (sin DOM, testeable aislada)
     - Emitter  : sistema de eventos on/off/emit (base de Flipbook)
     - Sheet    : una hoja física (frente, solapa, sombras) y su render
     - Flipbook : fachada pública — estado, gestos, navegación, modos

   USO:
     const fb = new Flipbook(contenedor, {
       pages: [{ className: 'portada', html: '<h1>...</h1>' }, ...],
       singleModeQuery: '(max-width: 640px)',   // opcional
       flipDuration: 650,                        // opcional (ms)
       pageNumbers: true,                        // opcional
       commitProgress: 0.42,                     // opcional (física)
       flickVelocity: 1.2,                       // opcional (px/ms)
       cornerSnap: 0.14,                         // opcional
     });
     fb.next(); fb.prev(); fb.goTo(n); fb.destroy();
     fb.on('change',    info => ...);   // estado/página visible cambió
     fb.on('flipstart', info => ...);   // una hoja empezó a voltearse
     fb.on('flipend',   info => ...);   // la hoja terminó de asentarse
     (la opción onChange sigue soportada como atajo de on('change'))

   Las clases internas se exponen como estáticos para extender desde
   el proyecto padre: Flipbook.FoldMath, Flipbook.Sheet, Flipbook.Emitter.

   TÉCNICA: en lugar de rotar la hoja en 3D, se calcula la línea de
   pliegue (mediatriz entre la esquina original de la hoja C y el punto
   P donde la sostiene el usuario) y se renderiza el frente recortado,
   el verso reflejado sobre esa línea y sombras dinámicas. FoldMath
   impone la inextensibilidad de una hoja cosida al lomo, por lo que
   ningún arrastre puede producir un doblez físicamente imposible.
   ============================================================ */
(function (root, factory) {
    if (typeof module === 'object' && module.exports) module.exports = factory();
    else root.Flipbook = factory();
})(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    /* =====================  FoldMath  =====================
       Geometría pura del pliegue. Todo estático, sin estado ni DOM. */
    class FoldMath {
        /** Recorta un polígono con el semiplano sign*((p-M)·n) >= 0 (Sutherland–Hodgman). */
        static clipPoly(poly, M, n, sign) {
            const out = [];
            for (let i = 0; i < poly.length; i++) {
                const a = poly[i], b = poly[(i + 1) % poly.length];
                const da = sign * ((a[0] - M[0]) * n[0] + (a[1] - M[1]) * n[1]);
                const db = sign * ((b[0] - M[0]) * n[0] + (b[1] - M[1]) * n[1]);
                if (da >= 0) out.push(a);
                if ((da < 0 && db > 0) || (da > 0 && db < 0)) {
                    const t = da / (da - db);
                    out.push([a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1])]);
                }
            }
            return out;
        }

        /** Convierte una lista de vértices en un clip-path: polygon(...) en px. */
        static toPolygon(pts, offX, offY) {
            return 'polygon(' + pts.map(p => (p[0] + offX).toFixed(2) + 'px ' + (p[1] + offY).toFixed(2) + 'px').join(',') + ')';
        }

        /** Matriz CSS que refleja el plano sobre la línea de pliegue (punto M, normal n). */
        static reflectionMatrix(Mx, My, nx, ny) {
            const a = 1 - 2 * nx * nx, b = -2 * nx * ny, d = 1 - 2 * ny * ny;
            const k = Mx * nx + My * ny;
            return `matrix(${a},${b},${b},${d},${2 * k * nx},${2 * k * ny})`;
        }

        /** Inextensibilidad de una hoja cosida al lomo (3 restricciones):
            - fibra horizontal del punto de agarre:  |P-(0,cy)| <= w
            - esquina superior del lomo:             |P-(0,0)| <= |C-(0,0)|
            - esquina inferior del lomo:             |P-(0,h)| <= |C-(0,h)|
            Las dos últimas equivalen a que el pliegue NUNCA cruce el lomo:
            sin ellas, arrastres extremos generaban dobleces imposibles (hoja "rota"). */
        static clampToSheet(x, y, C, w, h) {
            const lims = [
                [0, C.y, w],
                [0, 0, Math.hypot(w, C.y)],
                [0, h, Math.hypot(w, h - C.y)],
            ];
            for (let pass = 0; pass < 2; pass++) {
                for (const [sx, sy, rad] of lims) {
                    const dx = x - sx, dy = y - sy, d = Math.hypot(dx, dy);
                    if (d > rad) { x = sx + dx * rad / d; y = sy + dy * rad / d; }
                }
            }
            return { x, y };
        }
    }

    /* =====================  Emitter  =====================
       Sistema de eventos mínimo; Flipbook lo extiende. */
    class Emitter {
        constructor() { this._listeners = {}; }
        /** Suscribe un manejador. Devuelve this para encadenar. */
        on(type, fn) {
            (this._listeners[type] = this._listeners[type] || []).push(fn);
            return this;
        }
        /** Quita un manejador (o todos los del tipo si no se pasa fn). */
        off(type, fn) {
            if (!this._listeners[type]) return this;
            this._listeners[type] = fn ? this._listeners[type].filter(f => f !== fn) : [];
            return this;
        }
        emit(type, data) {
            (this._listeners[type] || []).slice().forEach(fn => fn(data));
            return this;
        }
    }

    /* =====================  Sheet  =====================
       Una hoja física: frente (recto), solapa (verso reflejado),
       sombra proyectada y brillo de pliegue. Solo sabe renderizarse:
       el estado del libro vive en Flipbook. */
    class Sheet {
        constructor(frontHTML, backHTML) {
            this.el = document.createElement('div');
            this.el.className = 'fb-paper';
            this.el.innerHTML =
                `<div class="fb-front">${frontHTML}</div>` +
                `<div class="fb-cast"></div>` +
                `<div class="fb-flap"><div class="fb-mirror">${backHTML}</div><div class="fb-foldshade"></div></div>`;
            this.front = this.el.querySelector('.fb-front');
            this.cast = this.el.querySelector('.fb-cast');
            this.flap = this.el.querySelector('.fb-flap');
            this.foldshade = this.el.querySelector('.fb-foldshade');
        }

        setZ(z) { this.el.style.zIndex = z; }

        /** Estado de reposo: plana a la derecha o volteada a la izquierda. */
        renderRest(flipped, w, h) {
            const cy = h;
            this.renderFold(flipped ? { x: -w, y: cy } : { x: w, y: cy }, { x: w, y: cy }, w, h);
        }

        /** Render del pliegue. P = esquina libre actual; C = esquina agarrada (w, cy).
            P=(w,cy) => reposo sin voltear; P=(-w,cy) => volteada. */
        renderFold(P, C, w, h) {
            const dx = P.x - C.x, dy = P.y - C.y;
            const dist = Math.hypot(dx, dy);

            if (dist < 0.5) {               // reposo: sin voltear
                this.front.style.display = '';
                this.front.style.clipPath = '';
                this.flap.style.display = 'none';
                this.cast.style.display = 'none';
                return;
            }
            const nx = dx / dist, ny = dy / dist;         // normal del pliegue
            const Mx = (P.x + C.x) / 2, My = (P.y + C.y) / 2;
            const rect = [[0, 0], [w, 0], [w, h], [0, h]];
            const keep = FoldMath.clipPoly(rect, [Mx, My], [nx, ny], +1);  // zona aún plana
            const fold = FoldMath.clipPoly(rect, [Mx, My], [nx, ny], -1);  // zona plegada

            // frente (recto): siempre recortado a la zona plana. (Nunca quitar el
            // recorte aquí: al final del giro "keep" es una astilla y sin recorte
            // la cara completa reaparecía un instante — flash de la portada.)
            if (keep.length < 3) {
                this.front.style.display = 'none';
            } else {
                this.front.style.display = '';
                this.front.style.clipPath = FoldMath.toPolygon(keep, 0, 0);
            }
            // solapa (verso reflejado sobre la línea de pliegue)
            if (fold.length < 3) {
                this.flap.style.display = 'none';
            } else {
                this.flap.style.display = '';
                this.flap.style.clipPath = keep.length < 3 ? '' : FoldMath.toPolygon(fold, 0, 0);
                this.flap.style.transform = FoldMath.reflectionMatrix(Mx, My, nx, ny);
            }
            // sombras (proporcionales al avance del pliegue)
            const fx = Math.min(1, Math.max(0, (C.x - P.x) / (2 * w)));
            const s = Math.sin(Math.PI * fx);
            if (s < 0.03 || fold.length < 3) {
                this.cast.style.display = 'none';
                this.foldshade.style.background = '';
                return;
            }
            const gx = -nx, gy = -ny;                     // del pliegue hacia adentro
            const ang = (Math.atan2(gx, -gy) * 180 / Math.PI).toFixed(2);
            const len = w * (0.12 + 0.3 * s);
            // sombra proyectada sobre lo revelado (caja de -w a w)
            const castClip = FoldMath.clipPoly([[-w, 0], [w, 0], [w, h], [-w, h]], [Mx, My], [nx, ny], -1);
            if (castClip.length < 3) {
                this.cast.style.display = 'none';
            } else {
                this.cast.style.display = '';
                this.cast.style.clipPath = FoldMath.toPolygon(castClip, w, 0);
                const L1 = 2 * w * Math.abs(gx) + h * Math.abs(gy);
                const p1 = Mx * gx + (My - h / 2) * gy + L1 / 2;
                this.cast.style.background =
                    `linear-gradient(${ang}deg, rgba(0,0,0,${(0.32 * s).toFixed(3)}) ${p1.toFixed(1)}px, rgba(0,0,0,0) ${(p1 + len).toFixed(1)}px)`;
            }
            // brillo/sombra del pliegue sobre la propia solapa
            const L2 = w * Math.abs(gx) + h * Math.abs(gy);
            const p2 = (Mx - w / 2) * gx + (My - h / 2) * gy + L2 / 2;
            this.foldshade.style.background =
                `linear-gradient(${ang}deg, rgba(255,255,255,${(0.30 * s).toFixed(3)}) ${p2.toFixed(1)}px, rgba(0,0,0,${(0.20 * s).toFixed(3)}) ${(p2 + 0.05 * w).toFixed(1)}px, rgba(0,0,0,0) ${(p2 + 0.45 * w).toFixed(1)}px)`;
        }

        destroy() { this.el.remove(); }
    }

    /* =====================  Flipbook  =====================
       Fachada pública. Orquesta hojas, gestos, animación y modos,
       y emite eventos para que el proyecto anfitrión reaccione. */
    class Flipbook extends Emitter {
        constructor(container, opts = {}) {
            super();
            this.el = container;
            this.pages = opts.pages || [];
            this.opts = Object.assign({
                singleModeQuery: '(max-width: 640px)',
                flipDuration: 650,
                pageNumbers: true,
                onChange: null,        // atajo legado de on('change')
                commitProgress: 0.42,  // fracción del recorrido (borde->lomo) para completar al soltar
                flickVelocity: 1.2,    // px/ms: sólo un "lanzamiento" claro completa con recorrido corto
                cornerSnap: 0.14,      // % de altura cerca de un borde donde el agarre se ajusta a la esquina exacta
            }, opts);

            this.total = Math.ceil(this.pages.length / 2);
            this.current = 0;      // hojas volteadas (solo lectura desde fuera)
            this.view = 0;         // página visible en modo una-página (solo lectura)
            this.mode = 'spread';  // 'spread' | 'single' (solo lectura)
            this.busy = false;
            this.drag = null;
            this._swipe = null;
            this._pending = null;  // acción de navegación encolada durante un settle
            this._anim = null;     // animación de asentado en curso (cancelable)

            if (this.opts.onChange) this.on('change', this.opts.onChange);

            this._build();
            this._bind();
            this._applyMode();     // el modo puede cambiar el tamaño del libro
            this._measure();
            this._renderAll();
            this._setZ();
            this._update();
        }

        /* ---------- API pública adicional ---------- */
        get pageCount() { return this.pages.length; }

        /** Estado actual (el mismo payload que reciben los eventos). */
        info() { return this._info(); }

        /* ---------- construcción ---------- */
        _pageHTML(page, idx) {
            if (!page) page = {};
            const isCover = idx === 0 || idx === this.pages.length - 1;
            const num = this.opts.pageNumbers && !isCover ? `<div class="fb-pagenum">${idx + 1}</div>` : '';
            return `<div class="fb-page ${page.className || ''}"><div class="fb-content">${page.html || ''}</div>${num}</div>`;
        }

        _build() {
            this.el.classList.add('fb-book');
            this.sheets = [];
            for (let i = 0; i < this.total; i++) {
                const sheet = new Sheet(this._pageHTML(this.pages[2 * i], 2 * i),
                                        this._pageHTML(this.pages[2 * i + 1], 2 * i + 1));
                this.el.appendChild(sheet.el);
                this.sheets.push(sheet);
            }
            this.hsPrev = document.createElement('div');
            this.hsPrev.className = 'fb-hotspot fb-prev';
            this.hsNext = document.createElement('div');
            this.hsNext.className = 'fb-hotspot fb-next';
            this.el.appendChild(this.hsPrev);
            this.el.appendChild(this.hsNext);
        }

        _measure() {
            const r = this.el.getBoundingClientRect();
            this._w = r.width;
            this._h = r.height;
        }

        /* ---------- render ---------- */
        _renderFold(idx, P, C) { this.sheets[idx].renderFold(P, C, this._w, this._h); }

        _renderRest(idx) { this.sheets[idx].renderRest(idx < this.current, this._w, this._h); }

        _renderAll() { for (let i = 0; i < this.total; i++) this._renderRest(i); }

        _setZ(movingIdx = -1) {
            this.sheets.forEach((s, i) => {
                s.setZ((i === movingIdx) ? this.total + 1
                     : (i < this.current) ? i + 1
                                          : this.total - i);
            });
        }

        /* ---------- estado / UI ---------- */
        _info() {
            const N = this.pages.length;
            const canNext = this.mode === 'single' ? this.view < N - 1 : this.current < this.total;
            const canPrev = this.mode === 'single' ? this.view > 0 : this.current > 0;
            const label = this.mode === 'single'
                ? `${this.view + 1} / ${N}`
                : this.current === 0 ? `1 / ${N}`
                : this.current === this.total ? `${N} / ${N}`
                : `${this.current * 2}–${this.current * 2 + 1} / ${N}`;
            return { mode: this.mode, current: this.current, view: this.view, canNext, canPrev, label };
        }

        _update() {
            const tx = this.mode === 'single'
                ? (this.view % 2 === 1 ? '100%' : '0%')
                : (this.current === 0 ? '0%' : this.current === this.total ? '100%' : '50%');
            this.el.style.transform = `translateX(${tx})`;
            this.el.classList.toggle('fb-has-left', this.current > 0);
            this.el.classList.toggle('fb-has-right', this.current < this.total);
            this.hsNext.classList.toggle('fb-hidden', !(this.current < this.total && (this.mode === 'spread' || this.view % 2 === 0)));
            this.hsPrev.classList.toggle('fb-hidden', !(this.current > 0 && (this.mode === 'spread' || this.view % 2 === 1)));
            this.emit('change', this._info());
        }

        /* ---------- asentado animado (P viaja hasta su esquina destino) ----------
           momentum=true (al soltar) usa ease-out: arranca rápido para continuar
           el impulso del dedo, sin el micro-tirón de arrancar en reposo.
           notify=true emite 'flipend' al terminar (hubo cambio de página). */
        _settle(idx, from, C, willFlip, momentum, notify) {
            this.busy = true;
            this._setZ(idx);
            const w = this._w;
            const target = { x: willFlip ? -w : w, y: C.y };
            const distX = Math.abs(target.x - from.x);
            const dur = Math.max(200, this.opts.flipDuration * Math.pow(distX / (2 * w), 0.6));
            const t0 = performance.now();
            const lift = (this._h / 2 - C.y) * 0.5 * Math.min(1, distX / (2 * w)); // arco (solo esquinas)
            let ended = false;
            const finish = () => {
                if (ended) return;
                ended = true;
                clearTimeout(toId);
                this._anim = null;
                this._renderRest(idx);
                this._setZ();
                this.busy = false;
                if (notify) this.emit('flipend', this._info());
                const p = this._pending; this._pending = null;
                if (p) this[p]();               // ejecuta la acción encolada durante el settle
            };
            const toId = setTimeout(finish, dur + 200); // respaldo: pestañas en 2º plano congelan rAF
            this._anim = { stop: () => { ended = true; clearTimeout(toId); this._anim = null; this.busy = false; } };
            const step = (now) => {
                if (ended) return;
                const t = Math.min(1, (now - t0) / dur);
                const k = momentum
                    ? 1 - Math.pow(1 - t, 3)                                       // ease-out (conserva impulso)
                    : (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2); // ease-in-out (desde reposo)
                const P = FoldMath.clampToSheet(
                    from.x + (target.x - from.x) * k,
                    from.y + (target.y - from.y) * k + lift * Math.sin(Math.PI * k),
                    C, this._w, this._h);
                this._renderFold(idx, P, C);
                if (t >= 1) finish(); else requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
        }

        /* ---------- navegación ---------- */
        next() {
            if (this.busy) { this._pending = 'next'; return; }   // encola: clics rápidos no se pierden
            if (this._w < 2) this._measure();
            const cy = this._h / 2;   // pivote en la mitad del borde: giro de hoja limpio (no "oreja")
            if (this.mode === 'single') {
                if (this.view >= this.pages.length - 1) return;
                this.view++;
                const target = Math.round(this.view / 2);
                if (target > this.current) {
                    const idx = this.current;
                    this.current = target;
                    this._update();
                    this.emit('flipstart', Object.assign(this._info(), { direction: 'next' }));
                    this._settle(idx, { x: this._w, y: cy }, { x: this._w, y: cy }, true, false, true);
                } else this._update();
            } else {
                if (this.current >= this.total) return;
                const idx = this.current;
                this.current++;
                this._update();
                this.emit('flipstart', Object.assign(this._info(), { direction: 'next' }));
                this._settle(idx, { x: this._w, y: cy }, { x: this._w, y: cy }, true, false, true);
            }
        }

        prev() {
            if (this.busy) { this._pending = 'prev'; return; }   // encola: clics rápidos no se pierden
            if (this._w < 2) this._measure();
            const cy = this._h / 2;   // pivote en la mitad del borde: giro de hoja limpio (no "oreja")
            if (this.mode === 'single') {
                if (this.view <= 0) return;
                this.view--;
                const target = Math.round(this.view / 2);
                if (target < this.current) {
                    const idx = this.current - 1;
                    this.current = target;
                    this._update();
                    this.emit('flipstart', Object.assign(this._info(), { direction: 'prev' }));
                    this._settle(idx, { x: -this._w, y: cy }, { x: this._w, y: cy }, false, false, true);
                } else this._update();
            } else {
                if (this.current <= 0) return;
                const idx = this.current - 1;
                this.current--;
                this._update();
                this.emit('flipstart', Object.assign(this._info(), { direction: 'prev' }));
                this._settle(idx, { x: -this._w, y: cy }, { x: this._w, y: cy }, false, false, true);
            }
        }

        goTo(view) {
            view = Math.max(0, Math.min(this.pages.length - 1, view));
            this.view = view;
            this.current = Math.round(view / 2);
            this._renderAll();
            this._setZ();
            this._update();
        }

        /* ---------- arrastre ---------- */
        _clampP(x, y, C) { return FoldMath.clampToSheet(x, y, C, this._w, this._h); }

        _startDrag(e, forward) {
            if (this.busy || this.drag) return;
            if (this._w < 2) this._measure();   // construido oculto (p.ej. modal): re-medir al usar
            const idx = forward ? this.current : this.current - 1;
            if (idx < 0 || idx >= this.total) return;
            const r = this.el.getBoundingClientRect();
            // cornerY continuo: se agarra desde donde toque el usuario. Cerca de un borde se
            // ajusta a la esquina exacta (oreja nítida); en el centro => giro de hoja plano.
            let cy = Math.max(0, Math.min(this._h, e.clientY - r.top));
            const snap = this._h * this.opts.cornerSnap;
            if (cy < snap) cy = 0; else if (cy > this._h - snap) cy = this._h;
            this.drag = {
                idx, forward,
                corner: { x: this._w, y: cy },
                P: { x: forward ? this._w : -this._w, y: cy },
                startX: e.clientX, moved: false,
                lastX: e.clientX, lastT: performance.now(), vx: 0,
            };
            this._setZ(idx);
            this.el.classList.add('fb-grabbing');
            // capturar el puntero: garantiza recibir pointerup/pointercancel aunque
            // se suelte fuera de la ventana (si no, la hoja quedaba pegada al cursor)
            try { e.target.setPointerCapture(e.pointerId); } catch (err) { /* punteros sintéticos */ }
            e.preventDefault();
        }

        _moveDrag(e) {
            const g = this.drag;
            if (!g) return;
            // botón ya suelto (pointerup perdido fuera de la ventana): terminar aquí.
            // La hoja jamás debe seguir al cursor sin que se esté presionando.
            if (e.pointerType === 'mouse' && (e.buttons & 1) === 0) { this._endDrag(); return; }
            if (!g.moved && Math.abs(e.clientX - g.startX) > 4) g.moved = true;
            if (!g.moved) return;
            const now = performance.now();
            const dt = now - g.lastT;
            // velocidad horizontal (px/ms), solo con Δt real (evita "flick" falso por
            // eventos casi simultáneos) y acotada a un máximo sensato.
            if (dt >= 5) {
                g.vx = Math.max(-3, Math.min(3, (e.clientX - g.lastX) / dt));
                g.lastX = e.clientX; g.lastT = now;
            }
            const r = this.el.getBoundingClientRect();
            const w = this._w, h = this._h, C = g.corner;
            let P = this._clampP(e.clientX - r.left, e.clientY - r.top, C);
            // La hoja no se "enrolla": la desviación vertical del pliegue se acota y se
            // endereza al acercarse al lomo, como una página real que se aplana al girar.
            const nearSpine = Math.max(0, 1 - Math.abs(P.x) / w);   // 0 en los bordes, 1 en el lomo
            const devMax = h * 0.35 * (1 - 0.65 * nearSpine);
            P = this._clampP(P.x, C.y + Math.max(-devMax, Math.min(devMax, P.y - C.y)), C);
            // La hoja se mantiene agarrada hasta soltar el clic: la decisión de pasar
            // o regresar se toma únicamente en _endDrag (al soltar).
            g.P = P;
            this._renderFold(g.idx, g.P, g.corner);
        }

        // Completa un volteo desde el arrastre y anima el asentado con momentum.
        _commitDrag(g, willFlip) {
            this.drag = null;
            this.el.classList.remove('fb-grabbing');
            const wasFlipped = !g.forward;
            const changed = willFlip !== wasFlipped;
            if (changed) {
                this.current += willFlip ? 1 : -1;
                if (this.mode === 'single') this.view = willFlip ? this.current * 2 - 1 : this.current * 2;
            }
            this._update();
            if (changed) this.emit('flipstart', Object.assign(this._info(), { direction: willFlip ? 'next' : 'prev' }));
            this._settle(g.idx, g.P, g.corner, willFlip, true, changed);
        }

        _endDrag() {
            const g = this.drag;
            if (!g) return;
            if (!g.moved) { this.drag = null; this.el.classList.remove('fb-grabbing'); g.forward ? this.next() : this.prev(); return; }
            const w = this._w;
            // progreso del gesto en su dirección: 0 = origen, 1 = borde libre en el lomo (media hoja)
            const prog = g.forward ? (w - g.P.x) / w : (g.P.x + w) / w;
            const flick = (g.forward ? (g.vx < -this.opts.flickVelocity) : (g.vx > this.opts.flickVelocity)) && prog >= 0.2;
            // completa si se llegó al umbral de recorrido, o con un lanzamiento claro tras un mínimo recorrido
            const commit = prog >= this.opts.commitProgress || flick;
            this._commitDrag(g, g.forward ? commit : !commit);
        }

        /* ---------- eventos DOM ---------- */
        _bind() {
            this._onDownNext = (e) => this._startDrag(e, true);
            this._onDownPrev = (e) => this._startDrag(e, false);
            this._onMove = (e) => this._moveDrag(e);
            this._onUp = () => this._endDrag();
            this._onSwipeDown = (e) => { if (!this.drag) this._swipe = { x: e.clientX, t: performance.now() }; };
            this._onSwipeUp = (e) => {
                const s = this._swipe;
                this._swipe = null;
                // gesto huérfano (su pointerup se perdió fuera de la ventana): ignorarlo
                // para que un clic posterior no dispare un pase de página fantasma.
                if (!s || performance.now() - s.t > 1500) return;
                const dx = e.clientX - s.x;
                if (Math.abs(dx) > 60) dx < 0 ? this.next() : this.prev();
            };
            this.hsNext.addEventListener('pointerdown', this._onDownNext);
            this.hsPrev.addEventListener('pointerdown', this._onDownPrev);
            window.addEventListener('pointermove', this._onMove);
            window.addEventListener('pointerup', this._onUp);       // antes que el swipe
            window.addEventListener('pointercancel', this._onUp);
            this._onBlur = () => this._endDrag();                    // perder el foco = soltar
            window.addEventListener('blur', this._onBlur);
            this.el.addEventListener('pointerdown', this._onSwipeDown);
            window.addEventListener('pointerup', this._onSwipeUp);

            this._mq = matchMedia(this.opts.singleModeQuery);
            this._onMq = () => this._applyMode();
            this._mq.addEventListener('change', this._onMq);

            this._refresh = () => {
                this._applyMode();   // primero el modo (puede cambiar el tamaño del libro)
                this._measure();
                this._renderAll();
                // no perder un pliegue en curso (arrastre activo)
                if (this.drag && this.drag.moved) this._renderFold(this.drag.idx, this.drag.P, this.drag.corner);
            };
            this._ro = new ResizeObserver(this._refresh);
            this._ro.observe(this.el);
            // tercera vía: resize de ventana con debounce (entornos donde
            // matchMedia/ResizeObserver llegan tarde o con valores desfasados)
            this._onResize = () => {
                clearTimeout(this._rzT);
                this._rzT = setTimeout(this._refresh, 150);
            };
            window.addEventListener('resize', this._onResize);
        }

        _applyMode() {
            const newMode = this._mq.matches ? 'single' : 'spread';
            if (newMode === this.mode && this.el.classList.contains('fb-single') === (newMode === 'single')) return;
            this.mode = newMode;
            this.el.classList.toggle('fb-single', this.mode === 'single');
            if (this.mode === 'single') this.view = this.current === this.total ? this.pages.length - 1 : this.current * 2;
            else this.current = Math.round(this.view / 2);
            this._update();
        }

        destroy() {
            if (this._anim) this._anim.stop();
            clearTimeout(this._rzT);
            window.removeEventListener('resize', this._onResize);
            window.removeEventListener('blur', this._onBlur);
            window.removeEventListener('pointermove', this._onMove);
            window.removeEventListener('pointerup', this._onUp);
            window.removeEventListener('pointercancel', this._onUp);
            window.removeEventListener('pointerup', this._onSwipeUp);
            this._mq.removeEventListener('change', this._onMq);
            this._ro.disconnect();
            this.sheets.forEach(s => s.destroy());
            this.el.classList.remove('fb-book', 'fb-single', 'fb-has-left', 'fb-has-right', 'fb-grabbing');
            this.el.innerHTML = '';
            this._listeners = {};
        }
    }

    /* Metadatos y clases internas expuestas para extender desde el proyecto padre */
    Flipbook.version = '1.0.0';
    Flipbook.FoldMath = FoldMath;
    Flipbook.Sheet = Sheet;
    Flipbook.Emitter = Emitter;

    return Flipbook;
});
