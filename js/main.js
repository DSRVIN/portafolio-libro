/* ============================================================
   Portafolio — Cuaderno interactivo
   Contenido de páginas, pestañas de navegación y UI del host.
   Motor de pase de hoja: js/flipbook.js (window.Flipbook).
   ============================================================ */
(function () {
    'use strict';

    /* Cambia aquí el correo de contacto del estudio */
    const CONTACT_EMAIL = 'winvingaer@gmail.com';
    const CONTACT_PHONE = '+51 000 000 000';
    const CONTACT_CITY  = 'Lima, Perú';

    /* =====================  Iconos (SVG inline, estilo Lucide)  ===================== */
    const IC = (paths, extra = '') =>
        `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${extra} aria-hidden="true">${paths}</svg>`;

    const icons = {
        home:     IC('<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M9 21v-6h6v6"/>'),
        users:    IC('<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6"/><circle cx="17.5" cy="9" r="2.6"/><path d="M16.5 14.3c2.9.3 5 2.4 5 5.7"/>'),
        method:   IC('<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>'),
        services: IC('<path d="M21 8 12 3 3 8l9 5 9-5Z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/>'),
        folder:   IC('<path d="M3 7a2 2 0 0 1 2-2h4l2 3h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"/>'),
        code:     IC('<path d="m8 7-5 5 5 5"/><path d="m16 7 5 5-5 5"/><path d="m13 4-3 16"/>'),
        team:     IC('<circle cx="12" cy="7" r="3.5"/><path d="M5 21c0-3.9 3.1-6.5 7-6.5s7 2.6 7 6.5"/>'),
        mail:     IC('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>'),
        search:   IC('<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>'),
        pen:      IC('<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5Z"/>'),
        shield:   IC('<path d="M12 3 4.5 6v5c0 5 3.2 8.4 7.5 10 4.3-1.6 7.5-5 7.5-10V6L12 3Z"/><path d="m9 11.5 2.2 2.2L15.5 9.5"/>'),
        headset:  IC('<path d="M4 13a8 8 0 0 1 16 0"/><rect x="3" y="13" width="4" height="6" rx="1.6"/><rect x="17" y="13" width="4" height="6" rx="1.6"/><path d="M20 19a3 3 0 0 1-3 2.5h-3"/>'),
        rocket:   IC('<path d="M5 15c-1.5 1.3-2 5-2 5s3.7-.5 5-2"/><path d="M12 15 9 12c1.5-4.5 4.5-8 10-9-.9 5.5-4.5 8.5-9 10Z"/><path d="M15.5 8.5h.01"/>'),
        heart:    IC('<path d="M12 20.5C7 16.5 3.5 13.5 3.5 9.6 3.5 7 5.5 5 8 5c1.6 0 3 .8 4 2 1-1.2 2.4-2 4-2 2.5 0 4.5 2 4.5 4.6 0 3.9-3.5 6.9-8.5 10.9Z"/>'),
        star:     IC('<path d="m12 3 2.7 5.7 6.3.8-4.6 4.3 1.2 6.2L12 17l-5.6 3 1.2-6.2L3 9.5l6.3-.8L12 3Z"/>'),
        check:    IC('<path d="m4.5 12.5 5 5 10-11"/>'),
        eye:      IC('<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="3"/>'),
        target:   IC('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2"/>'),
        phone:    IC('<path d="M5 4h4l1.5 4.5L8 10a12 12 0 0 0 6 6l1.5-2.5L20 15v4a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 3 6.2 2 2 0 0 1 5 4Z"/>'),
        pin:      IC('<path d="M12 21s-7-5.6-7-11a7 7 0 0 1 14 0c0 5.4-7 11-7 11Z"/><circle cx="12" cy="10" r="2.6"/>'),
        send:     IC('<path d="m21.5 2.5-10 10"/><path d="M21.5 2.5 15 21l-3.5-8.5L3 9l18.5-6.5Z"/>'),
        arrow:    IC('<path d="M7 17 17 7"/><path d="M9 7h8v8"/>'),
        arrowR:   IC('<path d="M4 12h16"/><path d="m13 5 7 7-7 7"/>'),
        cart:     IC('<circle cx="9" cy="20" r="1.6"/><circle cx="17" cy="20" r="1.6"/><path d="M3 4h2.5l2.2 11h10.8L21 7H7"/>'),
        mobile:   IC('<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>'),
        sparkle:  IC('<path d="M12 3c.6 3.8 2.2 5.4 6 6-3.8.6-5.4 2.2-6 6-.6-3.8-2.2-5.4-6-6 3.8-.6 5.4-2.2 6-6Z"/><path d="M19 14c.3 1.9 1.1 2.7 3 3-1.9.3-2.7 1.1-3 3-.3-1.9-1.1-2.7-3-3 1.9-.3 2.7-1.1 3-3Z"/>'),
        laptop:   IC('<rect x="4" y="5" width="16" height="11" rx="1.6"/><path d="M2 19h20"/>'),
        image:    IC('<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="1.8"/><path d="m4.5 18.5 5-5 3 3 3.5-3.5 3.5 3.5"/>'),
        menu:     IC('<path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/>'),
        close:    IC('<path d="m6 6 12 12"/><path d="m18 6-12 12"/>'),
        book:     IC('<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5v14Z"/><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"/>'),
        refresh:  IC('<path d="M21 12a9 9 0 1 1-2.6-6.3"/><path d="M21 3v6h-6"/>'),
        logo:     IC('<rect x="3.5" y="3.5" width="17" height="17" rx="2.5"/><path d="M9 15V9h6v6H9Z"/>'),
    };

    /* =====================  Piezas de contenido  ===================== */

    /** Bloque fotográfico placeholder (sustituir por <img> reales en assets/img). */
    const photo = (ic, cls, cap) =>
        `<div class="photo ${cls || ''}">
            <span class="photo-ic">${icons[ic] || icons.image}</span>
            ${cap ? `<span class="photo-cap">${cap}</span>` : ''}
        </div>`;

    const methodRow = (ic, num, title, desc, thumbIc, thumbTone) =>
        `<div class="method-row">
            <span class="method-ic">${icons[ic]}</span>
            <div class="method-txt">
                <h4>${num}. ${title}</h4>
                <p>${desc}</p>
            </div>
            <div class="photo method-thumb ${thumbTone || ''}"><span class="photo-ic">${icons[thumbIc]}</span></div>
        </div>`;

    const tlStep = (n, title, desc) =>
        `<div class="tl-step">
            <span class="tl-num">${n}</span>
            <div class="tl-body"><h4>${title}</h4><p>${desc}</p></div>
        </div>`;

    const card = (ic, title, desc) =>
        `<div class="card">
            <span class="card-ic">${icons[ic]}</span>
            <h4>${title}</h4>
            <p>${desc}</p>
        </div>`;

    const tech = (mono, bg, name, tag) =>
        `<div class="tech">
            <span class="tech-logo" style="background:${bg}">${mono}</span>
            <span><span class="tech-name">${name}</span><span class="tech-tag">${tag}</span></span>
        </div>`;

    const member = (ini, bg, name, role) =>
        `<div class="member">
            <span class="avatar" style="background:${bg}">${ini}</span>
            <div><h4>${name}</h4><p>${role}</p></div>
        </div>`;

    /* =====================  Páginas  ===================== */
    const pages = [

        /* 0 — Portada (cuero con marca repujada + CTA de apertura) */
        { className: 'pg-cover pg-cover-front', html: `
            <div class="cover-frame emb"></div>
            <div class="cover-emblem">${icons.logo}</div>
            <div class="cover-title-emb">Estudio Creativo</div>
            <div class="cover-rule emb-rule"></div>
            <div class="cover-tagline">Diseño · Desarrollo · Estrategia</div>
            <button class="back-cta cover-cta" type="button" id="btnOpen">Iniciar recorrido ${icons.arrowR}</button>
        `},

        /* 1 — Inicio · izquierda */
        { html: `
            <div class="eyebrow reveal">${icons.sparkle} Estudio Creativo</div>
            <h1 class="pg-title reveal">PORTAFOLIO</h1>
            <p class="pg-sub reveal">Creamos experiencias digitales que conectan, inspiran y transforman.</p>
            ${'' /* Foto del equipo: reemplazar por <img src="assets/img/equipo.jpg"> */}
            <div class="reveal">${photo('users', 'ratio-wide tone-dark', 'Nuestro equipo en acción')}</div>
            <div class="callout reveal">
                <span class="callout-ic">${icons.heart}</span>
                <div>
                    <h3>Nuestro propósito</h3>
                    <p>Ayudamos a marcas y organizaciones a crecer a través de soluciones digitales centradas en las personas y en resultados medibles.</p>
                </div>
            </div>
        `},

        /* 2 — Inicio · derecha (metodología resumen) */
        { html: `
            <h2 class="pg-h2 reveal">Nuestra Metodología</h2>
            <p class="pg-sub reveal">Un proceso colaborativo, claro y enfocado en resultados reales.</p>
            <div class="method-list reveal">
                ${methodRow('search', '01', 'Descubrimiento', 'Investigamos, escuchamos y entendemos las necesidades del proyecto.', 'users', '')}
                ${methodRow('pen', '02', 'Diseño UX/UI', 'Diseñamos experiencias intuitivas que combinan funcionalidad y estética.', 'image', 'tone-b')}
                ${methodRow('code', '03', 'Desarrollo', 'Construimos soluciones robustas, escalables y de alto rendimiento.', 'laptop', 'tone-dark')}
                ${methodRow('shield', '04', 'Pruebas', 'Validamos cada detalle para garantizar calidad, seguridad y estabilidad.', 'check', 'tone-d')}
                ${methodRow('headset', '05', 'Soporte & Evolución', 'Acompañamos, optimizamos y hacemos crecer tu solución en el tiempo.', 'rocket', 'tone-c')}
            </div>
        `},

        /* 3 — Quiénes somos · izquierda */
        { html: `
            <div class="eyebrow reveal">${icons.users} Quiénes somos</div>
            <h2 class="pg-h2 reveal">Un equipo,<br>una misma visión</h2>
            <p class="pg-body reveal">Somos un equipo de desarrolladores, diseñadores y estrategas que transformamos ideas en soluciones digitales efectivas. Nos une la curiosidad, el oficio y la obsesión por los detalles.</p>
            <div class="reveal">${photo('team', 'ratio-tall tone-c', 'Juntos creamos soluciones')}</div>
        `},

        /* 4 — Quiénes somos · derecha */
        { html: `
            <h2 class="pg-h2 reveal">Lo que nos define</h2>
            <div class="cards one-col reveal">
                ${card('target', 'Misión', 'Impulsar a empresas y personas con productos digitales útiles, bellos y bien construidos.')}
                ${card('eye', 'Visión', 'Ser el estudio de referencia para quienes buscan calidad artesanal con tecnología de punta.')}
                ${card('star', 'Valores', 'Transparencia, colaboración, mejora continua y compromiso real con cada proyecto.')}
            </div>
            <div class="callout reveal">
                <span class="callout-ic">${icons.sparkle}</span>
                <div>
                    <h3>Artesanal, pero tecnológico</h3>
                    <p>Cuidamos cada pixel y cada línea de código como si fuera una página de este cuaderno.</p>
                </div>
            </div>
        `},

        /* 5 — Metodología · izquierda */
        { html: `
            <div class="eyebrow reveal">${icons.method} Metodología</div>
            <h2 class="pg-h2 reveal">Cómo<br>trabajamos</h2>
            <p class="pg-body reveal">Cada proyecto recorre un camino probado: de la primera conversación al lanzamiento y más allá. Sin sorpresas, con entregas claras y comunicación constante en cada etapa.</p>
            <div class="reveal">${photo('method', 'ratio-tall tone-b', 'Proceso claro, resultados reales')}</div>
        `},

        /* 6 — Metodología · derecha */
        { html: `
            <h2 class="pg-h2 reveal">El proceso, paso a paso</h2>
            <div class="timeline reveal">
                ${tlStep('01', 'Descubrimiento', 'Entrevistas, análisis del negocio y definición de objetivos medibles.')}
                ${tlStep('02', 'Diseño UX/UI', 'Wireframes, prototipos navegables y diseño visual alineado a tu marca.')}
                ${tlStep('03', 'Desarrollo', 'Código limpio y escalable, con revisiones e integraciones continuas.')}
                ${tlStep('04', 'Pruebas de calidad', 'Testing funcional, rendimiento, seguridad y compatibilidad multi-dispositivo.')}
                ${tlStep('05', 'Entrega & soporte', 'Lanzamiento acompañado, capacitación y evolución continua del producto.')}
            </div>
        `},

        /* 7 — Servicios · izquierda */
        { html: `
            <div class="eyebrow reveal">${icons.services} Servicios</div>
            <h2 class="pg-h2 reveal">Soluciones a<br>tu medida</h2>
            <p class="pg-body reveal">Del sitio institucional al producto digital complejo: elegimos la tecnología según el problema, nunca al revés.</p>
            <div class="reveal">${photo('laptop', 'ratio-wide tone-dark', 'Desarrollo de alto impacto')}</div>
            <div class="callout reveal">
                <span class="callout-ic">${icons.check}</span>
                <div>
                    <h3>Todo incluido</h3>
                    <p>Estrategia, diseño, desarrollo, contenido y puesta en producción, en un solo equipo.</p>
                </div>
            </div>
        `},

        /* 8 — Servicios · derecha */
        { html: `
            <h2 class="pg-h2 reveal">Qué hacemos</h2>
            <div class="cards reveal">
                ${card('laptop', 'Sitios web', 'Landing pages y sitios corporativos rápidos y con SEO.')}
                ${card('cart', 'E-commerce', 'Tiendas online con pagos, inventario y analítica.')}
                ${card('mobile', 'Apps & sistemas', 'Soluciones a medida que automatizan tu operación.')}
                ${card('pen', 'Diseño UX/UI', 'Interfaces intuitivas centradas en tus usuarios.')}
                ${card('rocket', 'Optimización', 'Rendimiento, accesibilidad y conversión al máximo.')}
                ${card('headset', 'Soporte continuo', 'Mantenimiento, seguridad y evolución constante.')}
            </div>
        `},

        /* 9 — Proyectos · izquierda */
        { html: `
            <div class="eyebrow reveal">${icons.folder} Proyectos</div>
            <h2 class="pg-h2 reveal">Trabajo del que<br>estamos orgullosos</h2>
            <div class="project reveal">
                ${photo('cart', 'ratio-featured tone-dark')}
                <div class="project-body">
                    <div class="project-meta"><span>Aurora Store</span><span>E-commerce</span><span>2025</span></div>
                    <h4>Tienda online de moda sostenible</h4>
                    <p>Plataforma completa con catálogo dinámico, pagos y panel de gestión. +140% de ventas en 6 meses.</p>
                    <div class="chips"><span class="chip">Next.js</span><span class="chip">Node.js</span><span class="chip">Stripe</span></div>
                    <button class="project-cta" type="button">Ver proyecto ${icons.arrow}</button>
                </div>
            </div>
        `},

        /* 10 — Proyectos · derecha */
        { html: `
            <h2 class="pg-h2 reveal">Más casos</h2>
            <div class="project mini reveal">
                ${photo('shield', 'tone-d')}
                <div class="project-body">
                    <div class="project-meta"><span>Clínica Vitalis</span><span>Web + Citas</span><span>2024</span></div>
                    <h4>Portal médico con reservas</h4>
                    <p>Agenda online, historias clínicas y recordatorios automáticos.</p>
                    <div class="chips"><span class="chip">React</span><span class="chip">Laravel</span></div>
                </div>
            </div>
            <div class="project mini reveal">
                ${photo('book', 'tone-b')}
                <div class="project-body">
                    <div class="project-meta"><span>EduPro</span><span>Plataforma LMS</span><span>2025</span></div>
                    <h4>Campus virtual interactivo</h4>
                    <p>Cursos, evaluaciones y certificados para +5,000 estudiantes.</p>
                    <div class="chips"><span class="chip">Next.js</span><span class="chip">Python</span></div>
                </div>
            </div>
            <div class="callout reveal">
                <span class="callout-ic">${icons.folder}</span>
                <div>
                    <h3>+120 proyectos entregados</h3>
                    <p>Cada uno con su propia historia. ¿Escribimos la tuya en la siguiente página?</p>
                </div>
            </div>
        `},

        /* 11 — Tecnologías · izquierda */
        { html: `
            <div class="eyebrow reveal">${icons.code} Tecnologías</div>
            <h2 class="pg-h2 reveal">Herramientas<br>de precisión</h2>
            <p class="pg-body reveal">Dominamos un stack moderno y probado. La tecnología correcta para cada reto: ni más, ni menos.</p>
            <div class="reveal">${photo('code', 'ratio-tall tone-dark', 'Código limpio y escalable')}</div>
        `},

        /* 12 — Tecnologías · derecha */
        { html: `
            <h2 class="pg-h2 reveal">Nuestro stack</h2>
            <div class="tech-grid reveal">
                ${tech('H5', '#D65A31', 'HTML5', 'Estructura')}
                ${tech('CSS', '#2965C9', 'CSS3', 'Estilos')}
                ${tech('JS', '#C9A227', 'JavaScript', 'Interacción')}
                ${tech('Re', '#2E9BB5', 'React', 'Interfaces')}
                ${tech('Nx', '#2C2C2C', 'Next.js', 'Full-stack')}
                ${tech('No', '#4E8A3A', 'Node.js', 'Backend')}
                ${tech('La', '#C0392B', 'Laravel', 'Backend PHP')}
                ${tech('Py', '#3A6EA5', 'Python', 'Datos & APIs')}
                ${tech('Fg', '#8A4FBE', 'Figma', 'Diseño UI')}
                ${tech('WP', '#1F6E8C', 'WordPress', 'CMS')}
            </div>
        `},

        /* 13 — Equipo · izquierda */
        { html: `
            <div class="eyebrow reveal">${icons.team} Equipo</div>
            <h2 class="pg-h2 reveal">Las personas<br>detrás del código</h2>
            <p class="pg-body reveal">Un grupo pequeño a propósito: cada proyecto recibe la atención directa de quienes lo diseñan y lo construyen.</p>
            <div class="reveal">${photo('team', 'ratio-tall tone-c', 'Cinco amigos, un estudio')}</div>
        `},

        /* 14 — Equipo · derecha */
        { html: `
            <h2 class="pg-h2 reveal">Quién hace qué</h2>
            <div class="team-list reveal">
                ${member('FS', 'linear-gradient(150deg,#D6712A,#A64F16)', 'Dev Full-Stack', 'Arquitectura y desarrollo de extremo a extremo')}
                ${member('UX', 'linear-gradient(150deg,#8A4FBE,#5E3388)', 'Diseño UX/UI', 'Investigación, prototipos y diseño visual')}
                ${member('FE', 'linear-gradient(150deg,#2E9BB5,#1D6B7E)', 'Frontend', 'Interfaces rápidas, accesibles y animadas')}
                ${member('BE', 'linear-gradient(150deg,#4E8A3A,#33622A)', 'Backend', 'APIs, bases de datos e integraciones')}
                ${member('QA', 'linear-gradient(150deg,#C0903A,#8F6A24)', 'Calidad & PM', 'Pruebas, planificación y comunicación')}
            </div>
        `},

        /* 15 — Contacto · izquierda */
        { html: `
            <div class="eyebrow reveal">${icons.mail} Contacto</div>
            <h2 class="pg-h2 reveal">Hablemos de<br>tu proyecto</h2>
            <p class="pg-body reveal">Cuéntanos tu idea y te responderemos en menos de 24 horas con los primeros pasos.</p>
            <div class="contact-rows reveal">
                <div class="contact-row">${icons.mail}<span><strong>Correo</strong>${CONTACT_EMAIL}</span></div>
                <div class="contact-row">${icons.phone}<span><strong>Teléfono</strong>${CONTACT_PHONE}</span></div>
                <div class="contact-row">${icons.pin}<span><strong>Ubicación</strong>${CONTACT_CITY} · Trabajo remoto global</span></div>
            </div>
        `},

        /* 16 — Contacto · derecha (formulario) */
        { html: `
            <h2 class="pg-h2 reveal">Escríbenos</h2>
            <form class="form reveal" id="contactForm">
                <label>Nombre
                    <input type="text" name="nombre" placeholder="Tu nombre" required>
                </label>
                <label>Correo
                    <input type="email" name="correo" placeholder="tu@correo.com" required>
                </label>
                <label>Mensaje
                    <textarea name="mensaje" rows="4" placeholder="Cuéntanos sobre tu proyecto…" required></textarea>
                </label>
                <button class="form-send" type="submit">Enviar mensaje ${icons.send}</button>
            </form>
        `},

        /* 17 — Contraportada */
        { className: 'pg-cover', html: `
            <div class="cover-frame"></div>
            <div class="cover-brand">${icons.sparkle} Estudio Creativo</div>
            <h1 class="cover-title" style="font-size:9cqi">GRACIAS</h1>
            <div class="cover-rule"></div>
            <p class="cover-sub">Diseñamos y desarrollamos hoy las soluciones que impulsan el mañana.</p>
            <button class="back-cta" type="button" id="btnRestart">${icons.refresh} Volver al inicio</button>
        `},
    ];

    /* =====================  Secciones / pestañas  ===================== */
    const sections = [
        { label: 'Inicio',        icon: 'home',     page: 1,  bg: '#E1934E', ink: '#3D2410' },
        { label: 'Quiénes Somos', icon: 'users',    page: 3,  bg: '#F0E3C8', ink: '#4A3B24' },
        { label: 'Metodología',   icon: 'method',   page: 5,  bg: '#E3B04B', ink: '#3D2E10' },
        { label: 'Servicios',     icon: 'services', page: 7,  bg: '#B7C4A0', ink: '#33402A' },
        { label: 'Proyectos',     icon: 'folder',   page: 9,  bg: '#E2A48C', ink: '#4A2A1C' },
        { label: 'Tecnologías',   icon: 'code',     page: 11, bg: '#B9C7D2', ink: '#2C3B48' },
        { label: 'Equipo',        icon: 'team',     page: 13, bg: '#C9BBD9', ink: '#3A2E4A' },
        { label: 'Contacto',      icon: 'mail',     page: 15, bg: '#EFE3CE', ink: '#4A3B24' },
    ];

    /* =====================  Instancia del flipbook  ===================== */
    // Extensiones de "libro" sobre el motor de revista (flipbook.js no se toca):
    // - Tapas (primera y última hoja): tablas rígidas — giran planas alrededor
    //   del lomo, sin doblez alguno, hasta que se cierran.
    // - Hojas interiores: papel grueso de libro — el pliegue apenas se comba
    //   (la revista original permitía una desviación mucho mayor).
    class HardcoverBook extends Flipbook {
        _isBoard(idx) { return idx === 0 || idx === this.total - 1; }

        _startDrag(e, forward) {
            super._startDrag(e, forward);
            const g = this.drag;
            if (g && this._isBoard(g.idx)) {
                // tapa dura: pivote en el centro del borde → giro plano de tabla
                g.corner = { x: this._w, y: this._h / 2 };
                g.P = { x: forward ? this._w : -this._w, y: this._h / 2 };
            }
        }

        /* Igual que el motor, pero con rigidez de libro: devMax pasa de
           h*0.35*(1-0.65*nearSpine) a h*0.14*(1-0.8*nearSpine), y 0 en tapas. */
        _moveDrag(e) {
            const g = this.drag;
            if (!g) return;
            if (e.pointerType === 'mouse' && (e.buttons & 1) === 0) { this._endDrag(); return; }
            if (!g.moved && Math.abs(e.clientX - g.startX) > 4) g.moved = true;
            if (!g.moved) return;
            const now = performance.now();
            const dt = now - g.lastT;
            if (dt >= 5) {
                g.vx = Math.max(-3, Math.min(3, (e.clientX - g.lastX) / dt));
                g.lastX = e.clientX; g.lastT = now;
            }
            const r = this.el.getBoundingClientRect();
            const w = this._w, h = this._h, C = g.corner;
            let P = this._clampP(e.clientX - r.left, e.clientY - r.top, C);
            const nearSpine = Math.max(0, 1 - Math.abs(P.x) / w);
            const devMax = this._isBoard(g.idx) ? 0 : h * 0.14 * (1 - 0.8 * nearSpine);
            P = this._clampP(P.x, C.y + Math.max(-devMax, Math.min(devMax, P.y - C.y)), C);
            g.P = P;
            this._renderFold(g.idx, g.P, g.corner);
        }
    }

    const NORMAL_MS = 850;    // giro de hoja (algo más pausado: libro, no revista)
    const COVER_MS  = 1100;   // apertura/cierre de la tapa dura
    const bookEl = document.getElementById('book');
    const fb = new HardcoverBook(bookEl, {
        pages,
        flipDuration: NORMAL_MS,
        singleModeQuery: '(max-width: 640px)',
    });

    // Las tapas son tablas: sin sombra proyectada ni brillo de pliegue al girar
    [0, fb.total - 1].forEach(i => fb.sheets[i].el.classList.add('fb-board'));

    /* =====================  Pestañas + drawer  ===================== */
    const tabsEl = document.getElementById('tabs');
    const drawerListEl = document.getElementById('drawerList');

    const makeTab = (s, i) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'tab';
        b.style.setProperty('--tab-bg', s.bg);
        b.style.setProperty('--tab-ink', s.ink);
        b.innerHTML = `${icons[s.icon]}<span>${s.label}</span>`;
        b.dataset.section = i;
        b.addEventListener('click', () => { goSection(i); closeDrawer(); });
        return b;
    };
    sections.forEach((s, i) => tabsEl.appendChild(makeTab(s, i)));
    sections.forEach((s, i) => drawerListEl.appendChild(makeTab(s, i)));

    /* --- Navegación por hojeo: las pestañas pasan las hojas hasta su sección
       (rápido en las intermedias, giro completo en la última), en vez de
       saltar instantáneamente. --- */
    const RIFFLE_MS = 230, FINAL_MS = 620;
    let riffleTarget = null;   // hoja destino (spread) o vista destino (single)

    function riffleStep() {
        if (riffleTarget == null || fb.busy || fb.drag) return;
        const pos = fb.mode === 'single' ? fb.view : fb.current;
        if (pos === riffleTarget) { endRiffle(); return; }
        fb.opts.flipDuration = Math.abs(riffleTarget - pos) <= 1 ? FINAL_MS : RIFFLE_MS;
        if (riffleTarget > pos) fb.next(); else fb.prev();
        // en modo una-página hay medios pasos sin giro (misma hoja): continuar
        if (!fb.busy && riffleTarget != null) setTimeout(riffleStep, 40);
    }
    function endRiffle() {
        riffleTarget = null;
        fb.opts.flipDuration = NORMAL_MS;
    }
    // Arranque robusto: si el libro está ocupado (hoja asentándose), reintenta
    function kickRiffle() {
        if (riffleTarget == null) return;
        if (fb.busy || fb.drag) { setTimeout(kickRiffle, 90); return; }
        riffleStep();
    }
    fb.on('flipend', riffleStep);
    // Tras cualquier giro suelto (apertura de tapa incluida), restaurar el ritmo normal
    fb.on('flipend', () => { if (riffleTarget == null) fb.opts.flipDuration = NORMAL_MS; });

    /** Apertura de la tapa dura: giro plano y más pausado que una hoja normal. */
    function openCover() {
        if (fb.busy || fb.current !== 0) return;
        fb.opts.flipDuration = COVER_MS;
        fb.next();
    }

    function goSection(i) {
        riffleTarget = fb.mode === 'single'
            ? sections[i].page
            : Math.round(sections[i].page / 2);
        kickRiffle();
    }

    /** Índice de sección activa según el estado del libro (o -1). */
    function activeSection(info) {
        const p = info.mode === 'single' ? info.view : info.current * 2 - 1;
        if (p < 1 || p > 16) return -1;
        return Math.floor((p - 1) / 2);
    }

    /* =====================  Estado del cuaderno (cuero/anillas/pestañas)  ===================== */
    const notebook = document.getElementById('notebook');
    const btnPrev = document.getElementById('btnPrev');
    const btnNext = document.getElementById('btnNext');

    function renderUI(info) {
        // desplazamiento del cromo según posición del lomo
        const state = info.current === 0 ? 'cover' : (info.current >= fb.total ? 'end' : 'open');
        notebook.dataset.state = state;
        notebook.dataset.mode = info.mode;

        // cerrado: en escena solo el libro; al abrirlo aparecen footer,
        // contacto y flechas (y arrancan los contadores la primera vez)
        document.body.classList.toggle('book-closed', state === 'cover');
        if (state !== 'cover') startCounters();

        // pestaña activa (en barra lateral y drawer)
        const act = activeSection(info);
        document.querySelectorAll('.tab').forEach(t =>
            t.classList.toggle('active', Number(t.dataset.section) === act));

        btnNext.disabled = !info.canNext;
        btnPrev.disabled = !info.canPrev;
    }

    fb.on('change', renderUI);
    renderUI(fb.info());

    // Como en un cuaderno real, las hojas siempre están impresas: todas las
    // páginas nacen pintadas (ninguna cara visible queda en blanco al girar).
    bookEl.querySelectorAll('.fb-page').forEach(p => p.classList.add('is-in'));

    /* =====================  Navegación global  ===================== */
    // Cualquier control manual cancela un hojeo en curso
    btnNext.addEventListener('click', () => { endRiffle(); fb.next(); });
    btnPrev.addEventListener('click', () => { endRiffle(); fb.prev(); });
    window.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') { endRiffle(); fb.next(); }
        if (e.key === 'ArrowLeft')  { endRiffle(); fb.prev(); }
    });
    bookEl.addEventListener('pointerdown', (e) => {
        if (e.target.closest('.fb-hotspot')) endRiffle();
    }, true);

    document.getElementById('btnContact').addEventListener('click', () => goSection(7));

    // Delegación: botones dentro de páginas (se re-renderizan con el motor)
    bookEl.addEventListener('click', (e) => {
        if (e.target.closest('#btnOpen')) { openCover(); return; }
        if (e.target.closest('.pg-cover-front') && fb.current === 0 && !fb.busy) { openCover(); return; }
        if (e.target.closest('#btnRestart')) { goSection(0); return; }
        const cta = e.target.closest('.project-cta');
        if (cta) goSection(7);   // demo: "Ver proyecto" lleva a contacto
    });
    bookEl.addEventListener('submit', (e) => {
        const form = e.target.closest('#contactForm');
        if (!form) return;
        e.preventDefault();
        const d = new FormData(form);
        const subject = encodeURIComponent(`Proyecto de ${d.get('nombre')}`);
        const body = encodeURIComponent(`${d.get('mensaje')}\n\n— ${d.get('nombre')} (${d.get('correo')})`);
        window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    });

    /* =====================  Drawer móvil  ===================== */
    const drawer = document.getElementById('drawer');
    const veil = document.getElementById('drawerVeil');
    const fab = document.getElementById('menuFab');
    fab.innerHTML = icons.menu;
    document.getElementById('drawerClose').innerHTML = icons.close;

    function openDrawer() {
        drawer.classList.add('open');
        veil.classList.add('show');
        drawer.setAttribute('aria-hidden', 'false');
        fab.setAttribute('aria-expanded', 'true');
    }
    function closeDrawer() {
        drawer.classList.remove('open');
        veil.classList.remove('show');
        drawer.setAttribute('aria-hidden', 'true');
        fab.setAttribute('aria-expanded', 'false');
    }
    fab.addEventListener('click', () => drawer.classList.contains('open') ? closeDrawer() : openDrawer());
    veil.addEventListener('click', closeDrawer);

    /* =====================  Iconos del header y footer  ===================== */
    document.querySelector('.btn-contact-icon').innerHTML = icons.mail;
    document.querySelector('.btn-contact-arrow').innerHTML = icons.arrow;
    const footIcons = { folder: 'folder', users: 'users', calendar: 'star', chart: 'rocket' };
    document.querySelectorAll('.stat-icon').forEach(el => {
        el.innerHTML = icons[footIcons[el.dataset.icon]] || icons.star;
    });

    /* =====================  Contador animado del footer  =====================
       Arranca la primera vez que el libro se abre (el footer recién aparece). */
    let countersDone = false;
    function startCounters() {
        if (countersDone) return;
        countersDone = true;
        document.querySelectorAll('.stat-num').forEach(el => {
            const target = Number(el.dataset.count);
            const suffix = el.dataset.suffix || '';
            const t0 = performance.now();
            const dur = 1400;
            const step = (now) => {
                const t = Math.min(1, (now - t0) / dur);
                const k = 1 - Math.pow(1 - t, 3);
                el.textContent = Math.round(target * k) + suffix;
                if (t < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
        });
    }

    /* =====================  Parallax sutil del cuaderno  ===================== */
    const stage = document.getElementById('stage');
    let pxT = null;
    stage.addEventListener('pointermove', (e) => {
        if (fb.drag || matchMedia('(pointer: coarse)').matches) return;
        if (pxT) return;
        pxT = requestAnimationFrame(() => {
            pxT = null;
            const r = stage.getBoundingClientRect();
            const dx = (e.clientX - r.left) / r.width - 0.5;
            const dy = (e.clientY - r.top) / r.height - 0.5;
            notebook.style.translate = `${dx * 7}px ${dy * 5}px`;
        });
    });
    stage.addEventListener('pointerleave', () => { notebook.style.translate = '0px 0px'; });

})();
