document.addEventListener("DOMContentLoaded", () => {
    // Cargar los usuarios al cargar la página
    cargarUsuarios();

    // Manejo del formulario de actualización
    const formActualizarUsuario = document.getElementById('formActualizarUsuario');
    formActualizarUsuario.addEventListener('submit', actualizarUsuario);

    // Cerrar el modal de actualización
    const modal = document.getElementById('modalActualizar');
    const cerrarModal = document.getElementById('cerrarModal');
    cerrarModal.addEventListener('click', () => modal.style.display = 'none');
});

function obtenerToken() {
    return localStorage.getItem('token'); // Ajusta esta parte según cómo almacenes el token
}

// Función para cargar los usuarios desde la API
async function cargarUsuarios() {
    const response = await fetch(`https://heladeriabackend.onrender.com/api/usuarios`, {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${obtenerToken()}` // Agregar el token al encabezado
        }
    });

    const usuarios = await response.json();
    const tablaUsuarios = document.getElementById('tablaUsuarios').getElementsByTagName('tbody')[0];
    tablaUsuarios.innerHTML = ''; // Limpiar la tabla antes de llenarla

    usuarios.forEach(usuario => {
        const row = tablaUsuarios.insertRow();
        row.insertCell(0).textContent = usuario.id;
        row.insertCell(1).textContent = usuario.nombre;
        row.insertCell(2).textContent = usuario.rol;
        const accionesCell = row.insertCell(3);

        // Crear botones de actualizar y eliminar
        const btnActualizar = document.createElement('button');
        btnActualizar.textContent = 'Actualizar';
        btnActualizar.onclick = () => mostrarModalActualizar(usuario);
        accionesCell.appendChild(btnActualizar);

        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = 'Eliminar';
        btnEliminar.onclick = () => eliminarUsuario(usuario.id);
        accionesCell.appendChild(btnEliminar);
    });
}

// Función para mostrar el modal de actualización con los datos del usuario
function mostrarModalActualizar(usuario) {
    document.getElementById('usuarioId').value = usuario.id;
    document.getElementById('nombre').value = usuario.nombre;
    document.getElementById('rol').value = usuario.rol;
    document.getElementById('nivel_acceso').value = usuario.nivel_acceso;
    const modal = document.getElementById('modalActualizar');
    modal.style.display = 'block';
}

// Función para actualizar el usuario
async function actualizarUsuario(e) {
    e.preventDefault();

    const id = document.getElementById('usuarioId').value;
    const nombre = document.getElementById('nombre').value;
    const rol = document.getElementById('rol').value;
    const nivel_acceso = parseInt(document.getElementById('nivel_acceso').value);
    const password = document.getElementById('password').value;  // Obtén el valor de la contraseña

    // Validación en frontend para asegurarse que los campos no estén vacíos
    if (!nombre || !rol || !nivel_acceso) {
        alert("Todos los campos son obligatorios.");
        return;
    }

    const response = await fetch(`https://heladeriabackend.onrender.com/api/usuarios/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${obtenerToken()}` // Agregar el token al encabezado
        },
        body: JSON.stringify({ nombre, rol, nivel_acceso, password }),  // Incluir el password si se proporciona
    });

    const result = await response.json();
    if (response.ok) {
        alert('Usuario actualizado correctamente');
        cargarUsuarios();
        document.getElementById('modalActualizar').style.display = 'none';
    } else {
        alert(`Error: ${result.error}`);
    }
}

// Función para eliminar un usuario
async function eliminarUsuario(id) {
    const confirmacion = confirm("¿Estás seguro de eliminar este usuario?");
    if (!confirmacion) return;

    const response = await fetch(`https://heladeriabackend.onrender.com/api/usuarios/${id}`, {
        method: 'DELETE',
        headers: {
            "Authorization": `Bearer ${obtenerToken()}` // Agregar el token al encabezado
        }
    });

    const result = await response.json();
    if (response.ok) {
        alert('Usuario eliminado correctamente');
        cargarUsuarios();
    } else {
        alert(`Error: ${result.error}`);
    }
}