import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import Purchases from "./pages/Purchases";
import AdminPanel from "./pages/AdminPanel";

function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Cargando Auth...</div>;

  return (
    <Router>
      <Navbar />
      {/* Ajuste: quitamos restricciones de ancho y aseguramos que ocupe todo el viewport */}
      <div style={{ 
        paddingTop: "100px", 
        minHeight: "100vh", 
        width: "100%", // Ocupa el 100% del ancho disponible
        background: "#f8fafc",
        margin: 0,
        boxSizing: "border-box"
      }}>
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/products" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/products" />} />
          
          <Route path="/products" element={<Products />} />
          <Route path="/purchases" element={<Purchases />} />
          <Route path="/admin" element={<AdminPanel />} />
          
          <Route path="/" element={<Navigate to="/products" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;