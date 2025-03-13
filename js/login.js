document.getElementById("login-form").addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevenir el comportamiento por defecto del formulario
  
    // Obtener los valores del formulario
    const nombre = document.getElementById("nombre").value;
    const password = document.getElementById("password").value;
  
    // Enviar la solicitud de login al backend
    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Si el login es exitoso, almacenar el token JWT y redirigir
        localStorage.setItem("token", data.token);
        alert('Inicio de sesión exitoso');
        window.location.href = "dashboard.html"; // Redirige a la página de inicio
      } else {
        alert(data.error || 'Error al iniciar sesión');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      alert('Hubo un error al intentar iniciar sesión');
    }
  });