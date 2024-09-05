-- Creamos la base de datos
CREATE DATABASE IF NOT EXISTS ZazilApp;
USE ZazilApp;

-- Tabla Usuarios: almacena la información de todos los usuarios, independientemente de su rol.
CREATE TABLE Usuarios (
    usuario_id INT PRIMARY KEY AUTO_INCREMENT, -- Identificador único para cada usuario
    nombre VARCHAR(255) NOT NULL, -- Nombre del usuario
    email VARCHAR(255) NOT NULL UNIQUE, -- Correo electrónico único
    password_hash VARCHAR(255) NOT NULL, -- Contraseña almacenada como hash
    rol ENUM('administrador', 'usuario', 'especialista') NOT NULL, -- Rol del usuario en el sistema
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP -- Fecha de creación de la cuenta
);

-- Tabla Productos: contiene la información básica de los productos.
CREATE TABLE Productos (
    producto_id INT PRIMARY KEY AUTO_INCREMENT, -- Identificador único del producto
    nombre VARCHAR(255) NOT NULL, -- Nombre del producto
    descripcion TEXT, -- Descripción del producto
    precio_actual DECIMAL(10, 2) NOT NULL, -- Precio actual del producto
    inventario INT NOT NULL, -- Cantidad disponible en inventario
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP -- Fecha de creación del producto
);

-- Tabla HistorialPrecios: registra los cambios de precio de los productos.
CREATE TABLE HistorialPrecios (
    historial_id INT PRIMARY KEY AUTO_INCREMENT, -- Identificador único del historial de precios
    producto_id INT NOT NULL, -- Referencia al producto
    precio DECIMAL(10, 2) NOT NULL, -- Precio en el momento del cambio
    fecha_cambio DATETIME DEFAULT CURRENT_TIMESTAMP, -- Fecha en que se cambió el precio
    FOREIGN KEY (producto_id) REFERENCES Productos(producto_id) -- Llave foránea vinculando al producto
);

-- Tabla Carritos: guarda la información de los carritos de compras, incluyendo su estado.
CREATE TABLE Carritos (
    carrito_id INT PRIMARY KEY AUTO_INCREMENT, -- Identificador único del carrito
    usuario_id INT NOT NULL, -- Referencia al usuario que creó el carrito
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP, -- Fecha de creación del carrito
    estado ENUM('pendiente', 'completado', 'abandonado') DEFAULT 'pendiente', -- Estado del carrito
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(usuario_id) -- Llave foránea vinculando al usuario
);

-- Tabla CarritoProductos: vincula productos con los carritos de compras, incluyendo cantidad y precio.
CREATE TABLE CarritoProductos (
    carrito_producto_id INT PRIMARY KEY AUTO_INCREMENT, -- Identificador único de la relación carrito-producto
    carrito_id INT NOT NULL, -- Referencia al carrito
    producto_id INT NOT NULL, -- Referencia al producto
    cantidad INT NOT NULL, -- Cantidad del producto en el carrito
    precio DECIMAL(10, 2) NOT NULL, -- Precio del producto en el momento de añadirlo al carrito
    FOREIGN KEY (carrito_id) REFERENCES Carritos(carrito_id), -- Llave foránea vinculando al carrito
    FOREIGN KEY (producto_id) REFERENCES Productos(producto_id) -- Llave foránea vinculando al producto
);

-- Tabla Compras: registra cada compra realizada por los usuarios.
CREATE TABLE Compras (
    compra_id INT PRIMARY KEY AUTO_INCREMENT, -- Identificador único de la compra
    usuario_id INT NOT NULL, -- Referencia al usuario que realizó la compra
    total DECIMAL(10, 2) NOT NULL, -- Monto total de la compra
    fecha_compra DATETIME DEFAULT CURRENT_TIMESTAMP, -- Fecha en que se realizó la compra
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(usuario_id) -- Llave foránea vinculando al usuario
);

-- Tabla DetalleCompras: almacena los detalles de cada producto comprado en cada transacción.
CREATE TABLE DetalleCompras (
    detalle_id INT PRIMARY KEY AUTO_INCREMENT, -- Identificador único del detalle de compra
    compra_id INT NOT NULL, -- Referencia a la compra
    producto_id INT NOT NULL, -- Referencia al producto comprado
    cantidad INT NOT NULL, -- Cantidad del producto en la compra
    precio DECIMAL(10, 2) NOT NULL, -- Precio del producto en la transacción
    FOREIGN KEY (compra_id) REFERENCES Compras(compra_id), -- Llave foránea vinculando a la compra
    FOREIGN KEY (producto_id) REFERENCES Productos(producto_id) -- Llave foránea vinculando al producto
);

-- Tabla Preguntas: guarda las preguntas hechas por los usuarios en el foro.
CREATE TABLE Preguntas (
    pregunta_id INT PRIMARY KEY AUTO_INCREMENT, -- Identificador único de la pregunta
    usuario_id INT NOT NULL, -- Referencia al usuario que hizo la pregunta
    titulo VARCHAR(255) NOT NULL, -- Título de la pregunta
    contenido TEXT NOT NULL, -- Contenido o detalle de la pregunta
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP, -- Fecha de creación de la pregunta
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(usuario_id) -- Llave foránea vinculando al usuario
);

-- Tabla Respuestas: contiene las respuestas a las preguntas en el foro.
CREATE TABLE Respuestas (
    respuesta_id INT PRIMARY KEY AUTO_INCREMENT, -- Identificador único de la respuesta
    pregunta_id INT NOT NULL, -- Referencia a la pregunta correspondiente
    usuario_id INT NOT NULL, -- Referencia al usuario que respondió (puede ser administrador o especialista)
    contenido TEXT NOT NULL, -- Contenido de la respuesta
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP, -- Fecha de creación de la respuesta
    FOREIGN KEY (pregunta_id) REFERENCES Preguntas(pregunta_id), -- Llave foránea vinculando a la pregunta
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(usuario_id) -- Llave foránea vinculando al usuario
);

-- Vista para Ventas por Mes: agrega las ventas por mes, útil para reportes y análisis.
CREATE VIEW VentasPorMes AS
SELECT 
    MONTH(fecha_compra) AS mes, -- Mes de la compra
    SUM(total) AS total_ventas -- Suma de las ventas en ese mes
FROM 
    Compras
GROUP BY 
    mes; -- Agrupación por mes
