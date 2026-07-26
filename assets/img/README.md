# Imágenes del portafolio — guía de entrega e integración

Esta carpeta está **vacía a propósito**. Cada hueco de imagen del libro se ve hoy como
un rectángulo con degradado, icono y pie de foto: es un **espacio preparado**, no un error.
En cuanto pongas un archivo aquí y lo declares en `js/main.js`, la foto real ocupa ese
hueco conservando marco, esquinas redondeadas, sombra y pie.

Si el archivo declarado no existe, el sitio **vuelve solo al hueco preparado**: nunca
queda un espacio en blanco ni una imagen rota. Puedes ir subiendo fotos de a una.

---

## 1. Cómo se reemplaza una imagen (3 pasos)

1. **Exporta** el archivo con las medidas de la tabla del punto 2 y guárdalo en esta carpeta
   (`assets/img/`) con el nombre exacto que indica la tabla.
2. **Declárala** en `js/main.js`. Según el caso:
   - **Personas** → array `TEAM`, campo `img`:
     ```js
     { name: 'Kevin Hawdo Díaz', role: 'Fundador y desarrollador',
       bio: '…', img: 'assets/img/equipo-kevin.jpg' },
     ```
   - **Proyectos** → objeto `PROJECTS`, campo `img`:
     ```js
     albareto: { name: 'ALBARETO', cat: 'E-commerce', desc: '…',
                 url: 'https://albaretolp.vercel.app', img: 'assets/img/proyecto-albareto.jpg' },
     ```
   - **Fotos de sección** (las de ambiente) → en la página correspondiente del array `pages`,
     la llamada `photo(...)` recibe la ruta y el texto alternativo como 4.º y 5.º argumento:
     ```js
     photo('users', 'ratio-wide tone-dark', 'Nuestro espacio de trabajo',
           'assets/img/inicio-equipo.jpg', 'Equipo trabajando en una laptop')
     ```
3. **Recarga** el navegador. No hay build ni compilación: el cambio es inmediato.

> **Encuadre fino:** si la foto queda mal centrada (una cara cortada, por ejemplo), no la
> recortes de nuevo. Añade `style="--pos: 50% 30%"` al `.photo` o ajusta la variable
> `--pos` en el CSS: el primer valor mueve horizontalmente, el segundo verticalmente
> (`0%` = arriba, `100%` = abajo). Por defecto es `50% 50%`, centrado.

---

## 2. Qué imagen va en cada hueco

Las medidas ya están al doble del tamaño real de pantalla, para que se vean nítidas en
pantallas Retina. **No subas archivos más grandes**: no se ven mejor y hacen lento el sitio.

| Archivo | Dónde aparece | Medida (px) | Encuadre | Qué debe mostrar |
|---|---|---|---|---|
| `inicio-equipo.jpg` | Inicio, página derecha | 1000 × 600 | Horizontal | Espacio de trabajo real: escritorio, laptop, la persona trabajando. Es la primera foto que se ve. |
| `nosotros-trabajo.jpg` | Quiénes somos, izquierda | 1000 × 720 | Horizontal | Ambiente de trabajo, manos sobre el teclado, pizarra con ideas. |
| `equipo-<nombre>.jpg` | El equipo (una por persona) | 600 × 800 | **Vertical** | Retrato de medio cuerpo, mirada a cámara. Ver punto 3. |
| `proceso-entrega.jpg` | Quiénes somos, derecha | 1000 × 600 | Horizontal | Reunión, videollamada o entrega de un proyecto. |
| `metodologia-proceso.jpg` | Metodología, izquierda | 1000 × 720 | Horizontal | Bocetos, wireframes, post-its, pizarra de planificación. |
| `metodologia-revision.jpg` | Metodología, derecha | 1200 × 525 | Panorámica | Revisión de pantalla, checklist, pruebas en varios dispositivos. |
| `tecnologias-codigo.jpg` | Tecnologías, izquierda | 1000 × 720 | Horizontal | Editor de código, terminal. Que se lea código real, no genérico. |
| `proyecto-albareto.jpg` | Proyectos, destacado | 1200 × 525 | Panorámica | Captura del sitio publicado, preferible dentro de un mockup de laptop. |
| `proyecto-trovix.jpg` | Proyectos, mini | 900 × 900 | **Cuadrado** | Captura del dashboard. Cuadrada: la fila se descuadra con otra proporción. |
| `proyecto-techstore.jpg` | Proyectos, mini | 900 × 900 | **Cuadrado** | Captura de la tienda. |
| `proyecto-tankeado.jpg` | Proyectos, mini | 900 × 900 | **Cuadrado** | Captura del sitio. |
| `og-portada.jpg` | Vista previa al compartir | 1200 × 630 | Panorámica | Captura del libro abierto. **No es una foto**: ver punto 5. |

