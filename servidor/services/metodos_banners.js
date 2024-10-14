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
    cb(null, 'uploads_banner/'); // Carpeta donde se guardarán las imágenes
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
//AGREGAR BANNER
async function addBanner(req, res) {
    console.log(req.body);
    const {nombre_banner} = req.body;
    const ruta_banner = req.file ? req.file.filename : null;
    if (!nombre_banner || !ruta_banner) {
        return res.status(400).send({ alert: 'Faltan campos por llenar' });
    }

    getConnection((err, connection) => {
        if (err) {
            return res.status(500).send({ alert: 'Error al conectar con la base de datos' });
        }
        const query = "INSERT INTO banner (nombre_banner, ruta_banner) VALUES (?, ?)";
        connection.query(query, [nombre_banner, ruta_banner], (error, results) => {
            if (error) {
                console.error('Error al insertar en la base de datos:', error);
                return res.status(500).send({ alert: 'Error al insertar en la base de datos' });
            }
            res.json({ alert: 'Banner agregado' });
            console.log('Banner agregado:', results);
        });
    });
}
//GET IMAGEN
async function getImage(req, res) {
    const { filename } = req.params;
    const filepath = path.join(__dirname, '../uploads_banner', filename);
    // Verificar si el archivo existe
    if (fs.existsSync(filepath)) {
      res.sendFile(filepath); // Enviar el archivo si existe
    } else {
      res.status(404).json({ error: 'Imagen no encontrada' }); // Devolver error si no se encuentra
    }
}

//DELETE BANNER
async function deleteBanner(req, res) {
    const { id } = req.params;
    getConnection((err, connection) => {
        if (err) {
            return res.status(500).send({ alert: 'Error al conectar con la base de datos' });
        }
        connection.query(`
            DELETE FROM banner WHERE id_banner = ${id}`, (error, results) => {
            connection.release();
            if (error) {
                console.error('Error al eliminar en la base de datos:', error);
                return res.status(500).send({ alert: 'Error al eliminar en la base de datos' });
            }
            res.json({ alert: 'Banner eliminado' });
            console.log('Banner eliminado:', results);
        });
    });
}
//GET BANNERS
async function getBanners(req, res) {
    getConnection((err, connection) => {
        if (err) {
            return res.status(500).send({ alert: 'Error al conectar con la base de datos' });
        }
        connection.query("SELECT * FROM banner", (error, results) => {
            connection.release();
            if (error) {
                console.error('Error al consultar en la base de datos:', error);
                return res.status(500).send({ alert: 'Error al consultar en la base de datos' });
            }
            res.json(results);
            console.log('Banners:', results);
        });
    });
}
export const methods = {
    getImage,
    addBanner: [upload.single('ruta_banner'), addBanner],
    deleteBanner,
    getBanners
}