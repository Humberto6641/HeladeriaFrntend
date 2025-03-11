const productoForm = document.getElementById("productoForm");
const productosTable = document.getElementById("productosTable").getElementsByTagName('tbody')[0];

// Función para registrar un producto
async function registrarProducto(event) {
    event.preventDefault(); 
    const producto = {
        nombre: document.getElementById("nombre").value,
        tipo: document.getElementById("tipo").value,
        precio: parseFloat(document.getElementById("precio").value),
        stock: parseInt(document.getElementById("stock").value)

    };

    try {
        const response = await fetch("http://localhost:3000/api/productos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(producto),
        });

        const data = await response.json();
        if (response.ok) {
            alert("Producto registrado exitosamente");
            cargarProductos();  
        } else {
            alert(`Error: ${data.error}`);
        }
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
}

// muestra los productos en existencia
async function cargarProductos() {
    try {
        const response = await fetch("http://localhost:3000/api/productos");
        const data = await response.json();
        console.log(data); 
        if (response.ok) {
            productosTable.innerHTML = "";
            if (Array.isArray(data) && data.length > 0) {
               
                data.forEach(producto => {
                    const row = productosTable.insertRow();
                    row.innerHTML = `
                        <td>${producto.id}</td>
                        <td>${producto.nombre}</td>
                        <td>${producto.tipo}</td>
                        <td>${producto.precio}</td>
                        <td>${producto.stock}</td>
                        <td>
                            <button onclick="editarProducto(${producto.id})">Editar</button>
                        </td>
                    `;
                });
            } else {
                alert("No se encontraron productos.");
            }
        } else {
            alert(`Error: ${data.error}`);
        }
    } catch (error) {
        alert(`Error al cargar los productos: ${error.message}`);
    }
}
/*function editarProducto(id) {
    alert(`Editar producto con ID: ${id}`);
}*/

window.onload = cargarProductos;

productoForm.addEventListener("submit", registrarProducto);