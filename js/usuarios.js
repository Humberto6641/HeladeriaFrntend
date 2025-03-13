document.addEventListener("DOMContentLoaded", () => {
    
    cargarUsuarios();

    
    const formActualizarUsuario = document.getElementById('formActualizarUsuario');
    formActualizarUsuario.addEventListener('submit', actualizarUsuario);

    
    const modal = document.getElementById('modalActualizar');
    const cerrarModal = document.getElementById('cerrarModal');
    cerrarModal.addEventListener('click', () => modal.style.display = 'none');
});

function obtenerToken() {
    return localStorage.getItem('token'); 
}

// Funcin para cargar los usuarios desde la API
async function cargarUsuarios() {
    const response = await fetch(`https://heladeriabackend.onrender.com/api/usuarios`, {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${obtenerToken()}` 
        }
    });

    const usuarios = await response.json();
    const tablaUsuarios = document.getElementById('tablaUsuarios').getElementsByTagName('tbody')[0];
    tablaUsuarios.innerHTML = ''; 

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

// Funcion para mostrar el modal de actualización con los datos del usuario
function mostrarModalActualizar(usuario) {
    document.getElementById('usuarioId').value = usuario.id;
    document.getElementById('nombre').value = usuario.nombre;
    document.getElementById('rol').value = usuario.rol;
    const modal = document.getElementById('modalActualizar');
    modal.style.display = 'block';
}

// Funcion para actualizar el usuario
async function actualizarUsuario(e) {
    e.preventDefault();

    const id = document.getElementById('usuarioId').value;
    const rol = document.getElementById('rol').value;

    if (!rol) {
        alert("El rol es obligatorio.");
        return;
    }
    const data = { rol };

    const response = await fetch(`https://heladeriabackend.onrender.com/api/usuarios/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${obtenerToken()}`
        },
        body: JSON.stringify(data)
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

// Funcio para eliminar un usuario
async function eliminarUsuario(id) {
    const confirmacion = confirm("¿Estás seguro de eliminar este usuario?");
    if (!confirmacion) return;

    const response = await fetch(`https://heladeriabackend.onrender.com/api/usuarios/${id}`, {
        method: 'DELETE',
        headers: {
            "Authorization": `Bearer ${obtenerToken()}` 
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