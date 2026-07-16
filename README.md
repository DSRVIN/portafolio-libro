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
| `js/main.js` | Contenido de las 18 páginas, pestañas, drawer, contadores, parallax, formulario |
| `assets/img/` | Vacío: aquí van las fotos reales que reemplacen a los placeholders |

## Cómo funciona la escena

- El libro (`#book`) mide **una página** (`--pw` × `--ph` en `styles.css`); el motor
  muestra el pliego completo trasladando el contenedor (0% portada / 50% abierto / 100% final).
- No hay base de cuero: el cuaderno ES el objeto sobre la madera. Cerrado (`data-state`
  `cover`/`end`) aparece `.book-block` (contratapa rígida con voladizo + canto de hojas)
  para el grosor de **tapa dura**; las **pestañas** (`.chrome`) se desplazan con el lomo.
- La página carga con el **libro cerrado y nada más en escena**: el botón Contáctanos,
  las flechas y el footer aparecen (con fundido) recién al abrir la tapa, y los contadores
  del footer arrancan en ese momento. Se abre con "Iniciar recorrido", clic en la portada,
  las pestañas o las flechas.
- **Hojas de libro, no de revista** (`HardcoverBook`, subclase en `main.js`, sin tocar el
  motor): las hojas interiores apenas se comban al arrastrarlas (`devMax` reducido) y las
  **tapas** (primera y última hoja, clase `.fb-board`) giran totalmente planas — pivote
  central, sin doblez, sin sombra de barrido ni brillo de pliegue.
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

## Personalizar

- **Correo, teléfono y ciudad**: constantes al inicio de `js/main.js`
  (`CONTACT_EMAIL`, `CONTACT_PHONE`, `CONTACT_CITY`).
- **Fotos**: los bloques `photo(...)` de `js/main.js` son placeholders con gradiente e
  icono. Para usar fotos reales coloca los archivos en `assets/img/` y reemplaza el
  placeholder por `<img src="assets/img/mi-foto.jpg" alt="...">` dentro de un
  `<div class="photo ratio-wide">` (la clase conserva bordes y sombra).
- **Secciones/pestañas**: array `sections` en `js/main.js` (etiqueta, icono, color y
  página destino). Las páginas viven en el array `pages` (una entrada = una cara).
- **Paleta**: variables CSS al inicio de `css/styles.css`.
- **Estadísticas del footer**: atributos `data-count` / `data-suffix` en `index.html`.

## Pendientes sugeridos

- Reemplazar los placeholders por fotografías reales del equipo y de los proyectos.
- Páginas internas por proyecto (hoy "Ver proyecto" lleva a Contacto como demo).
- Conectar el formulario a un backend o servicio (hoy abre el cliente de correo con `mailto:`).
