import mysql from 'mysql';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';
import multer from 'multer';
import path from "path";
import fs from 'fs';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config();


// Configuración de la conexión a la base de datos
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'zazilapp'
};
//Configuración de multer para subir archivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, 'uploads_profile/'); // Carpeta donde se guardarán las imágenes
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Nombre único para la imagen
    }
});
const upload = multer({ storage: storage });

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

//// LOGIN
async function login(req, res) {
    console.log(req.body);
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send({ message: 'Faltan datos' });
    }
    getConnection((err, connection) => {
        if (err) {
        return res.status(500).send({ message: 'Error al conectar con la base de datos' });
    }

    const query = "SELECT * FROM usuario WHERE email = ?";
    connection.query(query, [email], (error, results) => {
        connection.release();
        if (error) {
            return res.status(500).send({ message: 'Error al verificar el usuario' });
        }
        if (results.length === 0) {
            return res.status(400).send({ message: 'Usuario no encontrado' });
        }
        const user = results[0];

        if (user.password !== password) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }else{
            console.log("Usuario autenticado correctamente");
            res.json({status: true});
        }
        });
    });
}

//// REGISTRO
async function register(req, res) {
    console.log(req.body);
    const { nombre, apellido_paterno, apellido_materno, f_nacimiento, tipo_usuario, email, password } = req.body;
    const ruta_img = req.file ? req.file.filename : null;  // Guarda la ruta de la imagen
    if (!nombre || !apellido_paterno || !apellido_materno || !f_nacimiento || !tipo_usuario || !email || !password) {
        return res.status(400).send({ alert: 'Faltan datos' });
    }

    getConnection((err, connection) => {
        if (err) {
            return res.status(500).send({ alert: 'Error al conectar con la base de datos' });
        }

        // Verificar si el usuario ya está registrado
        connection.query('SELECT * FROM usuario WHERE email = ?', [email], async (error, results) => {
            if (error) {
                connection.release();
                return res.status(500).send({ alert: 'Error al verificar el usuario' });
            }
            if (results.length > 0) {
                connection.release();
                return res.status(400).send({ status: "Error", alert: 'Usuario ya registrado' });
            }
            try {
                // Crear un nuevo hash para la contraseña
                //const salt = await bcryptjs.genSalt(10);
                //const hashedPassword = await bcryptjs.hash(password, salt);
        
                // Proceso de creación del nuevo usuario
                const query = 'INSERT INTO usuario (nombre, apellido_paterno, apellido_materno, f_nacimiento, tipo_usuario, email, ruta_img, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
                connection.query(query, [nombre, apellido_paterno, apellido_materno, f_nacimiento, tipo_usuario, email, ruta_img, password], (error, result) => {//CAMBIAR PASSWORD POR hashedPassword
                connection.release();
                if (error) {
                    return res.status(501).send({ alert: 'Error al registrar el usuario' });
                }
                    res.status(201).send({ status: 'Usuario registrado correctamente' });
                });
            } catch (error) {
                connection.release();
                return res.status(500).send({ alert: 'Error al crear el hash de la contraseña' });
            }
        });
    });
}
//Traer usuarios
async function getusers(req, res) {
    getConnection((err, connection) => {
        if (err) {
            return res.status(500).send({ alert: 'Error al conectar con la base de datos' });
        }
        const query = "SELECT id_usuario, nombre, apellido_paterno, apellido_materno, estatus, tipo_usuario FROM usuario";
        connection.query(query,(error, results) => {
            connection.release();
            if (error) {
                return res.status(500).send({ alert: 'Error al consultar la base de datos' });
            }
            res.json(results);
            console.log(results);
        });
    });
}

// GET USER BY ID
async function getuserbyid(req, res){
    getConnection((err, connection) => {
        if(err){
            return res.status(500).send({alert: "Error al conectar con la base de datos"});
        }
        const id = req.params.id;
        const query = 'SELECT * FROM usuario WHERE id_usuario = ?';

        connection.query(query, [id], (err, results) => {
            console.log(results);
        if (err) {
            res.status(500).json({ error: 'Error al obtener el usuario' });
            return;
        };
        if (!results){
            res.status(404).json({mensaje: "Usuario no encontrado"})
        }else{
            res.json(results[0]);
        }
    });
});
}

// DELETE USER
async function deleteuser(req, res) {
    const id = req.params.id; // Obtener el ID del usuario desde los parámetros de la URL

    // Imprime el ID para asegurarte de que lo está recibiendo correctamente
    console.log("Intentando eliminar el usuario con id:", id);

    if (!id) {
        return res.status(400).send({ message: "ID de usuario no proporcionado" });
    }

    getConnection((err, connection) => {
        if (err) {
            console.error('Error al conectar con la base de datos:', err);
            return res.status(500).send({ message: 'Error al conectar con la base de datos' });
        }

        const query = 'DELETE FROM usuario WHERE id_usuario = ?';
        connection.query(query, [id], (error, results) => {
        connection.release();

        // Revisa si hay un error en la consulta
        if (error) {
            console.error('Error al ejecutar la consulta:', error);
            return res.status(500).send({ message: 'Error al ejecutar la consulta' });
        }

        // Verifica si algún registro fue afectado
        if (results.affectedRows === 0) {
            console.log("No se encontró un usuario con ese ID");
            return res.status(404).send({ message: 'Usuario no encontrado' });
        }
        console.log("Usuario eliminado exitosamente");
        return res.status(200).send({ message: 'Usuario eliminado correctamente' });
        });
        });
    }
//GET IMAGEN_USUARIO
async function getImageUser(req, res) {
    const { filename } = req.params;
    const filepath = path.join(__dirname, '../uploads_profile', filename);
    // Verificar si el archivo existe
    if (fs.existsSync(filepath)) {
      res.sendFile(filepath); // Enviar el archivo si existe
    } else {
      res.status(404).json({ error: 'Imagen no encontrada' }); // Devolver error si no se encuentra
    }
}
// Exportar métodos
export const methods = {
    login,
    register:[upload.single('profileImage'), register],
    getusers,
    getuserbyid,
    deleteuser,
    getImageUser,
};
