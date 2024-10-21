import mysql from "mysql";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configuración de multer para almacenar imágenes
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Carpeta donde se guardarán las imágenes
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Nombre único para la imagen
  },
});

const upload = multer({ storage: storage });

dotenv.config();

// Configuración de la conexión a la base de datos
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "zazilapp",
};

const pool = mysql.createPool(dbConfig);
// Conexión a la base de datos
function getConnection(callback) {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error al conectar a la base de datos:", err);
      return callback(err, null);
    }
    console.log("Conexión a la base de datos establecida");
    callback(null, connection);
  });
}

// REGISTRO DE PRODUCTO
async function newproduct(req, res) {
  const { nombre_producto, descripcion, precio, stock, categoria } = req.body;
  const ruta_img = req.file ? req.file.filename : null; // Guarda la ruta de la imagen
  if (!nombre_producto || !descripcion || !precio || !stock || !categoria) {
    return res.status(400).send({ alert: "Faltan datos" });
  }
  getConnection((err, connection) => {
    if (err) {
      return res
        .status(500)
        .send({ alert: "Error al conectar con la base de datos" });
    }
    // Verificar si el producto ya está registrado
    connection.query(
      "SELECT * FROM product_z WHERE nombre_producto = ?",
      [nombre_producto],
      async (error, results) => {
        if (error) {
          connection.release();
          return res
            .status(500)
            .send({ alert: "Error al verificar el producto" });
        }
        if (results.length > 0) {
          connection.release();
          return res
            .status(400)
            .send({ status: "Error", alert: "Producto ya registrado" });
        }
        try {
          // Proceso de creación del nuevo producto
          const query =
            "INSERT INTO product_z (nombre_producto, categoria, descripcion, precio, stock, ruta_img) VALUES (?, ?, ?, ?, ?, ?)";
          connection.query(
            query,
            [nombre_producto, categoria, descripcion, precio, stock, ruta_img],
            (error, result) => {
              connection.release();
              if (error) {
                return res
                  .status(501)
                  .send({ alert: "Error al crear el producto" });
              }
              res
                .status(201)
                .send({ status: "Producto registrado correctamente" });
            }
          );
        } catch (error) {
          connection.release();
          return res.status(500).send({ alert: "Error al crear el producto" });
        }
      }
    );
  });
}
//GET PRODUCTOS
async function getproducts(req, res) {
  getConnection((err, connection) => {
    if (err) {
      return res
        .status(500)
        .send({ alert: "Error al conectar con la base de datos" });
    }
    connection.query("SELECT * FROM product_z", (error, results) => {
      connection.release();
      if (error) {
        return res
          .status(500)
          .send({ alert: "Error al consultar la base de datos" });
      }
      res.json(results);
      console.log(results);
    });
  });
}
// GET PRODUCTO POR ID
async function getproductbyid(req, res) {
  const { id } = req.params;
  getConnection((err, connection) => {
    if (err) {
      return res
        .status(500)
        .send({ alert: "Error al conectar con la base de datos" });
    }
    connection.query(
      "SELECT * FROM product_z WHERE id_producto = ?",
      [id],
      (error, results) => {
        connection.release();
        if (error) {
          return res
            .status(500)
            .send({ alert: "Error al consultar la base de datos" });
        }
        if (results.length === 0) {
          return res.status(404).send({ alert: "Producto no encontrado" });
        }
        res.json(results[0]);
      }
    );
  });
}
//GET IMAGEN
async function getImage(req, res) {
  const { filename } = req.params;
  const filepath = path.join(__dirname, "../uploads", filename);
  // Verificar si el archivo existe
  if (fs.existsSync(filepath)) {
    res.sendFile(filepath); // Enviar el archivo si existe
  } else {
    res.status(404).json({ error: "Imagen no encontrada" }); // Devolver error si no se encuentra
  }
}

// Método para eliminar un producto
async function deleteProduct(req, res) {
  const { id } = req.params;
  getConnection((err, connection) => {
    if (err) {
      return res
        .status(500)
        .send({ alert: "Error al conectar con la base de datos" });
    }
    connection.query(
      "DELETE FROM product_z WHERE id_producto = ?",
      [id],
      (error, result) => {
        connection.release();
        if (error) {
          return res
            .status(500)
            .send({ alert: "Error al eliminar el producto" });
        }
        if (result.affectedRows === 0) {
          return res.status(404).send({ alert: "Producto no encontrado" });
        }
        res.status(200).send({ status: "Producto eliminado correctamente" });
      }
    );
  });
}

