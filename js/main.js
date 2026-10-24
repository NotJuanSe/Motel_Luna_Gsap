/* =========================================================
   Motel Luna · Tour virtual
   GSAP core + ScrollTrigger + gsap.utils
   ========================================================= */
gsap.registerPlugin(ScrollTrigger);
Scenes.render();

const { toArray, random, clamp } = gsap.utils;
const $ = (s, scope = document) => scope.querySelector(s);

const FLOORS = {
  0: { name: "Fachada", color: "#ffcf5c" },
  1: { name: "Lobby · Parqueadero · Sala de espera", color: "#ffcf5c" },
  2: { name: "Habitaciones Sencillas", color: "#2bd2ff" },
  3: { name: "Habitación Especial", color: "#ff3cac" },
  4: { name: "Suites", color: "#a77bff" },
};
const label = (n) => (n === 0 ? "F" : String(n));

/* ---------- Estado del ascensor (panel fijo) ---------- */
let current = 0;
let busy = false;
const liftNum = $("#lift-num");
const liftArrow = $("#lift-arrow");
const liftBtns = toArray(".lift-btn");

function setFloor(n) {
  if (n === current) return;
  liftArrow.textContent = n > current ? "▲" : "▼";
  current = n;
  liftNum.textContent = label(n);
  liftBtns.forEach((b) => b.classList.toggle("is-active", +b.dataset.go === n));
  toggleSubFloor(n === 1);
}

/* ---------- Submenú temporal del piso 1 (parqueadero · lobby · sala) ---------- */
const subFloor = $(".sub-floor");
const subBtns = toArray(".sub-btn");
let subShown = false;
let parkAnim = null; // timeline del parqueadero (para repetirla desde el submenú)

function toggleSubFloor(on) {
  if (on === subShown) return;
  subShown = on;
  gsap.killTweensOf([subFloor, ...subBtns]);
  if (on) {
    gsap.set(subFloor, { autoAlpha: 1 });
    gsap.fromTo(subBtns, { autoAlpha: 0, scale: 0.6 }, {
      autoAlpha: 1, scale: 1, duration: 0.35, ease: "back.out(2)", stagger: 0.06,
    });
  } else {
    gsap.to(subBtns, {
      autoAlpha: 0, scale: 0.6, duration: 0.2, stagger: { each: 0.04, from: "end" },
      onComplete: () => gsap.set(subFloor, { autoAlpha: 0 }),
    });
  }
}

// Resalta el área que se está viendo según el avance del scroll horizontal
function setArea(i) {
  subBtns.forEach((b, j) => b.classList.toggle("is-on", i === j));
}

// Scroll suave hasta un área: el track horizontal avanza lineal (ease "none"),
// así que el panel i está en progress = i / (paneles - 1)
function goArea(i) {
  const st = ScrollTrigger.getById("sec-1");
  if (!st || busy) return;
  const last = subBtns.length - 1;
  const target = clamp(st.start + 2, st.end - 2, st.start + (st.end - st.start) * (i / last));
  const proxy = { y: window.scrollY };
  busy = true; // pausa el auto tour mientras se desplaza
  gsap.to(proxy, {
    y: target,
    duration: clamp(0.6, 1.6, Math.abs(target - proxy.y) / 1500),
    ease: "power2.inOut",
    onUpdate: () => window.scrollTo(0, proxy.y),
    onComplete: () => {
      busy = false;
      tour.pos = window.scrollY;
      // Parqueadero: los carros y motos vuelven a entrar
      if (i === 0) parkAnim?.restart();
    },
  });
}

/* ---------- Loops ambientales: solo corren en la sección activa ---------- */
let loops = {};
const addLoop = (key, anim) => (loops[key] ||= []).push(anim.pause());
const toggleLoops = (key, on) => (loops[key] || []).forEach((a) => (on ? a.resume() : a.pause()));

