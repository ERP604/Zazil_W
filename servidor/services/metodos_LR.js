import mysql from 'mysql';
import argon2 from 'argon2';  // Cambiar a argon2
import dotenv from 'dotenv';
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
        }
        res.json({ message: '¡Bienvenido!' });
        });
    });
}

//// REGISTRO
async function register(req, res) {
    console.log(req.body);
    const { nombre, apellido_paterno, apellido_materno, f_nacimiento, tipo_usuario, email, password } = req.body;

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
                // Crear un nuevo hash para la contraseña usando argon2
                const hashedPassword = await argon2.hash(password);

                // Proceso de creación del nuevo usuario
                const query = 'INSERT INTO usuario (nombre, apellido_paterno, apellido_materno, f_nacimiento, tipo_usuario, email, password) VALUES (?, ?, ?, ?, ?, ?, ?)';
                connection.query(query, [nombre, apellido_paterno, apellido_materno, f_nacimiento, tipo_usuario, email, hashedPassword], (error, result) => {
                    connection.release();
                    if (error) {
                        return res.status(500).send({ alert: 'Error al registrar el usuario' });
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
async function getuserbyid(req, res){
    getConnection((err, connection) => {
        if(err){
            return res.status(500).send({alert: "Error al conectar con la base de datos"});
        }
        const id = req.params.id;
        const query = 'SELECT * FROM usuario WHERE id_usuario = ?';

        connection.query(query, [id], (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Error al obtener el usuario' });
            return;
        };
        if (results.lenght > 0){
            res.json(results[0]);
        }else{
            res.status(404).json({mensaje: "Usuario no encontrado"})
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

// Exportar métodos
export const methods = {
    login,
    register,
    getusers,
    getuserbyid,
    deleteuser,
};
