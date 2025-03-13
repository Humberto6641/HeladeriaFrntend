const ventaForm = document.getElementById("ventaForm");
const confirmarVentaBtn = document.getElementById("confirmarVenta");
const productosSeleccionadosTable = document.getElementById("productosSeleccionados").getElementsByTagName('tbody')[0];
const totalElement = document.getElementById("total");

let productosSeleccionados = [];
let total = 0;

function obtenerToken() {
  return localStorage.getItem('token');  
}

// Extraer el id del usuario desde el token
function obtenerIdUsuarioDesdeToken() {
  const token = obtenerToken();
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1])); // Decodificar payload del JWT
    return payload.id; // Asegúrate de que en el backend el token incluye el campo `id`
  } catch (error) {
    console.error("Error al extraer id del token:", error);
    return null;
  }
}

// Función para registrar auditoría
async function registrarAuditoria(evento, descripcion) {
  try {
    const response = await fetch("https://heladeriabackend.onrender.com/api/auditoria", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${obtenerToken()}`  
      },
      body: JSON.stringify({ evento, descripcion, fecha: new Date().toISOString() })
    });

    if (!response.ok) {
      throw new Error('Error al registrar auditoría: ' + response.statusText);
    }
  } catch (error) {
    console.error('Error en la auditoría:', error);
  }
}

// Obtener los productos disponibles
async function obtenerProductos() {
  try {
    const response = await fetch("https://heladeriabackend.onrender.com/api/productos", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${obtenerToken()}`  
      }
    });

    if (!response.ok) {
      throw new Error('Error al obtener productos: ' + response.statusText);
    }

    const productos = await response.json();

    if (!productos || productos.length === 0) {
      console.log("No hay productos disponibles");
      return;
    }

    const selectElement = document.getElementById("producto");
    productos.forEach(producto => {
      const option = document.createElement("option");
      option.value = producto.id;
      option.text = producto.nombre;
      selectElement.appendChild(option);
    });
  } catch (error) {
    console.error('Error al obtener productos:', error);
  }
}

function actualizarTabla() {
  productosSeleccionadosTable.innerHTML = "";

  total = 0;

  productosSeleccionados.forEach((producto, index) => {
    const row = productosSeleccionadosTable.insertRow();
    row.innerHTML = `
      <td>${producto.nombre}</td>
      <td>${producto.cantidad}</td>
      <td>${producto.subtotal}</td>
      <td><button class="eliminar" data-index="${index}">Eliminar</button></td>
    `;
  });

  total = productosSeleccionados.reduce((sum, producto) => sum + producto.subtotal, 0);
  totalElement.textContent = total.toFixed(2);
}

// Eliminar producto del carrito
productosSeleccionadosTable.addEventListener("click", async (e) => {
  if (e.target.classList.contains("eliminar")) {
    const index = e.target.getAttribute("data-index");
    const productoEliminado = productosSeleccionados[index];
    
    productosSeleccionados.splice(index, 1);
    actualizarTabla();

    // Registrar en auditoría
    await registrarAuditoria("Eliminar producto", `Se eliminó ${productoEliminado.nombre} del carrito.`);
  }
});

// Agregar producto al carrito
ventaForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const productoId = document.getElementById("producto").value;
  const cantidad = document.getElementById("cantidad").value;

  if (!productoId || cantidad <= 0) {
    alert("Seleccione un producto y una cantidad válida.");
    return;
  }

  const response = await fetch(`https://heladeriabackend.onrender.com/api/productos/${productoId}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${obtenerToken()}`  
    }
  });

  const producto = await response.json();
  const subtotal = producto.precio * cantidad;

  productosSeleccionados.push({
    id: productoId,
    nombre: producto.nombre,
    cantidad: cantidad,
    subtotal: subtotal,
  });

  actualizarTabla();

  // Registrar en auditoría
  await registrarAuditoria("Agregar producto", `Se agregó ${producto.nombre} (${cantidad}) al carrito.`);
});

// Confirmar venta
confirmarVentaBtn.addEventListener("click", async () => {
  if (productosSeleccionados.length === 0) {
    alert("No hay productos seleccionados.");
    return;
  }

  const id_usuario = obtenerIdUsuarioDesdeToken(); // Obtener id del usuario del token
  if (!id_usuario) {
    alert("No se pudo obtener la información del usuario.");
    return;
  }

  const productos = productosSeleccionados.map(p => ({
    id_producto: p.id,
    cantidad: p.cantidad
  }));

  const response = await fetch("https://heladeriabackend.onrender.com/api/ventas", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${obtenerToken()}`  
    },
    body: JSON.stringify({ id_usuario, productos })
  });

  const data = await response.json();
  if (response.ok) {
    alert("Venta registrada con éxito.");
    productosSeleccionados = [];
    actualizarTabla();

    // Registrar en auditoría
    await registrarAuditoria("Venta confirmada", `Se registró una venta con ${productos.length} productos.`);
  } else {
    alert("Error al registrar la venta: " + data.error);
  }
});

document.addEventListener("DOMContentLoaded", obtenerProductos);