function roomAmbient(svg, key) {
  const q = (s) => toArray(s, svg);

  const drops = q(".drop");
  if (drops.length)
    addLoop(key, gsap.fromTo(drops, { y: 0, autoAlpha: 1 }, {
      y: 360, autoAlpha: 0.2, duration: () => random(0.5, 0.9), ease: "power1.in",
      stagger: { each: 0.06, repeat: -1 },
    }));

  const waves = q(".wave");
  if (waves.length)
    addLoop(key, gsap.fromTo(waves, { autoAlpha: 0, x: -6 }, {
      autoAlpha: 1, x: 6, duration: 0.5, ease: "sine.inOut",
      stagger: { each: 0.15, repeat: -1, yoyo: true },
    }));

  const notes = q(".note");
  if (notes.length)
    addLoop(key, gsap.fromTo(notes, { y: 0, autoAlpha: 1 }, {
      y: -70, x: "random(-10, 25)", autoAlpha: 0, duration: 2, ease: "sine.out",
      stagger: { each: 1, repeat: -1 },
    }));

  const bubbles = q(".bubble");
  if (bubbles.length)
    addLoop(key, gsap.fromTo(bubbles, { y: 0, x: 0, autoAlpha: 0.9, scale: 0.6, transformOrigin: "50% 50%" }, {
      y: "random(-140, -60)", x: "random(-20, 20)", autoAlpha: 0, scale: 1.3,
      duration: "random(1.6, 3)", ease: "sine.out",
      stagger: { each: 0.15, repeat: -1 },
    }));

  const steam = q(".steam");
  if (steam.length)
    addLoop(key, gsap.to(steam, {
      keyframes: { y: [0, -270], opacity: [0, 0.55, 0], scale: [0.6, 1.6] },
      transformOrigin: "50% 50%", duration: "random(3, 5)", ease: "none",
      stagger: { each: 0.35, repeat: -1 },
    }));

  const flames = q(".flame");
  if (flames.length)
    addLoop(key, gsap.to(flames, {
      scaleY: "random(0.7, 1.25)", scaleX: "random(0.8, 1.1)", transformOrigin: "50% 100%",
      duration: 0.15, repeat: -1, yoyo: true, repeatRefresh: true, stagger: 0.05,
    }));

  const hearts = q(".neon-heart");
  if (hearts.length)
    addLoop(key, gsap.timeline({ repeat: -1, repeatDelay: 2.5 })
      .to(hearts, { opacity: 0.25, duration: 0.06, repeat: 5, yoyo: true }));

  const ceil = q(".ceil");
  if (ceil.length)
    addLoop(key, gsap.to(ceil, { opacity: 0.4, duration: 1.4, repeat: -1, yoyo: true, ease: "sine.inOut" }));
}

/* =========================================================
   Construcción de animaciones (gsap.matchMedia → respeta
   prefers-reduced-motion y limpia todo si cambia)
   ========================================================= */
const mm = gsap.matchMedia();

