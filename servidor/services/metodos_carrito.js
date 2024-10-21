import mysql from "mysql";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import nodemailer from "nodemailer";
import { get } from "http";

dotenv.config();

// Configuración de la conexión a la base de datos
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "zazilapp",
};

// Configuración del transporte de Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail", // Puedes usar otros servicios como Outlook, Yahoo, etc.
  auth: {
    user: "sanscrft@gmail.com", // Tu correo electrónico
    pass: "kfwd ntzg yvcg avgk", // Tu contraseña o contraseña de aplicación
  },
});

const pool = mysql.createPool(dbConfig);
// Funcion de la conexion a la DB
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

//Funcion para crear un nuevo carrito, si el usuario tiene un carrito en estado PENDIENTE, añadir productos a ese carrito, de lo contrario crear un nuevo carrito
async function crearCarrito(req, res) {
  const { id_usuario, id_producto, cantidad } = req.body;
  const fechaActual = new Date(); // Fecha actual

  getConnection((err, connection) => {
    if (err) {
      return res
        .status(500)
        .send({ alert: "Error al conectar con la base de datos" });
    }
    connection.query(
      `SELECT id_carrito FROM carrito WHERE id_usuario = ? AND estado = 'PENDIENTE'`,
      [id_usuario],
      (error, results) => {
        if (error) {
          console.error("Error al consultar la base de datos:", error);
          return res
            .status(500)
            .send({ alert: "Error al consultar la base de datos" });
        }
        if (results.length > 0) {
          const id_carrito = results[0].id_carrito;
          connection.query(
            `INSERT INTO producto_carrito (id_carrito, id_producto, cantidad, f_added) VALUES (?, ?, ?, ?)`,
            [id_carrito, id_producto, cantidad, fechaActual],
            (error, results) => {
              if (error) {
                console.error("Error al consultar la base de datos:", error);
                connection.release();
                return res
                  .status(500)
                  .send({ alert: "Error al consultar la base de datos" });
              }
              // Actualizar la fecha de actualización del carrito
              connection.query(
                `UPDATE carrito SET f_actualizacion = ? WHERE id_carrito = ?`,
                [fechaActual, id_carrito],
                (error) => {
                  connection.release();
                  if (error) {
                    console.error(
                      "Error al actualizar la fecha del carrito:",
                      error
                    );
                    return res.status(500).send({
                      alert: "Error al actualizar la fecha del carrito",
                    });
                  }
                  res.json({
                    alert: "Producto añadido al carrito",
                  });
                  console.log("Producto añadido al carrito:", results);
                }
              );
            }
          );
        } else {
          connection.query(
            `INSERT INTO carrito (id_usuario, estado, f_creacion, f_actualizacion) VALUES (?, 'PENDIENTE', ?, ?)`,
            [id_usuario, fechaActual, fechaActual],
            (error, results) => {
              if (error) {
                console.error("Error al consultar la base de datos:", error);
                connection.release();
                return res
                  .status(500)
                  .send({ alert: "Error al consultar la base de datos" });
              }
              const id_carrito = results.insertId;
              connection.query(
                `INSERT INTO producto_carrito (id_carrito, id_producto, cantidad, f_added) VALUES (?, ?, ?, ?)`,
                [id_carrito, id_producto, cantidad, fechaActual],
                (error, results) => {
                  connection.release();
                  if (error) {
                    console.error(
                      "Error al consultar la base de datos:",
                      error
                    );
                    return res
                      .status(500)
                      .send({ alert: "Error al consultar la base de datos" });
                  }
                  res.json({
                    alert: "Producto añadido al carrito",
                  });
                  console.log("Producto añadido al carrito:", results);
                }
              );
            }
          );
        }
      }
    );
  });
}

// GET CARRITO
async function getCarrito(req, res) {
  const { id_usuario } = req.params;
  getConnection((err, connection) => {
    if (err) {
      return res
        .status(500)
        .send({ alert: "Error al conectar con la base de datos" });
    }
    connection.query(
      `SELECT c.id_carrito, c.estado, pc.id_producto_carrito, pc.id_producto, pc.cantidad, p.nombre_producto, p.precio, p.ruta_img, p.stock
      FROM carrito c
      JOIN producto_carrito pc ON c.id_carrito = pc.id_carrito
      JOIN product_z p ON pc.id_producto = p.id_producto
      WHERE c.id_usuario = ${id_usuario} AND c.estado = 'PENDIENTE'
      `,
      (error, results) => {
        connection.release();
        if (error) {
          console.error("Error al consultar la base de datos:", error);
          return res
            .status(500)
            .send({ alert: "Error al consultar la base de datos" });
        }
        res.json(results);
        console.log("Carrito obtenido:", results);
      }
    );
  });
}

