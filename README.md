# 🌙 Motel Luna · Tour virtual

> Un pequeño experimento con **GSAP**: un recorrido animado e interactivo por un motel de neón, hecho para jugar con scroll, timelines y microinteracciones.

Este proyecto es un **laboratorio de animación** con forma de juego. No es un sitio comercial ni un producto terminado: es una excusa para probar qué tan lejos se puede llegar con GSAP, SVG y nada más, **sin frameworks y sin compilar**.

La idea es sencilla: llegas de noche a la fachada, entras por la puerta, recorres el parqueadero y el lobby y subes en ascensor piso por piso hasta la suite. Todo lo mueve el scroll (o el auto tour, si prefieres solo mirar).

---

## 🎮 Cómo se juega

| Control | Qué hace |
|---|---|
| 🖱️ **Scroll** | Avanza o retrocede el recorrido. Todo está sincronizado con la rueda del mouse o el dedo. |
| ▶ **Auto tour** | El recorrido avanza solo. Se puede pausar en cualquier momento. |
| **x1 · x1.5 · x2 · x3** | Velocidad del auto tour. En celular es un solo botón que va rotando. |
| ▶▶ **Avanzar** | Mantenlo presionado para avanzar a tu ritmo y suéltalo para parar. |
| 🛗 **Botones F · 1 · 2 · 3 · 4** | El ascensor te lleva a cualquier piso, con puertas, contador y "¡Ding!". |
| 🛏️ **Chips de amenidades** | Resaltan cada elemento de la habitación. El minibar se abre. |
| 🔔 **Lobby** | Toca la campana de recepción o las llaves. |
| ⌨️ **Shift + RePág / AvPág** | Sube o baja de piso con el teclado. |

### El recorrido

1. **Fachada.** Noche estrellada, letrero de neón que titila, ventanas que se prenden y apagan y un carro que pasa por la calle. Al bajar, la cámara se acerca hasta la puerta, que se abre.
2. **Piso 1.** Recorrido horizontal por tres espacios:
   - **Parqueadero:** los carros entran a su garaje privado y baja la cortina; las motos llegan a su zona.
   - **Lobby:** recepción con lámparas, llavero y campana.
   - **Sala de espera:** con reloj y TV animados.
3. **Ascensor.** Entre cada piso, las puertas se cierran, el display cambia de número, la cabina vibra y se abre en el piso nuevo.
4. **Piso 2, Habitaciones Sencillas:** cama doble, baño con ducha, minibar y sonido.
5. **Piso 3, Habitación Especial:** cama doble, baño con bañera, minibar y sonido. Hay velas y pétalos.
6. **Piso 4, Suites:** cama doble, ducha, jacuzzi, turco, silla tántrica, minibar y sonido.

---

## 🧪 Qué se está experimentando

El objetivo era usar **las piezas principales de GSAP** en un mismo proyecto y ver cómo conviven.

### GSAP Core: tweens, timelines y easing
Las animaciones de entrada (el edificio que sube, las lámparas que caen con rebote, el sofá que se desliza) son `timelines` con el parámetro de posición para encadenar y solapar pasos:

```js
gsap.timeline()
  .from("#lobby-desk", { y: 240, autoAlpha: 0, duration: 0.8, ease: "power3.out" })
  .from(".lobby-lamp", { y: -280, ease: "bounce.out", stagger: 0.15 }, "<0.2");
```

### ScrollTrigger: pin, scrub y scroll horizontal
- **`pin` + `scrub`:** cada piso se "congela" en pantalla mientras el scroll arma la habitación pieza por pieza.
- **Scroll horizontal falso:** el piso 1 se mueve de lado mientras haces scroll vertical. Las animaciones internas usan `containerAnimation` para dispararse según la posición horizontal.
- **`ScrollTrigger.batch()`** anima en grupo los elementos del cierre.
- **El ascensor entre pisos** es una timeline con scrub que, en `onUpdate`, cambia el número del display al pasar la mitad del viaje.

```js
gsap.to(track, {
  x: () => -(track.scrollWidth - innerWidth),
  ease: "none", // obligatorio con containerAnimation
  scrollTrigger: { trigger: "#piso1", pin: true, scrub: 1, end: () => "+=" + distancia },
});
```

