import mysql from 'mysql';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url'; 
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configuración de multer para almacenar imágenes
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Carpeta donde se guardarán las imágenes
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Nombre único para la imagen
    }
});

const upload = multer({ storage: storage });

dotenv.config();

// Configuración de la conexión a la base de datos
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'zazilapp'
};

const pool = mysql.createPool(dbConfig);
// Conexión a la base de datos
function getConnection(callback) {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error al conectar a la base de datos:', err);
            return callback(err, null);
        }
        console.log("Conexión a la base de datos establecida");
        callback(null, connection);
    });
}

// REGISTRO DE PRODUCTO
async function newproduct(req, res) {
    const { nombre_producto, descripcion, precio, stock, categoria} = req.body;
    const ruta_img = req.file ? req.file.filename : null;  // Guarda la ruta de la imagen
    if (!nombre_producto || !descripcion || !precio || !stock || !categoria) {
        return res.status(400).send({ alert: 'Faltan datos' });
    }
    getConnection((err, connection) => {
        if (err) {
        return res.status(500).send({ alert: 'Error al conectar con la base de datos' });
        }
      // Verificar si el producto ya está registrado
      connection.query('SELECT * FROM product_z WHERE nombre_producto = ?', [nombre_producto], async (error, results) => {
        if (error) {
            connection.release();
            return res.status(500).send({ alert: 'Error al verificar el producto' });
        }
        if (results.length > 0) {
            connection.release();
            return res.status(400).send({ status: "Error", alert: 'Producto ya registrado' });
        }
        try {
          // Proceso de creación del nuevo producto
            const query = 'INSERT INTO product_z (nombre_producto, categoria, descripcion, precio, stock, ruta_img) VALUES (?, ?, ?, ?, ?, ?)';
            connection.query(query, [nombre_producto, categoria, descripcion, precio, stock, ruta_img], (error, result) => {
            connection.release();
            if (error) {
                return res.status(501).send({ alert: 'Error al crear el producto' });
            }
            res.status(201).send({ status: 'Producto registrado correctamente' });
            });
        } catch (error) {
            connection.release();
            return res.status(500).send({ alert: 'Error al crear el producto' });
        }
        });
    });
}
//GET PRODUCTOS
async function getproducts(req, res) {
    getConnection((err, connection) => {
        if (err) {
            return res.status(500).send({ alert: 'Error al conectar con la base de datos' });
        }
        connection.query('SELECT * FROM product_z', (error, results) => {
            connection.release();
            if (error) {
                return res.status(500).send({ alert: 'Error al consultar la base de datos' });
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
            return res.status(500).send({ alert: 'Error al conectar con la base de datos' });
        }
        connection.query('SELECT * FROM product_z WHERE id_producto = ?', [id], (error, results) => {
            connection.release();
            if (error) {
                return res.status(500).send({ alert: 'Error al consultar la base de datos' });
            }
            if (results.length === 0) {
                return res.status(404).send({ alert: 'Producto no encontrado' });
            }
            res.json(results[0]);
        });
    });
}
//GET IMAGEN
async function getImage(req, res) {
    const { filename } = req.params;
    const filepath = path.join(__dirname, '../uploads', filename);
    // Verificar si el archivo existe
    if (fs.existsSync(filepath)) {
      res.sendFile(filepath); // Enviar el archivo si existe
    } else {
      res.status(404).json({ error: 'Imagen no encontrada' }); // Devolver error si no se encuentra
    }
}

// Método para eliminar un producto
async function deleteProduct (req, res) {
    const { id } = req.params;
    getConnection((err, connection) => {
        if (err) {
            return res.status(500).send({ alert: 'Error al conectar con la base de datos' });
        }
        connection.query('DELETE FROM product_z WHERE id_producto = ?', [id], (error, result) => {
            connection.release();
            if (error) {
                return res.status(500).send({ alert: 'Error al eliminar el producto' });
            }
        if (result.affectedRows === 0) {
            return res.status(404).send({ alert: 'Producto no encontrado' });
        }
        res.status(200).send({ status: 'Producto eliminado correctamente' });
        });
    });
};  
// Actualizar un producto
async function updateProduct(req, res) {
    console.log(req.body);
    const { id } = req.params;  // El id del producto que vamos a actualizar
    const { nombre_producto, descripcion, precio, stock, categoria } = req.body;
    const ruta_img = req.file ? req.file.filename : null;  // Si hay una nueva imagen, usa la nueva ruta

    if (!nombre_producto || !descripcion || !precio || !stock || !categoria) {
        return res.status(400).send({ alert: 'Faltan datos' });
    }

    getConnection((err, connection) => {
        if (err) {
            return res.status(500).send({ alert: 'Error al conectar con la base de datos' });
        }

        // Primero, obtenemos la ruta actual de la imagen del producto
        const getImageQuery = `SELECT ruta_img FROM product_z WHERE id_producto = ?`;
        connection.query(getImageQuery, [id], (error, results) => {
            if (error || results.length === 0) {
                connection.release();
                return res.status(500).send({ alert: 'Error al obtener la imagen actual del producto' });
            }

            const currentImage = results[0].ruta_img; // La imagen actual del producto
            const updatedImage = ruta_img || currentImage; // Si no se ha actualizado, mantén la imagen actual

            // Ahora actualizamos el producto
            const updateQuery = `UPDATE product_z SET nombre_producto = ?, categoria = ?, descripcion = ?, precio = ?, stock = ?, ruta_img = ? WHERE id_producto = ?`;
            connection.query(updateQuery, [nombre_producto, categoria, descripcion, precio, stock, updatedImage, id], (error, result) => {
                if (error) {
                    connection.release();
                    return res.status(500).send({ alert: 'Error al actualizar el producto' });
                }

                // Si hay una nueva imagen y no es la misma que la actual, eliminamos la imagen antigua
                if (ruta_img && currentImage) {
                    const imagePath = path.join(__dirname, '../uploads', currentImage);
                    // Verifica si el archivo existe antes de intentar eliminarlo
                    fs.unlink(imagePath, (unlinkError) => {
                        if (unlinkError) {
                            console.error('Error al eliminar la imagen anterior:', unlinkError);
                        } else {
                            console.log('Imagen anterior eliminada:', currentImage);
                        }
                    });
                }

                connection.release();
                res.status(200).send({ status: 'Producto actualizado correctamente' });
            });
        });
    });
}



// Exporta con multer para manejar la subida de archivos
export const methods = {
    newproduct: [upload.single('mainImage'), newproduct],
    getproducts,
    deleteProduct,
    getproductbyid,
    getImage,
    updateProduct,
};