import { useEffect, useState } from "react";
import api from "../api/axios";

function Products() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/products");
      const data = res.data.items || res.data;
      setProducts(Array.isArray(data) ? data : []);
      setError(""); 
    } catch (err) {
      setError("Error al conectar con la panadería.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleBuy = async (productId, productName) => {
    const qty = prompt(`¿Cuántas unidades de ${productName} deseas?`);
    if (!qty) return;
    const quantity = parseInt(qty);
    if (isNaN(quantity) || quantity <= 0) {
      alert("Ingresa una cantidad válida.");
      return;
    }

    try {
      await api.post(`/products/${productId}/buy`, { quantity });
      alert("¡Compra exitosa!");
      loadProducts(); 
    } catch (err) {
      const msg = err.response?.data?.error || "Error al procesar la compra";
      alert(`No se pudo realizar la compra: ${msg}`);
    }
  };

  if (loading) return <div style={{ textAlign: "center", padding: "50px" }}>Cargando panadería...</div>;

  return (
    // CAMBIO AQUÍ: Aumentamos el ancho máximo o usamos 100%
    <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center", color: "#1e293b", marginBottom: "30px", fontSize: "2rem" }}>
        🥐 Catálogo de Productos
      </h2>
      
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

      <div style={{ 
        display: "grid", 
        // CAMBIO AQUÍ: minmax de 280px para que las tarjetas se vean más grandes y llenen la pantalla
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", 
        gap: "30px" 
      }}>
        {products.map(p => (
          <div key={p.id} style={{ 
            border: "1px solid #e2e8f0", 
            padding: "25px", 
            borderRadius: "15px", 
            textAlign: "center", 
            background: "white",
            boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)"
          }}>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "15px" }}>{p.name}</h3>
            <p style={{ fontWeight: "bold", fontSize: "1.8rem", color: "#e67e22" }}>
              ${Number(p.price).toFixed(2)}
            </p>
            <p style={{ color: "#64748b", marginBottom: "15px" }}>Stock: {p.stock} unidades</p>
            
            <button 
              onClick={() => handleBuy(p.id, p.name)}
              disabled={p.stock <= 0}
              style={{ 
                backgroundColor: p.stock <= 0 ? "#cbd5e1" : "#e67e22", 
                color: "white", 
                border: "none", 
                padding: "15px", 
                borderRadius: "8px", 
                width: "100%", 
                cursor: p.stock <= 0 ? "not-allowed" : "pointer",
                fontWeight: "bold",
                fontSize: "1rem",
                transition: "background 0.3s"
              }}
            >
              {p.stock <= 0 ? "AGOTADO" : "AÑADIR AL CARRITO"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;