### gsap.utils: el toque orgánico
Lo que hace que la escena se sienta viva viene casi todo de `gsap.utils`:
- `random()` para el titileo de estrellas, las ventanas, las burbujas y el vapor.
- `toArray()` para seleccionar elementos dentro de cada SVG.
- `clamp()` para limitar el piso destino del ascensor.
- `repeatRefresh` para que cada ciclo de un loop tome valores aleatorios nuevos.

### gsap.matchMedia(): accesibilidad
Todo se construye dentro de `gsap.matchMedia()`. Si el sistema tiene activado **"reducir movimiento"** (`prefers-reduced-motion`), se desactivan los loops decorativos y el recorrido sigue funcionando.

### El auto tour
No es una animación aparte: un callback en `gsap.ticker` **mueve el scroll de la página** a una velocidad proporcional al alto de la pantalla. Por eso todas las animaciones con ScrollTrigger responden igual que con la rueda del mouse, sin duplicar lógica.

---

## 📚 Cosas que aprendimos en el camino

Algunos tropiezos reales que vale la pena anotar:

- **El orden de creación de los ScrollTriggers importa.** Los pins se calculan en el orden en que se crean. Al crear primero todos los ascensores y luego todos los pisos, las posiciones se desfasaban. La solución fue recorrer las secciones en el orden del DOM.
- **CSS `transition` + GSAP sobre la misma propiedad = problemas.** Los chips tenían `transition: transform` para el hover, y eso hacía que GSAP registrara un valor final equivocado (quedaban corridos 40px). Regla práctica: si GSAP anima una propiedad, CSS no le pone transición.
- **Los loops infinitos no deben correr si no se ven.** Cada sección pausa sus animaciones ambientales (gotas, vapor, burbujas) cuando sale de pantalla y las reanuda al volver.
- **`ease: "none"` en el scroll horizontal no es opcional.** Con otro ease, el scroll y la posición horizontal dejan de corresponder.

---

## 🗂️ Estructura

```
├── index.html       → estructura, textos y definiciones SVG compartidas
├── css/
│   └── styles.css   → estilos neón, layout responsive y dock móvil
├── js/
│   ├── scenes.js    → genera las ilustraciones SVG de cada escena
│   └── main.js      → animaciones, ScrollTrigger, ascensor y auto tour
└── .nojekyll        → GitHub Pages sirve los archivos tal cual
```

**Decisiones técnicas:**
- **Sin build ni dependencias locales.** GSAP 3.13 y ScrollTrigger se cargan desde CDN.
- **Ilustraciones 100% SVG generadas con JavaScript.** Cama, minibar, ducha, jacuzzi y demás son funciones reutilizables. Por ejemplo, `bed({ x, blanket })` dibuja una cama en cualquier posición y color.
- **Separación clara:** `scenes.js` solo dibuja y `main.js` solo anima.
- **Solo se animan transformaciones y opacidad,** para mantener los 60 fps.

---

## 🚀 Probarlo en local

Basta con cualquier servidor estático. Por ejemplo, con Python:

```bash
python -m http.server 5173
```

Luego abre <http://localhost:5173>.

> Abrir el `index.html` con doble clic también suele funcionar, pero con un servidor se comporta igual que publicado.

## 🌐 Publicarlo en GitHub Pages

1. Sube el repositorio a GitHub.
2. Ve a **Settings → Pages → Build and deployment**.
3. Elige **Deploy from a branch**, rama `main` y carpeta `/ (root)`.
4. En un par de minutos queda en `https://TU-USUARIO.github.io/NOMBRE-REPO/`.

---

## 🎨 Personalizarlo

- **Nombre del motel:** busca `Luna` en `index.html` y `js/scenes.js`.
- **Colores:** están como variables en `:root`, al inicio de `css/styles.css`.
- **Velocidad del auto tour:** cambia `pxPerSecond` en `js/main.js`.
- **Duración de cada piso:** ajusta el `end: "+=160%"` de cada ScrollTrigger. Un número más alto hace la sección más larga.

## 💡 Ideas para seguir experimentando

- Sonido ambiente (música suave, el "ding" del ascensor) con un botón para silenciar.
- `Flip` para transiciones entre la vista general y el detalle de cada amenidad.
- `MotionPathPlugin` para que los carros entren al garaje siguiendo una curva.
- `SplitText` para animar los títulos letra por letra.
- Migrar a React con `useGSAP()` para comparar enfoques.

---

Hecho con ☕, neón y [GSAP](https://gsap.com/).
