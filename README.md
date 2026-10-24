# Motel Luna · Tour virtual

Maqueta interactiva hecha con **GSAP 3** (core, timelines, ScrollTrigger y `gsap.utils`).
Es HTML/CSS/JS puro, sin compilación: se sube tal cual a GitHub Pages.

## Recorrido

| Sección | Qué pasa |
|---|---|
| Fachada | Intro con letrero de neón, estrellas y carro pasando. Al hacer scroll se acerca a la puerta y se abre. |
| Piso 1 | Recorrido horizontal: parqueadero (los carros entran al garaje y baja la cortina, llegan las motos) → lobby (toca la campana o las llaves) → sala de espera. |
| Ascensor | Entre cada piso: se cierran las puertas, cambia el número, se abren en el piso nuevo. |
| Piso 2 | Habitación sencilla: cama doble, baño con ducha, minibar y sonido. |
| Piso 3 | Habitación especial: cama doble, baño con bañera, minibar y sonido. |
| Piso 4 | Suite: cama doble, ducha, jacuzzi, turco, silla tántrica, minibar y sonido. |

- **Auto tour**: recorre todo solo; velocidad x1 · x1.5 · x2 · x3 (se recuerda en el navegador). **Avanzar**: mantenlo presionado para avanzar a tu ritmo. El scroll normal sigue funcionando.
- El **panel del ascensor** (derecha en escritorio, abajo en móvil) lleva a cualquier piso con animación de puertas.
- Los **botones de amenidades** resaltan el elemento en la ilustración. El minibar se abre al tocarlo.
- Respeta `prefers-reduced-motion` (desactiva las animaciones en bucle).

## Estructura

```
index.html      → estructura y textos
css/styles.css  → estilos (colores en :root)
js/scenes.js    → ilustraciones SVG de cada escena
js/main.js      → animaciones GSAP / ScrollTrigger
```

Para cambiar el nombre del motel, busca `Luna` / `MOTEL LUNA` en `index.html` y `js/scenes.js`.

## Probar en local

```bash
python -m http.server 5173
```

Abre http://localhost:5173

## Publicar en GitHub Pages

1. Crea un repositorio y sube estos archivos a la rama `main`.
2. En GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch**, rama `main`, carpeta `/ (root)`.
3. Queda publicado en `https://TU-USUARIO.github.io/NOMBRE-REPO/`.