mm.add(
  { reduce: "(prefers-reduced-motion: reduce)", ok: "(prefers-reduced-motion: no-preference)" },
  (ctx) => {
    const { reduce } = ctx.conditions;
    loops = {};

    /* ---------- FACHADA ---------- */
    if (!reduce) {
      gsap.timeline({ defaults: { ease: "power3.out" } })
        .from("#building", { y: 120, autoAlpha: 0, duration: 1.4 })
        .from("#sign", { autoAlpha: 0, duration: 0.1 }, "-=0.6")
        .to("#sign", { keyframes: { opacity: [1, 0.2, 1, 0.4, 1] }, duration: 0.8, ease: "none" })
        .from(".facade-copy > *", { y: 30, autoAlpha: 0, stagger: 0.12, duration: 0.7 }, 0.3);

      const stars = toArray("#svg-fachada .star");
      addLoop("f0", gsap.to(stars, {
        opacity: "random(0.15, 1)", duration: "random(0.8, 2.5)",
        repeat: -1, yoyo: true, repeatRefresh: true, stagger: { each: 0.02, from: "random" },
      }));

      const wins = toArray("#svg-fachada .win");
      addLoop("f0", gsap.to({}, {
        duration: 0.35, repeat: -1,
        onRepeat: () => gsap.to(random(wins), { opacity: random([0.15, 0.6, 1]), duration: 0.25 }),
      }));

      addLoop("f0", gsap.timeline({ repeat: -1, repeatDelay: 3 })
        .to("#sign-text", { opacity: 0.3, duration: 0.05, repeat: 3, yoyo: true }));

      addLoop("f0", gsap.fromTo("#street-car", { x: -900 }, {
        x: 2100, duration: 8, ease: "none", repeat: -1, repeatDelay: 2.5,
      }));
    }

    gsap.timeline({
      scrollTrigger: {
        trigger: "#fachada",
        start: "top top",
        end: "+=150%",
        pin: true,
        scrub: 1,
        id: "sec-0",
        onLeave: () => toggleLoops("f0", false),
        onEnterBack: () => { toggleLoops("f0", true); setFloor(0); },
      },
    })
      .to("#scroll-hint", { autoAlpha: 0, duration: 0.2 }, 0)
      .to(".facade-copy", { autoAlpha: 0, y: -60, duration: 0.5 }, 0)
      // zoom hacia la puerta de entrada
      .to("#facade-world", { scale: 5.5, svgOrigin: "600 560", duration: 2, ease: "power2.in" }, 0.1)
      .to("#door-l", { x: -42, duration: 0.6 }, 0.9)
      .to("#door-r", { x: 42, duration: 0.6 }, 0.9)
      .to("#facade-fade", { autoAlpha: 1, duration: 0.4 }, 1.75);

    toggleLoops("f0", true);

    /* ---------- PISO 1: scroll horizontal ---------- */
    const track = $(".h-track");
    const hDist = () => track.scrollWidth - window.innerWidth;

    const hTween = gsap.to(track, {
      x: () => -hDist(),
      ease: "none", // obligatorio para containerAnimation
      scrollTrigger: {
        trigger: "#piso1",
        start: "top top",
        end: () => "+=" + hDist() * 1.1,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        id: "sec-1",
        onToggle: (self) => {
          toggleLoops("f1", self.isActive);
          if (self.isActive) setFloor(1);
        },
        onUpdate: (self) => setArea(Math.round(self.progress * (subBtns.length - 1))),
      },
    });

    // Parqueadero: los carros entran a su garaje y baja la cortina
    const cars = toArray("#svg-parking .car");
    const motos = toArray("#svg-parking .moto");
    const curtains = toArray("#svg-parking .curtain");
    const carTargets = [85, 385, 685];
    const motoTargets = [975, 1058];
    gsap.set(curtains, { scaleY: 0, transformOrigin: "50% 0%" });
    gsap.set([...cars, ...motos], { x: -300 });

    const parkTl = (parkAnim = gsap.timeline({
      scrollTrigger: { trigger: "#piso1", start: "top 60%", toggleActions: "play none none reverse" },
    }));
    cars.forEach((car, i) => {
      const t = i * 0.55;
      parkTl
        .to(car, { x: carTargets[i], duration: 1.1, ease: "power2.out" }, t)
        .to(car, { y: -30, scale: 0.85, transformOrigin: "50% 100%", duration: 0.45, ease: "power1.inOut" }, t + 1.1)
        .to(curtains[i], { scaleY: 1, duration: 0.7, ease: "bounce.out" }, t + 1.45);
    });
    motos.forEach((m, i) => {
      parkTl.to(m, { x: motoTargets[i], duration: 1.3, ease: "power2.out" }, 1.2 + i * 0.35);
    });

    // Lobby (se dispara por la posición horizontal)
    gsap.timeline({
      scrollTrigger: { trigger: ".panel-lobby", containerAnimation: hTween, start: "left 70%", toggleActions: "play none none reverse" },
    })
      .from("#lobby-desk", { y: 240, autoAlpha: 0, duration: 0.8, ease: "power3.out" })
      .from(".lobby-lamp", { y: -280, duration: 1, ease: "bounce.out", stagger: 0.15 }, "<0.2")
      .from("#svg-lobby .key", { rotation: -70, autoAlpha: 0, transformOrigin: "50% 0%", stagger: 0.05, duration: 0.5, ease: "back.out(3)" }, "<0.3")
      .from(".lobby-plant", { scale: 0, transformOrigin: "50% 100%", duration: 0.6, ease: "back.out" }, "<")
      .add(ringBell());

    // Sala de espera
    gsap.timeline({
      scrollTrigger: { trigger: ".panel-sala", containerAnimation: hTween, start: "left 70%", toggleActions: "play none none reverse" },
    })
      .from("#sofa", { x: -420, autoAlpha: 0, duration: 0.9, ease: "power3.out" })
      .from("#coffee-table", { y: 160, autoAlpha: 0, duration: 0.6, ease: "power2.out" }, "<0.2")
      .from("#tv-screen", { scaleY: 0.02, transformOrigin: "50% 50%", duration: 0.5, ease: "power2.out" })
      .from(".sala-plant", { scale: 0, transformOrigin: "50% 100%", duration: 0.6, ease: "back.out" }, "<");

    if (!reduce) {
      addLoop("f1", gsap.to("#min-hand", { rotation: 360, svgOrigin: "400 170", duration: 6, repeat: -1, ease: "none" }));
      addLoop("f1", gsap.to("#hour-hand", { rotation: 360, svgOrigin: "400 170", duration: 72, repeat: -1, ease: "none" }));
      addLoop("f1", gsap.to("#svg-sala .tv-bar", {
        scaleX: "random(0.25, 1)", transformOrigin: "0% 50%", duration: 0.6,
        repeat: -1, yoyo: true, repeatRefresh: true, stagger: 0.1,
      }));
      addLoop("f1", gsap.to(".lobby-lamp", {
        rotation: 2, transformOrigin: "50% 0%", duration: 2, repeat: -1, yoyo: true, ease: "sine.inOut", stagger: 0.4,
      }));
    }

    /* ---------- Pisos 2 → 4 con ascensor entre ellos ----------
       Se crean en el orden del DOM (ride, piso, ride, piso…) para
       que los pins se calculen de arriba hacia abajo. */
    toArray(".ride, .floor").forEach((sec) => {
      if (sec.classList.contains("ride")) return buildRide(sec);

      const n = +sec.id.replace("piso", "");
      const svg = $("svg", sec);
      const q = (s) => toArray(s, svg);

      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        scrollTrigger: {
          trigger: sec,
          start: "top top",
          end: "+=160%",
          pin: true,
          scrub: 0.8,
          id: "sec-" + n,
          onToggle: (self) => {
            toggleLoops("f" + n, self.isActive);
            if (self.isActive) setFloor(n);
          },
        },
      });

      tl.from(q(".bed-g"), { y: 240, autoAlpha: 0, duration: 1 })
        .from(q(".sound-g"), { y: -140, autoAlpha: 0, duration: 0.6 }, "<0.3")
        .from(q(".minibar-g"), { x: -180, autoAlpha: 0, duration: 0.6 }, "<0.2")
        .from(q(".bath-g"), { x: 280, autoAlpha: 0, duration: 0.8, stagger: 0.2 }, "<0.2")
        .from(q(".extra"), { y: 80, autoAlpha: 0, duration: 0.6, stagger: 0.2 })
        .from(toArray(".chip", sec), { x: 40, autoAlpha: 0, duration: 0.4, stagger: 0.1 }, "<")
        .to({}, { duration: 1.2 }); // pausa para disfrutar la habitación

      if (!reduce) roomAmbient(svg, "f" + n);
    });

    /* ---------- Final ---------- */
    gsap.set(".fin-item", { autoAlpha: 0, y: 40 });
    ScrollTrigger.batch(".fin-item", {
      start: "top 88%",
      onEnter: (els) => gsap.to(els, { autoAlpha: 1, y: 0, stagger: 0.12, duration: 0.7, ease: "power3.out", overwrite: true }),
      onLeaveBack: (els) => gsap.to(els, { autoAlpha: 0, y: 40, duration: 0.3, overwrite: true }),
    });

    // Barra de progreso (se crea al final: depende de todos los pins)
    gsap.to("#progress", { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.3 } });

    return () => { loops = {}; };
  }
);

