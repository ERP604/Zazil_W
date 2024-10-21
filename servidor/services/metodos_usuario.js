import mysql from "mysql";
import bcryptjs from "bcryptjs";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { get } from "http";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config();

// Configuración de la conexión a la base de datos
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "zazilapp",
};
//Configuración de multer para subir archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads_profile/"); // Carpeta donde se guardarán las imágenes
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Nombre único para la imagen
  },
});
const upload = multer({ storage: storage });

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

//// LOGIN USER
async function login(req, res) {
  console.log(req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ message: "Faltan datos" });
  }

  getConnection((err, connection) => {
    if (err) {
      return res
        .status(500)
        .send({ message: "Error al conectar con la base de datos" });
    }

    const query = "SELECT * FROM usuario WHERE email = ?";
    connection.query(query, [email], (error, results) => {
      connection.release();
      if (error) {
        return res
          .status(500)
          .send({ message: "Error al verificar el usuario" });
      }

      if (results.length === 0) {
        return res.status(400).send({ message: "Usuario no encontrado" });
      }

      const user = results[0];

      // Verificar si el usuario es "administrador"
      if (user.estatus !== "activo") {
        return res
          .status(403)
          .send({ alert: "Acceso denegado: Su cuenta ha sido suspendida" });
      }

      // Verificar la contraseña hasheada
      bcryptjs.compare(password, user.password, (err, isMatch) => {
        if (err) {
          console.error("Error al verificar la contraseña:", err);
          return res
            .status(500)
            .send({ message: "Error al verificar la contraseña" });
        }

        if (!isMatch) {
          return res.status(401).send({ message: "Contraseña incorrecta" });
        }
        res.json({
          status_login: true,
          id_usuario: user.id_usuario,
          nombre: user.nombre,
          apellido_paterno: user.apellido_paterno,
          apellido_materno: user.apellido_materno,
          tipo_usuario: user.tipo_usuario,
          status_user: user.estatus,
          email: user.email,
          ruta_img: user.ruta_img,
        });
        console.log("Usuario autenticado:", user);
      });
    });
  });
}


//LOGIN ADMIN
async function loginadmin(req, res) {
  console.log(req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ message: "Faltan datos" });
  }

  getConnection((err, connection) => {
    if (err) {
      return res
        .status(500)
        .send({ message: "Error al conectar con la base de datos" });
    }

    const query = "SELECT * FROM usuario WHERE email = ?";
    connection.query(query, [email], (error, results) => {
      connection.release();
      if (error) {
        return res
          .status(500)
          .send({ message: "Error al verificar el usuario" });
      }

      if (results.length === 0) {
        return res.status(400).send({ message: "Usuario no encontrado" });
      }

      const user = results[0];

      // Verificar si el usuario es "administrador"
      if (user.tipo_usuario !== "administrador") {
        return res
          .status(403)
          .send({ message: "Acceso denegado: No tiene permisos de administrador" });
      }

      // Verificar la contraseña hasheada
      bcryptjs.compare(password, user.password, (err, isMatch) => {
        if (err) {
          console.error("Error al verificar la contraseña:", err);
          return res
            .status(500)
            .send({ message: "Error al verificar la contraseña" });
        }

        if (!isMatch) {
          return res.status(401).send({ message: "Contraseña incorrecta" });
        }
        res.json({
          status_login: true,
          id_usuario: user.id_usuario,
          nombre: user.nombre,
          apellido_paterno: user.apellido_paterno,
          apellido_materno: user.apellido_materno,
          tipo_usuario: user.tipo_usuario,
          status_user: user.estatus,
          email: user.email,
          ruta_img: user.ruta_img,
        });
        console.log("Usuario autenticado:", user);
      });
    });
  });
}



