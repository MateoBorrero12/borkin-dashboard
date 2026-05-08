const pool = require("../db/connection");

// LISTAR PRODUCTOS
const getProducts = async (req, res) => {
try {
    const result = await pool.query("SELECT * FROM products ORDER BY id ASC");
    res.json(result.rows);
} catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({
        message: "Error al obtener productos",
    });
}
};

// CREAR PRODUCTO
const createProduct = async (req, res) => {
try {
    const { name, category, stock, price } = req.body;

    if (!name || !category || stock === undefined || price === undefined) {
    return res.status(400).json({
        message: "Todos los campos son obligatorios",
    });
    }

    if (Number(stock) < 0 || Number(price) <= 0) {
    return res.status(400).json({
        message: "El stock no puede ser negativo y el precio debe ser mayor a 0",
    });
    }

    const result = await pool.query(
    `INSERT INTO products (name, category, stock, price)
    VALUES ($1, $2, $3, $4)
       RETURNING *`,
    [name, category, Number(stock), Number(price)]
    );

    res.status(201).json(result.rows[0]);
} catch (error) {
    console.error("Error al crear producto:", error);
    res.status(500).json({
        message: "Error al crear producto",
    });
}
};

// EDITAR PRODUCTO
const updateProduct = async (req, res) => {
try {
    const { id } = req.params;
    const { name, category, stock, price } = req.body;

    if (!name || !category || stock === undefined || price === undefined) {
    return res.status(400).json({
        message: "Todos los campos son obligatorios",
    });
    }

    if (Number(stock) < 0 || Number(price) <= 0) {
    return res.status(400).json({
        message: "El stock no puede ser negativo y el precio debe ser mayor a 0",
    });
    }

    const result = await pool.query(
    `UPDATE products
    SET name = $1,
        category = $2,
        stock = $3,
        price = $4
    WHERE id = $5
       RETURNING *`,
    [name, category, Number(stock), Number(price), id]
    );

    if (result.rowCount === 0) {
    return res.status(404).json({
        message: "Producto no encontrado",
    });
    }

    res.json(result.rows[0]);
} catch (error) {
    console.error("Error al editar producto:", error);
    res.status(500).json({
        message: "Error al editar producto",
    });
}
};

// ELIMINAR PRODUCTO
const deleteProduct = async (req, res) => {
try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM products WHERE id = $1 RETURNING *",
    [id]
    );

    if (result.rowCount === 0) {
    return res.status(404).json({
        message: "Producto no encontrado",
    });
    }

    res.json({
        message: "Producto eliminado correctamente",
        product: result.rows[0],
    });
} catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({
        message: "Error al eliminar producto",
    });
}
};

module.exports = {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
};