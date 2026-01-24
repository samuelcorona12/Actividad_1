
class Tarea {
    constructor(nombre, completada = false) {
        this.id = Date.now() + Math.random(); // Genera un ID único
        this.nombre = nombre;
        this.completada = completada;
    }

    // Método para actualizar el estado (completada/incompleta)
    cambiarEstado() {
        this.completada = !this.completada;
    }

    // Método para editar el contenido
    editarContenido(nuevoNombre) {
        this.nombre = nuevoNombre;
    }
}

class GestorDeTareas {
    constructor() {
        // Al cargar, convertimos los datos planos de LocalStorage en instancias de la clase Tarea
        const datosGuardados = JSON.parse(localStorage.getItem('tareas')) || [];
        this.tareas = datosGuardados.map(t => new Tarea(t.nombre, t.completada));
        
        this.listaUl = document.getElementById('taskList');
        this.input = document.getElementById('taskInput');
        this.renderizar();
    }

    agregarTarea() {
        const nombre = this.input.value.trim();
        
        // Validación: No permitir tareas vacías
        if (nombre === "") {
            alert("El nombre de la tarea no puede estar vacío.");
            return;
        }

        const nuevaTarea = new Tarea(nombre);
        this.tareas.push(nuevaTarea);
        
        this.guardarEnLocalStorage();
        this.renderizar();
        this.input.value = ""; // Limpiar input
    }

    eliminarTarea(id) {
        this.tareas = this.tareas.filter(t => t.id !== id);
        this.guardarEnLocalStorage();
        this.renderizar();
    }

    editarTarea(id) {
        const tarea = this.tareas.find(t => t.id === id);
        const nuevoNombre = prompt("Edita tu tarea:", tarea.nombre);
        
        if (nuevoNombre && nuevoNombre.trim() !== "") {
            tarea.editarContenido(nuevoNombre.trim());
            this.guardarEnLocalStorage();
            this.renderizar();
        }
    }

    alternarTarea(id) {
        const tarea = this.tareas.find(t => t.id === id);
        tarea.cambiarEstado();
        this.guardarEnLocalStorage();
        this.renderizar();
    }

    guardarEnLocalStorage() {
        localStorage.setItem('tareas', JSON.stringify(this.tareas));
    }

    renderizar() {
        this.listaUl.innerHTML = ""; // Limpiar lista antes de redibujar

        // Uso de forEach para iterar sobre las tareas
        this.tareas.forEach(tarea => {
            const li = document.createElement('li');
            li.className = `task-item ${tarea.completada ? 'completed' : ''}`;
            
            // Uso de Template Literals para generar el HTML
            li.innerHTML = `
                <span onclick="gestor.alternarTarea(${tarea.id})">
                    ${tarea.nombre}
                </span>
                <div class="buttons">
                    <button class="edit-btn" onclick="gestor.editarTarea(${tarea.id})">Editar</button>
                    <button class="delete-btn" onclick="gestor.eliminarTarea(${tarea.id})">Eliminar</button>
                </div>
            `;
            this.listaUl.appendChild(li);
        });
    }
}

const gestor = new GestorDeTareas();

document.getElementById('addTaskBtn').addEventListener('click', () => {
    gestor.agregarTarea();
});
