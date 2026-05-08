function ProductTable({
    products,
    search,
    user,
    onSearchChange,
    onEditProduct,
    onDeleteProduct,
}) {
const filteredProducts = products.filter((product) => {
    const searchText = search.toLowerCase();

    return (
        product.name.toLowerCase().includes(searchText) ||
        product.category.toLowerCase().includes(searchText)
    );
});

return (
    <section className="product-table-section" id="productos">
        <div className="panel-header">
            <div>
                <h2>Productos</h2>
                <p>Agregá, editá, revisá y eliminá productos del inventario.</p>
            </div>

        <input
            type="text"
            placeholder="Buscar producto..."
            value={search}
            onChange={onSearchChange}
        />
        </div>

        <div className="table-wrapper">
        <table>
            <thead>
            <tr>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Stock</th>
                <th>Precio</th>
                <th>Estado</th>
                {user?.role === "admin" && <th>Acción</th>}
            </tr>
            </thead>

            <tbody>
            {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                <tr key={product.id}>
                    <td className="product-name">{product.name}</td>
                    <td>{product.category}</td>
                    <td>{product.stock}</td>
                    <td>${Number(product.price).toLocaleString("es-AR")}</td>
                    <td>
                    {product.stock <= 5 ? (
                        <span className="badge danger">Stock bajo</span>
                    ) : (
                        <span className="badge success">Disponible</span>
                    )}
                    </td>
                    {user?.role === "admin" && (
                        <td className="actions-cell">
                            <button
                                className="edit-btn"
                                onClick={() => onEditProduct(product)}
                            >
                                Editar
                            </button>

                            <button
                                className="delete-btn"
                                onClick={() => onDeleteProduct(product.id)}
                            >
                                Eliminar
                            </button>
                        </td>
                    )}
                </tr>
            ))
            ) : (
                <tr>
                <td colSpan={user?.role === "admin" ? 6 : 5} className="empty-table">
                    No se encontraron productos.
                </td>
                </tr>
            )}
                </tbody>
            </table>
        </div>
    </section>
);
}

export default ProductTable;