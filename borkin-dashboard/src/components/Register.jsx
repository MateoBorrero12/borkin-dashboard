import { useState } from "react";

function Register({ onShowLogin }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
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

    if (!form.name || !form.email || !form.password) {
      setMessage("Completá todos los campos.");
      setSuccess(false);
      return;
    }

    if (form.password.length < 6) {
      setMessage("La contraseña debe tener al menos 6 caracteres.");
      setSuccess(false);
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Error al registrar usuario.");
        setSuccess(false);
        return;
      }

      setMessage("Usuario registrado correctamente. Ya podés iniciar sesión.");
      setSuccess(true);

      setForm({
        name: "",
        email: "",
        password: "",
      });
    } catch (error) {
      setMessage("Error de conexión con el servidor.");
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="public-auth-page">
      <section className="public-auth-layout">
        <div className="public-auth-info">
          <span className="public-auth-kicker">Nueva cuenta</span>

          <h1>Borkin Dashboard</h1>

          <p>
            Creá una cuenta para acceder al sistema y comenzar a gestionar
            productos, stock y datos del inventario.
          </p>

          <div className="public-auth-features">
            <span>Inventario</span>
            <span>Productos</span>
            <span>Rutas protegidas</span>
          </div>

          <div className="public-auth-preview">
            <div className="preview-header">
              <span></span>
              <p>Panel de gestión</p>
            </div>

            <div className="preview-row">
              <div>
                <strong>Productos</strong>
                <small>Alta, edición y eliminación</small>
              </div>
              <b>Admin</b>
            </div>

            <div className="preview-row">
              <div>
                <strong>Consulta</strong>
                <small>Visualización del inventario</small>
              </div>
              <b>Viewer</b>
            </div>

            <div className="preview-row">
              <div>
                <strong>Seguridad</strong>
                <small>Acceso mediante JWT</small>
              </div>
              <b>Token</b>
            </div>
          </div>
        </div>

        <form className="public-auth-card" onSubmit={handleSubmit}>
          <div className="public-auth-card-header">
            <span className="public-auth-kicker">Registro</span>
            <h2>Crear cuenta</h2>
            <p>Registrate para acceder al sistema de inventario.</p>
          </div>

          <div className="public-auth-form">
            <div className="public-auth-field">
              <label>Nombre</label>
              <input
                type="text"
                name="name"
                placeholder="Mateo Borrero"
                value={form.name}
                onChange={handleChange}
              />
            </div>

            <div className="public-auth-field">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="usuario@email.com"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="public-auth-field">
              <label>Contraseña</label>
              <input
                type="password"
                name="password"
                placeholder="Mínimo 6 caracteres"
                value={form.password}
                onChange={handleChange}
              />
            </div>

            {message && (
              <span className={success ? "public-auth-message success" : "public-auth-message error"}>
                {message}
              </span>
            )}

            <button className="public-auth-submit" type="submit" disabled={loading}>
              {loading ? "Creando cuenta..." : "Crear cuenta"}
            </button>
          </div>

          <p className="public-auth-switch">
            ¿Ya tenés cuenta?{" "}
            <button type="button" onClick={onShowLogin}>
              Iniciar sesión
            </button>
          </p>
        </form>
      </section>
    </main>
  );
}

export default Register;