/* ---------- Animación de un viaje en ascensor (scrub) ---------- */
function buildRide(ride) {
  const from = +ride.dataset.from;
  const to = +ride.dataset.to;
  ride.innerHTML = `
    <div class="cabin">
      <div class="ride-display"><span class="arrow">▲</span><span class="num">${from}</span></div>
      <div class="doorway">
        <div class="hall hall-from" style="--c:${FLOORS[from].color}">
          <span class="hall-num">${from}</span><span class="hall-name">${FLOORS[from].name}</span>
        </div>
        <div class="hall hall-to" style="--c:${FLOORS[to].color}">
          <span class="hall-num">${to}</span><span class="hall-name">${FLOORS[to].name}</span>
        </div>
        <div class="door l"></div><div class="door r"></div>
        <div class="ride-ding">¡Ding!</div>
      </div>
      <p class="ride-caption">Subiendo al piso ${to}…</p>
      <div class="ride-light"></div>
    </div>`;

  const cabin = $(".cabin", ride);
  const num = $(".num", ride);
  const arrow = $(".arrow", ride);
  const hallFrom = $(".hall-from", ride);
  const hallTo = $(".hall-to", ride);
  const doors = toArray(".door", ride);
  const light = $(".ride-light", ride);
  const ding = $(".ride-ding", ride);
  gsap.set(hallTo, { autoAlpha: 0 });
  gsap.set(light, { yPercent: -100 });

  let arrived = null;
  gsap.timeline({
    scrollTrigger: {
      trigger: ride,
      start: "top top",
      end: "+=140%",
      pin: true,
      scrub: 0.6,
      onUpdate: (self) => {
        const past = self.progress >= 0.5;
        if (past !== arrived) {
          arrived = past;
          num.textContent = past ? to : from;
          gsap.set(hallFrom, { autoAlpha: past ? 0 : 1 });
          gsap.set(hallTo, { autoAlpha: past ? 1 : 0 });
        }
        setFloor(past ? to : from);
      },
    },
  })
    .fromTo(doors, { xPercent: (i) => (i ? 100 : -100) }, { xPercent: 0, duration: 1, ease: "power2.inOut" })
    .to(light, { yPercent: 100, duration: 1.6, ease: "none" }, 1.1)
    .to(cabin, { keyframes: { y: [0, -4, 3, -3, 2, 0] }, duration: 1.6, ease: "none" }, 1.1)
    .to(arrow, { opacity: 0.15, duration: 0.2, repeat: 7, yoyo: true, ease: "none" }, 1.1)
    .to(doors, { xPercent: (i) => (i ? 100 : -100), duration: 1, ease: "power2.inOut" }, 2.9)
    .fromTo(ding, { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 1, scale: 1, duration: 0.3, ease: "back.out(3)" }, 2.9)
    .to(ding, { autoAlpha: 0, duration: 0.3 }, 3.6);
}

