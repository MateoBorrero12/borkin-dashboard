# Borkin Dashboard

Borkin Dashboard es un sistema web para la gestión de productos e inventario.

El proyecto permite administrar productos desde un panel privado con autenticación, roles de usuario y conexión a una base de datos PostgreSQL.

Fue desarrollado como proyecto de portfolio para practicar y demostrar conocimientos de frontend, backend, base de datos, autenticación, rutas protegidas y arquitectura separada entre cliente y servidor.

---

## Funcionalidades principales

- Registro de usuarios
- Inicio de sesión
- Autenticación con JWT
- Contraseñas encriptadas con bcrypt
- Roles de usuario:
  - Admin: puede agregar, editar y eliminar productos
  - Viewer: solo puede visualizar productos
- Listado de productos
- Búsqueda de productos por nombre o categoría
- Creación de productos
- Edición de productos
- Eliminación de productos
- Confirmación antes de eliminar
- Indicador visual de stock bajo
- Cálculo del valor total del inventario
- Feedback visual para acciones del usuario
- Interfaz responsive básica
- Frontend separado en componentes
- Backend separado en rutas, controladores y middlewares

---

## Tecnologías utilizadas

### Frontend

- React
- Vite
- JavaScript
- CSS

### Backend

- Node.js
- Express
- PostgreSQL
- pg
- bcrypt
- jsonwebtoken
- dotenv
- cors

### Herramientas

- VS Code
- pgAdmin
- Thunder Client
- Git
- GitHub

---

## Estructura del proyecto

```txt
borkin-project/
├── borkin-dashboard/
├── backend-borkin/
└── README.md 
```

## Frontend 

```txt
borkin-dashboard/
├── src/
│   ├── components/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── ProductForm.jsx
│   │   ├── ProductTable.jsx
│   │   ├── Sidebar.jsx
│   │   ├── StatsCards.jsx
│   │   └── Topbar.jsx
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── package.json
└── vite.config.js
```

## Backend

```txt
backend-borkin/
├── controllers/
│   ├── authController.js
│   └── productController.js
├── db/
│   └── connection.js
├── middleware/
│   ├── authMiddleware.js
│   └── roleMiddleware.js
├── routes/
│   ├── authRoutes.js
│   └── productRoutes.js
├── .env
├── package.json
└── server.js
```

---

## Instalación y ejecución

### 1. Clonar el repositorio

```txt
git clone URL_DEL_REPOSITORIO
```

Entrar a la carpeta principal del proyecto:

```txt
cd borkin-project
```

---

### 2. Configuración del backend

Entrar a la carpeta del backend:

```txt
cd backend-borkin
```

Instalar dependencias:

```txt
npm install
```

Crear un archivo .env en la raíz de backend-borkin:

```txt
DB_HOST=localhost
DB_PORT=5432
DB_NAME=borkin_db
DB_USER=postgres
DB_PASSWORD=TU_CONTRASEÑA
PORT=4000
JWT_SECRET=tu_clave_secreta
```

Ejecutar el backend:

```txt
npm run dev
```

El servidor debería iniciar en:

```txt
http://localhost:4000
```

---

### 3. Configuración de la base de datos

Crear una base de datos en PostgreSQL llamada:

```txt
borkin_db
```

Luego ejecutar el siguiente SQL dentro de esa base de datos:

```txt
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(100) NOT NULL,
  stock INTEGER NOT NULL,
  price NUMERIC(12, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

```txt
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Datos iniciales opcionales para productos:

```txt
INSERT INTO products (name, category, stock, price)
VALUES
('Notebook Lenovo', 'Tecnología', 8, 850000),
('Mouse Logitech', 'Accesorios', 20, 25000),
('Teclado Redragon', 'Accesorios', 4, 55000);
```

Para verificar que los productos se cargaron correctamente:

```txt
SELECT * FROM products;
```

---

### 4. Configuración del frontend

Entrar a la carpeta del frontend:

```txt
cd borkin-dashboard
```

Instalar dependencias:

```txt
npm install
```

Ejecutar el frontend:

```txt
npm run dev
```

La aplicación debería iniciar en:

```txt
http://localhost:5173
```

---

### Endpoints principales

#### Autenticación

#### Registrar usuario

```txt
POST /api/auth/register
```

