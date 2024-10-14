import mysql from 'mysql';
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

// Función para obtener una conexión del pool
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

// FUNCIONALIDADES

//OBTENER PREGUNTAS
async function getPreguntas(req, res) {

    getConnection((err, connection) => {
        if (err) {
            return res.status(500).send({ alert: 'Error al conectar con la base de datos' });
        }

        connection.query(`
            SELECT 
                p.id_pregunta, 
                p.id_usuario, 
                u.nombre AS firstName, 
                u.apellido_paterno AS lastName, 
                p.titulo, 
                p.id_usuario_respuesta, 
                p.respuesta, 
                p.fecha_respuesta
            FROM pregunta p
            JOIN usuario u ON p.id_usuario = u.id_usuario`, (error, results) => {
            connection.release();
            if (error) {
                console.error('Error al consultar la base de datos:', error);
                return res.status(500).send({ alert: 'Error al consultar la base de datos' });
            }
            res.json(results);
            console.log('Preguntas obtenidas:', results);
        });
    });
}

//SUBIR RESPUESTA
async function addRespuesta(req, res) {
    const { id_pregunta } = req.params;
    const { id_usuario_respuesta, respuesta } = req.body;
    const fecha_respuesta = new Date(); // Fecha actual

    // Validar que se hayan proporcionado todos los datos necesarios
    if (!id_pregunta || !id_usuario_respuesta || !respuesta) {
        return res.status(400).send({ alert: 'Faltan datos necesarios para agregar la respuesta' });
    }

    getConnection((err, connection) => {
        if (err) {
            return res.status(500).send({ alert: 'Error al conectar con la base de datos' });
        }

        // Verificar si la pregunta existe
        const checkQuery = 'SELECT * FROM pregunta WHERE id_pregunta = ?';
        connection.query(checkQuery, [id_pregunta], (error, results) => {
            if (error) {
                connection.release();
                console.error('Error al verificar la pregunta:', error);
                return res.status(500).send({ alert: 'Error al verificar la pregunta' });
            }

            if (results.length === 0) {
                connection.release();
                return res.status(404).send({ alert: 'Pregunta no encontrada' });
            }

            // Actualizar la pregunta con la respuesta
            const updateQuery = `
                UPDATE pregunta 
                SET id_usuario_respuesta = ?, respuesta = ?, fecha_respuesta = ?
                WHERE id_pregunta = ?
            `;
            connection.query(updateQuery, [id_usuario_respuesta, respuesta, fecha_respuesta, id_pregunta], (updateError, updateResult) => {
                connection.release();
                if (updateError) {
                    console.error('Error al agregar la respuesta:', updateError);
                    return res.status(500).send({ alert: 'Error al agregar la respuesta' });
                }

                res.status(200).send({ status: 'Respuesta agregada correctamente' });
            });
        });
    });
}

//ELIMINAR PREGUNTA
async function deletePregunta(req, res) {
    const { id_pregunta } = req.params;

    if (!id_pregunta) {
        return res.status(400).send({ alert: 'ID de pregunta no proporcionado' });
    }

    getConnection((err, connection) => {
        if (err) {
            console.error('Error al conectar con la base de datos:', err);
            return res.status(500).send({ alert: 'Error al conectar con la base de datos' });
        }

        const deleteQuery = 'DELETE FROM pregunta WHERE id_pregunta = ?';
        connection.query(deleteQuery, [id_pregunta], (error, results) => {
            connection.release();

            if (error) {
                console.error('Error al eliminar la pregunta:', error);
                return res.status(500).send({ alert: 'Error al eliminar la pregunta' });
            }

            if (results.affectedRows === 0) {
                return res.status(404).send({ alert: 'Pregunta no encontrada' });
            }

            res.status(200).send({ status: 'Pregunta eliminada correctamente' });
        });
    });
}

// EXPORTACIÓN DE MÉTODOS
export const methods = {
    getPreguntas,
    addRespuesta,
    deletePregunta,
};
