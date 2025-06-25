// app.js

class Evento {
    constructor(id, nombre, fecha, ubicacion, categoria) {
        this.id = id;
        this.nombre = nombre;
        this.fecha = fecha;
        this.ubicacion = ubicacion;
        this.categoria = categoria;
        this.inscrito = false;
    }

    inscribirse() {
        this.inscrito = true;
    }

    cancelarInscripcion() {
        this.inscrito = false;
    }
}

// Lista simulada de eventos
const listaEventos = [
    new Evento(1, "Convencion POO 2025", "2025-07-15", "San Isidro", "Tecnología"),
    new Evento(2, "Festival de Música", "2025-07-20", "Barrranco", "Música"),
    new Evento(3, "Maratón en el Campo de Marte", "2025-07-15", "Jesus Maria", "Deporte"),
    new Evento(4, "Taller de Ciberseguridad", "2025-07-22", "Rimac", "Tecnología"),
    new Evento(5, "Concierto de Rock", "2025-08-01", "Barranco", "Música"),
    new Evento(6, "Running 10K", "2025-07-28", "Jesus Maria", "Deporte"),
    new Evento(7, "Expo Emprende", "2025-08-05", "Rimac", "Tecnología"),
    new Evento(8, "DtMf - Bad Bunny", "2025-08-10", "Barranco", "Música"),
    new Evento(9, "Seminario de Inteligencia Artificial", "2025-07-30", "San Isidro", "Tecnología"),
    new Evento(10, "Torneo de Basket", "2025-07-18", "San Isidro", "Deporte"),
    new Evento(11, "Conferencia de Innovación", "2025-08-12", "Rimac", "Tecnología"),
    new Evento(12, "Festival de Cine", "2025-08-15", "San Isidro", "Cultura")
];

// Elementos del DOM
const contenedorEventos = document.getElementById("eventos-container");
const contenedorMisEventos = document.getElementById("mis-eventos-container");
const tabs = document.querySelectorAll(".tab");
const contenidos = document.querySelectorAll(".tab-content");

const selectCategoria = document.getElementById("categoria");
const selectFecha = document.getElementById("fecha");
const selectUbicacion = document.getElementById("ubicacion");
const inputBuscador = document.getElementById("buscador");
const botonLimpiarFiltros = document.getElementById("limpiar-filtros");

// Crear la tarjeta visual del evento
function crearCardEvento(evento, esInscrito) {
    const card = document.createElement("div");
    card.className = "evento-card";
    card.innerHTML = `
        <h3>${evento.nombre}</h3>
        <p>📍 ${evento.ubicacion} | 🗓️ ${evento.fecha} | 🏷️ ${evento.categoria}</p>
        <button>${esInscrito ? "Cancelar inscripción" : "Inscribirme"}</button>
    `;

    const boton = card.querySelector("button");
    boton.addEventListener("click", () => {
        if (esInscrito) {
            evento.cancelarInscripcion();
        } else {
            evento.inscribirse();
        }
        filtrarEventos();
        renderizarMisEventos();
    });

    return card;
}

// 🔍 Filtro dinámico incluyendo categoría, fecha, ubicación y búsqueda por nombre
function filtrarEventos() {
    const categoria = selectCategoria.value;
    const fecha = selectFecha.value;
    const ubicacion = selectUbicacion.value;
    const textoBusqueda = inputBuscador.value.toLowerCase();

    contenedorEventos.innerHTML = "";

    listaEventos.forEach(evento => {
        const coincideCategoria = !categoria || evento.categoria === categoria;
        const coincideFecha = !fecha || evento.fecha === fecha;
        const coincideUbicacion = !ubicacion || evento.ubicacion === ubicacion;
        const coincideBusqueda = evento.nombre.toLowerCase().includes(textoBusqueda);

        if (!evento.inscrito && coincideCategoria && coincideFecha && coincideUbicacion && coincideBusqueda) {
            const card = crearCardEvento(evento, false);
            contenedorEventos.appendChild(card);
        }
    });
}

// Mostrar eventos inscritos
function renderizarMisEventos() {
    contenedorMisEventos.innerHTML = "";
    listaEventos.forEach(evento => {
        if (evento.inscrito) {
            const card = crearCardEvento(evento, true);
            contenedorMisEventos.appendChild(card);
        }
    });
}

// Cambio entre pestañas
tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        contenidos.forEach(c => c.classList.remove("active"));
        const target = document.getElementById(tab.dataset.tab);
        target.classList.add("active");
    });
});

// 🎧 Eventos de escucha
selectCategoria.addEventListener("change", filtrarEventos);
selectFecha.addEventListener("change", filtrarEventos);
selectUbicacion.addEventListener("change", filtrarEventos);
inputBuscador.addEventListener("input", filtrarEventos);

botonLimpiarFiltros.addEventListener("click", () => {
    selectCategoria.value = "";
    selectFecha.value = "";
    selectUbicacion.value = "";
    inputBuscador.value = "";
    filtrarEventos();
});

// Inicialización
filtrarEventos();
renderizarMisEventos();
