

/**
 * Inserta el SVG en el documento al final del <body>,
 * asegurando que la plantilla gráfica esté disponible para visualización y captura.
 *//**
 * Actualiza dinámicamente la vista previa de la firma con los datos ingresados en los campos de formulario.
 */
function actualizarVista() {
  // Reinserta el SVG limpio
  document.getElementById("preview-area").innerHTML = svgMarkup;

  // Espera un poco y luego agrega los textos
  setTimeout(() => {
    insertarTextoSVG(1900, 380, document.getElementById("inNombre").value, 140, "bold");
    insertarTextoSVG(1900, 550, document.getElementById("inCargo").value, 120);
    insertarTextoSVG(1900, 700, document.getElementById("inDepto").value, 100);
    insertarTextoSVG(1990, 880, document.getElementById("inDireccion").value, 80);
    insertarTextoSVG(1990, 1010, document.getElementById("inCorreo").value, 80);
    insertarTextoSVG(1990, 1148, document.getElementById("inTelefono").value, 80);
    insertarTextoSVG(1990, 1290, document.getElementById("inWeb").value, 80);
  }, 20);
}

function insertarTextoSVG(x, y, texto, fontSize = 16, fontWeight = 'normal') {
  const svg = document.getElementById("firma-svg");
  const ns = "http://www.w3.org/2000/svg";
  const text = document.createElementNS(ns, "text");
  text.setAttribute("x", x);
  text.setAttribute("y", y);
  text.setAttribute("fill", "white");
  text.setAttribute("font-size", fontSize);
  text.setAttribute("font-family", "Montserrat");
  text.setAttribute("font-weight", fontWeight);
  text.textContent = texto;
  svg.appendChild(text);
}

/**
 * Exporta la firma SVG como imagen PNG optimizada para uso en correos electrónicos.
 * La imagen final tiene 750px de ancho, con altura proporcional, buena calidad y bajo peso.
 */
/**
 * Exporta la firma SVG como PNG de alta nitidez (doble resolución).
 * Se genera una imagen de 1500px de ancho, ideal para verse nítida al mostrarse a 750px.
 */
async function descargarFirma() {
  const svgElement = document.getElementById('firma-svg');
  if (!svgElement) return;

  // Serializa el contenido SVG a texto
  const svgData = new XMLSerializer().serializeToString(svgElement);

  // Dimensiones base del diseño SVG
  const baseWidth = 750;
  const baseHeight = 269;

  // Escalado doble para mayor nitidez
  const scale = 2;
  const targetWidth = baseWidth * scale;   // 1500px
  const targetHeight = baseHeight * scale; // 538px

  // Crear canvas a doble resolución
  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  // Configurar contexto para suavizado de alta calidad
  const ctx = canvas.getContext('2d');
  ctx.scale(scale, scale); // Escalado lógico del contenido original
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Renderiza el SVG dentro del canvas usando canvg
  const v = await canvg.Canvg.fromString(ctx, svgData);
  await v.render();

  // Crear enlace de descarga
  const link = document.createElement('a');
  link.download = 'firma-verfrut-nitida.png';
  link.href = canvas.toDataURL("image/png");
  link.click();
}

/**
 * SVG base incrustado dinámicamente.
 */
