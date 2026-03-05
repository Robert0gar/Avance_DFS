import { useEffect, useState } from "react";
import api from "../api/axios";

function AdminPanel() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({ name: "", price: "", stock: "" });
  const [editingId, setEditingId] = useState(null); // Estado para saber qué ID editamos
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/products");
      const data = res.data.items || res.data;
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error cargando productos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProducts(); }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 1. Función para cargar datos en el formulario
  const startEdit = (product) => {
    setEditingId(product.id);
    setFormData({ name: product.name, price: product.price, stock: product.stock });
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Sube al formulario
  };

  // 2. Función para limpiar edición
  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ name: "", price: "", stock: "" });
  };

  // 3. Submit dinámico (Crear o Actualizar)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Modo Edición: usa PUT
        await api.put(`/products/${editingId}`, formData);
        setMessage("✅ Producto actualizado con éxito");
      } else {
        // Modo Creación: usa POST
        await api.post("/products", formData);
        setMessage("✅ Producto agregado con éxito");
      }
      cancelEdit();
      loadProducts();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("❌ Error al procesar la solicitud");
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este producto?")) return;
    try {
      await api.delete(`/products/${id}`);
      loadProducts();
    } catch (err) {
      alert("No se pudo eliminar el producto.");
    }
  };

  if (loading) return <div style={{ textAlign: "center", padding: "50px" }}>Cargando...</div>;

  return (
    <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1>⚙️ Panel de Administración</h1>
      
      {/* Formulario que cambia según el modo */}
      <section style={{ background: "white", padding: "25px", borderRadius: "12px", marginBottom: "40px", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}>
        <h3 style={{ marginTop: 0 }}>{editingId ? "📝 Editar Producto" : "➕ Agregar Nuevo Producto"}</h3>
        {message && <p style={{ fontWeight: "bold", color: message.includes("✅") ? "green" : "red" }}>{message}</p>}
        
        <form onSubmit={handleSubmit} style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
          <input type="text" name="name" placeholder="Nombre" value={formData.name} onChange={handleChange} required style={{ padding: "12px", flex: "2", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
          <input type="number" name="price" placeholder="Precio" value={formData.price} onChange={handleChange} required style={{ padding: "12px", width: "120px", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
          <input type="number" name="stock" placeholder="Stock" value={formData.stock} onChange={handleChange} required style={{ padding: "12px", width: "100px", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
          
          <button type="submit" style={{ backgroundColor: editingId ? "#3498db" : "#e67e22", color: "white", padding: "12px 25px", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>
            {editingId ? "ACTUALIZAR" : "GUARDAR"}
          </button>
          
          {editingId && (
            <button type="button" onClick={cancelEdit} style={{ backgroundColor: "#94a3b8", color: "white", padding: "12px 25px", border: "none", borderRadius: "6px", cursor: "pointer" }}>
              CANCELAR
            </button>
          )}
        </form>
      </section>

      {/* Tabla con botón de Editar */}
      <div style={{ background: "white", borderRadius: "12px", overflow: "hidden", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ backgroundColor: "#1e293b", color: "white" }}>
              <th style={{ padding: "15px" }}>ID</th>
              <th style={{ padding: "15px" }}>Nombre</th>
              <th style={{ padding: "15px" }}>Precio</th>
              <th style={{ padding: "15px" }}>Stock</th>
              <th style={{ padding: "15px", textAlign: "center" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                <td style={{ padding: "15px" }}>#{p.id}</td>
                <td style={{ padding: "15px", fontWeight: "bold" }}>{p.name}</td>
                <td style={{ padding: "15px" }}>${Number(p.price).toFixed(2)}</td>
                <td style={{ padding: "15px" }}>{p.stock} un.</td>
                <td style={{ padding: "15px", textAlign: "center", display: "flex", gap: "10px", justifyContent: "center" }}>
                  <button onClick={() => startEdit(p)} style={{ backgroundColor: "#3498db", color: "white", border: "none", padding: "8px 15px", borderRadius: "6px", cursor: "pointer" }}>
                    Editar
                  </button>
                  <button onClick={() => deleteProduct(p.id)} style={{ backgroundColor: "#ef4444", color: "white", border: "none", padding: "8px 15px", borderRadius: "6px", cursor: "pointer" }}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminPanel;