// Correos permitidos para el login
const correosPermitidos = [
  "ruacristian68@gmail.com",
  "cruar@aliaddo.com",
  "sapo"
];

// Cursos disponibles por grupo
const cursosPorGrupo = {
  erp: [
    { titulo: "Curso 1: Parametrización inicial - Sesión 1", video: "uU85OOa83JI" },
    { titulo: "Curso 2: Parametrización inicial - Sesión 2", video: "0toYR619JJk" },
    { titulo: "Curso 3: Parametrización inicial - Sesión 3", video: "7gt43kHfb7g" },
    { titulo: "Curso 4: Documentos electrónicos", video: "9cvVY00SfCA" },
    { titulo: "Curso 5: Contabilidad", video: "4tdiqtW3Ekc" },
    { titulo: "Curso 6: Tesorería y reportes", video: "ULYq83NzY0w" },
    { titulo: "Curso 7: Inventario", video: "zz8WSStkiKg" },
    { titulo: "Curso 8: POS electrónico", video: "Mw8v_94qgw" },
    { titulo: "Curso 9: CRM", video: "JTcBhGFByN8" },
    { titulo: "Curso 10: Nómina lite", video: "w7cP0h7Njik" }
  ],
  nomina: [
    { titulo: "Curso 1: Parametrización de nómina automática", video: "GmYPkNnDDqY" },
    { titulo: "Curso 2: Contrato", video: "pGEH-c1uQE4" },
    { titulo: "Curso 3: Periodos y novedades", video: "uU85OOa83JI" },
    { titulo: "Curso 4: PILA, nómina electrónica, contabilidad", video: "_-0-UinOlB0" }
  ]
};

let grupoSeleccionado = null;
let players = [];

// Esperar que cargue el DOM antes de acceder a elementos
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("selector-principal").style.display = "none";
  document.getElementById("boton-volver-principal").style.display = "block";
  document.getElementById("cerrar-superior-dentro").style.display = "none";
});

// Función para iniciar sesión
function iniciarSesion() {
  const email = document.getElementById("email").value.trim().toLowerCase();
  const error = document.getElementById("error");

  if (correosPermitidos.includes(email)) {
    localStorage.setItem("usuarioAliaddo", email);
    document.getElementById("login-section").style.display = "none";
    document.getElementById("selector-principal").style.display = "block";
    mostrarSeccion("inicio");
    document.getElementById("cerrar-superior-dentro").style.display = "block";
  } else {
    error.textContent = "Correo no autorizado. Debe estar registrado en Aliaddo.";
  }
}

function cerrarSesion() {
  localStorage.removeItem("usuarioAliaddo");
  location.reload();
}

// Mostrar secciones
function mostrarSeccion(seccion) {
  document.getElementById("inicio-section").style.display = "none";
  document.getElementById("cursos-section").style.display = "none";
  document.getElementById("articulos-section").style.display = "none";

  if (seccion === "inicio") {
    document.getElementById("inicio-section").style.display = "block";
  } else if (seccion === "cursos") {
    document.getElementById("cursos-section").style.display = "block";
  } else if (seccion === "articulos") {
    document.getElementById("articulos-section").style.display = "block";
  }
}

function seleccionarGrupo(grupo) {
  grupoSeleccionado = grupo;
  document.getElementById("selector-grupo").style.display = "none";
  mostrarCursos();
}

function mostrarCursos() {
  const usuario = localStorage.getItem("usuarioAliaddo");
  if (!usuario || !grupoSeleccionado) return;

  const cursos = cursosPorGrupo[grupoSeleccionado];
  const progresoKey = `progresoAliaddo_${usuario}_${grupoSeleccionado}`;
  const progreso = parseInt(localStorage.getItem(progresoKey)) || 0;
  const contenedor = document.getElementById("lista-cursos");
  contenedor.innerHTML = "";
  contenedor.style.display = "block";

  for (let index = 0; index < cursos.length; index++) {
    const curso = cursos[index];
    const estaCompletado = index < progreso;
    const esDesbloqueado = index === progreso;
    const estaBloqueado = index > progreso;

    let clasesCurso = 'curso';
    let etiqueta = '';
    let contenidoCurso = '';

    if (estaCompletado) {
      clasesCurso += ' completado';
      etiqueta = '<span class="etiqueta-terminado">Curso terminado</span>';
      contenidoCurso = `<div id="player${index}"></div>`;
    } else if (esDesbloqueado) {
      contenidoCurso = `
        <div id="player${index}"></div>
        <div id="boton-completar-${index}"></div>
      `;
    } else if (estaBloqueado) {
      clasesCurso += ' bloqueado';
      contenidoCurso = `<p style="color: #888;">Debes completar el curso anterior para desbloquear este contenido.</p>`;
    }

    contenedor.innerHTML += `
      <div class="${clasesCurso}" id="curso-${index}">
        <h2>${curso.titulo} ${etiqueta}</h2>
        ${contenidoCurso}
      </div>
    `;
  }

  document.getElementById("boton-cambiar-grupo").style.display = "block";
  onYouTubeIframeAPIReady();
}

function mostrarBoton(index) {
  const div = document.getElementById(`boton-completar-${index}`);
  if (div) {
    div.innerHTML = `
      <button onclick="completarCurso(${index})" style="margin-top:10px; padding:10px; background-color:#4b0082; color:white; border:none;">
        Marcar como completado
      </button>
    `;
  }
}

function completarCurso(index) {
  const usuario = localStorage.getItem("usuarioAliaddo");
  const progresoKey = `progresoAliaddo_${usuario}_${grupoSeleccionado}`;
  const progresoActual = parseInt(localStorage.getItem(progresoKey)) || 0;

  if (index === progresoActual) {
    localStorage.setItem(progresoKey, index + 1);
    mostrarCursos();
  }
}

// API de YouTube
window.onYouTubeIframeAPIReady = function () {
  const usuario = localStorage.getItem("usuarioAliaddo");
  if (!usuario || !grupoSeleccionado) return;

  const cursos = cursosPorGrupo[grupoSeleccionado];
  const progresoKey = `progresoAliaddo_${usuario}_${grupoSeleccionado}`;
  const progreso = parseInt(localStorage.getItem(progresoKey)) || 0;

  for (let index = 0; index <= progreso; index++) {
    const playerContainer = document.getElementById(`player${index}`);
    if (playerContainer) {
      players[index] = new YT.Player(`player${index}`, {
        height: '315',
        width: '100%',
        videoId: cursos[index].video,
        events: {
          'onStateChange': function (event) {
            if (event.data === YT.PlayerState.ENDED && index === progreso) {
              mostrarBoton(index);
            }
          }
        }
      });
    }
  }
};

// Carrusel de imágenes
const imagenesCarrusel = [
  "https://i.postimg.cc/7Z5dG361/aliaddo-app-movil.webp",
  "https://i.postimg.cc/HL5N3TbV/aliaddo-software.webp",
];
let indiceCarrusel = 0;

setInterval(() => {
  indiceCarrusel = (indiceCarrusel + 1) % imagenesCarrusel.length;
  const img = document.getElementById("imagen-carrusel");
  if (img) img.src = imagenesCarrusel[indiceCarrusel];
}, 4000);

// ... TU CÓDIGO ANTERIOR COMPLETO HASTA volverASeleccionarGrupo()

function volverASeleccionarGrupo() {
  grupoSeleccionado = null;
  document.getElementById("lista-cursos").innerHTML = "";
  document.getElementById("boton-cambiar-grupo").style.display = "none";
  document.getElementById("selector-grupo").style.display = "block";
}

// ---------- AÑADIDO PARA ARTÍCULOS ERP / NÓMINA ----------

function seleccionarArticulo(tipo) {
  const selector = document.getElementById("selector-articulo");
  const contenedor = document.getElementById("contenido-articulo");
  const botonVolver = document.getElementById("boton-volver-articulos");

  const articulosERP = `
    <h2>Artículos sobre ERP</h2>
    <ul>
      <li><a href="https://aliaddo.com/blog-erp" target="_blank">¿Qué es un ERP?</a></li>
      <li><a href="https://aliaddo.com/ventajas-erp" target="_blank">Ventajas de un ERP</a></li>
    </ul>
  `;

  const articulosNomina = `
    <h2>Artículos sobre Nómina</h2>
    <ul>
      <li><a href="https://aliaddo.com/blog-nomina" target="_blank">¿Qué es la nómina electrónica?</a></li>
      <li><a href="https://aliaddo.com/novedades-nomina" target="_blank">Novedades y ajustes en nómina</a></li>
      <li><a href="#" onclick="mostrarCalculadoraHorasExtras()">Cálculo de horas extras</a></li>
    </ul>
  `;

  selector.style.display = "none";
  botonVolver.style.display = "block";

  if (tipo === "erp") {
    contenedor.innerHTML = articulosERP;
  } else if (tipo === "nomina") {
    contenedor.innerHTML = articulosNomina;
  }
}

