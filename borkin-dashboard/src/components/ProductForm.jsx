function ProductForm({
    form,
    editingId,
    onChange,
    onSubmit,
    onCancelEdit,
}) {
return (
    <form className="product-form" onSubmit={onSubmit}>
    <input
        type="text"
        name="name"
        placeholder="Nombre del producto"
        value={form.name}
        onChange={onChange}
    />

    <input
        type="text"
        name="category"
        placeholder="Categoría"
        value={form.category}
        onChange={onChange}
    />

    <input
        type="number"
        name="stock"
        placeholder="Stock"
        value={form.stock}
        onChange={onChange}
    />

    <input
        type="number"
        name="price"
        placeholder="Precio"
        value={form.price}
        onChange={onChange}
    />

    <button className="primary-btn" type="submit">
        {editingId ? "Guardar cambios" : "Agregar"}
    </button>

    {editingId && (
        <button type="button" className="secondary-btn" onClick={onCancelEdit}>
            Cancelar
        </button>
    )}
    </form>
);
}

export default ProductForm;