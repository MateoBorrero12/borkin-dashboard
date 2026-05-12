import { useEffect, useState } from "react";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import StatsCards from "./components/StatsCards";
import ProductForm from "./components/ProductForm";
import ProductTable from "./components/ProductTable";
import Login from "./components/Login";
import Register from "./components/Register";

function App() {

  const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  setUser(null);
};

  const [user, setUser] = useState(() => {
  const savedUser = localStorage.getItem("user");
  return savedUser ? JSON.parse(savedUser) : null;
});

  const [products, setProducts] = useState([]);
  const [authMode, setAuthMode] = useState("login");

  const [form, setForm] = useState({
    name: "",
    category: "",
    stock: "",
    price: "",
  });

  const [feedback, setFeedback] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
      const data = await res.json();

      setProducts(data);
    } catch (error) {
      setFeedback("Error al cargar productos desde el servidor.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const resetForm = () => {
    setForm({
      name: "",
      category: "",
      stock: "",
      price: "",
    });
  };

  const handleNewProduct = () => {
    setEditingId(null);
    resetForm();
    setFeedback("Listo para agregar un nuevo producto.");
  };

  const saveProduct = async (e) => {
    e.preventDefault();

    if (!form.name || !form.category || !form.stock || !form.price) {
      setFeedback("Completá todos los campos antes de guardar.");
      return;
    }

    if (Number(form.stock) < 0 || Number(form.price) <= 0) {
      setFeedback("El stock no puede ser negativo y el precio debe ser mayor a 0.");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      if (editingId) {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        });

        const updatedProduct = await res.json();

        if (!res.ok) {
          setFeedback(updatedProduct.message || "Error al editar producto.");
          return;
        }

        setProducts(
          products.map((product) =>
            product.id === editingId ? updatedProduct : product
          )
        );

        setFeedback("Producto editado correctamente.");
        setEditingId(null);
      } else {
        const res = await fetch("http://localhost:4000/api/products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        });

        const newProduct = await res.json();

        if (!res.ok) {
          setFeedback(newProduct.message || "Error al agregar producto.");
          return;
        }

        setProducts([...products, newProduct]);
        setFeedback("Producto agregado correctamente.");
      }

      resetForm();
    } catch (error) {
      setFeedback("Error de conexión con el servidor.");
    }
  };

  const startEditProduct = (product) => {
    setEditingId(product.id);

    setForm({
      name: product.name,
      category: product.category,
      stock: String(product.stock),
      price: String(product.price),
    });

    setFeedback(`Editando producto: ${product.name}`);
  };

  const cancelEdit = () => {
    setEditingId(null);
    resetForm();
    setFeedback("Edición cancelada.");
  };

  const deleteProduct = async (id) => {
    const confirmDelete = confirm("¿Seguro que querés eliminar este producto?");

    if (!confirmDelete) {
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      const data = await res.json();

      if (!res.ok) {
        setFeedback(data.message || "Error al eliminar producto.");
        return;
      }

      setProducts(products.filter((product) => product.id !== id));
      setFeedback("Producto eliminado correctamente.");
    } catch (error) {
      setFeedback("Error de conexión al eliminar producto.");
    }
  };

  if (!user) {
  if (authMode === "register") {
    return <Register onShowLogin={() => setAuthMode("login")} />;
  }

  return (
    <Login
      onLogin={setUser}
      onShowRegister={() => setAuthMode("register")}
    />
  );
}
  
  return (
    <div className="dashboard">
      <Sidebar />

      <main className="main">
        <Topbar
            onNewProduct={handleNewProduct}
            user={user}
            onLogout={logout}
        />
        <StatsCards products={products} />

        <section className="panel">
          {user?.role === "admin" && (
        <ProductForm
            form={form}
            editingId={editingId}
            onChange={handleChange}
            onSubmit={saveProduct}
            onCancelEdit={cancelEdit}
        />
)}

          {feedback && <p className="feedback">{feedback}</p>}

        <ProductTable
            products={products}
            search={search}
            user={user}
            onSearchChange={(e) => setSearch(e.target.value)}
            onEditProduct={startEditProduct}
            onDeleteProduct={deleteProduct}
        />
        </section>
      </main>
    </div>
  );
}

export default App;