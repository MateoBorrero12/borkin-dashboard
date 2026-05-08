function StatsCards({ products }) {
const lowStockCount = products.filter((product) => product.stock <= 5).length;

const totalValue = products.reduce(
    (total, product) => total + Number(product.price) * Number(product.stock),
    0
);

return (
    <section className="stats">
        <div className="stat-card">
            <span>Total productos</span>
            <strong>{products.length}</strong>
        </div>

        <div className={`stat-card ${lowStockCount > 0 ? "warning-card" : ""}`}>
            <span>Stock bajo</span>
            <strong>{lowStockCount}</strong>
        </div>

        <div className="stat-card">
            <span>Valor del inventario</span>
            <strong>${totalValue.toLocaleString("es-AR")}</strong>
        </div>
    </section>
);
}

export default StatsCards;