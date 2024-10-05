import mysql from 'mysql';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';

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
    const ruta_img = req.file ? `uploads/${req.file.filename}` : null;  // Guarda la ruta de la imagen
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
// Método para eliminar un producto
export const deleteProduct = (req, res) => {
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

// Exporta con multer para manejar la subida de archivos
export const methods = {
    newproduct: [upload.single('mainImage'), newproduct],
    getproducts,
    deleteProduct
};