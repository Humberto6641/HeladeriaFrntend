const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre = document.querySelector("#nombre").value;
  const password = document.querySelector("#password").value;

  try {
    const response = await fetch("http://localhost:3000/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nombre, password }),
    });

    const data = await response.json();
    if (response.ok) {
      console.log("Usuario registrado con éxito", data);
    } else {
      console.log("Error al registrar usuario", data);
    }
  } catch (error) {
    console.error("Error en la solicitud:", error);
  }
});