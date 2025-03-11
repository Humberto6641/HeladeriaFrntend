const tablaReportes = document.getElementById("reportes").getElementsByTagName('tbody')[0];
const ventasChartCanvas = document.getElementById("ventasChart");

async function obtenerReportes() {
    try {
      const response = await fetch("http://localhost:3000/api/reportes"); 
  
      if (!response.ok) {
        throw new Error('Error al obtener reportes: ' + response.statusText);
      }
  
      const reportes = await response.json();
      console.log(reportes); 
  
      if (!reportes || reportes.length === 0) {
        console.log("No hay ventas registradas.");
        return;
      }

      reportes.forEach(venta => {
        venta.detalle_venta.forEach(detalle => {
          const row = tablaReportes.insertRow();
          row.innerHTML = `
            <td>${new Date(venta.fecha).toLocaleDateString()}</td>
            <td>${detalle.producto.nombre}</td>
            <td>${detalle.cantidad}</td>
            <td>${(detalle.cantidad * detalle.producto.precio).toFixed(2)}</td>
          `;
        });
      });
  
      // parte grafica
      crearGrafico(reportes);
  
    } catch (error) {
      console.error('Error al obtener reportes:', error);
    }
  }

  function crearGrafico(reportes) {
    const productos = [];
    const cantidades = [];
  
    reportes.forEach(venta => {
      venta.detalle_venta.forEach(detalle => {
        const index = productos.indexOf(detalle.producto.nombre);
        if (index === -1) {
          productos.push(detalle.producto.nombre);
          cantidades.push(detalle.cantidad);
        } else {
          cantidades[index] += detalle.cantidad;
        }
      });
    });
  
    // barrass para el grafico
    new Chart(ventasChartCanvas, {
      type: 'bar',
      data: {
        labels: productos,
        datasets: [{
          label: 'Cantidad Vendida',
          data: cantidades,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

document.addEventListener("DOMContentLoaded", obtenerReportes);