**Formato y peso para todas:**
- Formato: `.jpg` para fotos, `.webp` si tu exportador lo permite (pesa la mitad y se ve igual).
- Peso máximo: **200 KB** por imagen; **120 KB** las cuadradas de proyecto.
- Calidad de exportación: 80 %. Por encima de eso solo sube el peso.
- Nombres en minúsculas, sin espacios, sin tildes y sin `ñ`.

---

## 3. Fotos del equipo

El hueco es **vertical 3:4** (600 × 800 px). Para que las fichas se vean como un conjunto
y no como un collage, todas las fotos deben compartir:

- **Mismo fondo**: una pared lisa, la misma para todos. Sirve una pared blanca o clara.
- **Misma luz**: de frente, preferible luz de ventana. Nunca a contraluz ni con flash directo.
- **Mismo encuadre**: de la cintura hacia arriba, cabeza centrada, con aire por encima.
- **Misma distancia**: marca el suelo con cinta y que todos se paren en el mismo punto.
- **Vertical**: gira el celular. Una foto horizontal recortada a 3:4 pierde la cabeza o los hombros.

Con celular basta: modo retrato, cámara a la altura de los ojos, dos metros de distancia.

**Para agregar una persona nueva**: añade un objeto al array `TEAM` en `js/main.js` y sube
su foto. Caben hasta **3 fichas por página**; con más, avísame y abro una segunda cara.

> Sobre fotos generadas con IA: funcionan como imagen de ambiente, pero **no las recomiendo
> para retratos con nombre real**. En un portafolio que vende confianza, un rostro de IA bajo
> un nombre verdadero se nota y resta credibilidad. Si aun así se usan, deben generarse todas
> con el mismo prompt de encuadre, luz y fondo, y conviene no ponerles nombre propio.

---

## 4. Capturas de proyectos

Para cada proyecto necesitas una captura del sitio ya publicado:

1. Abre el proyecto en el navegador **a pantalla completa** (F11) y con el zoom al 100 %.
2. Captura la portada, no una página interior.
3. Recorta a la proporción de la tabla (panorámica el destacado, cuadrada los pequeños).
4. Si la captura queda muy vacía, ponla dentro de un mockup de laptop o celular: se ve más
   profesional y disimula los bordes del navegador.

**Antes de publicar la captura de un cliente**, confirma que puedes mostrar su marca. Si no
tienes permiso por escrito, cambia el nombre por algo genérico ("Tienda de moda masculina")
y usa una captura sin logotipos visibles.

---

## 5. Imagen para compartir el enlace (`og-portada.jpg`)

Es la miniatura que sale cuando el enlace se manda **por WhatsApp**, LinkedIn o X. Sin ella,
el enlace se comparte como una tarjeta gris que parece rota.

- Medida exacta: **1200 × 630 px**.
- Contenido: una captura del libro abierto sobre la madera, con el título legible.
- Deja el texto importante en el centro: WhatsApp recorta los bordes en algunas vistas.
- Al subirla, verifica el resultado en <https://www.opengraph.xyz> pegando la URL del sitio.

---

## 6. Formulario de contacto (no es una imagen, pero se configura igual)

El formulario funciona hoy abriendo el cliente de correo. Para que los mensajes lleguen
**directo a la bandeja**, sin que el visitante tenga que enviarlos:

1. Entra en <https://web3forms.com>, escribe el correo donde quieres recibir los mensajes y
   copia la *access key* que te envían (es gratis, 250 mensajes al mes, sin tarjeta).
2. Pégala en `js/main.js`, en la constante `FORM_KEY`:
   ```js
   const FORM_KEY = 'a1b2c3d4-…';
   ```
3. Listo. El formulario pasa a enviar en segundo plano y muestra "¡Mensaje enviado!" en la
   página. Si el envío falla, abre el correo como respaldo para no perder el mensaje.

La clave es pública a propósito: solo sirve para enviarte correo **a ti** y se puede cambiar
cuando quieras desde el panel de Web3Forms.

---

## 7. Lista de verificación antes de publicar

- [ ] Ninguna imagen supera 200 KB.
- [ ] Los retratos son verticales y comparten fondo y luz.
- [ ] Las capturas cuadradas de proyecto son realmente cuadradas.
- [ ] Existe `og-portada.jpg` y el enlace se previsualiza bien en WhatsApp.
- [ ] Tienes permiso para mostrar las marcas de los clientes que aparecen.
- [ ] `FORM_KEY` está configurada y llegó un correo de prueba.
- [ ] Los datos de contacto de `js/main.js` (correo, WhatsApp, ciudad) son los definitivos.