/* ---------- Navegación con los botones del ascensor ---------- */
const ov = $("#lift-overlay");
const ovDoors = toArray(".ov-door", ov);
const ovDisplay = $(".ov-display", ov);
const ovNum = $(".ov-num", ov);
const ovArrow = $(".ov-arrow", ov);
const ovDing = $(".ov-ding", ov);
gsap.set(ovDoors, { xPercent: (i) => (i ? 100 : -100) });

function targetY(n) {
  if (n === 0) return 0;
  const st = ScrollTrigger.getById("sec-" + n);
  if (!st) return 0;
  // En las habitaciones llegamos con el cuarto ya armado
  return n === 1 ? st.start + 2 : st.start + (st.end - st.start) * 0.72;
}

function goTo(n) {
  n = clamp(0, 4, n);
  if (busy || n === current) return;
  busy = true;
  const from = current;
  const dir = n > from ? 1 : -1;
  ovArrow.textContent = dir > 0 ? "▲" : "▼";
  ovNum.textContent = label(from);

  const tl = gsap.timeline({ onComplete: () => (busy = false) });
  tl.set(ov, { autoAlpha: 1 })
    .to(ovDoors, { xPercent: 0, duration: 0.55, ease: "power3.inOut" })
    .fromTo(ovDisplay, { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.3, ease: "back.out(2)" }, "-=0.15");

  for (let f = from + dir; dir > 0 ? f <= n : f >= n; f += dir) {
    tl.call(() => (ovNum.textContent = label(f)), null, "+=0.32");
  }

  tl.call(() => {
    window.scrollTo({ top: targetY(n), behavior: "instant" });
    ScrollTrigger.update();
    setFloor(n);
  }, null, "+=0.2")
    .fromTo(ovDing, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.25 }, "+=0.05")
    .to(ovDoors, { xPercent: (i) => (i ? 100 : -100), duration: 0.7, ease: "power3.inOut" }, "+=0.2")
    .to([ovDisplay, ovDing], { autoAlpha: 0, duration: 0.25 }, "<")
    .set(ov, { autoAlpha: 0 });
}

