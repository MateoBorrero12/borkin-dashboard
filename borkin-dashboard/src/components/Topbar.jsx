function Topbar({ onNewProduct, user, onLogout }) {
return (
    <header className="topbar">
    <div>
        <h1>Borkin Dashboard</h1>
        <p>Panel administrativo para gestionar productos.</p>
    </div>

        <div className="topbar-actions">
        <div className="user-box">
            <strong>{user?.name}</strong>
            <span>{user?.role}</span>
        </div>

        {user?.role === "admin" && (
        <button className="primary-btn" onClick={onNewProduct}>
            Nuevo producto
        </button>
        )}

        <button className="secondary-btn" onClick={onLogout}>
            Salir
        </button>
    </div>
    </header>
);
}

export default Topbar;