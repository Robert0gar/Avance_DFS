import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "1rem 2rem",
      backgroundColor: "#1e293b",
      color: "white"
    }}>
      <div>
        <Link to="/" style={{ color: "white", textDecoration: "none", fontSize: "1.5rem", fontWeight: "bold" }}>
          🍞 Panadería EL PALOMO
        </Link>
      </div>

      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        {user ? (
          <>
            <Link to="/products" style={{ color: "white", textDecoration: "none" }}>Productos</Link>
            <Link to="/purchases" style={{ color: "white", textDecoration: "none" }}>Mis Compras</Link>
            
            {user.role === "admin" && (
              <Link to="/admin" style={{ color: "#fbbf24", textDecoration: "none", fontWeight: "bold" }}>
                Panel Admin
              </Link>
            )}

            <span style={{ fontSize: "0.9rem", color: "#cbd5e1", marginLeft: "10px" }}>
              {user.email}
            </span>

            <button 
              onClick={handleLogout}
              style={{
                backgroundColor: "#ef4444",
                color: "white",
                border: "none",
                padding: "5px 15px",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Salir
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: "white", textDecoration: "none" }}>Login</Link>
            <Link to="/register" style={{ color: "white", textDecoration: "none" }}>Registro</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;