Body:

```txt
{
  "name": "Mateo",
  "email": "mateo@test.com",
  "password": "123456"
}
```

Respuesta esperada:

```txt
{
  "message": "Usuario registrado correctamente",
  "user": {
    "id": 1,
    "name": "Mateo",
    "email": "mateo@test.com",
    "role": "admin"
  }
}
```

---

#### Iniciar sesión

```txt
POST /api/auth/login
```

Body:

```txt
{
  "email": "mateo@test.com",
  "password": "123456"
}
```

Respuesta esperada:

```txt
{
  "message": "Login correcto",
  "token": "TOKEN_JWT",
  "user": {
    "id": 1,
    "name": "Mateo",
    "email": "mateo@test.com",
    "role": "admin"
  }
}
```

---

#### Productos

##### Listar productos

```txt
GET /api/products
```

Esta ruta es pública y permite visualizar los productos.

---

##### Crear producto

Ruta protegida. Requiere token JWT y rol admin.

```txt
POST /api/products
```

Headers:

```txt
Authorization: Bearer TOKEN_JWT
```

Body:

```txt
{
  "name": "Monitor Samsung",
  "category": "Tecnología",
  "stock": 7,
  "price": 180000
}
```

---

##### Editar producto

Ruta protegida. Requiere token JWT y rol admin.

```txt
PUT /api/products/:id
```

Headers:

```txt
Authorization: Bearer TOKEN_JWT
```

Body:

```txt
{
  "name": "Monitor Samsung 24",
  "category": "Tecnología",
  "stock": 10,
  "price": 200000
}
```

---

##### Eliminar producto

Ruta protegida. Requiere token JWT y rol admin.

```txt
DELETE /api/products/:id
```

Headers:

```txt
Authorization: Bearer TOKEN_JWT
```

---

##### Roles del sistema

Admin

El usuario con rol admin puede:

- Ver productos
- Crear productos
- Editar productos
- Eliminar productos
- Viewer

El usuario con rol viewer puede:

- Ver productos

El usuario viewer no puede:

- Crear productos
- Editar productos
- Eliminar productos

Aunque un usuario sin permisos intente acceder manualmente a las rutas protegidas, el backend valida su rol antes de permitir la acción.

---

### Seguridad implementada

El sistema utiliza bcrypt para encriptar contraseñas antes de guardarlas en la base de datos.

Esto significa que las contraseñas no se almacenan en texto plano.

También utiliza JWT para autenticar usuarios. Al iniciar sesión, el backend genera un token que el frontend guarda y envía en las peticiones protegidas mediante el header:

```txt
Authorization: Bearer TOKEN_JWT
```

Además, el backend tiene middlewares para:

- Verificar si el token es válido
- Identificar al usuario autenticado
- Controlar permisos según el rol del usuario

---

### Flujo general del sistema

```txt
Usuario inicia sesión
        ↓
Backend valida email y contraseña
        ↓
Backend genera token JWT
        ↓
Frontend guarda token en localStorage
        ↓
Usuario puede usar el dashboard
        ↓
Frontend envía token en acciones protegidas
        ↓
Backend valida token y rol
        ↓
PostgreSQL guarda, edita o elimina productos
```

---

### Estado actual del proyecto

Funcionalidades implementadas:

- CRUD completo de productos
- Conexión con PostgreSQL
- Registro de usuarios
- Login de usuarios
- Encriptación de contraseñas con bcrypt
- Autenticación con JWT
- Protección de rutas
- Control de roles
- Interfaz condicional según rol
- Búsqueda de productos
- Indicador de stock bajo
- Cálculo de valor total del inventario
- Organización del frontend en componentes
- Organización del backend en rutas, controladores y middlewares

---

Posibles mejoras futuras:

- Agregar módulo de ventas
- Agregar módulo de clientes
- Descontar stock automáticamente al registrar una venta
- Agregar historial de movimientos de stock
- Agregar paginación de productos
- Agregar filtros avanzados por categoría o stock
- Agregar gráficos al dashboard
- Mejorar diseño responsive
- Agregar recuperación de contraseña
- Agregar edición de usuarios y roles desde el panel

---

## Autor

Desarrollado por Mateo Borrero Kinen como proyecto para portfolio personal.