//GET CARRITO COMPLEATADO SIN FORMATO PARA CORREO
async function getCarritoCompletadoNP(req, res) {
  const { id_usuario } = req.params;

  getConnection((err, connection) => {
    if (err) {
      return res
        .status(500)
        .send({ alert: "Error al conectar con la base de datos" });
    }

    connection.query(
      `SELECT id_carrito, estado, total, f_actualizacion FROM carrito WHERE id_usuario = ? AND estado = 'COMPLETADO'`,

      [id_usuario], // Usar parámetros para evitar inyecciones SQL
      (error, results) => {
        connection.release();
        if (error) {
          console.error("Error al consultar la base de datos:", error);
          return res
            .status(500)
            .send({ alert: "Error al consultar la base de datos" });
        }

        res.json(results);
        console.log("Carrito obtenido:", results);
      }
    );
  });
}

//GET CARRITO COMPLEATADO
async function getCarritoCompletado(req, res) {
  const { id_usuario } = req.params;
  const { email: emailFromBody, usuario: usuarioFromBody, asunto } = req.body; // Obtener datos adicionales del cuerpo de la solicitud

  getConnection((err, connection) => {
    if (err) {
      return res
        .status(500)
        .send({ alert: "Error al conectar con la base de datos" });
    }

    // Consulta para obtener el email asociado al id_usuario
    connection.query(
      `SELECT email FROM usuario WHERE id_usuario = ?`,
      [id_usuario],
      (emailError, emailResults) => {
        if (emailError || emailResults.length === 0) {
          connection.release();
          console.error("Error al obtener el email del usuario:", emailError);
          return res
            .status(500)
            .send({ alert: "Error al obtener el email del usuario" });
        }

        const email = emailFromBody || emailResults[0].email; // Usar el email del cuerpo de la solicitud o el de la base de datos

        // Consulta para obtener el nombre del usuario
        connection.query(
          `SELECT nombre FROM usuario WHERE id_usuario = ?`,
          [id_usuario],
          (nombreError, nombreResults) => {
            if (nombreError || nombreResults.length === 0) {
              connection.release();
              console.error(
                "Error al obtener el nombre del usuario:",
                nombreError
              );
              return res
                .status(500)
                .send({ alert: "Error al obtener el nombre del usuario" });
            }

            const nombreUsuario = usuarioFromBody || nombreResults[0].nombre; // Usar el nombre del cuerpo de la solicitud o el de la base de datos

            // Consulta para obtener el carrito completado
            connection.query(
              `SELECT c.id_carrito, c.estado, pc.id_producto_carrito, pc.id_producto, pc.cantidad, p.nombre_producto, p.precio, p.ruta_img, p.stock
                FROM carrito c
              JOIN producto_carrito pc ON c.id_carrito = pc.id_carrito
              JOIN product_z p ON pc.id_producto = p.id_producto
              WHERE c.id_usuario = ? AND c.estado = 'COMPLETADO'
              AND c.id_carrito = (
                  SELECT c2.id_carrito
                  FROM carrito c2
                  WHERE c2.id_usuario = ? AND c2.estado = 'COMPLETADO'
                  ORDER BY c2.id_carrito DESC
                  LIMIT 1
              );`,
              [id_usuario, id_usuario],
              (error, results) => {
                if (error) {
                  connection.release();
                  console.error("Error al consultar la base de datos:", error);
                  return res
                    .status(500)
                    .send({ alert: "Error al consultar la base de datos" });
                }

                // Calcular el total de los productos en el carrito
                const total = results.reduce(
                  (sum, producto) => sum + producto.precio * producto.cantidad,
                  0
                );

                // Actualizar la tabla carrito con el total calculado
                connection.query(
                  `UPDATE carrito SET total = ? WHERE id_usuario = ? AND estado = 'COMPLETADO'`,
                  [total, id_usuario],
                  (updateError) => {
                    connection.release();
                    if (updateError) {
                      console.error(
                        "Error al actualizar el total en la base de datos:",
                        updateError
                      );
                      return res.status(500).send({
                        alert: "Error al actualizar el total del carrito",
                      });
                    }

                    // Formatear la respuesta para enviar el correo
                    const formattedResponse = {
                      destinatario: email,
                      usuario: nombreUsuario,
                      productos: results.map((producto) => ({
                        id_carrito: producto.id_carrito,
                        estado: producto.estado,
                        id_producto_carrito: producto.id_producto_carrito,
                        id_producto: producto.id_producto,
                        cantidad: producto.cantidad,
                        nombre_producto: producto.nombre_producto,
                        precio: producto.precio,
                        ruta_img: producto.ruta_img,
                        stock: producto.stock,
                      })),
                      asunto: asunto || "Confirmación de tu compra",
                    };

                    // Llamar a la función correopago para enviar el correo
                    correopago(
                      { body: formattedResponse },
                      {
                        status: (statusCode) => ({
                          json: (response) =>
                            res.status(statusCode).json(response),
                        }),
                      }
                    );

                    res.json(true);
                    console.log(
                      "Carrito obtenido, actualizado y formateado para el correo:",
                      formattedResponse
                    );
                  }
                );
              }
            );
          }
        );
      }
    );
  });
}

