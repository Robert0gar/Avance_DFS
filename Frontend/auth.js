const API_URL = "http://localhost:3000/api";

document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.token) {
    localStorage.setItem("token", data.token);
    window.location.href = "products.html";
    } else {
        document.getElementById("error").innerText = "Credenciales incorrectas";
    }
});
