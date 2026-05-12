import { useState } from "react";

function Login({ onLogin, onShowRegister }) {
const [form, setForm] = useState({
    email: "",
    password: "",
});

const [message, setMessage] = useState("");

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
    }
};

return (
    <div className="login-page">
    <form className="login-card" onSubmit={handleSubmit}>
        <h1>Borkin</h1>
        <p>Ingresá para administrar productos.</p>

        <div className="demo-users">
            <strong>Usuarios demo</strong>
            <span>Admin: admin@borkin.com / 123456</span>
            <span>Viewer: viewer@borkin.com / 123456</span>
        </div>

        <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
        />

        <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
        />

        <button className="primary-btn" type="submit">
            Iniciar sesión
        </button>

        {message && <span className="auth-message error">{message}</span>}

        <button type="button" className="auth-link-btn" onClick={onShowRegister}>
            Crear una cuenta
        </button>
    </form>
    </div>
);
}

export default Login;