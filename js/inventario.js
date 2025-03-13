const tablaInventario = document.getElementById("tablaInventario").getElementsByTagName('tbody')[0]; 
const formInventario = document.getElementById("formInventario");
const idProductoSelect = document.getElementById("id_producto");

// Función para obtener el token desde el localStorage
function obtenerToken() {
  return localStorage.getItem('token');  // Asegúrate de que el token esté guardado en el localStorage
}

// Función para cargar los productos
async function cargarProductos() {
  try {
    const response = await fetch(`https://heladeriabackend.onrender.com/api/productos`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${obtenerToken()}`  // Aquí agregamos el token
      }
    });
    const productos = await response.json();
    
    if (response.ok) {
      productos.forEach(producto => {
        const option = document.createElement("option");
        option.value = producto.id;
        option.textContent = `${producto.nombre} - ${producto.tipo}`;
        idProductoSelect.appendChild(option);
      });
    } else {
      alert("No se pudieron cargar los productos.");
    }
  } catch (error) {
    alert("Error al cargar los productos: " + error.message);
  }
}

// Función para cargar el inventario
async function cargarInventario() {
  try {
    const response = await fetch(`https://heladeriabackend.onrender.com/api/inventarios`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${obtenerToken()}`  // Aquí también agregamos el token
      }
    });
    const inventarios = await response.json();
    
    if (response.ok) {
      tablaInventario.innerHTML = "";
      inventarios.forEach(inventario => {
        const row = tablaInventario.insertRow();
        row.innerHTML = `
          <td>${inventario.id_producto}</td>
          <td>${inventario.nombre}</td>
          <td>${inventario.cantidad}</td>
          <td>${new Date(inventario.fecha_reposicion).toLocaleDateString()}</td>
        `;
      });
    } else {
      alert("No se pudieron cargar los inventarios.");
    }
  } catch (error) {
    alert("Error al cargar el inventario: " + error.message);
  }
}

// Función para registrar reposición de inventario
async function registrarReposicion(event) {
  event.preventDefault();
  
  const id_producto = idProductoSelect.value;
  const cantidad = parseInt(document.getElementById("cantidad").value);
  const fecha_reposicion = document.getElementById("fecha_reposicion").value;

  try {
    const response = await fetch(`https://heladeriabackend.onrender.com/api/inventarios`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${obtenerToken()}`  // Agregamos el token aquí también
      },
      body: JSON.stringify({ id_producto, cantidad, fecha_reposicion })
    });

    const data = await response.json();

    if (response.ok) {
      alert("Reposición registrada exitosamente.");
      cargarInventario();  
    } else {
      alert(`Error: ${data.error}`);
    }
  } catch (error) {
    alert("Error al registrar reposición: " + error.message);
  }
}

async function init() {
  await cargarProductos();  
  await cargarInventario();  
}

formInventario.addEventListener("submit", registrarReposicion);
init();