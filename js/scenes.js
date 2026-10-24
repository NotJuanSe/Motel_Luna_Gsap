/* =========================================================
   Ilustraciones SVG de cada escena (viewBox 1200 x 700).
   Solo genera el markup; las animaciones viven en main.js.
   ========================================================= */
(() => {
  const rnd = (min, max) => min + Math.random() * (max - min);
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const times = (n, fn) => Array.from({ length: n }, (_, i) => fn(i)).join("");

  /* ---------------- FACHADA ---------------- */
  const facade = () => {
    const winColors = ["#ffcf5c", "#ffcf5c", "#ff7ac8", "#7fe3ff"];
    const windows = [185, 295, 405]
      .map((y) =>
        times(5, (i) => {
          const x = 375 + i * 95;
          return `<rect class="win" x="${x}" y="${y}" width="70" height="60" rx="4" fill="${pick(winColors)}" opacity="${rnd(0.35, 1).toFixed(2)}" filter="url(#f-window)"/>
                  <rect x="${x}" y="${y}" width="70" height="60" rx="4" fill="none" stroke="#3b2c63" stroke-width="4"/>
                  <line x1="${x + 35}" y1="${y}" x2="${x + 35}" y2="${y + 60}" stroke="#3b2c63" stroke-width="3"/>`;
        })
      )
      .join("");

    let skyline = "";
    for (let x = -1400; x < 2600; x += rnd(50, 90)) {
      const h = rnd(60, 220);
      skyline += `<rect x="${x.toFixed(0)}" y="${(600 - h).toFixed(0)}" width="${rnd(40, 80).toFixed(0)}" height="${h.toFixed(0)}" fill="#160d2e"/>`;
    }

    // Silueta genérica de parca (origen en los pies). Solo se ve cuando la luz del poste la ilumina.
    const reaper = (x) => `
      <g transform="translate(${x} 601)">
        <g class="reaper" opacity="0">
          <ellipse cx="0" cy="0" rx="22" ry="4" fill="#000" opacity=".35"/>
          <g class="scythe">
            <path d="M17 6 L19 -112" stroke="#1d1530" stroke-width="3.5" stroke-linecap="round"/>
            <path d="M19 -112 Q-8 -126 -30 -102 Q-6 -114 19 -105Z" fill="#c9d1e6" opacity=".85"/>
          </g>
          <!-- Túnica: degradado que se desvanece abajo, borde rasgado, pliegues y bordes suaves -->
          <g filter="url(#f-robe)">
            <path d="M-23 -2 C-26 -32 -20 -60 -14 -78 C-12 -93 -6 -101 0 -101 C6 -101 12 -93 14 -78 C19 -60 25 -32 23 -2
                     L18 -9 L14 1 L9 -7 L4 2 L-1 -8 L-6 1 L-11 -7 L-16 2Z" fill="url(#g-robe)"/>
            <path d="M-6 -72 Q-11 -38 -13 -6 M5 -72 Q9 -40 12 -6 M0 -66 Q-1 -36 1 -4" stroke="#2a1f45" stroke-width="1.2" fill="none" opacity=".7"/>
            <path class="arm-hold" d="M10 -58 Q16 -62 19 -66" stroke="#0a0614" stroke-width="7" stroke-linecap="round" fill="none"/>
            <path d="M-14 -78 C-12 -93 -6 -101 0 -101 C6 -101 12 -93 14 -78" stroke="#3a2d5c" stroke-width="1.4" fill="none" opacity=".8"/>
          </g>
          <ellipse cx="0" cy="-82" rx="7.5" ry="9.5" fill="#000"/>
          <circle class="reaper-eye" cx="-3" cy="-83" r="1.5" fill="#ff3b3b" filter="url(#f-glow)"/>
          <circle class="reaper-eye" cx="3" cy="-83" r="1.5" fill="#ff3b3b" filter="url(#f-glow)"/>
          <!-- Solo para el easter egg doble: brazos arriba, "!" y gotas de sudor -->
          <g class="arms-up" opacity="0">
            <path d="M-11 -72 Q-19 -90 -20 -110 M11 -72 Q19 -90 20 -110" stroke="#0a0614" stroke-width="6" stroke-linecap="round" fill="none"/>
            <circle cx="-20" cy="-112" r="2.6" fill="#c9d1e6"/>
            <circle cx="20" cy="-112" r="2.6" fill="#c9d1e6"/>
          </g>
          <text class="alarm" x="0" y="-132" text-anchor="middle" font-family="Poppins" font-weight="800" font-size="22" fill="#ffcf5c" opacity="0">!</text>
          ${[[-12, -98], [12, -96], [8, -105]].map(([x, y]) => `<g transform="translate(${x} ${y})"><path class="sweat" d="M0 -4 Q3 0 0 3 Q-3 0 0 -4Z" fill="#9fe7ff" opacity="0"/></g>`).join("")}
        </g>
        <!-- Humo tipo hielo seco a ras del piso (aparece con la figura y se queda un rato al irse) -->
        <g class="fog" filter="url(#f-fog)">${times(14, () => `<circle class="fog-puff" cx="${rnd(-34, 34).toFixed(0)}" cy="${rnd(-14, -3).toFixed(0)}" r="${rnd(12, 22).toFixed(0)}" fill="${pick(["#d9d6e6", "#c4c0d4", "#ece9f5"])}" opacity="0"/>`)}</g>
      </g>`;

    const lamp = (x, dir) => `
      <g class="lamp clickable">
        <g class="lamp-light">
          <ellipse cx="${x + dir * 30}" cy="600" rx="90" ry="14" fill="url(#g-lamp)"/>
          <path d="M${x + dir * 30} 428 L${x + dir * 30 - 80} 600 L${x + dir * 30 + 80} 600Z" fill="#ffcf5c" opacity=".07"/>
        </g>
        ${reaper(x + dir * 48)}
        <rect x="${x - 4}" y="420" width="8" height="180" fill="#2b2445"/>
        <path d="M${x} 422 Q${x + dir * 14} 410 ${x + dir * 30} 420" stroke="#2b2445" stroke-width="6" fill="none"/>
        <g class="lamp-light">
          <circle cx="${x + dir * 30}" cy="426" r="46" fill="url(#g-bulbhalo)"/>
          <ellipse cx="${x + dir * 30}" cy="424" rx="14" ry="6" fill="#fff1c1" filter="url(#f-neon)"/>
        </g>
      </g>`;

    return `
    <g id="facade-world">
      <!-- El fondo se extiende más allá del viewBox para llenar pantallas muy anchas o muy altas -->
      <rect x="-1500" y="-1300" width="4200" height="2000" fill="url(#g-sky)"/>
      <g id="stars">${times(220, () => `<circle class="star" cx="${rnd(-1400, 2600).toFixed(0)}" cy="${rnd(-600, 460).toFixed(0)}" r="${rnd(0.6, 2.2).toFixed(1)}" fill="#fff"/>`)}</g>
      <!-- Estrellas fugaces: pool reutilizable (la cabeza está en el origen 0,0 y la cola hacia +x) -->
      <g id="shooting">${times(3, () => `<g class="shoot" opacity="0">
        <g class="shoot-rot">
          <rect class="tail" x="0" y="-1.3" width="170" height="2.6" rx="1.3" fill="url(#g-tail)"/>
          <circle r="2.8" fill="#fff" filter="url(#f-glow)"/>
        </g>
      </g>`)}</g>
      <!-- Easter egg: platillo volador (origen en el centro del platillo). Va antes del edificio para pasar por detrás -->
      <g id="ufo" opacity="0">
        <g id="ufo-body">
          <path class="ufo-beam" d="M-9 5 L9 5 L34 90 L-34 90Z" fill="url(#g-beam)" filter="url(#f-soft)" opacity="0"/>
          <ellipse cx="0" cy="-7" rx="14" ry="12" fill="#9ff0ff" opacity=".85"/>
          <ellipse cx="-4" cy="-11" rx="4" ry="3" fill="#fff" opacity=".7"/>
          <ellipse cx="0" cy="1" rx="34" ry="9" fill="#9aa6c2"/>
          <ellipse cx="0" cy="-2" rx="34" ry="5" fill="#e3e8f7"/>
          ${[-22, -11, 0, 11, 22].map((x, i) => `<circle class="ufo-light" cx="${x}" cy="3" r="2.6" fill="${i % 2 ? "#ff3cac" : "#7cffb2"}" filter="url(#f-glow)"/>`).join("")}
        </g>
      </g>
      <g id="moon" class="clickable">
        <circle cx="1030" cy="110" r="110" fill="url(#g-moonhalo)"/>
        <circle cx="1030" cy="110" r="46" fill="#fff4d6" filter="url(#f-glow)"/>
        <circle cx="1050" cy="96" r="42" fill="#120a2b"/>
      </g>
      ${skyline}

      <g id="building">
        <rect x="340" y="150" width="520" height="16" fill="#2b1d4f"/>
        <rect x="350" y="160" width="500" height="440" fill="#24183f"/>
        <path d="M350 270H850M350 380H850M350 490H850" stroke="#33245a" stroke-width="5"/>
        <g id="windows">${windows}</g>

        <!-- Piso 1: garajes, entrada y lobby -->
        <rect x="365" y="515" width="80" height="85" fill="url(#p-curtain)"/>
        <rect x="455" y="515" width="80" height="85" fill="url(#p-curtain)"/>
        <rect x="360" y="508" width="180" height="8" fill="#ff3cac" filter="url(#f-glow)"/>
        <rect x="550" y="505" width="100" height="95" fill="#ffcf5c"/>
        <rect x="550" y="505" width="100" height="95" fill="url(#g-lamp)"/>
        <!-- Puertas corredizas: se recortan al marco para que al abrir se escondan dentro de la pared -->
        <clipPath id="door-clip"><rect x="550" y="505" width="100" height="95"/></clipPath>
        <g clip-path="url(#door-clip)">
          <rect id="door-l" x="555" y="510" width="45" height="90" fill="#3a2a66" stroke="#ffcf5c" stroke-width="2"/>
          <rect id="door-r" x="600" y="510" width="45" height="90" fill="#3a2a66" stroke="#ffcf5c" stroke-width="2"/>
        </g>
        <path d="M535 505 L665 505 L655 488 L545 488Z" fill="#ff3cac"/>
        <rect x="670" y="515" width="165" height="60" rx="4" fill="#ffcf5c" opacity=".85"/>
        <path d="M800 575 q-6 -30 6 -44 q8 20 -6 44 M800 575 q-20 -18 -16 -36 q14 10 16 36" fill="#2f9e6a"/>
        <rect x="670" y="515" width="165" height="60" rx="4" fill="none" stroke="#3b2c63" stroke-width="4"/>

        <!-- Letrero vertical 24H -->
        <g id="sign-24">
          <rect x="866" y="200" width="44" height="200" rx="8" fill="#140c26" stroke="#2bd2ff" stroke-width="3"/>
          <rect x="866" y="200" width="44" height="200" rx="8" fill="none" stroke="#2bd2ff" stroke-width="3" filter="url(#f-neon)"/>
          <text x="888" y="250" text-anchor="middle" font-family="Poppins" font-weight="800" font-size="34" fill="#2bd2ff" filter="url(#f-glow)">2</text>
          <text x="888" y="300" text-anchor="middle" font-family="Poppins" font-weight="800" font-size="34" fill="#2bd2ff" filter="url(#f-glow)">4</text>
          <text x="888" y="350" text-anchor="middle" font-family="Poppins" font-weight="800" font-size="34" fill="#2bd2ff" filter="url(#f-glow)">H</text>
        </g>
      </g>

      <g id="sign" class="clickable">
        <path d="M470 135V150M730 135V150" stroke="#2b1d4f" stroke-width="8"/>
        <rect x="380" y="55" width="440" height="80" rx="14" fill="#140c26" stroke="#ff3cac" stroke-width="4"/>
        <rect x="380" y="55" width="440" height="80" rx="14" fill="none" stroke="#ff3cac" stroke-width="4" filter="url(#f-neon)"/>
        <!-- Texto oculto solo para medir dónde va cada letra; las letras reales se crean en main.js -->
        <text id="sign-measure" x="600" y="110" text-anchor="middle" font-family="Monoton" font-size="36" visibility="hidden">MOTEL&#160;LUNA</text>
        <g id="sign-text" filter="url(#f-neon)"></g>
      </g>

      ${lamp(200, 1)}
      ${lamp(1000, -1)}
      <rect x="-1500" y="600" width="4200" height="20" fill="#2a2240"/>
      <rect x="-1500" y="620" width="4200" height="900" fill="#120d1f"/>
      <line x1="-1500" y1="662" x2="2700" y2="662" stroke="#ffcf5c" stroke-width="4" stroke-dasharray="40 30" opacity=".5"/>
      <use href="#car" id="street-car" x="0" y="598" width="220" height="90" style="color:#2bd2ff"/>
    </g>`;
  };

  /* ---------------- PARQUEADERO ---------------- */
  const parking = () => {
    const bays = [60, 360, 660];
    const carColors = ["#ff3cac", "#2bd2ff", "#ffcf5c"];
    return `
      <rect width="1200" height="520" fill="#1a1430"/>
      <rect y="520" width="1200" height="180" fill="#221b38"/>
      <line x1="0" y1="620" x2="1200" y2="620" stroke="#ffcf5c" stroke-width="4" stroke-dasharray="40 30" opacity=".45"/>
      ${times(4, (i) => `<rect x="${110 + i * 300}" y="0" width="80" height="10" fill="#fff6d8" filter="url(#f-glow)"/><ellipse cx="${150 + i * 300}" cy="40" rx="120" ry="40" fill="url(#g-lamp)"/>`)}
      ${bays
        .map(
          (bx, i) => `
        <rect x="${bx - 8}" y="192" width="286" height="10" fill="#3a2d5c"/>
        <rect x="${bx}" y="200" width="270" height="320" fill="#0b0816"/>
        <text x="${bx + 135}" y="165" text-anchor="middle" font-family="Poppins" font-weight="800" font-size="34" fill="#2bd2ff" filter="url(#f-glow)">G${i + 1}</text>
        <rect x="${bx}" y="520" width="270" height="6" fill="#ffcf5c" opacity=".6"/>`
        )
        .join("")}
      <rect x="950" y="440" width="235" height="125" rx="8" fill="#2a2244"/>
      <path d="M1030 445V560M1110 445V560" stroke="#7cffb2" stroke-width="3" stroke-dasharray="10 8" opacity=".6"/>
      <rect x="990" y="330" width="160" height="50" rx="10" fill="#140c26" stroke="#7cffb2" stroke-width="3"/>
      <text x="1070" y="365" text-anchor="middle" font-family="Poppins" font-weight="800" font-size="26" fill="#7cffb2" filter="url(#f-glow)">MOTOS</text>
      ${bays.map((_, i) => `<use href="#car" class="car" x="0" y="450" width="220" height="90" style="color:${carColors[i]}"/>`).join("")}
      <use href="#moto" class="moto" x="0" y="468" width="120" height="72" style="color:#7cffb2"/>
      <use href="#moto" class="moto" x="0" y="492" width="120" height="72" style="color:#ff9f43"/>
      ${bays.map((bx) => `<rect class="curtain" x="${bx}" y="200" width="270" height="320" fill="url(#p-curtain)"/>`).join("")}`;
  };

  /* ---------------- LOBBY ---------------- */
  const lobby = () => {
    // Llavero organizado por piso, con el color de cada piso en el tour
    const keyRows = [
      { label: "P2", color: "#2bd2ff", rooms: [201, 202, 203, 204] }, // Sencillas
      { label: "P3", color: "#ff3cac", rooms: [301, 302] },           // Especial
      { label: "P4", color: "#a77bff", rooms: [401, 402] },           // Suites
    ];
    const keys = keyRows
      .map((row, r) => {
        const ky = 202 + r * 52;
        const label = `<text x="880" y="${ky + 34}" font-family="Poppins" font-size="13" font-weight="800" fill="${row.color}">${row.label}</text>`;
        return label + row.rooms
          .map((room, c) => {
            const kx = 930 + c * 48;
            return `<g class="key clickable">
              <circle cx="${kx}" cy="${ky}" r="3" fill="#ddd"/>
              <line x1="${kx}" y1="${ky}" x2="${kx}" y2="${ky + 14}" stroke="#ccc" stroke-width="2"/>
              <rect x="${kx - 15}" y="${ky + 13}" width="30" height="30" rx="6" fill="${row.color}"/>
              <text x="${kx}" y="${ky + 33}" text-anchor="middle" font-family="Poppins" font-size="11" font-weight="800" fill="#140c26">${room}</text>
            </g>`;
          })
          .join("");
      })
      .join("");
    const lampAt = (x) => `<g class="lobby-lamp">
        <line x1="${x}" y1="0" x2="${x}" y2="160" stroke="#555" stroke-width="3"/>
        <ellipse cx="${x}" cy="230" rx="130" ry="90" fill="url(#g-lamp)"/>
        <path d="M${x - 30} 195 L${x - 16} 160 H${x + 16} L${x + 30} 195Z" fill="#ffcf5c"/>
        <ellipse cx="${x}" cy="196" rx="20" ry="5" fill="#fff4d6" filter="url(#f-glow)"/>
      </g>`;
    return `
      <rect width="1200" height="520" fill="#21173a"/>
      <rect y="400" width="1200" height="120" fill="#2a1d48"/>
      <rect y="520" width="1200" height="180" fill="url(#p-checker)"/>
      <text id="lobby-sign" x="600" y="105" text-anchor="middle" font-family="Monoton" font-size="54" fill="#ff3cac" filter="url(#f-glow)">RECEPCIÓN</text>
      ${lampAt(380)}${lampAt(600)}${lampAt(820)}
      <rect x="865" y="186" width="240" height="172" rx="8" fill="#3a2a1e" stroke="#5a4330" stroke-width="4"/>
      ${keys}
      <g class="lobby-plant">
        <path d="M70 470 H150 L140 560 H80Z" fill="#3b2d63"/>
        <path d="M110 470 q-40 -60 -20 -130 q30 60 20 130 M110 470 q30 -70 70 -100 q-10 70 -70 100 M110 470 q-60 -30 -80 -90 q50 20 80 90" fill="#2f9e6a"/>
      </g>
      <g id="lobby-desk">
        <rect x="250" y="390" width="600" height="170" rx="20" fill="#2d2050"/>
        <rect x="262" y="470" width="576" height="6" fill="#2bd2ff" filter="url(#f-glow)"/>
        <text x="550" y="445" text-anchor="middle" font-family="Monoton" font-size="30" fill="#ffcf5c">LUNA</text>
        <rect x="230" y="375" width="640" height="20" rx="8" fill="#4a3880"/>
        <rect x="320" y="290" width="120" height="80" rx="6" fill="#111" stroke="#444" stroke-width="4"/>
        <rect x="328" y="298" width="104" height="64" rx="3" fill="#1f3b57"/>
        <rect x="372" y="370" width="16" height="6" fill="#444"/>
        <g id="bell" class="clickable">
          <rect x="735" y="367" width="50" height="8" rx="2" fill="#c9a227"/>
          <path d="M738 368 Q760 326 782 368Z" fill="#ffcf5c"/>
          <circle cx="760" cy="331" r="5" fill="#ffcf5c"/>
        </g>
        <text id="ding" x="760" y="305" text-anchor="middle" font-family="Poppins" font-weight="800" font-size="26" fill="#ffcf5c" opacity="0">¡Ding!</text>
      </g>`;
  };

  /* ---------------- SALA DE ESPERA ---------------- */
  const sala = () => `
      <rect width="1200" height="520" fill="#1c1630"/>
      ${times(15, (i) => `<rect x="${i * 80}" y="0" width="40" height="520" fill="#21193a"/>`)}
      <rect y="520" width="1200" height="180" fill="url(#p-wood)"/>
      <g id="clock">
        <circle cx="400" cy="170" r="50" fill="#f5efff" stroke="#ffcf5c" stroke-width="6"/>
        <path d="M400 128v8M400 204v8M358 170h8M434 170h8" stroke="#555" stroke-width="4"/>
        <line id="hour-hand" x1="400" y1="170" x2="400" y2="142" stroke="#222" stroke-width="6" stroke-linecap="round"/>
        <line id="min-hand" x1="400" y1="170" x2="400" y2="130" stroke="#ff3cac" stroke-width="4" stroke-linecap="round"/>
        <circle cx="400" cy="170" r="5" fill="#222"/>
      </g>
      <g id="tv">
        <rect x="760" y="160" width="320" height="180" rx="10" fill="#0d0d14" stroke="#333" stroke-width="8"/>
        <g id="tv-screen">
          <rect x="772" y="172" width="296" height="156" fill="#10243a"/>
          <text x="920" y="200" text-anchor="middle" font-family="Poppins" font-weight="800" font-size="16" fill="#7fe3ff">LUNA TV</text>
          ${times(4, (i) => `<rect class="tv-bar" x="800" y="${215 + i * 26}" width="240" height="14" rx="7" fill="${["#ff3cac", "#2bd2ff", "#ffcf5c", "#a77bff"][i]}"/>`)}
        </g>
      </g>
      <ellipse cx="420" cy="600" rx="300" ry="50" fill="#2b1d4f" opacity=".85"/>
      <g id="sofa">
        <rect x="150" y="340" width="500" height="100" rx="30" fill="#6b2fb3"/>
        <rect x="200" y="360" width="180" height="70" rx="20" fill="#8f4fe0"/>
        <rect x="420" y="360" width="180" height="70" rx="20" fill="#8f4fe0"/>
        <rect x="160" y="430" width="480" height="60" rx="16" fill="#7d3cc9"/>
        <rect x="130" y="400" width="60" height="100" rx="18" fill="#5a2696"/>
        <rect x="610" y="400" width="60" height="100" rx="18" fill="#5a2696"/>
        <rect x="175" y="498" width="14" height="22" fill="#1a1330"/>
        <rect x="612" y="498" width="14" height="22" fill="#1a1330"/>
      </g>
      <g id="coffee-table">
        <rect x="320" y="585" width="12" height="50" fill="#2a1f18"/>
        <rect x="508" y="585" width="12" height="50" fill="#2a1f18"/>
        <ellipse cx="420" cy="582" rx="140" ry="24" fill="#4a382b"/>
        <rect x="360" y="566" width="60" height="10" rx="2" fill="#ff3cac" transform="rotate(-6 390 571)"/>
        <rect x="372" y="560" width="54" height="8" rx="2" fill="#2bd2ff" transform="rotate(4 399 564)"/>
        <rect x="470" y="556" width="20" height="20" rx="4" fill="#f5efff"/>
      </g>
      <g class="sala-plant">
        <path d="M1080 470 H1160 L1150 560 H1090Z" fill="#3b2d63"/>
        <path d="M1120 470 q-50 -80 -10 -170 q40 80 10 170 M1120 470 q40 -60 70 -150 q10 90 -70 150 M1120 470 q-60 -40 -90 -120 q60 30 90 120" fill="#2f9e6a"/>
      </g>`;

  /* ---------------- PIEZAS DE HABITACIÓN ---------------- */
  const shell = ({ wall, floor, ceil, bathX = 790, decor = "" }) => `
    <g class="room-shell">
      <rect width="1200" height="520" fill="${wall}"/>
      <rect y="520" width="1200" height="180" fill="${floor}"/>
      <path d="M0 560H1200M0 610H1200M0 665H1200" stroke="#000" stroke-opacity=".18" stroke-width="2"/>
      <rect x="${bathX}" width="${1200 - bathX}" height="520" fill="url(#p-tiles)"/>
      <rect x="${bathX}" y="520" width="${1200 - bathX}" height="180" fill="#1e2236"/>
      <rect class="ceil" width="${bathX}" height="8" fill="${ceil}" filter="url(#f-glow)"/>
      <ellipse cx="${bathX / 2}" cy="0" rx="${bathX / 2}" ry="120" fill="${ceil}" opacity=".12"/>
      ${decor}
      <rect x="${bathX - 14}" y="40" width="14" height="480" fill="#9fe7ff" opacity=".14" stroke="#9fe7ff" stroke-opacity=".4"/>
    </g>`;

  const bed = ({ id, x, w = 440, blanket, extra = "" }) => {
    const y = 410;
    return `
    <g class="bed-g" id="${id}">
      <rect x="${x + 20}" y="${y - 110}" width="${w - 40}" height="120" rx="18" fill="#2a1f45" stroke="#4b3a75" stroke-width="4"/>
      <rect x="${x}" y="${y}" width="${w}" height="70" rx="14" fill="#efe9ff"/>
      <ellipse cx="${x + w * 0.27}" cy="${y + 4}" rx="${w * 0.16}" ry="20" fill="#fff"/>
      <ellipse cx="${x + w * 0.73}" cy="${y + 4}" rx="${w * 0.16}" ry="20" fill="#fff"/>
      <rect x="${x}" y="${y + 28}" width="${w}" height="62" rx="14" fill="${blanket}"/>
      <rect x="${x}" y="${y + 28}" width="${w}" height="10" rx="5" fill="#fff" opacity=".35"/>
      <rect x="${x + 12}" y="${y + 88}" width="14" height="22" fill="#120d22"/>
      <rect x="${x + w - 26}" y="${y + 88}" width="14" height="22" fill="#120d22"/>
      ${extra}
    </g>`;
  };

  const minibar = ({ id, x }) => {
    const y = 410;
    return `
    <g class="minibar-g clickable" id="${id}">
      <rect x="${x}" y="${y}" width="100" height="110" rx="8" fill="#20283a" stroke="#3b4a66" stroke-width="3"/>
      <rect x="${x + 8}" y="${y + 8}" width="84" height="94" fill="#7fe3ff" opacity=".22"/>
      <line x1="${x + 8}" y1="${y + 62}" x2="${x + 92}" y2="${y + 62}" stroke="#9fb3d9" stroke-width="2"/>
      <rect x="${x + 18}" y="${y + 20}" width="10" height="40" rx="3" fill="#ff6b9d"/>
      <rect x="${x + 38}" y="${y + 14}" width="12" height="46" rx="3" fill="#ffcf5c"/>
      <rect x="${x + 60}" y="${y + 26}" width="10" height="34" rx="3" fill="#7cffb2"/>
      <rect x="${x + 20}" y="${y + 70}" width="22" height="26" rx="3" fill="#ff9f43"/>
      <rect x="${x + 52}" y="${y + 70}" width="22" height="26" rx="3" fill="#a77bff"/>
      <g class="mb-door">
        <rect x="${x + 4}" y="${y + 4}" width="92" height="102" rx="6" fill="#2c3650" stroke="#4d5f85" stroke-width="2"/>
        <rect x="${x + 78}" y="${y + 36}" width="6" height="32" rx="3" fill="#9fb3d9"/>
        <circle cx="${x + 18}" cy="${y + 18}" r="4" fill="#7cffb2"/>
        <text x="${x + 44}" y="${y + 96}" text-anchor="middle" font-family="Poppins" font-weight="800" font-size="11" fill="#9fb3d9">MINIBAR</text>
      </g>
    </g>`;
  };

  const speaker = ({ id, x, y }) => `
    <g class="sound-g" id="${id}">
      <rect x="${x}" y="${y}" width="70" height="110" rx="10" fill="#151022" stroke="#3a2d5c" stroke-width="3"/>
      <circle cx="${x + 35}" cy="${y + 33}" r="17" fill="#2a2140" stroke="#6a55a8" stroke-width="3"/>
      <circle cx="${x + 35}" cy="${y + 33}" r="6" fill="#a77bff"/>
      <circle cx="${x + 35}" cy="${y + 78}" r="22" fill="#2a2140" stroke="#6a55a8" stroke-width="3"/>
      <circle cx="${x + 35}" cy="${y + 78}" r="8" fill="#a77bff"/>
      ${times(3, (i) => `<path class="wave" d="M${x + 84 + i * 16} ${y + 28} Q${x + 104 + i * 22} ${y + 55} ${x + 84 + i * 16} ${y + 82}" fill="none" stroke="#2bd2ff" stroke-width="4" stroke-linecap="round"/>`)}
      <text class="note" x="${x + 100}" y="${y + 10}" font-size="26" fill="#ff3cac">♪</text>
      <text class="note" x="${x + 130}" y="${y + 30}" font-size="22" fill="#2bd2ff">♫</text>
    </g>`;

  const shower = ({ id, x, w = 210 }) => {
    const cx = x + w / 2;
    return `
    <g class="bath-g" id="${id}">
      <path d="M${x + w - 30} 100V70H${cx}V108" fill="none" stroke="#b8c4d9" stroke-width="8" stroke-linejoin="round"/>
      <ellipse cx="${cx}" cy="114" rx="34" ry="10" fill="#cfd8ea"/>
      <g class="drops">${times(16, () => {
        const dx = rnd(cx - 26, cx + 26).toFixed(0);
        return `<line class="drop" x1="${dx}" y1="128" x2="${dx}" y2="142" stroke="#7fe3ff" stroke-width="3" stroke-linecap="round"/>`;
      })}</g>
      <rect x="${x + 6}" y="90" width="${w - 12}" height="420" fill="#9fe7ff" opacity=".07" stroke="#9fe7ff" stroke-opacity=".45" stroke-width="3"/>
      <rect x="${x}" y="505" width="${w}" height="15" rx="3" fill="#e5ecf8"/>
    </g>`;
  };

  const sink = (x) => `
    <g class="extra">
      <rect x="${x + 5}" y="200" width="80" height="95" rx="40" fill="#9fe7ff" opacity=".18" stroke="#cfd8ea" stroke-width="4"/>
      <rect x="${x}" y="335" width="90" height="18" rx="6" fill="#f4f1ff"/>
      <path d="M${x + 45} 335V318H${x + 58}" stroke="#cfd8ea" stroke-width="5" fill="none"/>
      <rect x="${x + 10}" y="353" width="70" height="85" rx="6" fill="#3a3150"/>
    </g>`;

  const tub = ({ id, x }) => `
    <g class="bath-g" id="${id}">
      <path d="M${x + 300} 425V350H${x + 268}V366" fill="none" stroke="#cfd8ea" stroke-width="8"/>
      <g>${times(18, () => `<circle class="bubble" cx="${rnd(x + 40, x + 290).toFixed(0)}" cy="${rnd(408, 422).toFixed(0)}" r="${rnd(4, 11).toFixed(0)}" fill="#fff" fill-opacity=".85" stroke="#bdeeff"/>`)}</g>
      <path d="M${x} 430H${x + 330}L${x + 315} 500Q${x + 305} 520 ${x + 280} 520H${x + 50}Q${x + 25} 520 ${x + 15} 500Z" fill="#f4f1ff"/>
      <rect x="${x + 6}" y="418" width="318" height="14" rx="7" fill="url(#g-water)"/>
      <rect x="${x - 6}" y="426" width="342" height="12" rx="6" fill="#fff"/>
      <g class="candles">${times(3, (i) => `
        <rect x="${x + 6 + i * 16}" y="${398 + (i % 2) * 6}" width="10" height="${28 - (i % 2) * 6}" rx="2" fill="#fff6d8"/>
        <ellipse class="flame" cx="${x + 11 + i * 16}" cy="${392 + (i % 2) * 6}" rx="4" ry="8" fill="#ffcf5c" filter="url(#f-glow)"/>`)}</g>
    </g>`;

  const jacuzzi = ({ id, cx, cy }) => `
    <g class="extra" id="${id}">
      <ellipse cx="${cx}" cy="${cy + 22}" rx="212" ry="60" fill="#1b2440"/>
      <ellipse cx="${cx}" cy="${cy}" rx="212" ry="56" fill="#e9edff"/>
      <ellipse cx="${cx}" cy="${cy + 4}" rx="186" ry="42" fill="url(#g-water)"/>
      <ellipse cx="${cx}" cy="${cy + 4}" rx="186" ry="42" fill="none" stroke="#2bd2ff" stroke-width="3" filter="url(#f-glow)" opacity=".7"/>
      <g>${times(22, () => {
        const a = rnd(0, Math.PI * 2), r = Math.sqrt(Math.random());
        return `<circle class="bubble" cx="${(cx + Math.cos(a) * 160 * r).toFixed(0)}" cy="${(cy + 4 + Math.sin(a) * 32 * r).toFixed(0)}" r="${rnd(3, 9).toFixed(0)}" fill="#fff" fill-opacity=".8"/>`;
      })}</g>
    </g>`;

  const turco = ({ id, x }) => `
    <g class="bath-g" id="${id}">
      <rect x="${x + 45}" y="118" width="100" height="32" rx="6" fill="#1a1330" stroke="#ff9f43" stroke-width="3"/>
      <text x="${x + 95}" y="141" text-anchor="middle" font-family="Poppins" font-weight="800" font-size="18" fill="#ff9f43" filter="url(#f-glow)">TURCO</text>
      <rect x="${x}" y="160" width="190" height="360" rx="8" fill="#fff" fill-opacity=".05" stroke="#fff" stroke-opacity=".35" stroke-width="3"/>
      <rect x="${x + 15}" y="430" width="160" height="22" rx="4" fill="#8a6a4a"/>
      <rect x="${x + 25}" y="452" width="12" height="68" fill="#6b5038"/>
      <rect x="${x + 153}" y="452" width="12" height="68" fill="#6b5038"/>
      <rect x="${x + 170}" y="320" width="6" height="40" rx="3" fill="#cfd8ea"/>
      <g filter="url(#f-blur)">${times(12, () => `<circle class="steam" cx="${rnd(x + 30, x + 160).toFixed(0)}" cy="${rnd(420, 470).toFixed(0)}" r="${rnd(18, 34).toFixed(0)}" fill="#fff" opacity="0"/>`)}</g>
    </g>`;

  const chair = ({ id, x, y }) => `
    <g class="extra" id="${id}">
      <path d="M${x + 30} ${y + 76}L${x + 42} 516M${x + 170} ${y + 86}L${x + 158} 516" stroke="#3a2d5c" stroke-width="10" stroke-linecap="round"/>
      <rect x="${x + 25}" y="512" width="150" height="8" rx="4" fill="#3a2d5c"/>
      <path d="M${x} ${y + 60}C${x + 40} ${y + 60} ${x + 50} ${y - 10} ${x + 95} ${y}C${x + 140} ${y + 10} ${x + 140} ${y + 70} ${x + 200} ${y + 70}L${x + 200} ${y + 86}C${x + 130} ${y + 86} ${x + 130} ${y + 26} ${x + 95} ${y + 18}C${x + 60} ${y + 10} ${x + 50} ${y + 76} ${x} ${y + 76}Z" fill="#c2185b" stroke="#ff3cac" stroke-width="3"/>
    </g>`;

  const neonHeart = (cx, cy, s, color) =>
    `<path class="neon-heart" d="M${cx} ${cy + s * 0.9}C${cx - s * 1.4} ${cy} ${cx - s * 0.9} ${cy - s * 0.9} ${cx} ${cy - s * 0.3}C${cx + s * 0.9} ${cy - s * 0.9} ${cx + s * 1.4} ${cy} ${cx} ${cy + s * 0.9}Z" fill="none" stroke="${color}" stroke-width="5" filter="url(#f-glow)"/>`;

  const petals = (x, w) =>
    `<g class="extra">${times(16, () => `<ellipse cx="${rnd(x + 20, x + w - 20).toFixed(0)}" cy="${rnd(448, 492).toFixed(0)}" rx="7" ry="4" fill="#d6103f" transform="rotate(${rnd(0, 180).toFixed(0)} 0 0)" style="transform-box:fill-box;transform-origin:center"/>`)}</g>`;

  /* ---------------- HABITACIONES ---------------- */
  const room2 = () =>
    shell({ wall: "#1b1a3a", floor: "#2a2240", ceil: "#2bd2ff" }) +
    speaker({ id: "f2-sound", x: 40, y: 160 }) +
    bed({ id: "f2-bed", x: 130, blanket: "#2bd2ff" }) +
    minibar({ id: "f2-minibar", x: 620 }) +
    sink(810) +
    shower({ id: "f2-bath", x: 950 });

  const room3 = () =>
    shell({ wall: "#2a1030", floor: "#2b1a2e", ceil: "#ff3cac", decor: neonHeart(350, 200, 46, "#ff3cac") }) +
    speaker({ id: "f3-sound", x: 40, y: 160 }) +
    bed({ id: "f3-bed", x: 130, blanket: "#ff3cac" }) +
    petals(130, 440) +
    minibar({ id: "f3-minibar", x: 620 }) +
    tub({ id: "f3-bath", x: 835 });

  const room4 = () =>
    shell({ wall: "#1a0f2e", floor: "url(#p-wood)", ceil: "#a77bff", decor: neonHeart(240, 190, 38, "#a77bff") }) +
    speaker({ id: "f4-sound", x: 600, y: 150 }) +
    bed({ id: "f4-bed", x: 60, w: 360, blanket: "#8b5cf6" }) +
    minibar({ id: "f4-minibar", x: 440 }) +
    chair({ id: "f4-chair", x: 565, y: 384 }) +
    jacuzzi({ id: "f4-jacuzzi", cx: 420, cy: 615 }) +
    turco({ id: "f4-turco", x: 800 }) +
    shower({ id: "f4-shower", x: 1005, w: 185 });

  const render = () => {
    const set = (id, html) => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = html;
    };
    set("svg-fachada", facade());
    set("svg-parking", parking());
    set("svg-lobby", lobby());
    set("svg-sala", sala());
    set("svg-room2", room2());
    set("svg-room3", room3());
    set("svg-room4", room4());
  };

  window.Scenes = { render };
})();
