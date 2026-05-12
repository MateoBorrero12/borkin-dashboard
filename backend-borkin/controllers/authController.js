const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db/connection");

// REGISTRAR USUARIO
const register = async (req, res) => {
try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
    return res.status(400).json({
        message: "Todos los campos son obligatorios",
    });
    }

    if (password.length < 6) {
    return res.status(400).json({
        message: "La contraseña debe tener al menos 6 caracteres",
    });
    }

    const userExists = await pool.query(
      "SELECT * FROM users WHERE email = $1",
    [email]
    );

    if (userExists.rows.length > 0) {
    return res.status(400).json({
        message: "El email ya está registrado",
    });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
        `INSERT INTO users (name, email, password, role)
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, email, role`,
    [name, email, hashedPassword, "viewer"]
);

    res.status(201).json({
        message: "Usuario registrado correctamente",
        user: result.rows[0],
    });
} catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(500).json({
        message: "Error al registrar usuario",
    });
}
};

// LOGIN
const login = async (req, res) => {
try {
    const { email, password } = req.body;

    if (!email || !password) {
    return res.status(400).json({
        message: "Email y contraseña son obligatorios",
    });
    }

    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
    [email]
    );

    if (result.rows.length === 0) {
    return res.status(401).json({
        message: "Credenciales incorrectas",
    });
    }

    const user = result.rows[0];

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
    return res.status(401).json({
        message: "Credenciales incorrectas",
    });
    }

    const token = jwt.sign(
    {
        id: user.id,
        email: user.email,
        role: user.role,
    },
        process.env.JWT_SECRET,
    {
        expiresIn: "2h",
    }
    );

    res.json({
        message: "Login correcto",
        token,
        user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    },
    });
} catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).json({
        message: "Error al iniciar sesión",
    });
}
};

module.exports = {
    register,
    login,
};