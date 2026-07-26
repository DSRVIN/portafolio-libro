# Portafolio — Cuaderno interactivo

Landing page de portafolio con la metáfora de un **libro de tapa dura sobre un
escritorio de madera**: hojas color marfil rígidas (papel de libro, no de revista),
pestañas físicas tipo agenda y pase de hoja realista (arrastrable desde las esquinas).

Construido **sin dependencias ni build**: HTML + CSS + JS vanilla sobre el motor
`Flipbook` del proyecto `E:\Clases\revista-flipbook`.

## Ejecutar

Cualquier servidor estático sirve:

```bash
python -m http.server 5187
# → http://localhost:5187
```

(También está configurado en `.claude/launch.json` para la vista previa de Claude Code.)

## Estructura

| Archivo | Rol |
|---|---|
| `index.html` | Escena: escritorio, botón Contáctanos, cuaderno, footer de estadísticas, drawer móvil |
| `css/flipbook.css` | Estilos del motor de pase de hoja (copiado del proyecto revista, prefijo `.fb-`) |
| `css/styles.css` | Todo el diseño: madera, tapa dura, pestañas, contenido editorial de las páginas |
| `js/flipbook.js` | Motor `Flipbook` (copiado del proyecto revista, sin modificar) |
| `js/main.js` | Datos del estudio, contenido de las 18 caras, pestañas, drawer, contadores, formulario |
| `assets/img/` | Vacío por ahora. **[Guía de imágenes](assets/img/README.md)**: qué foto va en cada hueco, medidas y cómo sustituirlas |

## Cómo funciona la escena

- El libro (`#book`) mide **una página** (`--pw` × `--ph` en `styles.css`); el motor
  muestra el pliego completo trasladando el contenedor (0% portada / 50% abierto / 100% final).
- **La tapa dura no se dibuja debajo: son las dos hojas de los extremos.** No hay ninguna
  base de cuero. La primera y la última hoja son tablas con un voladizo de ~5 mm
  (`--board`) que **viaja con ellas al girar**: la cara exterior es cuero a sangre
  (`.pg-cover`, agrandada) y la interior lleva el canto con sombras de expansión
  (`.pg-inner`, sin agrandar la caja para no escalar las container queries).
  Como el motor deja esas dos hojas al fondo de cada pila, su cuero asoma alrededor del
  papel y **forma solo los dos marcos del libro abierto**, sin que nadie los pinte.
- El **canto del bloque de hojas** (`.page-edge.left/.right`) no es un adorno: `main.js`
  fija su grosor con las hojas que quedan a cada lado del lomo, así que al hojear el
  bloque migra de un lado al otro y de un vistazo se ve por dónde vas.
- Las **pestañas** (`.chrome`) nacen del canto del papel —no del borde de la tapa— y
  sobresalen cruzando por encima del voladizo, como los separadores de una agenda; de ahí
  que el cromo se dibuje por delante de la cubierta. Se desplazan con el lomo.
- La página carga con el **libro cerrado y nada más en escena**: el botón Contáctanos,
  las flechas y el footer aparecen (con fundido) recién al abrir la tapa, y los contadores
  del footer arrancan en ese momento. Se abre con "Iniciar recorrido", clic en la portada,
  las pestañas o las flechas.
- **Hojas de libro, no de revista** (`HardcoverBook`, subclase en `main.js`, sin tocar el
  motor): las hojas interiores apenas se comban al arrastrarlas (`devMax` reducido) y las
  **tapas** (primera y última hoja, clase `.fb-board`) giran totalmente planas — pivote
  central, sin doblez, sin sombra de barrido ni brillo de pliegue. `_renderFold` rehace su
  recorte extendido por el voladizo: el motor recorta cada cara a la caja de la página y,
  sin eso, la tabla se encogía al tamaño de una hoja a mitad de giro.
- La sombra de suelo de un lado nuevo aparece con retardo (`fb-has-left/right` en
  `styles.css`) para que no se dibuje un rectángulo sombreado antes de que la tapa aterrice.