//// REGISTRO
async function register(req, res) {
  console.log(req.body);
  const {
    nombre,
    apellido_paterno,
    apellido_materno,
    tipo_usuario,
    email,
    password,
  } = req.body;
  const ruta_img = req.file ? req.file.filename : null; // Guarda la ruta de la imagen
  if (
    !nombre ||
    !apellido_paterno ||
    !apellido_materno ||
    !tipo_usuario ||
    !email ||
    !password
  ) {
    return res.status(400).send({ alert: "Faltan datos" });
  }

  getConnection((err, connection) => {
    if (err) {
      return res
        .status(500)
        .send({ alert: "Error al conectar con la base de datos" });
    }

    // Verificar si el usuario ya está registrado
    connection.query(
      "SELECT * FROM usuario WHERE email = ?",
      [email],
      async (error, results) => {
        if (error) {
          connection.release();
          return res
            .status(500)
            .send({ alert: "Error al verificar el usuario" });
        }
        if (results.length > 0) {
          connection.release();
          return res
            .status(400)
            .send({ status: "Error", alert: "Usuario ya registrado" });
        }
        try {
          // Crear un nuevo hash para la contraseña
          const salt = await bcryptjs.genSalt(10);
          const hashedPassword = await bcryptjs.hash(password, salt);

          // Proceso de creación del nuevo usuario
          const query =
            "INSERT INTO usuario (nombre, apellido_paterno, apellido_materno, tipo_usuario, email, ruta_img, password) VALUES (?, ?, ?, ?, ?, ?, ?)";
          connection.query(
            query,
            [
              nombre,
              apellido_paterno,
              apellido_materno,
              tipo_usuario,
              email,
              ruta_img,
              hashedPassword,
            ],
            (error, result) => {
              //CAMBIAR PASSWORD POR hashedPassword
              connection.release();
              if (error) {
                return res
                  .status(501)
                  .send({ alert: "Error al registrar el usuario" });
              }
              res
                .status(201)
                .send({ status: "Usuario registrado correctamente" });
            }
          );
        } catch (error) {
          connection.release();
          return res
            .status(500)
            .send({ alert: "Error al crear el hash de la contraseña" });
        }
      }
    );
  });
}