const svgMarkup  = `

<svg id="firma-svg" width="1500" height="" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 4350.2 1559">
<!-- Generator: Adobe Illustrator 29.5.1, SVG Export Plug-In . SVG Version: 2.1.0 Build 141)  -->
<defs>
  <style>
    .st0 {
      fill: none;
    }

    .st1 {
      fill: #92c9ff;
    }

    .st2 {
      display: none;
      font-family: Montserrat-Regular, Montserrat;
      font-size: 80px;
    }

    .st2, .st3 {
      fill: #fff;
    }

    .st4 {
      fill: #d9261c;
    }

    .st5 {
      fill: url(#Degradado_sin_nombre_26);
    }

    .st6 {
      clip-path: url(#clippath);
    }

    .st7 {
      fill: #2464ad;
    }
  </style>
  <linearGradient id="Degradado_sin_nombre_26" data-name="Degradado sin nombre 26" x1="697.8" y1="2256.8" x2="3652.4" y2="-697.8" gradientUnits="userSpaceOnUse">
    <stop offset="0" stop-color="#133555"/>
    <stop offset="1" stop-color="#2464ad"/>
  </linearGradient>
  <clipPath id="clippath">
    <rect class="st0" width="4350.2" height="1559"/>
  </clipPath>
</defs>
<g>
  <polygon class="st7" points="375 690 530.8 690 692.3 900.2 857.5 690 1020.2 690 697.6 1082.5 375 690"/>
  <path class="st4" d="M816.2,570.6c-.2,61.6-49.3,110.8-110.4,110.7-61.4,0-110-49.7-109.8-112.1.2-60.7,49.7-110.1,110.3-110,60.8,0,110.1,50,109.9,111.3"/>
</g>
<rect class="st5" width="4350.2" height="1559"/>
<g class="st6">
  <rect class="st7" x="242.9" y="273.1" width="1080.4" height="1012.8" rx="211.5" ry="211.5" transform="translate(174.1 -142.4) rotate(11.7)"/>
  <rect class="st3" x="242.9" y="273.1" width="1080.4" height="1012.8" rx="211.5" ry="211.5" transform="translate(780.6 -325.4) rotate(45)"/>
  <g>
    <polygon class="st7" points="555.2 745.6 667.5 745.6 783.9 897.1 902.9 745.6 1020.2 745.6 787.7 1028.5 555.2 745.6"/>
    <path class="st4" d="M873.2,659.5c-.1,44.4-35.5,79.9-79.5,79.8-44.2,0-79.3-35.8-79.2-80.8.1-43.7,35.8-79.3,79.5-79.3,43.8,0,79.3,36.1,79.2,80.2"/>
  </g>
</g>
<g>
  <text class="st2" transform="translate(1962.5 871.9)"><tspan x="0" y="0">Parcela 5 Sta. Inés, Las Cabras.</tspan></text>
  <g id="_01_align_center">
    <path class="st1" d="M1892.8,892.8l-2.6-2.2c-3.6-3-34.7-29.8-34.7-49.5s16.7-37.2,37.2-37.2,37.2,16.7,37.2,37.2-31.1,46.5-34.6,49.5l-2.6,2.2ZM1892.8,811.9c-16.1,0-29.2,13.1-29.2,29.2,0,12.3,19.1,32.1,29.2,41.1,10.1-9,29.2-28.8,29.2-41.1,0-16.1-13.1-29.2-29.2-29.2Z"/>
    <path class="st1" d="M1892.8,855.9c-8.2,0-14.8-6.6-14.8-14.8s6.6-14.8,14.8-14.8,14.8,6.6,14.8,14.8-6.6,14.8-14.8,14.8ZM1892.8,833.7c-4.1,0-7.4,3.3-7.4,7.4s3.3,7.4,7.4,7.4,7.4-3.3,7.4-7.4-3.3-7.4-7.4-7.4Z"/>
  </g>
</g>
<g>
  <text class="st2" transform="translate(1972.6 996.5)"><tspan x="0" y="0">cvasquez@verfrut.cl</tspan></text>
  <path class="st1" d="M1915.7,938.4h-43.9c-8.7,0-15.7,7-15.7,15.7v37.7c0,8.7,7,15.7,15.7,15.7h43.9c8.7,0,15.7-7,15.7-15.7v-37.7c0-8.7-7-15.7-15.7-15.7ZM1871.8,944.7h43.9c3.8,0,7.3,2.4,8.7,5.9l-24,24c-3.7,3.7-9.6,3.7-13.3,0l-24-24c1.4-3.6,4.9-5.9,8.7-5.9ZM1915.7,1001.2h-43.9c-5.2,0-9.4-4.2-9.4-9.4v-32.9l20.3,20.3c6.1,6.1,16.1,6.1,22.2,0l20.3-20.3v32.9c0,5.2-4.2,9.4-9.4,9.4Z"/>
</g>
<path class="st1" d="M1938.2,1132c4.3,4.3,4.3,11.3,0,15.6l-3.2,3.7c-29.2,27.9-100.1-43-72.6-72.3l4.1-3.6c4.3-4.2,11.2-4.1,15.4.1.1.1,6.7,8.7,6.7,8.7,4.1,4.3,4.1,11,0,15.2l-4.1,5.2c4.6,11.2,13.5,20.1,24.7,24.7l5.2-4.1c4.3-4.1,11-4.1,15.2,0,0,0,8.6,6.6,8.7,6.7ZM1933.3,1137.1s-8.5-6.6-8.6-6.7c-1.5-1.5-4-1.5-5.5,0,0,0-7.3,5.8-7.3,5.8-1,.8-2.3,1-3.5.5-14.5-5.4-26-16.8-31.4-31.4-.5-1.2-.3-2.6.5-3.6,0,0,5.7-7.2,5.8-7.3,1.5-1.5,1.5-4,0-5.5-.1-.1-6.7-8.6-6.7-8.6-1.5-1.4-3.9-1.3-5.4.1l-4.1,3.6c-20.1,24.2,41.4,82.2,62.6,62.2l3.2-3.7c1.6-1.5,1.7-3.9.3-5.5h0Z"/>
<path class="st1" d="M1939,1273.7s-31.2-14.2-31.3-14.2c-2.6-.9-5.4-.2-7.4,1.7-1.9,1.9-2.6,4.8-1.6,7.7l14.1,31c.6,1.3,1.8,2.1,3.2,2.1h0c1.4,0,2.6-.8,3.2-2l6.6-13.2,13.2-6.6c1.2-.6,2-1.9,2-3.3,0-1.4-.8-2.6-2.1-3.2h0ZM1921.7,1280.9c-.7.3-1.3.9-1.6,1.6l-3.8,7.6-10.9-23.9,23.9,10.9-7.6,3.8h0ZM1901.5,1294.7c-.6,0-1.2,0-1.9.1-2.4-2.4-8.6-9-13-17.8h2.6c2,0,3.6-1.6,3.6-3.6s-1.6-3.6-3.6-3.6h-5.5c-1-3.4-1.7-7-1.7-10.7s.6-7.3,1.7-10.7h28.8c.4,1.4.8,2.8,1.1,4.2.4,1.9,2.2,3.2,4.2,2.8,1.9-.4,3.2-2.2,2.8-4.2-.2-1-.4-2-.7-2.9h12.3c1.1,3.4,1.6,7,1.6,10.7s0,2.2-.1,3.3c-.2,2,1.3,3.7,3.2,3.9,2,.2,3.7-1.3,3.9-3.2.1-1.3.2-2.6.2-3.9,0-23.7-19.2-42.9-42.9-42.9s-42.9,19.2-42.9,42.9,19.2,42.9,42.9,42.9h0c1.3,0,2.6,0,3.9-.2,2-.2,3.4-1.9,3.2-3.9-.2-2-1.9-3.4-3.9-3.2h0ZM1876.4,1269.8h-12.3c-1.1-3.4-1.6-7-1.6-10.7s.6-7.3,1.6-10.7h12.3c-.9,3.4-1.4,7-1.4,10.7s.5,7.3,1.4,10.7h0ZM1886.7,1241.2c3.6-7.4,8.6-13.3,11.5-16.4,2.9,3.1,7.9,9,11.5,16.4h-23.1ZM1929.2,1241.2h-11.5c-2.8-6.7-6.7-12.5-10.1-16.6,9.2,2.5,17,8.6,21.7,16.6ZM1889,1224.6c-3.4,4.2-7.3,9.9-10.1,16.6h-11.5c4.7-8.1,12.4-14.2,21.7-16.6ZM1867.3,1277h11.5c2.8,6.7,6.7,12.5,10.1,16.6-9.2-2.5-17-8.6-21.7-16.6Z"/>
</svg>`;

/**
 * Inserta el SVG en el documento al final del <body>,
 * asegurando que la plantilla gráfica esté disponible para visualización y captura.
 */
document.getElementById("preview-area").innerHTML = svgMarkup;