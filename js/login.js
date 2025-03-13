document.getElementById("login-form").addEventListener("submit", async (event) => {
  event.preventDefault(); 

  
  const nombre = document.getElementById("nombre").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!nombre || !password) {
      alert("Por favor, ingresa nombre y contraseña.");
      return;
  }

  try {
      const response = await fetch('https://heladeriabackend.onrender.com/api/login', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ nombre, password }),
      });

      const data = await response.json();

      if (response.ok) {
          
          localStorage.setItem("token", data.token);

          alert('Inicio de sesión exitoso');
          window.location.href = "dashboard.html"; 
      } else {
          alert(data.error || 'Error al iniciar sesión');
      }
  } catch (error) {
      console.error('Error en la solicitud:', error);
      alert('Hubo un error al intentar iniciar sesión.');
  }
});