document.addEventListener("click", (e) => {
  const area = e.target.closest(".sub-btn");
  if (area) return goArea(+area.dataset.area);

  const go = e.target.closest("[data-go]");
  if (go) return goTo(+go.dataset.go);

  const chip = e.target.closest(".chip");
  if (chip) return highlight(chip);

  if (e.target.closest("#bell")) return ringBell();

  const key = e.target.closest("#svg-lobby .key");
  if (key)
    gsap.fromTo(key, { rotation: 0 }, {
      keyframes: { rotation: [25, -18, 10, -5, 0] }, transformOrigin: "50% 0%", duration: 0.9, ease: "none",
    });

  const mb = e.target.closest(".minibar-g");
  if (mb) toggleMinibar(mb);
});

// Teclado: Shift + RePág / AvPág para subir o bajar de piso
document.addEventListener("keydown", (e) => {
  if (e.target.closest("input, textarea")) return;
  if (e.key === "PageUp" && e.shiftKey) { e.preventDefault(); goTo(current + 1); }
  if (e.key === "PageDown" && e.shiftKey) { e.preventDefault(); goTo(current - 1); }
});

/* ---------- Interacciones ---------- */
function ringBell() {
  return gsap.timeline()
    .fromTo("#bell", { rotation: 0 }, { keyframes: { rotation: [-14, 12, -8, 4, 0] }, transformOrigin: "50% 100%", duration: 0.6, ease: "none" })
    .fromTo("#ding", { opacity: 0, y: 20, scale: 0.5 }, { opacity: 1, y: 0, scale: 1, transformOrigin: "50% 50%", duration: 0.35, ease: "back.out(3)" }, "<")
    .to("#ding", { opacity: 0, y: -10, duration: 0.4 }, "+=0.5");
}

function toggleMinibar(mb) {
  const door = $(".mb-door", mb);
  const open = door.dataset.open === "1";
  door.dataset.open = open ? "0" : "1";
  gsap.to(door, { scaleX: open ? 1 : 0.1, transformOrigin: "0% 50%", duration: 0.6, ease: "power2.inOut" });
}

function highlight(chip) {
  const el = document.querySelector(chip.dataset.target);
  if (!el) return;
  toArray(".chip", chip.closest(".amenities")).forEach((c) => c.classList.toggle("is-on", c === chip));
  el.classList.add("hl");
  gsap.fromTo(el, { scale: 1 }, {
    scale: 1.05, transformOrigin: "50% 50%", duration: 0.2, yoyo: true, repeat: 3, ease: "sine.inOut",
    onComplete: () => el.classList.remove("hl"),
  });
  if (el.classList.contains("minibar-g")) toggleMinibar(el);
}

/* =========================================================
   Auto tour + botón "Avanzar" (mantener presionado)
   Mueven el scroll de la página, así que todas las animaciones
   con ScrollTrigger responden igual que con la rueda del mouse.
   ========================================================= */
