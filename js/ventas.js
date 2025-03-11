const ventaForm = document.getElementById("ventaForm");
const confirmarVentaBtn = document.getElementById("confirmarVenta");
const productosSeleccionadosTable = document.getElementById("productosSeleccionados").getElementsByTagName('tbody')[0];
const totalElement = document.getElementById("total");

let productosSeleccionados = [];
let total = 0;

// Obtener los productos disponible
async function obtenerProductos() {
  try {
    const response = await fetch("http://localhost:3000/api/productos");

    if (!response.ok) {
      throw new Error('error al obtener productos: ' + response.statusText);
    }

    const productos = await response.json();

    console.log(productos); 

    
    if (!productos || productos.length === 0) {
      console.log("no hay productos disponibles");
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
    console.error('rrror al obtener productos:', error);
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

productosSeleccionadosTable.addEventListener("click", (e) => {
  if (e.target.classList.contains("eliminar")) {
    const index = e.target.getAttribute("data-index");
    productosSeleccionados.splice(index, 1);
    actualizarTabla();
  }
});

ventaForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const productoId = document.getElementById("producto").value;
  const cantidad = document.getElementById("cantidad").value;

  if (!productoId || cantidad <= 0) {
    alert("Seleccione un producto y una cantidad válida.");
    return;
  }
  const response = await fetch(`http://localhost:3000/api/productos/${productoId}`);
  
  const producto = await response.json();
  const subtotal = producto.precio * cantidad;

 
  productosSeleccionados.push({
    id: productoId,
    nombre: producto.nombre,
    cantidad: cantidad,
    subtotal: subtotal,
  });

  actualizarTabla();
});
confirmarVentaBtn.addEventListener("click", async () => {
  if (productosSeleccionados.length === 0) {
    alert("No hay productos seleccionados.");
    return;
  }
///// agregar autentificacion 
  const id_usuario = 1; 
  const productos = productosSeleccionados.map(p => ({
    id_producto: p.id,
    cantidad: p.cantidad
  }));

  const response = await fetch("http://localhost:3000/api/ventas", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ id_usuario, productos })
  });

  const data = await response.json();
  if (response.ok) {
    alert("Venta registrada con éxito.");
    productosSeleccionados = [];
    actualizarTabla();
  } else {
    alert("Error al registrar la venta: " + data.error);
  }
});

document.addEventListener("DOMContentLoaded", obtenerProductos);