- Sin anillas wire-o (se retiraron; quedan para una futura variante del diseño).
- Todas las páginas nacen pintadas (`.is-in`) para que ninguna cara quede en blanco al girar.
- Las pestañas navegan **hojeando** (`riffleStep` en `main.js`): giros rápidos (~230 ms)
  en las hojas intermedias y giro completo en la última, en vez de salto instantáneo.
  Apertura de tapa: 1100 ms; giro normal: 850 ms.
- Las páginas usan **container queries** (`cqi`): todo el contenido escala con el tamaño
  del cuaderno sin media queries por página.
- En móvil (≤ 640 px) el motor pasa a modo una-página y las pestañas se convierten en
  un menú lateral (drawer).

## Estructura del libro (18 caras / 9 hojas)

`0` tapa · `1` portadilla · `2` presentación · `3-4` quiénes somos · `5-6` el equipo ·
`7-8` metodología · `9-10` servicios y planes · `11-12` proyectos · `13-14` tecnologías ·
`15-16` contacto y formulario · `17` contraportada.

Reglas al añadir o quitar contenido:

- El total de caras debe seguir siendo **par** y cada sección empezar en **cara impar**
  (izquierda del pliego); si no, la contraportada deja de ser tapa.
- Al mover páginas hay que actualizar el array `sections` (campo `page`). `activeSection()`
  es genérico: una sección puede ocupar 2, 4 o más caras sin desincronizar las pestañas
  (Quiénes somos ya ocupa dos pliegos).
- Antes de dar por buena una página, comprobar que no desborda: `.fb-content` tiene
  `overflow:hidden` y el sobrante se **recorta en silencio**.

## Interacción dentro de las páginas

El motor dibuja cada hoja a todo el ancho del libro y sus zonas de agarre por encima de
todo, lo que impedía usar campos, enlaces y botones. Resuelto desde el CSS del host, sin
tocar el motor: `.fb-paper` no recibe puntero (solo las caras visibles), las zonas de
agarre se reducen al filo exterior, y `main.js` ignora las flechas del teclado y el gesto
de deslizar cuando el foco está en un campo. Se puede pasar página arrastrando la esquina
o deslizando sobre la propia hoja.

## Personalizar

Todo lo que cambia con el negocio está en constantes al inicio de `js/main.js`:

- **Marca**: `BRAND` (hoy "Estudio Creativo", provisional). También en el `<title>` y la
  descripción de `index.html`.
- **Contacto y redes**: `CONTACT_EMAIL`, `CONTACT_PHONE`, `WHATSAPP` (E.164, para `wa.me`),
  `WA_TEXT`, `CONTACT_CITY`, `SOCIAL`.
- **Equipo**: array `TEAM` (nombre, cargo, bio y `img`). Un objeto = una ficha.
- **Proyectos**: objeto `PROJECTS` (nombre, categoría, descripción, URL pública e `img`).
- **Formulario**: `FORM_KEY`. Vacía = abre el cliente de correo; con la clave de
  [Web3Forms](https://web3forms.com) envía directo a la bandeja. Ver la guía de assets.
- **Fotos**: `photo(icono, clases, pie, ruta, alt)`. Sin ruta deja el hueco preparado; si
  el archivo falta, vuelve solo al hueco. Detalle en [assets/img/README.md](assets/img/README.md).
- **Secciones/pestañas**: array `sections` (etiqueta, icono, color y cara destino).
- **Paleta**: variables CSS al inicio de `css/styles.css`.
- **Estadísticas del footer**: `data-count` / `data-suffix` en `index.html`.

## Pendientes

- Subir las fotos reales (equipo, ambiente y capturas de proyectos) según la guía de assets.
- Configurar `FORM_KEY` para que el formulario entregue los mensajes sin depender del
  cliente de correo.
- Añadir `assets/img/og-portada.jpg` para que el enlace se comparta con miniatura.
- Fijar la marca definitiva y sustituir el emblema geométrico por el logotipo real.
- Páginas internas por proyecto (hoy "Ver proyecto" abre el sitio publicado).