function volverASelectorArticulo() {
  document.getElementById("selector-articulo").style.display = "block";
  document.getElementById("contenido-articulo").innerHTML = "";
  document.getElementById("boton-volver-articulos").style.display = "none";
}

function calcularHorasExtras() {
  const salario = parseFloat(document.getElementById("salario").value);
  const horasContrato = parseFloat(document.getElementById("horasContrato").value);
  const horasExtras = parseFloat(document.getElementById("horasExtras").value);
  const tipoHora = document.getElementById("tipoHora").value;
  const resultado = document.getElementById("resultado-horas-extras");

  if (isNaN(salario) || isNaN(horasContrato) || isNaN(horasExtras) || !tipoHora) {
    resultado.textContent = "Por favor, completa todos los campos correctamente.";
    return;
  }

  const porcentajes = {
    nocturna: 0.35,
    extranocturna: 1.75,
    dominicalnocturno: 2.50,
    dominicalordinarionocturno: 1.10,
    diurnaordinaria: 0.25,
    dominicaldiurnaordinariadomingoocasional: 0.75,
    extradiurna: 1.25,
    diurnodominicaldomingohabitual: 1.75,
    diurnaextradominical: 2.0
  };

  const valorHoraNormal = salario / horasContrato;
  const porcentaje = porcentajes[tipoHora] || 0;
  const totalExtra = valorHoraNormal * horasExtras * (1 + porcentaje);

  resultado.textContent = `Valor total a pagar por ${horasExtras} horas ${tipoHora} extras: $${totalExtra.toFixed(2)}`;
}

function mostrarCalculadoraHorasExtras() {
  const contenedor = document.getElementById("contenido-articulo");

  contenedor.innerHTML = `
    <h2>Calculadora de Horas Extras</h2>

    <label for="salario">Salario mensual:</label>
    <input type="number" id="salario" /><br>

    <label for="horasContrato">Horas contratadas al mes:</label>
    <input type="number" id="horasContrato" /><br>

    <label for="horasExtras">Cantidad de horas extras:</label>
    <input type="number" id="horasExtras" /><br>

    <label for="tipoHora">Tipo de hora extra:</label>
    <select id="tipoHora">
      <option value="">-- Selecciona una opción --</option>
      <option value="nocturna">Nocturna</option>
      <option value="extranocturna">Extra Nocturna</option>
      <option value="dominicalnocturno">Dominical Nocturno</option>
      <option value="dominicalordinarionocturno">Dominical Ordinario Nocturno</option>
      <option value="diurnaordinaria">Diurna Ordinaria</option>
      <option value="dominicaldiurnaordinariadomingoocasional">Dominical Diurna Ordinaria Domingo Ocasional</option>
      <option value="extradiurna">Extra Diurna</option>
      <option value="diurnodominicaldomingohabitual">Diurno Dominical Domingo Habitual</option>
      <option value="diurnaextradominical">Diurna Extra Dominical</option>
    </select><br><br>

    <button onclick="calcularHorasExtras()">Calcular</button>
    <p id="resultado-horas-extras" style="margin-top: 1em;"></p>

    <button onclick="seleccionarArticulo('nomina')" style="margin-top: 2em;">⬅ Volver a artículos sobre nómina</button>
  `;
}

function calcularHorasExtras() {
  const salario = parseFloat(document.getElementById("salario").value);
  const horasContrato = parseFloat(document.getElementById("horasContrato").value);
  const horasExtras = parseFloat(document.getElementById("horasExtras").value);
  const tipoHora = document.getElementById("tipoHora").value;
  const resultado = document.getElementById("resultado-horas-extras");

  if (isNaN(salario) || isNaN(horasContrato) || isNaN(horasExtras) || tipoHora === "") {
    resultado.textContent = "Por favor, completa todos los campos correctamente.";
    return;
  }

  const porcentajes = {
    nocturna: 0.35,
    extranocturna: 1.75,
    dominicalnocturno: 2.50,
    dominicalordinarionocturno: 1.10,
    diurnaordinaria: 0.25,
    dominicaldiurnaordinariadomingoocasional: 0.75,
    extradiurna: 1.25,
    diurnodominicaldomingohabitual: 1.75,
    diurnaextradominical: 2.0,
  };

  const valorHoraNormal = salario / horasContrato;
  const porcentaje = porcentajes[tipoHora] || 0;
  const totalExtra = valorHoraNormal * horasExtras * porcentaje;

  resultado.textContent = `Valor total a pagar por ${horasExtras} horas ${tipoHora.replace(/([a-z])([A-Z])/g, '$1 $2')} extras: $${totalExtra.toFixed(2)}`;
}

