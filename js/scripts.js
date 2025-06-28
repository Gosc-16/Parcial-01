class Evento {
    constructor(id, nombre, fecha, ubicacion, categoria, inscrito = false) {
        this.id = id;
        this.nombre = nombre;
        this.fecha = fecha;
        this.ubicacion = ubicacion;
        this.categoria = categoria;
        this.inscrito = inscrito;
    }

    inscribirse() {
        this.inscrito = true;
    }

    cancelarInscripcion() {
        this.inscrito = false;
    }
}

// --- Datos y persistencia ---
const STORAGE_KEY = "eventos_inscritos";

const listaEventos = [
    new Evento(1, "Convención POO 2025", "2025-07-15", "San Isidro", "Tecnología"),
    new Evento(2, "Festival de Música", "2025-07-20", "Barranco", "Música"),
    new Evento(3, "Maratón en el Campo de Marte", "2025-07-15", "Jesus Maria", "Deporte"),
    new Evento(4, "Taller de Ciberseguridad", "2025-07-22", "Rimac", "Tecnología"),
    new Evento(5, "Concierto de Rock", "2025-08-01", "Barranco", "Música"),
    new Evento(6, "Running 10K", "2025-07-28", "Jesus Maria", "Deporte"),
    new Evento(7, "Expo Emprende", "2025-08-05", "Rimac", "Tecnología"),
    new Evento(8, "DtMf - Bad Bunny", "2025-08-10", "Barranco", "Música"),
    new Evento(9, "Seminario de Inteligencia Artificial", "2025-07-30", "San Isidro", "Tecnología"),
    new Evento(10, "Torneo de Basket", "2025-07-18", "San Isidro", "Deporte"),
    new Evento(11, "Conferencia de Innovación", "2025-08-12", "Rimac", "Tecnología"),
    new Evento(12, "Festival de Cine", "2025-08-15", "San Isidro", "Cultura"),
];

// Recuperar inscripciones guardadas
function cargarInscripciones() {
    const guardados = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (guardados && Array.isArray(guardados)) {
        listaEventos.forEach(evento => {
            evento.inscrito = guardados.includes(evento.id);
        });
    }
}

function guardarInscripciones() {
    const inscritos = listaEventos.filter(e => e.inscrito).map(e => e.id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(inscritos));
}

// --- Elementos DOM ---
const contenedorEventos = document.getElementById("eventos-container");
const contenedorMisEventos = document.getElementById("mis-eventos-container");
const tabs = document.querySelectorAll(".tab");
const contenidos = document.querySelectorAll(".tab-content");

const selectCategoria = document.getElementById("categoria");
const selectFecha = document.getElementById("fecha");
const selectUbicacion = document.getElementById("ubicacion");
const inputBuscador = document.getElementById("buscador");
const botonLimpiarFiltros = document.getElementById("limpiar-filtros");

const form = document.getElementById("form-cliente");
const botonRegistrar = document.getElementById("btn-registrar");
const formContainer = document.getElementById("form-container");

const mensajeExito = document.getElementById("mensaje-exito");

// --- Crear tarjeta de evento ---
function crearCardEvento(evento, esInscrito) {
    const card = document.createElement("div");
    card.className = "evento-card";
    card.innerHTML = `
        <h3>${evento.nombre}</h3>
        <p>📍 ${evento.ubicacion} | 🗓️ ${evento.fecha} | 🏷️ ${evento.categoria}</p>
        <button class="btn-inscripcion">${esInscrito ? "Cancelar inscripción ❌" : "Inscribirme ✅"}</button>
    `;

    const boton = card.querySelector("button");
    boton.addEventListener("click", () => {
        if (esInscrito) {
            evento.cancelarInscripcion();
        } else {
            evento.inscribirse();
        }
        guardarInscripciones();
        filtrarEventos();
        renderizarMisEventos();
        actualizarEstadoBotonRegistro();
    });

    return card;
}

// --- Filtrado ---
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

