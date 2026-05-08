function Sidebar() {
return (
    <aside className="sidebar">
    <h2 className="brand">Borkin</h2>

    <nav className="sidebar-menu">
        <a href="#" className="active">
            Dashboard
        </a>

        <a href="#productos">
            Productos
        </a>
    </nav>
    </aside>
);
}

export default Sidebar;