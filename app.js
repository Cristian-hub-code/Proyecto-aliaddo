const correosPermitidos = [
  "ruacristian68@gmail.com",
  "cruar@aliaddo.com",
  "sapo"
];

const cursosPorGrupo = {
  erp: [
    { titulo: "Curso 1: Parametrización ejemplo cambio github - Sesión 1", video: "uU85OOa83JI" },
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
    { titulo: "Curso 2: Contrato", video: "pGEH-c1uQE4"},
    { titulo: "Curso 3: Periodos y novedades", video: "uU85OOa83JI"},
    { titulo: "Curso 4: PILA, nómina electrónica, contabilidad", video: "_-0-UinOlB0" }
  ]
};

let grupoSeleccionado = null;
let players = [];

function iniciarSesion() {
  const email = document.getElementById("email").value.trim().toLowerCase();
  const error = document.getElementById("error");

  if (correosPermitidos.includes(email)) {
    localStorage.setItem("usuarioAliaddo", email);
    document.getElementById("login-section").style.display = "none";
    document.getElementById("nav-menu").style.display = "block";
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

function mostrarSeccion(seccion) {
  document.getElementById("inicio-section").style.display = "none";
  document.getElementById("cursos-section").style.display = "none";
  if (seccion === "inicio") {
    document.getElementById("inicio-section").style.display = "block";
  } else if (seccion === "cursos") {
    document.getElementById("cursos-section").style.display = "block";
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
      </button>`;
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

window.onYouTubeIframeAPIReady = function() {
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
          'onStateChange': function(event) {
            if (event.data === YT.PlayerState.ENDED && index === progreso) {
              mostrarBoton(index);
            }
          }
        }
      });
    }
  }
}

const imagenesCarrusel = [
  "https://i.postimg.cc/7Z5dG361/aliaddo-app-movil.webp",
  "https://i.postimg.cc/HL5N3TbV/aliaddo-software.webp",
];
let indiceCarrusel = 0;

setInterval(() => {
  indiceCarrusel = (indiceCarrusel + 1) % imagenesCarrusel.length;
  document.getElementById("imagen-carrusel").src = imagenesCarrusel[indiceCarrusel];
}, 4000);

function volverASeleccionarGrupo() {
  grupoSeleccionado = null;
  document.getElementById("lista-cursos").innerHTML = "";
  document.getElementById("boton-cambiar-grupo").style.display = "none";
  document.getElementById("selector-grupo").style.display = "block";
}

document.getElementById("cerrar-superior-dentro").style.display = "none";