///Función correopago
async function correopago(req, res) {
  const { destinatario, usuario, productos, asunto } = req.body;

  // Verifica que haya productos en la lista
  if (!productos || !Array.isArray(productos) || productos.length === 0) {
    return res
      .status(400)
      .json({ message: "La lista de productos está vacía o no es válida" });
  }

  // Construir las filas de la tabla para los productos
  let productosHTML = productos
    .map(
      (producto) => `
    <tr>
      <td style="border: 1px solid #ddd; padding: 8px;">${producto.nombre_producto}</td>
      <td style="border: 1px solid #ddd; padding: 8px;">${producto.cantidad}</td>
      <td style="border: 1px solid #ddd; padding: 8px;">$${producto.precio}</td>
    </tr>
  `
    )
    .join("");

  // Calcular el total
  let total = productos.reduce(
    (acc, producto) => acc + producto.precio * producto.cantidad,
    0
  );

  // Configuración del correo electrónico
  let mailOptions = {
    from: "sanscrft@gmail.com",
    to: destinatario, // Dirección de correo del destinatario
    subject: asunto || "Confirmación de tu compra", // Asunto del correo
    html: `
      <div style="font-family: Arial, sans-serif; text-align: center; color: #333;">
        <h2 style="background-color: #D22973; color: #fff; padding: 15px;">
          Agradecemos su compra, ${usuario}
        </h2>
        <p>Fundación Todas Brillamos A.C.</p>
        <p>Banorte</p>
        <p>Cuenta: 072180010963196216</p>
        <p>Contacto: +52 56 2308 3683</p>
        <h3>Detalles de tu compra:</h3>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr>
              <th style="border: 1px solid #ddd; padding: 8px;">Producto</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Cantidad</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Precio</th>
            </tr>
          </thead>
          <tbody>
            ${productosHTML}
          </tbody>
        </table>
        <p><strong>Total: $${total.toFixed(2)}</strong></p>
      </div>
    `,
  };

  // Enviar el correo
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error al enviar el correo:", error);
      return res
        .status(500)
        .json({ message: "Error al enviar el correo", error });
    }
    console.log("Correo enviado:", info.response);
    res.status(200).json({ message: "Correo enviado exitosamente" }, total);
  });
}

// DELETE PRODUCTO CARRITO
async function deleteProductoCarrito(req, res) {
  const { id_producto_carrito } = req.params;
  const { id_carrito } = req.params;
  getConnection((err, connection) => {
    if (err) {
      return res
        .status(500)
        .send({ alert: "Error al conectar con la base de datos" });
    }
    connection.query(
      `DELETE FROM producto_carrito WHERE id_producto_carrito = ${id_producto_carrito} AND id_carrito = ${id_carrito}`,
      (error, results) => {
        connection.release();
        if (error) {
          console.error("Error al consultar la base de datos:", error);
          return res
            .status(500)
            .send({ alert: "Error al consultar la base de datos" });
        }
        res.json({ alert: "Producto eliminado del carrito" });
        console.log("Producto eliminado del carrito:", results);
      }
    );
  });
}

//PUT CANTIDAD PRODUCTO
async function putCantidadProducto(req, res) {
  const { id_producto_carrito } = req.params;
  const { cantidad } = req.body;
  getConnection((err, connection) => {
    if (err) {
      return res
        .status(500)
        .send({ alert: "Error al conectar con la base de datos" });
    }
    connection.query(
      `UPDATE producto_carrito SET cantidad = ${cantidad} WHERE id_producto_carrito = ${id_producto_carrito}`,
      (error, results) => {
        connection.release();
        if (error) {
          console.error("Error al consultar la base de datos:", error);
          return res
            .status(500)
            .send({ alert: "Error al consultar la base de datos" });
        }
        res.json({ alert: "Cantidad actualizada" });
        console.log("Cantidad actualizada:", results);
      }
    );
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
      console.error("Error al conectar con la base de datos:", err);
      return res
        .status(500)
        .send({ alert: "Error al conectar con la base de datos" });
    }

    connection.query(query, (error, results) => {
      connection.release();

      if (error) {
        console.error("Error al ejecutar la consulta:", error);
        return res.status(500).send({ alert: "Error al ejecutar la consulta" });
      }

      res.json({ productosMenosVendidos: results });
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
      console.error("Error al conectar con la base de datos:", err);
      return res
        .status(500)
        .send({ alert: "Error al conectar con la base de datos" });
    }

    connection.query(query, (error, results) => {
      connection.release();

      if (error) {
        console.error("Error al ejecutar la consulta:", error);
        return res.status(500).send({ alert: "Error al ejecutar la consulta" });
      }

      res.json({ productosMasVendidos: results });
    });
  });
}

