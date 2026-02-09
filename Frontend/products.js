const API_URL = "http://localhost:3000/api/products";
const container = document.getElementById("ProductContainer");
const form = document.getElementById("productForm");

const token = localStorage.getItem("token");
if (!token) window.location.href = "index.html";

async function loadProducts() {
    const res = await fetch(API_URL, {
        headers: { "Authorization": "Bearer " + token }
    });
    const products = await res.json();
    renderProducts(products);
}

function renderProducts(products) {
    container.innerHTML = "";

    products.forEach(p => {
        const div = document.createElement("div");
        div.innerHTML = `
            <h3>${p.name}</h3>
            <p>Precio: $${p.price}</p>
            <p>Inventario: ${p.stock} piezas</p>
            <button onclick="deleteProduct(${p.id})">Eliminar</button>
        `;
        container.appendChild(div);
    });
}

form.addEventListener("submit", async e => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const price = document.getElementById("price").value;
    const stock = document.getElementById("stock").value;

    await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ name, price, stock })
    });

    form.reset();
    loadProducts();
});

async function deleteProduct(id) {
    await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { "Authorization": "Bearer " + token }
    });
    loadProducts();
}

document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "index.html";
});

document.addEventListener("DOMContentLoaded", loadProducts);
