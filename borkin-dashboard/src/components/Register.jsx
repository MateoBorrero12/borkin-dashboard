import { useState } from "react";

function Register({ onShowLogin }) {
const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
});

const [message, setMessage] = useState("");
const [success, setSuccess] = useState(false);

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
    }
};

return (
    <div className="login-page">
    <form className="login-card" onSubmit={handleSubmit}>
        <h1>Borkin</h1>
        <p>Creá una cuenta para administrar productos.</p>

        <input
            type="text"
            name="name"
            placeholder="Nombre"
            value={form.name}
            onChange={handleChange}
        />

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
            Crear cuenta
        </button>

        {message && (
        <span className={success ? "auth-message success" : "auth-message error"}>
            {message}
        </span>
        )}

        <button type="button" className="auth-link-btn" onClick={onShowLogin}>
            Ya tengo cuenta
        </button>
    </form>
    </div>
);
}

export default Register;