// Actualizar un producto
async function updateProduct(req, res) {
  console.log(req.body);
  const id = req.params.id; // El id del producto que vamos a actualizar
  const { nombre_producto, descripcion, precio, stock, categoria } = req.body;

  if (!nombre_producto || !descripcion || !precio || !stock || !categoria) {
    return res.status(400).send({ alert: "Faltan datos" });
  }

  getConnection((err, connection) => {
    if (err) {
      return res
        .status(500)
        .send({ alert: "Error al conectar con la base de datos" });
    }
    // Actualizar el producto
    const updateQuery = `UPDATE product_z SET nombre_producto = ?, categoria = ?, descripcion = ?, precio = ?, stock = ? WHERE id_producto = ?`;
    connection.query(
      updateQuery,
      [nombre_producto, categoria, descripcion, precio, stock, id],
      (error, result) => {
        if (error) {
          connection.release();
          return res
            .status(500)
            .send({ alert: "Error al actualizar el producto" });
        }
        connection.release();
        res.status(200).send({ status: "Producto actualizado correctamente" });
      }
    );
  });
}
//Actualizar Imagen Producto
async function updateImage(req, res) {
  const { id } = req.params;
  const ruta_img = req.file ? req.file.filename : null;
  console.log(req.body);

  if (!ruta_img) {
    return res.status(400).send({ alert: "No se ha proporcionado una imagen" });
  }

  getConnection((err, connection) => {
    if (err) {
      return res
        .status(500)
        .send({ alert: "Error al conectar con la base de datos" });
    }

    // Consulta la ruta de la imagen actual
    connection.query(
      "SELECT ruta_img FROM product_z WHERE id_producto = ?",
      [id],
      (error, results) => {
        if (error) {
          connection.release();
          return res
            .status(500)
            .send({ alert: "Error al consultar la base de datos" });
        }

        if (results.length === 0) {
          connection.release();
          return res.status(404).send({ alert: "Producto no encontrado" });
        }

        const oldImagePath = path.join(
          __dirname,
          "../uploads",
          results[0].ruta_img
        );

        // Elimina la imagen anterior si existe
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
        // Actualiza la nueva ruta de la imagen en la base de datos
        const updateQuery =
          "UPDATE product_z SET ruta_img = ? WHERE id_producto = ?";
        connection.query(updateQuery, [ruta_img, id], (error) => {
          connection.release();
          if (error) {
            return res
              .status(500)
              .send({ alert: "Error al actualizar la imagen del producto" });
          }
          res
            .status(200)
            .send({ status: "Imagen del producto actualizada correctamente" });
        });
      }
    );
  });
}

//FUNCION BUSQUEDA
async function searchproducts(req, res) {
  const { search, category, sort } = req.query;

  let query = "SELECT * FROM product_z";
  let conditions = [];
  let params = [];

  if (search) {
    conditions.push("(nombre_producto LIKE ? OR descripcion LIKE ?)");
    params.push(`%${search}%`, `%${search}%`);
  }

  if (category) {
    conditions.push("categoria = ?");
    params.push(category);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  if (sort === "asc") {
    query += " ORDER BY precio ASC";
  } else if (sort === "desc") {
    query += " ORDER BY precio DESC";
  }

  getConnection((err, connection) => {
    if (err) {
      console.error("Error al conectar a la base de datos:", err);
      return res.status(500).send({ alert: "Error interno del servidor" });
    }
    connection.query(query, params, (error, results) => {
      connection.release();
      if (error) {
        console.error("Error al consultar la base de datos:", error);
        return res.status(500).send({ alert: "Error interno del servidor" });
      }
      res.json(results);
      console.log(results);
    });
  });
}

//GET PRODUCTOS MAS VENDIDOS
function getProductosMasVendidos(req, res) {
  const query = `
    SELECT p.id_producto, p.nombre_producto, p.categoria, SUM(pc.cantidad) AS total_vendido
    FROM producto_carrito pc
    JOIN carrito c ON pc.id_carrito = c.id_carrito
    JOIN product_z p ON pc.id_producto = p.id_producto
    WHERE c.estado = 'COMPLETADO'
    GROUP BY p.id_producto, p.nombre_producto, p.categoria
    ORDER BY total_vendido DESC
    LIMIT 5
  `;

  getConnection((err, connection) => {
    if (err) {
      console.error('Error al conectar con la base de datos:', err);
      return res.status(500).send({ alert: 'Error al conectar con la base de datos' });
    }

    connection.query(query, (error, results) => {
      connection.release();

      if (error) {
        console.error('Error al ejecutar la consulta:', error);
        return res.status(500).send({ alert: 'Error al ejecutar la consulta' });
      }

      res.json({ productosMasVendidos: results });
    });
  });
}

//GET PRODUCTOS MENOS VENDIDOS
function getProductosMenosVendidos(req, res) {
  const query = `
    SELECT p.id_producto, p.nombre_producto, p.categoria, SUM(pc.cantidad) AS total_vendido
    FROM producto_carrito pc
    JOIN carrito c ON pc.id_carrito = c.id_carrito
    JOIN product_z p ON pc.id_producto = p.id_producto
    WHERE c.estado = 'COMPLETADO'
    GROUP BY p.id_producto, p.nombre_producto, p.categoria
    ORDER BY total_vendido ASC
    LIMIT 5
  `;

  getConnection((err, connection) => {
    if (err) {
      console.error('Error al conectar con la base de datos:', err);
      return res.status(500).send({ alert: 'Error al conectar con la base de datos' });
    }

    connection.query(query, (error, results) => {
      connection.release();

      if (error) {
        console.error('Error al ejecutar la consulta:', error);
        return res.status(500).send({ alert: 'Error al ejecutar la consulta' });
      }

      res.json({ productosMenosVendidos: results });
    });
  });
}


// Exporta con multer para manejar la subida de archivos
export const methods = {
  newproduct: [upload.single("mainImage"), newproduct],
  getproducts,
  searchproducts,
  deleteProduct,
  getproductbyid,
  getImage,
  updateProduct,
  updateImage: [upload.single("mainImage"), updateImage],
  getProductosMasVendidos,
  getProductosMenosVendidos,
};