//Traer usuarios
async function getusers(req, res) {
  getConnection((err, connection) => {
    if (err) {
      return res
        .status(500)
        .send({ alert: "Error al conectar con la base de datos" });
    }
    const query =
      "SELECT id_usuario, nombre, apellido_paterno, apellido_materno, estatus, tipo_usuario FROM usuario";
    connection.query(query, (error, results) => {
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

// GET USER BY ID
async function getuserbyid(req, res) {
  const { id } = req.params;
  getConnection((err, connection) => {
    if (err) {
      return res
        .status(500)
        .send({ alert: "Error al conectar con la base de datos" });
    }
    const query = "SELECT * FROM usuario WHERE id_usuario = ?";
    connection.query(query, [id], (err, results) => {
      console.log(results);
      if (err) {
        res.status(500).json({ error: "Error al obtener el usuario" });
        return;
      }
      if (!results) {
        res.status(404).json({ mensaje: "Usuario no encontrado" });
      } else {
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
      console.error("Error al conectar con la base de datos:", err);
      return res
        .status(500)
        .send({ message: "Error al conectar con la base de datos" });
    }

    const query = "DELETE FROM usuario WHERE id_usuario = ?";
    connection.query(query, [id], (error, results) => {
      connection.release();

      // Revisa si hay un error en la consulta
      if (error) {
        console.error("Error al ejecutar la consulta:", error);
        return res
          .status(500)
          .send({ message: "Error al ejecutar la consulta" });
      }

      // Verifica si algún registro fue afectado
      if (results.affectedRows === 0) {
        console.log("No se encontró un usuario con ese ID");
        return res.status(404).send({ message: "Usuario no encontrado" });
      }
      console.log("Usuario eliminado exitosamente");
      return res
        .status(200)
        .send({ message: "Usuario eliminado correctamente" });
    });
  });
}

//GET IMAGEN_USUARIO
async function getImageUser(req, res) {
  const { filename } = req.params;
  const filepath = path.join(__dirname, "../uploads_profile", filename);
  // Verificar si el archivo existe
  if (fs.existsSync(filepath)) {
    res.sendFile(filepath); // Enviar el archivo si existe
  } else {
    res.status(404).json({ error: "Imagen no encontrada" }); // Devolver error si no se encuentra
  }
}

// UPDATE USER STATUS
async function updateuserstatus(req, res) {
  const id = req.params.id; // Obtener el ID del usuario desde los parámetros de la URL
  const { estatus } = req.body; // Obtener el nuevo estatus desde el cuerpo de la solicitud

  // Validar que se haya proporcionado el estatus
  if (!estatus) {
    return res.status(400).send({ message: "Estatus no proporcionado" });
  }

  // Validar que el estatus sea válido
  const estatusValido = ["activo", "suspendido"];
  if (!estatusValido.includes(estatus)) {
    return res.status(400).send({ message: "Estatus inválido" });
  }

  getConnection((err, connection) => {
    if (err) {
      console.error("Error al conectar a la base de datos:", err);
      return res
        .status(500)
        .send({ message: "Error al conectar con la base de datos" });
    }

    const query = "UPDATE usuario SET estatus = ? WHERE id_usuario = ?";
    connection.query(query, [estatus, id], (error, results) => {
      connection.release();

      if (error) {
        console.error("Error al ejecutar la consulta:", error);
        return res
          .status(500)
          .send({ message: "Error al ejecutar la consulta" });
      }

      if (results.affectedRows === 0) {
        return res.status(404).send({ message: "Usuario no encontrado" });
      }

      return res
        .status(200)
        .send({ message: "Estatus actualizado correctamente" });
    });
  });
}

// UPDATE USER INFO
async function updateUser(req, res) {
  const id = req.params.id; // El ID del usuario a actualizar
  const { nombre, apellido_paterno, apellido_materno, tipo_usuario, email } =
    req.body;

  // Validar que se hayan proporcionado los datos necesarios
  if (
    !nombre ||
    !apellido_paterno ||
    !apellido_materno ||
    !tipo_usuario ||
    !email
  ) {
    return res.status(400).send({ alert: "Faltan datos" });
  }

  getConnection((err, connection) => {
    if (err) {
      return res
        .status(500)
        .send({ alert: "Error al conectar con la base de datos" });
    }

    // Ahora actualizamos el usuario sin manejar la imagen
    const updateQuery = `
            UPDATE usuario 
            SET 
                nombre = ?, 
                apellido_paterno = ?, 
                apellido_materno = ?, 
                tipo_usuario = ?, 
                email = ? 
            WHERE id_usuario = ?
        `;

    // Preparar los valores para la consulta
    const values = [
      nombre,
      apellido_paterno,
      apellido_materno,
      tipo_usuario,
      email,
      id,
    ];

    connection.query(updateQuery, values, (error, result) => {
      if (error) {
        connection.release();
        return res
          .status(500)
          .send({ alert: "Error al actualizar el usuario" });
      }

      connection.release();
      res.status(200).send({ status: "Usuario actualizado correctamente" });
    });
  });
}
/// ACTUALIZAR IMAGEN DE USUARIO
async function updateImageUser(req, res) {
  const id = req.params.id; // El ID del usuario a actualizar
  const ruta_img = req.file ? req.file.filename : null; // Guarda la ruta de la imagen
  console.log(req.body);

  getConnection((err, connection) => {
    if (err) {
      return res
        .status(500)
        .send({ alert: "Error al conectar con la base de datos" });
    }

    // Consulta de la ruta de la imagen actual
    connection.query(
      "SELECT ruta_img FROM usuario WHERE id_usuario = ?",
      [id],
      (error, results) => {
        if (error) {
          connection.release();
          return res
            .status(500)
            .send({ alert: "Error al obtener la imagen del usuario" });
        }
        if (results.length === 0) {
          connection.release();
          return res.status(404).send({ alert: "Usuario no encontrado" });
        }

        const oldImagePath = results[0].ruta_img
          ? path.join(__dirname, "../uploads_profile", results[0].ruta_img)
          : null;

        // Eliminar la imagen anterior si existe
        if (oldImagePath && fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }

        // Preparar los valores para la consulta
        const updateQuery =
          "UPDATE usuario SET ruta_img = ? WHERE id_usuario = ?";
        connection.query(updateQuery, [ruta_img, id], (error) => {
          connection.release();
          if (error) {
            return res
              .status(500)
              .send({ alert: "Error al actualizar la imagen del usuario" });
          }
          res.status(200).send({ status: "Imagen actualizada correctamente" });
        });
      }
    );
  });
}

//FUNCION BUSQUEDA
async function searchusers(req, res) {
  const { search, status, accountType } = req.query;

  let query =
    "SELECT id_usuario, nombre, apellido_paterno, apellido_materno, estatus, tipo_usuario, email, ruta_img FROM usuario";
  let conditions = [];
  let params = [];

  // Búsqueda por nombre o email
  if (search) {
    conditions.push(
      "(nombre LIKE ? OR apellido_paterno LIKE ? OR apellido_materno LIKE ? OR email LIKE ?)"
    );
  }

  if (status) {
    conditions.push("estatus = ?");
    params.push(status);
  }

  if (accountType) {
    conditions.push("tipo_usuario = ?");
    params.push(accountType);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
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

//Total de clientes
const getTotalUsuariosN = (req, res) => {
  const query =
    "SELECT COUNT(*) AS total FROM usuario WHERE tipo_usuario = 'usuario_n'";

  getConnection((err, connection) => {
    if (err) {
      console.error("Error al conectar con la base de datos:", err);
      return res
        .status(500)
        .send({ alert: "Error al conectar con la base de datos" });
    }

    connection.query(query, (error, results) => {
      connection.release(); // Liberar la conexión de vuelta al pool

      if (error) {
        console.error("Error al ejecutar la consulta:", error);
        return res.status(500).send({ alert: "Error al ejecutar la consulta" });
      }

      // Verificar si se obtuvo un resultado
      if (results.length > 0) {
        res.json({ total: results[0].total });
      } else {
        res.json({ total: 0 });
      }
    });
  });
};

// Exportar métodos
export const methods = {
  login,
  loginadmin,
  register: [upload.single("profileImage"), register],
  getusers,
  getuserbyid,
  deleteuser,
  searchusers,
  updateuserstatus,
  updateUser,
  getImageUser,
  updateImageUser: [upload.single("profileImage"), updateImageUser],
  getTotalUsuariosN,
};