// --- Renderizar inscritos ---
function renderizarMisEventos() {
    contenedorMisEventos.innerHTML = "";
    const eventosInscritos = listaEventos.filter(evento => evento.inscrito);

    if (eventosInscritos.length === 0) {
        // Mostrar mensaje cuando no hay eventos inscritos
        const mensaje = document.createElement("p");
        mensaje.textContent = "No tienes eventos inscritos. Por favor, inscríbete en algún evento.";
        mensaje.style.fontStyle = "italic";
        mensaje.style.color = "#666";
        mensaje.style.textAlign = "center";
        mensaje.style.marginTop = "2rem";
        contenedorMisEventos.appendChild(mensaje);
    } else {
        // Mostrar tarjetas normalmente
        eventosInscritos.forEach(evento => {
            const card = crearCardEvento(evento, true);
            contenedorMisEventos.appendChild(card);
        });
    }
}

// --- Estado botón registrar ---
function actualizarEstadoBotonRegistro() {
    const hayEventosInscritos = listaEventos.some(e => e.inscrito);
    botonRegistrar.disabled = !hayEventosInscritos;
}

// --- Validaciones ---
function validarInput(input, errorSpan, validatorFn, mensaje) {
    if (!validatorFn(input.value.trim())) {
        errorSpan.textContent = mensaje;
        return false;
    } else {
        errorSpan.textContent = "";
        return true;
    }
}

function validarFormulario() {
    const nombreValido = validarInput(
        document.getElementById("nombre"),
        document.getElementById("error-nombre"),
        val => val.length > 2,
        "Debe tener al menos 3 caracteres"
    );

    const apellidoValido = validarInput(
        document.getElementById("apellido"),
        document.getElementById("error-apellido"),
        val => val.length > 2,
        "Debe tener al menos 3 caracteres"
    );

    const correoValido = validarInput(
        document.getElementById("correo"),
        document.getElementById("error-correo"),
        val => /^\S+@\S+\.\S+$/.test(val),
        "Correo no válido"
    );

    const telefonoValido = validarInput(
        document.getElementById("telefono"),
        document.getElementById("error-telefono"),
        val => /^\d{7,15}$/.test(val),
        "Teléfono no válido"
    );

    const dniValido = validarInput(
        document.getElementById("dni"),
        document.getElementById("error-dni"),
        val => /^\d{8}$/.test(val),
        "DNI debe tener 8 dígitos"
    );

    const todosValidos = nombreValido && apellidoValido && correoValido && telefonoValido && dniValido;
    botonRegistrar.disabled = !todosValidos || !listaEventos.some(e => e.inscrito);

    return todosValidos;
}

// --- Mostrar toast ---
function mostrarMensaje(texto) {
    mensajeExito.textContent = texto;
    mensajeExito.classList.add("show");
    setTimeout(() => {
        mensajeExito.classList.remove("show");
    }, 4000);
}

// --- Eventos ---
tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        contenidos.forEach(c => c.classList.remove("active"));
        const target = document.getElementById(tab.dataset.tab);
        target.classList.add("active");

        formContainer.style.display = tab.dataset.tab === "mis-eventos" ? "block" : "none";

        validarFormulario();
    });
});

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

form.addEventListener("input", validarFormulario);

form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    const nombre = document.getElementById("nombre").value.trim();
    const dni = document.getElementById("dni").value.trim();
    const eventosInscritos = listaEventos.filter(e => e.inscrito).map(e => e.nombre);

    if (eventosInscritos.length === 0) {
        mostrarMensaje("❌ Debes inscribirte a al menos un evento antes de registrarte.");
        return;
    }

    const mensaje = `✅ REGISTRO EXITOSO:\nNOMBRE: ${nombre}\nDNI: ${dni}\nEVENTO${eventosInscritos.length > 1 ? 'S' : ''}: ${eventosInscritos.join(", ")}`;
    mostrarMensaje(mensaje);

    // Reset
    form.reset();
    listaEventos.forEach(e => e.cancelarInscripcion());
    guardarInscripciones();
    filtrarEventos();
    renderizarMisEventos();
    actualizarEstadoBotonRegistro();
});

// --- Inicializar ---
cargarInscripciones();
filtrarEventos();
renderizarMisEventos();
actualizarEstadoBotonRegistro();
validarFormulario();