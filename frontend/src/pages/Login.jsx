import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      const { token, role } = res.data;

      localStorage.setItem("token", token);
      login({ email, role });

      alert("¡Bienvenido!");
      navigate("/products");
    } catch (err) {
      alert("Error: Credenciales incorrectas");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "100px auto", padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}>
      <h2 style={{ textAlign: "center" }}>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        {/* Eliminamos 'fullWidth' para quitar el error de consola */}
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          style={{ display: "block", width: "100%", marginBottom: "15px", padding: "10px", boxSizing: "border-box" }} 
        />
        <input 
          type="password" 
          placeholder="Contraseña" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          style={{ display: "block", width: "100%", marginBottom: "20px", padding: "10px", boxSizing: "border-box" }} 
        />
        <button type="submit" style={{ width: "100%", padding: "12px", background: "#1e293b", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
          Entrar
        </button>
      </form>
    </div>
  );
}

export default Login;