const tour = {
  auto: false,
  holding: false,
  speed: 1,
  pos: 0, // posición flotante (scrollTo redondea a px enteros)
  // velocidad cómoda en x1: ~16% de la altura de pantalla por segundo
  pxPerSecond: () => window.innerHeight * 0.16,
};
const playBtn = $("#tour-play");
const holdBtn = $("#tour-hold");
const speedBtns = toArray(".speed-btn");
const speedCycle = $("#speed-cycle"); // versión móvil: un botón que rota x1 → x3
const SPEEDS = [1, 1.5, 2, 3];

try {
  const saved = parseFloat(localStorage.getItem("motel-tour-speed"));
  if ([1, 1.5, 2, 3].includes(saved)) setSpeed(saved);
} catch (e) { /* sin localStorage: x1 por defecto */ }

function setSpeed(s) {
  tour.speed = s;
  speedBtns.forEach((b) => {
    const on = +b.dataset.speed === s;
    b.classList.toggle("is-on", on);
    b.setAttribute("aria-pressed", on);
  });
  speedCycle.textContent = "x" + s;
  speedCycle.setAttribute("aria-label", `Velocidad x${s}. Toca para cambiar`);
  try { localStorage.setItem("motel-tour-speed", s); } catch (e) {}
}

function setAuto(on) {
  const max = ScrollTrigger.maxScroll(window);
  if (on && window.scrollY >= max - 2) window.scrollTo(0, 0); // al final: empieza de nuevo
  tour.auto = on;
  tour.pos = window.scrollY;
  playBtn.classList.toggle("is-on", on);
  playBtn.setAttribute("aria-pressed", on);
  $(".ico", playBtn).textContent = on ? "❚❚" : "▶";
  $(".txt", playBtn).textContent = on ? "Pausar" : "Auto tour";
}

function setHolding(on) {
  if (on === tour.holding) return;
  tour.holding = on;
  tour.pos = window.scrollY;
  holdBtn.classList.toggle("is-on", on);
}

gsap.ticker.add((time, deltaTime) => {
  if (!(tour.auto || tour.holding) || busy) return;
  // si el usuario hizo scroll a mano, retomamos desde ahí
  if (Math.abs(window.scrollY - tour.pos) > 40) tour.pos = window.scrollY;

  const dt = Math.min(deltaTime, 50) / 1000;
  const max = ScrollTrigger.maxScroll(window);
  tour.pos = Math.min(max, tour.pos + tour.pxPerSecond() * tour.speed * dt);
  window.scrollTo(0, tour.pos);

  if (tour.pos >= max) {
    if (tour.auto) setAuto(false);
    setHolding(false);
  }
});

playBtn.addEventListener("click", () => setAuto(!tour.auto));
speedBtns.forEach((b) => b.addEventListener("click", () => setSpeed(+b.dataset.speed)));
speedCycle.addEventListener("click", () =>
  setSpeed(SPEEDS[(SPEEDS.indexOf(tour.speed) + 1) % SPEEDS.length])
);

holdBtn.addEventListener("pointerdown", (e) => {
  e.preventDefault();
  holdBtn.setPointerCapture?.(e.pointerId);
  setHolding(true);
});
["pointerup", "pointercancel", "lostpointercapture"].forEach((ev) =>
  holdBtn.addEventListener(ev, () => setHolding(false))
);
holdBtn.addEventListener("contextmenu", (e) => e.preventDefault());
// teclado: mantener Espacio/Enter sobre el botón
holdBtn.addEventListener("keydown", (e) => {
  if (e.key === " " || e.key === "Enter") { e.preventDefault(); setHolding(true); }
});
holdBtn.addEventListener("keyup", (e) => {
  if (e.key === " " || e.key === "Enter") setHolding(false);
});
holdBtn.addEventListener("blur", () => setHolding(false));

/* Recalcular cuando carguen las fuentes (cambian medidas del texto) */
document.fonts?.ready.then(() => ScrollTrigger.refresh());
