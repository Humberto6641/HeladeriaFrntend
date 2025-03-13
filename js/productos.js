const productoForm = document.getElementById("productoForm");
const productosTable = document.getElementById("productosTable").getElementsByTagName('tbody')[0];
let productoIdEditado = null;  // Variable para almacenar el ID del producto que se está editando

// Función para obtener el token desde el localStorage
function obtenerToken() {
    return localStorage.getItem('token');  // Asegúrate de que el token esté guardado en el localStorage
}

// Función para registrar o actualizar un producto
async function registrarProducto(event) {
    event.preventDefault();
    const producto = {
        nombre: document.getElementById("nombre").value,
        tipo: document.getElementById("tipo").value,
        precio: parseFloat(document.getElementById("precio").value),
        stock: parseInt(document.getElementById("stock").value)
    };

    try {
        let response;
        if (productoIdEditado) {
            // Si estamos editando un producto, hacemos un PUT para actualizar
            response = await fetch(`https://heladeriabackend.onrender.com/api/productos/${productoIdEditado}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${obtenerToken()}`  // Aquí agregamos el token en el encabezado
                },
                body: JSON.stringify(producto),
            });
        } else {
            // Si no estamos editando, hacemos un POST para agregar
            response = await fetch("https://heladeriabackend.onrender.com/api/productos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${obtenerToken()}`  // Aquí agregamos el token en el encabezado
                },
                body: JSON.stringify(producto),
            });
        }

        const data = await response.json();
        if (response.ok) {
            alert("Producto registrado exitosamente");
            productoIdEditado = null;  // Resetear el ID del producto editado
            cargarProductos();  // Recargar la lista de productos
            resetFormulario();  // Resetear formulario
        } else {
            alert(`Error: ${data.error}`);
        }
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
}

// Muestra los productos en existencia
async function cargarProductos() {
    try {
        const response = await fetch("https://heladeriabackend.onrender.com/api/productos", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${obtenerToken()}`  // Agregamos el token aquí también
            }
        });
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
                            <button onclick="eliminarProducto(${producto.id})">Eliminar</button>
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

// Función para editar un producto
async function editarProducto(id) {
    try {
        const response = await fetch(`https://heladeriabackend.onrender.com/api/productos/${id}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${obtenerToken()}`  // Agregamos el token aquí también
            }
        });

        // Verifica si la respuesta fue exitosa
        const data = await response.json();
        if (response.ok) {
            console.log("Datos del producto:", data);  // Verificación de los datos recibidos

            // Llenamos el formulario con los datos del producto
            document.getElementById("nombre").value = data.nombre;
            document.getElementById("tipo").value = data.tipo;
            document.getElementById("precio").value = data.precio;
            document.getElementById("stock").value = data.stock;

            // Cambiar el texto del botón para "Guardar cambios"
            document.getElementById("productoForm").querySelector("button").textContent = "Guardar cambios";
            productoIdEditado = id;  // Guardamos el ID del producto que estamos editando
        } else {
            alert(`Error al cargar el producto: ${data.error}`);
        }
    } catch (error) {
        alert(`Error al cargar el producto: ${error.message}`);
    }
}

// Función para eliminar un producto
async function eliminarProducto(id) {
    if (confirm("¿Estás seguro de que quieres eliminar este producto?")) {
        try {
            const response = await fetch(`https://heladeriabackend.onrender.com/api/productos/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${obtenerToken()}`  // Agregamos el token aquí también
                }
            });

            const data = await response.json();
            if (response.ok) {
                alert("Producto eliminado exitosamente");
                cargarProductos();  // Vuelve a cargar los productos después de eliminar
            } else {
                alert(`Error al eliminar el producto: ${data.error || 'Error desconocido'}`);
            }
        } catch (error) {
            alert(`Error al eliminar el producto: ${error.message}`);
        }
    }
}

// Función para resetear el formulario
function resetFormulario() {
    productoForm.reset();
    document.getElementById("productoForm").querySelector("button").textContent = "Registrar producto";  // Restaurar texto original del botón
}

window.onload = cargarProductos;

productoForm.addEventListener("submit", registrarProducto);