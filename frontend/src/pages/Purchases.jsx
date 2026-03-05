import { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

function Purchases() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useContext(AuthContext);

  const loadPurchases = async () => {
    try {
      setLoading(true);
      setError("");

      let res;
      // El backend decide qué devolver según el rol
      if (user.role === "admin") {
        res = await api.get("/purchases");
      } else {
        res = await api.get("/purchases/my");
      }

      setPurchases(res.data);
    } catch (err) {
      console.error("Error al cargar compras:", err);
      setError("No se pudieron cargar las compras. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadPurchases();
    }
  }, [user]);

  if (loading) {
    return <div style={{ padding: "30px", textAlign: "center" }}>Cargando historial...</div>;
  }

  if (error) {
    return <div style={{ padding: "30px", color: "red", textAlign: "center" }}>{error}</div>;
  }

  return (
    <div style={{ padding: "30px", maxWidth: "800px", margin: "0 auto" }}>
      <h2 style={{ borderBottom: "2px solid #1e293b", paddingBottom: "10px" }}>
        {user.role === "admin" ? "📋 Gestión Global de Ventas" : "🛍️ Mis Compras"}
      </h2>

      {purchases.length === 0 ? (
        <p style={{ marginTop: "20px", color: "#667" }}>No hay registros de compras aún.</p>
      ) : (
        <div style={{ marginTop: "20px" }}>
          {purchases.map((purchase) => (
            <div
              key={purchase.id}
              style={{
                background: "#f8fafc",
                padding: "20px",
                marginBottom: "15px",
                borderRadius: "10px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                display: "flex",
                flexDirection: "column",
                gap: "5px"
              }}
            >
              {/* Solo el admin ve el correo del cliente */}
              {user.role === "admin" && (
                <p><strong> Cliente:</strong> {purchase.user_email}</p>
              )}

              <p><strong> Producto:</strong> {purchase.product_name}</p>
              <p><strong> Cantidad:</strong> {purchase.quantity} unidades</p>
              
              {/* IMPORTANTE: El campo en la DB es 'total' */}
              <p style={{ fontSize: "1.1em", color: "#16a34a" }}>
                <strong> Total Pagado:</strong> ${Number(purchase.total).toFixed(2)}
              </p>

              <p style={{ fontSize: "0.85em", color: "#64748b", marginTop: "5px" }}>
                <strong> Fecha:</strong> {new Date(purchase.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Purchases;