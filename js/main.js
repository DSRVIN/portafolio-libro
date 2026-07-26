/* ============================================================
   Portafolio — Libro interactivo
   Contenido de páginas, pestañas de navegación y UI del host.
   Motor de pase de hoja: js/flipbook.js (window.Flipbook).

   DATOS EDITABLES: todo lo que cambia con el negocio (contacto, redes,
   equipo, proyectos, servicios) vive en las constantes de arriba. El
   resto del archivo es estructura y comportamiento.
   ============================================================ */
(function () {
    'use strict';

    /* =====================  Datos del estudio  =====================
       Marca provisional: "Estudio Creativo". Al fijar la definitiva,
       cambia BRAND aquí y el <title>/description de index.html. */
    const BRAND        = 'Estudio Creativo';
    const CONTACT_EMAIL = 'dsrvin.solutions@gmail.com';
    const CONTACT_PHONE = '+51 926 037 358';
    const WHATSAPP      = '51926037358';        // E.164 sin signos, para wa.me
    const WA_TEXT       = 'Hola, vi tu portafolio y quiero cotizar un proyecto.';
    const CONTACT_CITY  = 'Lima, Perú';

    const SOCIAL = [
        { icon: 'linkedin',  label: 'LinkedIn',  url: 'https://www.linkedin.com/in/kevinhawdodiazsolier' },
        { icon: 'github',    label: 'GitHub',    url: 'https://github.com/DSRVIN' },
        { icon: 'instagram', label: 'Instagram', url: 'https://www.instagram.com/dsrvintp' },
        { icon: 'tiktok',    label: 'TikTok',    url: 'https://www.tiktok.com/@dsr_vin' },
    ];

    /* Formulario: pega aquí la access key de https://web3forms.com (gratis,
       250 envíos/mes). Mientras esté vacía, el formulario cae al cliente de
       correo (mailto:) como hasta ahora. Ver assets/img/README.md → Formulario. */
    const FORM_KEY = '';
    const FORM_ENDPOINT = 'https://api.web3forms.com/submit';

    /* Equipo. Añade una persona = un objeto más (máx. 4 por cara).
       `img`: ruta dentro de assets/img/ — vacío deja el hueco preparado. */
    const TEAM = [
        {
            name: 'Kevin Hawdo Díaz',
            role: 'Fundador y desarrollador',
            bio: 'Construyo desde una idea simple: cada cliente merece sentir que su proyecto importa de verdad.',
            img: '',
        },
    ];

    /* Proyectos reales (nombre, categoría, descripción y enlace público). */
    const PROJECTS = {
        albareto:   { name: 'ALBARETO',              cat: 'E-commerce', desc: 'Tienda online de ropa masculina, con catálogo y compra completa.', url: 'https://albaretolp.vercel.app', img: '' },
        tankeado:   { name: 'Tan.keado Urban Eats',  cat: 'Web',        desc: 'Sitio para empresa de comida rápida.',                             url: 'https://tankeado-urban-eats.vercel.app', img: '' },
        trovix:     { name: 'Trovix',                cat: 'Dashboard',  desc: 'Plataforma de control y gestión.',                                 url: 'https://trovix-rosy.vercel.app', img: '' },
        techstore:  { name: 'TechStore',             cat: 'E-commerce', desc: 'Tienda de productos tecnológicos.',                                url: 'https://techstore-virid.vercel.app', img: '' },
        bumanguesa: { name: 'Bumanguesa Neon Nights',cat: 'Web',        desc: 'Sitio para empresa de comida rápida.',                             url: 'https://bumanguesa-neon-nights-main.vercel.app', img: '' },
        flutter:    { name: 'Flutter Delivery',      cat: 'App móvil',  desc: 'App para envíos y ventas por e-commerce.',                         url: 'https://flutterdeliverylanding.vercel.app', img: '' },
        inmob:      { name: 'Emprendimientos Web',   cat: 'Web',        desc: 'Plataforma inmobiliaria.',                                         url: 'https://emprendimientos-web.vercel.app', img: '' },
    };

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
        chat:     IC('<path d="M21 12a8.5 8.5 0 0 1-12.4 7.5L3.5 21l1.5-4.8A8.5 8.5 0 1 1 21 12Z"/>'),
        clock:    IC('<circle cx="12" cy="12" r="9"/><path d="M12 7v5.2l3.2 1.9"/>'),
        linkedin: IC('<rect x="3" y="3" width="18" height="18" rx="2.5"/><path d="M7.5 10.5V17"/><path d="M7.5 7.6h.01"/><path d="M11.5 17v-6.5"/><path d="M11.5 13.4a2.3 2.3 0 0 1 4.6 0V17"/>'),
        instagram:IC('<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="3.8"/><path d="M17.3 6.7h.01"/>'),
        tiktok:   IC('<path d="M14.5 3.5c.5 2.2 1.9 3.5 4.1 3.7v3c-1.5 0-2.9-.4-4.1-1.2v6a5.4 5.4 0 1 1-4.6-5.3v3a2.4 2.4 0 1 0 1.7 2.3V3.5h2.9Z"/>'),
        github:   IC('<path d="M9.2 19.3c-3.6 1.1-3.6-1.9-5-2.3m10 4.5v-3.2c0-.9.1-1.2-.4-1.7 2.2-.2 4.4-1.1 4.4-4.9a3.8 3.8 0 0 0-1.1-2.6c.1-.3.5-1.3-.1-2.7 0 0-.9-.3-2.9 1a9.8 9.8 0 0 0-5.2 0C6.9 5.9 6 6.2 6 6.2c-.6 1.4-.2 2.4-.1 2.7a3.8 3.8 0 0 0-1.1 2.6c0 3.8 2.2 4.7 4.4 4.9-.3.3-.5.8-.5 1.4v3.5"/>'),
    };

    /* =====================  Piezas de contenido  ===================== */

    /* Tamaño del archivo por tipo de hueco (2x del render real; ver README de assets). */
    const RATIO_PX = {
        'ratio-featured': [1200, 525],
        'ratio-wide':     [1000, 600],
        'ratio-tall':     [1000, 720],
        'person-photo':   [ 600, 800],
        _default:         [ 900, 900],
    };

    /** Bloque fotográfico. Sin `src` pinta el hueco preparado (degradado +
        icono); con `src` pinta la imagen y conserva marco, sombra y pie.
        Si el archivo no existe, vuelve solo al hueco (nunca queda en blanco). */
    const photo = (ic, cls = '', cap = '', src = '', alt = '') => {
        const key = Object.keys(RATIO_PX).find(k => cls.includes(k)) || '_default';
        const [w, h] = RATIO_PX[key];
        const img = src
            ? `<img class="photo-img" src="${src}" alt="${alt}" width="${w}" height="${h}" decoding="async" draggable="false">`
            : '';
        return `<div class="photo ${cls}${src ? ' has-img' : ''}">
            <span class="photo-ic">${icons[ic] || icons.image}</span>
            ${img}
            ${cap ? `<span class="photo-cap">${cap}</span>` : ''}
        </div>`;
    };

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

    /** Fila de plan de mantenimiento: nivel + subtítulo de acento + descripción. */
    const plan = (ic, name, sub, desc) =>
        `<div class="plan">
            <span class="plan-ic">${icons[ic]}</span>
            <div class="plan-body">
                <h4>${name}<span class="plan-sub">${sub}</span></h4>
                <p>${desc}</p>
            </div>
        </div>`;

    const tech = (mono, bg, name, tag) =>
        `<div class="tech">
            <span class="tech-logo" style="background:${bg}">${mono}</span>
            <span><span class="tech-name">${name}</span><span class="tech-tag">${tag}</span></span>
        </div>`;

    /** Ficha de persona: retrato (o hueco preparado) + nombre, cargo y bio. */
    const person = (p) =>
        `<div class="person">
            ${photo('team', 'person-photo', '', p.img, p.img ? `Retrato de ${p.name}` : '')}
            <div class="person-body">
                <h4>${p.name}</h4>
                <span class="person-role">${p.role}</span>
                <p>${p.bio}</p>
            </div>
        </div>`;

    /** Tarjeta de proyecto real; el enlace abre el sitio publicado. */
    const project = (p, mini) =>
        `<div class="project${mini ? ' mini' : ''}">
            ${photo(mini ? 'laptop' : 'cart', mini ? 'tone-b' : 'ratio-featured tone-dark', '', p.img, p.img ? `Captura de ${p.name}` : '')}
            <div class="project-body">
                <div class="project-meta"><span>${p.cat}</span></div>
                <h4>${p.name}</h4>
                <p>${p.desc}</p>
                <a class="project-cta" href="${p.url}" target="_blank" rel="noopener">Ver proyecto ${icons.arrow}</a>
            </div>
        </div>`;

    /* =====================  Páginas  =====================
       Una entrada = una cara. El total debe ser PAR y cada sección
       empezar en cara IMPAR (izquierda del pliego): así la portada y la
       contraportada quedan como tapas y `goSection` cae en el pliego correcto. */
    const pages = [

        /* 0 — Portada (tapa dura, marca repujada) */
        { className: 'pg-cover pg-cover-front', html: `
            <div class="cover-frame emb"></div>
            <div class="cover-emblem">${icons.logo}</div>
            <div class="cover-title-emb">${BRAND}</div>
            <div class="cover-rule emb-rule"></div>
            <div class="cover-tagline">Diseño · Desarrollo · Automatización</div>
            <button class="back-cta cover-cta" type="button" id="btnOpen">Iniciar recorrido ${icons.arrowR}</button>
        `},

        /* 1 — Portadilla (media portada, como en un libro impreso) */
        { className: 'pg-plate', html: `
            <div class="plate-emblem reveal">${icons.logo}</div>
            <h1 class="plate-title reveal">PORTAFOLIO</h1>
            <div class="cover-rule reveal"></div>
            <p class="plate-sub reveal">${BRAND} · ${CONTACT_CITY}</p>
        `},

        /* 2 — Presentación */
        { html: `
            <div class="eyebrow reveal">${icons.sparkle} ${BRAND}</div>
            <h2 class="pg-title reveal">PORTAFOLIO</h2>
            <p class="pg-sub reveal">El código es la herramienta. Tu meta es el resultado.</p>
            <div class="reveal">${photo('users', 'ratio-wide tone-dark', 'Nuestro espacio de trabajo')}</div>
            <div class="callout reveal">
                <span class="callout-ic">${icons.heart}</span>
                <div>
                    <h3>Nuestro propósito</h3>
                    <p>El código no es el producto. El producto es el resultado que tu negocio consigue gracias a él.</p>
                </div>
            </div>
        `},

        /* 3 — Quiénes somos · izquierda */
        { html: `
            <div class="eyebrow reveal">${icons.users} Quiénes somos</div>
            <h2 class="pg-h2 reveal">Un estudio,<br>una obsesión</h2>
            <p class="pg-body reveal">Construimos productos digitales de principio a fin: web, apps, automatizaciones y backend. Sin capas intermedias ni promesas infladas.</p>
            <div class="reveal">${photo('team', 'ratio-tall tone-c', 'Así trabajamos')}</div>
        `},

        /* 4 — Quiénes somos · derecha */
        { html: `
            <h2 class="pg-h2 reveal">Lo que nos define</h2>
            <div class="cards one-col reveal">
                ${card('target', 'Orientados a resultados', 'Medimos el trabajo por lo que consigue tu negocio, no por la tecnología usada.')}
                ${card('chat', 'Comunicación directa', 'Hablas siempre con quien construye tu proyecto. Sin intermediarios.')}
                ${card('code', 'Código limpio y escalable', 'Lo que hoy es una landing mañana puede crecer sin reescribirse entero.')}
            </div>
            <div class="callout reveal">
                <span class="callout-ic">${icons.sparkle}</span>
                <div>
                    <h3>Comprometidos con tu éxito</h3>
                    <p>Cada cliente merece sentir que su proyecto importa de verdad.</p>
                </div>
            </div>
        `},

        /* 5 — Quiénes somos · el equipo (izquierda) */
        { html: `
            <div class="eyebrow reveal">${icons.team} El equipo</div>
            <h2 class="pg-h2 reveal">Quién está detrás</h2>
            <div class="people reveal">
                ${TEAM.map(person).join('')}
            </div>
            <div class="callout reveal">
                <span class="callout-ic">${icons.chat}</span>
                <div>
                    <h3>Trato directo</h3>
                    <p>Hablas con quien programa tu proyecto, de la primera idea a la entrega.</p>
                </div>
            </div>
        `},

        /* 6 — Quiénes somos · cómo trabajamos contigo (derecha) */
        { html: `
            <h2 class="pg-h2 reveal">Cómo trabajamos contigo</h2>
            <div class="cards one-col reveal">
                ${card('clock', 'Respuesta en 24 h', 'Sabes enseguida si podemos ayudarte y cómo.')}
                ${card('check', 'Sin compromiso inicial', 'La conversación y la propuesta no te cuestan nada.')}
                ${card('headset', 'Acompañamiento después', 'El proyecto no termina al entregarlo.')}
            </div>
            <div class="reveal">${photo('laptop', 'ratio-featured tone-b', 'Del primer mensaje a la entrega')}</div>
        `},

        /* 7 — Metodología · izquierda */
        { html: `
            <div class="eyebrow reveal">${icons.method} Metodología</div>
            <h2 class="pg-h2 reveal">Cómo<br>trabajamos</h2>
            <p class="pg-body reveal">Cada proyecto recorre un camino probado: de la primera conversación al lanzamiento y más allá. Sin sorpresas, con entregas claras y comunicación constante en cada etapa.</p>
            <div class="reveal">${photo('method', 'ratio-tall tone-b', 'Proceso claro, resultados reales')}</div>
        `},

        /* 8 — Metodología · derecha */
        { html: `
            <h2 class="pg-h2 reveal">El proceso, paso a paso</h2>
            <div class="timeline reveal">
                ${tlStep('01', 'Descubrimiento', 'Entendemos el negocio y definimos objetivos medibles.')}
                ${tlStep('02', 'Diseño UX/UI', 'Prototipos navegables y diseño alineado a tu marca.')}
                ${tlStep('03', 'Desarrollo', 'Código limpio y escalable, con revisiones continuas.')}
                ${tlStep('04', 'Pruebas de calidad', 'Funcionamiento, rendimiento, seguridad y multidispositivo.')}
                ${tlStep('05', 'Entrega y soporte', 'Lanzamiento acompañado y evolución continua.')}
            </div>
            <div class="reveal">${photo('check', 'ratio-strip tone-d', 'Cada etapa, revisada contigo')}</div>
        `},

        /* 9 — Servicios · izquierda */
        { html: `
            <div class="eyebrow reveal">${icons.services} Servicios</div>
            <h2 class="pg-h2 reveal">Nuestros servicios</h2>
            <div class="cards svc reveal">
                ${card('pin', 'Presencial', 'Consultoría, capacitación y soporte técnico en tus instalaciones.')}
                ${card('rocket', 'Crecimiento', 'Web multi-página con catálogo, galería, blog y estadísticas.')}
                ${card('refresh', 'Automatización', 'Conectamos tus herramientas vía API, con n8n y WhatsApp.')}
                ${card('code', 'Software a medida', 'Plataformas SaaS, CRM o ERP y aplicaciones móviles y web.')}
                ${card('cart', 'Ventas online', 'E-commerce con pagos, inventario y gestión de pedidos.')}
            </div>
        `},

        /* 10 — Servicios · derecha (planes de mantenimiento) */
        { html: `
            <h2 class="pg-h2 reveal">Planes de mantenimiento</h2>
            <p class="pg-sub reveal">Para que lo entregado siga funcionando y mejorando.</p>
            <div class="plans reveal">
                ${plan('shield', 'Básico', 'Actualizaciones y soporte', 'Actualizaciones menores, copias de seguridad mensuales y soporte técnico limitado.')}
                ${plan('eye', 'Profesional', 'Monitoreo y cambios', 'Monitoreo proactivo, cambios de contenido regulares y soporte prioritario.')}
                ${plan('star', 'Premium', 'Optimización estratégica', 'Mejoras continuas en tu web, optimización de rendimiento y consultoría de estrategia.')}
            </div>
        `},

        /* 11 — Proyectos · izquierda */
        { html: `
            <div class="eyebrow reveal">${icons.folder} Proyectos</div>
            <h2 class="pg-h2 reveal">Trabajo publicado</h2>
            <p class="pg-sub reveal">Siete proyectos en línea. Estos son algunos.</p>
            <div class="reveal">${project(PROJECTS.albareto)}</div>
        `},

        /* 12 — Proyectos · derecha */
        { html: `
            <h2 class="pg-h2 reveal">Más casos</h2>
            <div class="reveal">${project(PROJECTS.trovix, true)}</div>
            <div class="reveal">${project(PROJECTS.techstore, true)}</div>
            <div class="reveal">${project(PROJECTS.tankeado, true)}</div>
            <p class="proj-more reveal">También: Bumanguesa Neon Nights, Flutter Delivery y Emprendimientos Web.</p>
        `},

        /* 13 — Tecnologías · izquierda */
        { html: `
            <div class="eyebrow reveal">${icons.code} Tecnologías</div>
            <h2 class="pg-h2 reveal">Herramientas<br>de precisión</h2>
            <p class="pg-body reveal">La herramienta correcta para cada reto, ni más ni menos. También WordPress, Tailwind, AWS y Vercel según lo que pida el proyecto.</p>
            <div class="reveal">${photo('code', 'ratio-tall tone-dark', 'Código limpio y escalable')}</div>
        `},

        /* 14 — Tecnologías · derecha */
        { html: `
            <h2 class="pg-h2 reveal">Nuestro stack</h2>
            <div class="tech-grid reveal">
                ${tech('H5', '#D65A31', 'HTML5', 'Estructura')}
                ${tech('CSS', '#2965C9', 'CSS3', 'Estilos')}
                ${tech('JS', '#C9A227', 'JavaScript', 'Interacción')}
                ${tech('Re', '#2E9BB5', 'React', 'Interfaces')}
                ${tech('Nx', '#2C2C2C', 'Next.js', 'Full-stack')}
                ${tech('No', '#4E8A3A', 'Node.js', 'Backend')}
                ${tech('Py', '#3A6EA5', 'Python', 'Datos y APIs')}
                ${tech('Fl', '#2A7FA8', 'Flutter', 'Apps móviles')}
                ${tech('Fb', '#C9862A', 'Firebase', 'Tiempo real')}
                ${tech('n8', '#B5504A', 'n8n', 'Automatización')}
            </div>
        `},

        /* 15 — Contacto · izquierda */
        { html: `
            <div class="eyebrow reveal">${icons.mail} Contacto</div>
            <h2 class="pg-h2 reveal">Hablemos de<br>tu proyecto</h2>
            <p class="pg-body reveal">Cuéntanos tu idea y te respondemos en menos de 24 horas con los primeros pasos. La primera conversación no cuesta nada.</p>
            <div class="contact-rows reveal">
                <a class="contact-row" href="mailto:${CONTACT_EMAIL}">${icons.mail}<span><strong>Correo</strong>${CONTACT_EMAIL}</span></a>
                <a class="contact-row" href="https://wa.me/${WHATSAPP}?text=${encodeURIComponent(WA_TEXT)}" target="_blank" rel="noopener">${icons.chat}<span><strong>WhatsApp</strong>${CONTACT_PHONE}</span></a>
                <div class="contact-row">${icons.pin}<span><strong>Ubicación</strong>${CONTACT_CITY} · Trabajo remoto</span></div>
            </div>
            <div class="social-row reveal">
                ${SOCIAL.map(s => `<a class="social" href="${s.url}" target="_blank" rel="noopener" aria-label="${s.label}" title="${s.label}">${icons[s.icon]}</a>`).join('')}
            </div>
        `},

        /* 16 — Contacto · derecha (formulario) */
        { html: `
            <h2 class="pg-h2 reveal">Escríbenos</h2>
            <form class="form reveal" id="contactForm" novalidate>
                <label>Nombre
                    <input type="text" name="nombre" placeholder="Tu nombre" autocomplete="name" maxlength="80" required>
                </label>
                <label>Correo
                    <input type="email" name="correo" placeholder="tu@correo.com" autocomplete="email" inputmode="email" maxlength="120" required>
                </label>
                <label>Mensaje
                    <textarea name="mensaje" rows="4" placeholder="Cuéntanos sobre tu proyecto…" maxlength="1200" required></textarea>
                </label>
                <input type="checkbox" name="botcheck" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
                <button class="form-send" type="submit">Enviar mensaje ${icons.send}</button>
                <p class="form-note">Usamos tus datos solo para responderte.</p>
                <p class="form-status" id="formStatus" role="status" aria-live="polite"></p>
            </form>
        `},

        /* 17 — Contraportada */
        { className: 'pg-cover', html: `
            <div class="cover-frame"></div>
            <div class="cover-brand">${icons.sparkle} ${BRAND}</div>
            <h2 class="cover-title" style="font-size:9cqi">GRACIAS</h2>
            <div class="cover-rule"></div>
            <p class="cover-sub">El código es la herramienta.<br>Tu meta es el resultado.</p>
            <button class="back-cta" type="button" id="btnRestart">${icons.refresh} Volver al inicio</button>
        `},
    ];

    /* =====================  Secciones / pestañas  =====================
       `page` = cara izquierda del pliego donde empieza la sección.
       Quiénes somos abarca dos pliegos (3-4 y 5-6): la pestaña sigue
       marcada en ambos gracias a `activeSection`. */
    const sections = [
        { label: 'Inicio',        icon: 'home',     page: 1,  bg: '#E1934E', ink: '#3D2410' },
        { label: 'Quiénes Somos', icon: 'users',    page: 3,  bg: '#F0E3C8', ink: '#4A3B24' },
        { label: 'Metodología',   icon: 'method',   page: 7,  bg: '#E3B04B', ink: '#3D2E10' },
        { label: 'Servicios',     icon: 'services', page: 9,  bg: '#B7C4A0', ink: '#33402A' },
        { label: 'Proyectos',     icon: 'folder',   page: 11, bg: '#E2A48C', ink: '#4A2A1C' },
        { label: 'Tecnologías',   icon: 'code',     page: 13, bg: '#B9C7D2', ink: '#2C3B48' },
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

    // Si una foto real falta (404), se retira y vuelve a verse el hueco preparado
    bookEl.addEventListener('error', (e) => {
        const img = e.target;
        if (img.tagName !== 'IMG' || !img.classList.contains('photo-img')) return;
        const box = img.closest('.photo');
        if (box) box.classList.remove('has-img');
        img.remove();
    }, true);

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
    /** Salta a una sección por etiqueta (sobrevive a reordenar `sections`). */
    const goLabel = (label) => goSection(sections.findIndex(s => s.label === label));

    /** Índice de sección activa según el estado del libro (o -1).
        Busca la última sección cuya cara inicial ya se pasó: así una sección
        puede ocupar 2, 4 o más caras sin desincronizar las pestañas. */
    function activeSection(info) {
        const p = info.mode === 'single' ? info.view : info.current * 2 - 1;
        if (p < 1 || p > pages.length - 2) return -1;
        for (let i = sections.length - 1; i >= 0; i--) {
            if (p >= sections[i].page) return i;
        }
        return -1;
    }

    /* =====================  Estado del libro (tapas/pestañas)  ===================== */
    const notebook = document.getElementById('notebook');
    const btnPrev = document.getElementById('btnPrev');
    const btnNext = document.getElementById('btnNext');
    const FORM_FACE = pages.length - 2;   // cara del formulario (contacto derecha)

    function renderUI(info) {
        // desplazamiento del cromo según posición del lomo
        const state = info.current === 0 ? 'cover' : (info.current >= fb.total ? 'end' : 'open');
        notebook.dataset.state = state;
        notebook.dataset.mode = info.mode;

        // cerrado: en escena solo el libro; al abrirlo aparecen footer,
        // contacto y flechas (y arrancan los contadores la primera vez)
        document.body.classList.toggle('book-closed', state === 'cover');
        if (state !== 'cover') startCounters();

        // Con el formulario a la vista, la zona de agarre para pasar hoja se
        // estrecha: si no, tapa el 28% derecho de los campos y al hacer clic
        // en un input se pasa la página en vez de escribir.
        const rightFace = info.mode === 'single' ? info.view : info.current * 2;
        notebook.classList.toggle('form-open', rightFace === FORM_FACE);

        // pestaña activa (en barra lateral y drawer)
        const act = activeSection(info);
        document.querySelectorAll('.tab').forEach(t =>
            t.classList.toggle('active', Number(t.dataset.section) === act));

        btnNext.disabled = !info.canNext;
        btnPrev.disabled = !info.canPrev;
    }

    fb.on('change', renderUI);
    renderUI(fb.info());

    // Como en un libro real, las hojas siempre están impresas: todas las
    // páginas nacen pintadas (ninguna cara visible queda en blanco al girar).
    bookEl.querySelectorAll('.fb-page').forEach(p => p.classList.add('is-in'));

    /* =====================  Navegación global  ===================== */
    const isField = (el) => !!(el && el.closest && el.closest('input, textarea, select, a, button, [contenteditable]'));

    // Cualquier control manual cancela un hojeo en curso
    btnNext.addEventListener('click', () => { endRiffle(); fb.next(); });
    btnPrev.addEventListener('click', () => { endRiffle(); fb.prev(); });
    window.addEventListener('keydown', (e) => {
        // escribiendo en el formulario, las flechas mueven el cursor, no la hoja
        if (isField(e.target)) return;
        if (e.key === 'ArrowRight') { endRiffle(); fb.next(); }
        if (e.key === 'ArrowLeft')  { endRiffle(); fb.prev(); }
    });
    bookEl.addEventListener('pointerdown', (e) => {
        if (e.target.closest('.fb-hotspot')) endRiffle();
    }, true);
    // Seleccionar texto o arrastrar dentro de un campo no debe pasar la hoja:
    // en fase de captura llegamos antes que el gesto de swipe del motor.
    window.addEventListener('pointerup', (e) => {
        if (isField(e.target)) fb._swipe = null;
    }, true);

    document.getElementById('btnContact').addEventListener('click', () => goLabel('Contacto'));

    // Delegación: botones dentro de páginas (se re-renderizan con el motor)
    bookEl.addEventListener('click', (e) => {
        if (e.target.closest('#btnOpen')) { openCover(); return; }
        if (e.target.closest('.pg-cover-front') && fb.current === 0 && !fb.busy) { openCover(); return; }
        if (e.target.closest('#btnRestart')) { goSection(0); return; }
    });

    /* =====================  Envío del formulario  =====================
       Con FORM_KEY configurada envía por Web3Forms (sin backend propio) y
       muestra el estado dentro de la página. Sin clave, o si la petición
       falla, cae al cliente de correo para no perder el mensaje. */
    bookEl.addEventListener('submit', async (e) => {
        const form = e.target.closest('#contactForm');
        if (!form) return;
        e.preventDefault();

        const status = form.querySelector('#formStatus');
        const btn = form.querySelector('.form-send');
        const d = new FormData(form);
        const nombre = (d.get('nombre') || '').toString().trim();
        const correo = (d.get('correo') || '').toString().trim();
        const mensaje = (d.get('mensaje') || '').toString().trim();

        const setStatus = (msg, cls) => {
            status.textContent = msg;
            status.className = 'form-status' + (cls ? ' ' + cls : '');
        };

        if (!nombre || !correo || !mensaje) { setStatus('Completa los tres campos.', 'err'); return; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(correo)) { setStatus('Revisa el correo: no parece válido.', 'err'); return; }
        if (d.get('botcheck')) return;    // honeypot: bot detectado, se ignora

        const mailtoFallback = () => {
            const subject = encodeURIComponent(`Proyecto de ${nombre}`);
            const body = encodeURIComponent(`${mensaje}\n\n— ${nombre} (${correo})`);
            window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
        };

        if (!FORM_KEY) {
            setStatus('Abriendo tu correo para enviar el mensaje…');
            mailtoFallback();
            return;
        }

        btn.disabled = true;
        form.classList.add('is-sending');
        setStatus('Enviando…');
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), 12000);
        try {
            const res = await fetch(FORM_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                signal: ctrl.signal,
                body: JSON.stringify({
                    access_key: FORM_KEY,
                    subject: `Nuevo mensaje de ${nombre} — ${BRAND}`,
                    from_name: nombre,
                    name: nombre,
                    email: correo,
                    message: mensaje,
                }),
            });
            const out = await res.json().catch(() => ({}));
            if (!res.ok || out.success === false) throw new Error(out.message || 'error');
            form.reset();
            setStatus('¡Mensaje enviado! Te respondemos en menos de 24 horas.', 'ok');
        } catch (err) {
            setStatus('No se pudo enviar. Abrimos tu correo para que no pierdas el mensaje…', 'err');
            setTimeout(mailtoFallback, 900);
        } finally {
            clearTimeout(timer);
            btn.disabled = false;
            form.classList.remove('is-sending');
        }
    });

    // En móvil el teclado tapa el campo enfocado: lo centramos al enfocar
    bookEl.addEventListener('focusin', (e) => {
        if (!e.target.closest('#contactForm')) return;
        if (!matchMedia('(pointer: coarse)').matches) return;
        setTimeout(() => e.target.scrollIntoView({ block: 'center', behavior: 'smooth' }), 250);
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
    window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDrawer(); });

    /* =====================  Iconos del header y footer  ===================== */
    document.querySelector('.btn-contact-icon').innerHTML = icons.mail;
    document.querySelector('.btn-contact-arrow').innerHTML = icons.arrow;
    const footIcons = { folder: 'folder', users: 'services', calendar: 'clock', chart: 'heart' };
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

    /* =====================  Parallax sutil del libro  ===================== */
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
