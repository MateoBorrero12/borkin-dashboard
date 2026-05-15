import { useState } from "react";

function Login({ onLogin, onShowRegister }) {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setMessage("Completá email y contraseña.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Error al iniciar sesión.");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      onLogin(data.user);
      setMessage("");
    } catch (error) {
      setMessage("Error de conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="public-auth-page">
      <section className="public-auth-layout">
        <div className="public-auth-info">
          <span className="public-auth-kicker">Sistema de inventario</span>

          <h1>Borkin Dashboard</h1>

          <p>
            Gestioná productos, controlá stock y consultá información clave del
            inventario desde un panel simple, seguro y organizado.
          </p>

          <div className="public-auth-features">
            <span>Control de stock</span>
            <span>Roles de usuario</span>
            <span>Dashboard online</span>
          </div>

          <div className="public-auth-preview">
            <div className="preview-header">
              <span></span>
              <p>Resumen del sistema</p>
            </div>

            <div className="preview-row">
              <div>
                <strong>Productos</strong>
                <small>Gestión centralizada</small>
              </div>
              <b>CRUD</b>
            </div>

            <div className="preview-row">
              <div>
                <strong>Stock bajo</strong>
                <small>Alertas visibles</small>
              </div>
              <b>Activo</b>
            </div>

            <div className="preview-row">
              <div>
                <strong>Acceso seguro</strong>
                <small>Autenticación con token</small>
              </div>
              <b>JWT</b>
            </div>
          </div>
        </div>

        <form className="public-auth-card" onSubmit={handleSubmit}>
          <div className="public-auth-card-header">
            <span className="public-auth-kicker">Acceso</span>
            <h2>Iniciar sesión</h2>
            <p>Ingresá con tu cuenta para administrar el inventario.</p>
          </div>

          <div className="public-demo-users">
            <strong>Usuarios demo</strong>
            <span>Admin: admin@borkin.com / 123456</span>
            <span>Viewer: viewer@borkin.com / 123456</span>
          </div>

          <div className="public-auth-form">
            <div className="public-auth-field">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="admin@borkin.com"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="public-auth-field">
              <label>Contraseña</label>
              <input
                type="password"
                name="password"
                placeholder="Ingresá tu contraseña"
                value={form.password}
                onChange={handleChange}
              />
            </div>

            {message && <span className="public-auth-message error">{message}</span>}

            <button className="public-auth-submit" type="submit" disabled={loading}>
              {loading ? "Ingresando..." : "Iniciar sesión"}
            </button>
          </div>

          <p className="public-auth-switch">
            ¿No tenés cuenta?{" "}
            <button type="button" onClick={onShowRegister}>
              Crear una cuenta
            </button>
          </p>
        </form>
      </section>
    </main>
  );
}

export default Login;