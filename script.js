const input = document.getElementById("nuevaTarea");
const botonAgregar = document.getElementById("botonAgregar");
const lista = document.getElementById("listaTareas");
const botonEliminarCompletadas = document.getElementById("eliminarCompletadas");
const infoRapida = document.getElementById("infoRapida");

let tareas = JSON.parse(localStorage.getItem("tareas")) || [];

function mostrar() {
  lista.innerHTML = "";

  tareas.forEach((tarea, i) => {
    const item = document.createElement("li");
    item.className = tarea.completada ? "tarea-completada" : "";

    item.innerHTML = `
      <span>${tarea.texto}</span>
      <div>
        <button onclick="completar(${i})">✔</button>
        <button onclick="borrar(${i})">🗑</button>
      </div>
    `;

    lista.appendChild(item);
  });

  mostrarRapida();
  guardar();
}

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

function completar(i) {
  const tarea = tareas[i];

  if (!tarea.completada) {
    tarea.completada = true;
    tarea.completadaEn = Date.now();
  } else {
    tarea.completada = false;
    tarea.completadaEn = null;
  }

  mostrar();
}

function borrar(i) {
  tareas.splice(i, 1);
  mostrar();
}

botonEliminarCompletadas.addEventListener("click", () => {
  tareas = tareas.filter(t => !t.completada);
  mostrar();
});

function mostrarRapida() {
  const completadas = tareas.filter(t => t.completada && t.completadaEn);

  if (completadas.length === 0) {
    infoRapida.textContent = "";
    return;
  }

  const conTiempo = completadas.map(t => ({
    texto: t.texto,
    tiempo: t.completadaEn - t.creada
  }));

  const masRapida = conTiempo.reduce((a, b) => a.tiempo < b.tiempo ? a : b);

  infoRapida.textContent = `⏱ Tarea más rápida: "${masRapida.texto}" en ${Math.round(masRapida.tiempo / 1000)} segundos.`;
}

function guardar() {
  localStorage.setItem("tareas", JSON.stringify(tareas));
}

mostrar();
