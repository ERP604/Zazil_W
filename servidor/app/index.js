import express from "express";
import path from "path";
import fs from "fs";
import https from "https";
import { fileURLToPath } from "url";
import cors from "cors"; // Importamos cors
import { methods as authentication } from "../services/metodos_usuario.js";
import { methods as products } from "../services/metodos_productos.js";
import { methods as preguntas } from "../services/metodos_preguntas.js";
import { methods as banners } from "../services/metodos_banners.js";
import { methods as carrito } from "../services/metodos_carrito.js";

// FIX para obtener __dirname con ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Servidor
const app = express();
// Configura el puerto
app.set("port", 4000);

// Inicia el servidor en la IP específica y el puerto
app.listen(app.get("port"), "0.0.0.0", () => {
  console.log("Server running on IP 0.0.0.0, port", app.get("port"));
});

// Configura el transporte de Nodemailer

app.use(cors());

app.use(express.json({ limit: "10mb" })); // Middleware para analizar JSON en las solicitudes
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Configuración para servir archivos estáticos desde el directorio de compilación (dist)
app.use(express.static(path.join(__dirname, "../../TodasBrillamos/dist")));

// Middleware para servir archivos comprimidos en Brotli (.br)
app.get("*.br", (req, res, next) => {
  res.set("Content-Encoding", "br");
  next();
});

// Rutas de Navegación
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "../../TodasBrillamos/dist/index.html"));
});
app.get("/editarcuenta/:id", function (req, res) {
  res.sendFile(path.join(__dirname, "../../TodasBrillamos/dist/index.html"));
});
app.get("/dashboard", function (req, res) {
  res.sendFile(path.join(__dirname, "../../TodasBrillamos/dist/index.html"));
});
app.get("/productos", function (req, res) {
  res.sendFile(path.join(__dirname, "../../TodasBrillamos/dist/index.html"));
});
app.get("/addproductos", function (req, res) {
  res.sendFile(path.join(__dirname, "../../TodasBrillamos/dist/index.html"));
});
app.get("/cuentas", function (req, res) {
  res.sendFile(path.join(__dirname, "../../TodasBrillamos/dist/index.html"));
});
app.get("/editarproductos/:id", function (req, res) {
  res.sendFile(path.join(__dirname, "../../TodasBrillamos/dist/index.html"));
});
app.get("/anadiradministrador", function (req, res) {
  res.sendFile(path.join(__dirname, "../../TodasBrillamos/dist/index.html"));
});
app.get("/foro", function (req, res) {
  res.sendFile(path.join(__dirname, "../../TodasBrillamos/dist/index.html"));
});
app.get("/anuncios", function (req, res) {
  res.sendFile(path.join(__dirname, "../../TodasBrillamos/dist/index.html"));
});
app.get("/reset-password", function (req, res) {
  res.sendFile(path.join(__dirname, "../../TodasBrillamos/dist/index.html"));
});

// Rutas de Autenticación
app.post("/api/login", authentication.login);
app.post("/api/loginadmin", authentication.loginadmin);
app.post("/api/register", authentication.register);
app.post("/api/productos", products.newproduct);
app.post("/api/preguntas", preguntas.addPregunta);
app.post("/api/banners", banners.addBanner);
app.post("/api/carrito", carrito.crearCarrito);
app.post("/api/preguntas/:id_pregunta/respuesta", preguntas.addRespuesta);

// Rutas de Consulta
app.get("/api/productos", products.getproducts);
app.get("/api/productos/mas-vendidos", products.getProductosMasVendidos);
app.get("/api/productos/menos-vendidos", products.getProductosMenosVendidos);
app.get("/api/productos/:id", products.getproductbyid);
app.get("/api/usuario", authentication.getusers);
app.get("/api/usuario/:id", authentication.getuserbyid);
app.get("/api/imagenes/:filename", products.getImage);
app.get("/api/imagenes_usuario/:filename", authentication.getImageUser);
app.get("/api/productos/search", products.searchproducts);
app.get("/api/usuario/search", authentication.searchusers);
app.get("/api/preguntas", preguntas.getPreguntas);
app.get("/api/banners/:filename", banners.getImage);
app.get("/api/banners", banners.getBanners);
app.get("/api/carrito/:id_usuario", carrito.getCarrito);
app.get("/api/carrito/:id_usuario/completo", carrito.getCarritoCompletado);
app.get("/api/totalUsuariosN", authentication.getTotalUsuariosN);
app.get("/api/ventas/anio", carrito.getTotalVentasAnio);
app.get("/api/productos/mas-vendidos", carrito.getProductosMasVendidos);
app.get("/api/productos/menos-vendidos", carrito.getProductosMenosVendidos);
app.get(
  "/api/producto_carrito/:id_carrito/:id_producto_carrit",
  carrito.getIdProductoCarrito
);
app.get("/api/carrito/:id_usuario/completoNP", carrito.getCarritoCompletadoNP);

// Rutas de Eliminación
app.delete("/api/usuario/:id", authentication.deleteuser);
app.delete("/api/productos/:id", products.deleteProduct);
app.delete("/api/preguntas/:id_pregunta", preguntas.deletePregunta);
app.delete("/api/banners/:id", banners.deleteBanner);
app.delete(
  "/api/carrito/:id_carrito/:id_producto_carrito",
  carrito.deleteProductoCarrito
);

// Rutas de Actualización
app.put("/api/productos/:id", products.updateProduct);
app.put("/api/usuario/:id", authentication.updateUser);
app.put("/api/productos/:id/img", products.updateImage);
app.put("/api/usuario/:id/img", authentication.updateImageUser);
app.put("/api/preguntas/:id_pregunta/respuesta", preguntas.addRespuesta);
app.put(
  "/api/carrito/:id_carrito/:id_producto_carrito",
  carrito.putCantidadProducto
);
app.put("/api/carrito/:id_carrito", carrito.completarCarrito);

// Rutas de Actualización de Estado
app.patch("/api/usuario/:id", authentication.updateuserstatus);