//GET VENTAS ANUALES
function getTotalVentasAnio(req, res) {
  const currentYear = new Date().getFullYear();
  const query = `
    SELECT SUM(total) AS total_ventas
    FROM carrito
    WHERE estado = 'COMPLETADO'
      AND YEAR(f_creacion) = ?
  `;

  getConnection((err, connection) => {
    if (err) {
      console.error("Error al conectar con la base de datos:", err);
      return res
        .status(500)
        .send({ alert: "Error al conectar con la base de datos" });
    }

    connection.query(query, [currentYear], (error, results) => {
      connection.release();

      if (error) {
        console.error("Error al ejecutar la consulta:", error);
        return res.status(500).send({ alert: "Error al ejecutar la consulta" });
      }

      const totalVentas = results[0].total_ventas || 0;
      res.json({ totalVentas });
    });
  });
}

// Método para obtener id_producto_carrito basado en id_carrito y id_producto
async function getIdProductoCarrito(req, res) {
  const { id_carrito, id_producto } = req.params;
  getConnection((err, connection) => {
    if (err) {
      return res
        .status(500)
        .send({ alert: "Error al conectar con la base de datos" });
    }
    connection.query(
      `SELECT id_producto_carrito FROM producto_carrito WHERE id_carrito = ? AND id_producto = ?`,
      [id_carrito, id_producto],
      (error, results) => {
        connection.release();
        if (error) {
          console.error("Error al consultar la base de datos:", error);
          return res
            .status(500)
            .send({ alert: "Error al consultar la base de datos" });
        }
        if (results.length > 0) {
          res.json({ id_producto_carrito: results[0].id_producto_carrito });
        } else {
          res
            .status(404)
            .send({ alert: "Producto no encontrado en el carrito" });
        }
      }
    );
  });
}

// Funcion para actualizar el estado del carrito a COMPLETADO + fecha completado
async function completarCarrito(req, res) {
  const { id_carrito } = req.params;
  getConnection((err, connection) => {
    if (err) {
      return res
        .status(500)
        .send({ alert: "Error al conectar con la base de datos" });
    }
    connection.query(
      `UPDATE carrito SET estado = 'COMPLETADO' WHERE id_carrito = ?`,
      [id_carrito],
      (error, results) => {
        connection.release();
        if (error) {
          console.error("Error al consultar la base de datos:", error);
          return res
            .status(500)
            .send({ alert: "Error al consultar la base de datos" });
        }
        res.json({ alert: "Carrito completado" });
        console.log("Carrito completado:", results);
      }
    );
  });
}

// Funcion que une put cantidad producto y completar carrito
async function putCantidadCompletarCarrito(req, res) {
  const { id_producto_carrito } = req.params;
  const { cantidad } = req.body;
  getConnection((err, connection) => {
    if (err) {
      return res
        .status(500)
        .send({ alert: "Error al conectar con la base de datos" });
    }
    connection.query(
      `UPDATE producto_carrito SET cantidad = ${cantidad} WHERE id_producto_carrito = ${id_producto_carrito}`,
      (error, results) => {
        if (error) {
          console.error("Error al consultar la base de datos:", error);
          return res
            .status(500)
            .send({ alert: "Error al consultar la base de datos" });
        }
        const id_carrito = results.insertId;
        connection.query(
          `UPDATE carrito SET estado = 'COMPLETADO' WHERE id_carrito = ${id_carrito}`,
          (error, results) => {
            connection.release();
            if (error) {
              console.error("Error al consultar la base de datos:", error);
              return res
                .status(500)
                .send({ alert: "Error al consultar la base de datos" });
            }
            res.json({ alert: "Cantidad actualizada y carrito completado" });
            console.log("Cantidad actualizada y carrito completado:", results);
          }
        );
      }
    );
  });
}

export const methods = {
  crearCarrito,
  getCarrito,
  deleteProductoCarrito,
  getCarritoCompletado,
  putCantidadProducto,
  getProductosMenosVendidos,
  getProductosMasVendidos,
  getTotalVentasAnio,
  getIdProductoCarrito,
  completarCarrito,
  putCantidadCompletarCarrito,
  getCarritoCompletadoNP,
};
