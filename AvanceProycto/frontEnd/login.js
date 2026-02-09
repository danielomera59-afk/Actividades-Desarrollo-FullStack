function login() {
    const usuario = document.getElementById("usuario").value;
    const password = document.getElementById("password").value;
    const mensaje = document.getElementById("mensaje");

    if (usuario === "" || password === "") {
        mensaje.textContent = "Completa todos los campos";
        mensaje.style.color = "red";
        return;
    }

    // Simulación de login (backend real después)
    if (usuario === "admin" && password === "1234") {
        window.location.href = "dashboard.html";
    } else {
        mensaje.textContent = "Credenciales incorrectas";
        mensaje.style.color = "red";
    }
}