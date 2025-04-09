const input = document.getElementById("nuevaTarea");
const botonAgregar = document.getElementById("botonAgregar");
const lista = document.getElementById("listaTareas");
const botonEliminarCompletadas = document.getElementById("eliminarCompletadas");
const infoRapida = document.getElementById("infoRapida");
const botonesFiltro = document.querySelectorAll(".filtros button");

let tareas = JSON.parse(localStorage.getItem("tareas")) || [];
let filtroActual = "todas";

const mostrar = () => {
  lista.innerHTML = "";

  let tareasFiltradas = [];

  switch (filtroActual) {
    case "pendientes":
      tareasFiltradas = tareas.filter(t => !t.completada);
      break;
    case "completadas":
      tareasFiltradas = tareas.filter(t => t.completada);
      break;
    default:
      tareasFiltradas = [...tareas];
  }

  tareasFiltradas.forEach((tarea, i) => {
    const indexReal = tareas.indexOf(tarea); 
    const item = document.createElement("li");
    item.className = tarea.completada ? "tarea-completada" : "";

    item.innerHTML = `
      <span>${tarea.texto}</span>
      <div>
        <button onclick="completar(${indexReal})">✔</button>
        <button onclick="borrar(${indexReal})">🗑</button>
      </div>
    `;

    lista.appendChild(item);
  });

  mostrarRapida();
  guardar();
};

botonAgregar.addEventListener("click", () => {
  if (input.value.trim() === "") return;

  tareas.push({
    texto: input.value,
    completada: false,
    creada: Date.now(),
    completadaEn: null
  });

  input.value = "";
  mostrar();
});

const completar = i => {
  const tarea = tareas[i];

  if (!tarea.completada) {
    tarea.completada = true;
    tarea.completadaEn = Date.now();
  } else {
    tarea.completada = false;
    tarea.completadaEn = null;
  }

  mostrar();
};

const borrar = i => {
  tareas.splice(i, 1);
  mostrar();
};

botonEliminarCompletadas.addEventListener("click", () => {
  tareas = tareas.filter(t => !t.completada);
  mostrar();
});

const mostrarRapida = () => {
  const completadas = tareas.filter(t => t.completada && t.completadaEn);

  if (completadas.length === 0) {
    infoRapida.textContent = "";
    return;
  }

  const conTiempo = completadas.map(({ texto, creada, completadaEn }) => ({
    texto,
    tiempo: completadaEn - creada
  }));

  const masRapida = conTiempo.reduce((a, b) => (a.tiempo < b.tiempo ? a : b));

  infoRapida.textContent = `⏱ Tarea más rápida: "${masRapida.texto}" en ${Math.round(masRapida.tiempo / 1000)} segundos.`;
};

const guardar = () => {
  localStorage.setItem("tareas", JSON.stringify(tareas));
};

botonesFiltro.forEach(boton => {
  boton.addEventListener("click", () => {
    filtroActual = boton.getAttribute("data-filtro");
    mostrar();
  });
});

mostrar();
