import React, { useState } from 'react';
import { Link } from "react-router-dom"; // Para navegar a otra página
import "../styles/editarProducto.css"; // Importación de los estilos

const EditarProducto: React.FC = () => {
  // Simulación de datos iniciales del producto
  const [productData, setProductData] = useState({
    nombre: 'Tenis Nike Deportivos',
    descripcion: 'Tenis cómodos y confortables para deportes.',
    precio: '$578.90',
    stock: 10,
    imagenPrincipal: 'url-de-imagen-principal.jpg',  // URL de la imagen principal del producto
    imagenesSecundarias: ['url-de-imagen-1.jpg', 'url-de-imagen-2.jpg'], // URLs de las imágenes adicionales
  });

  const [currentImageIndex, setCurrentImageIndex] = useState(0); // Índice para navegar entre imágenes adicionales

  // Manejar cambios en los inputs de texto y textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target; // Obtener el nombre y el valor del input
    setProductData({
      ...productData,
      [name]: value, // Actualizar el estado del producto con los nuevos valores
    });
  };

  // Guardar los cambios (aquí se simula la lógica de guardado)
  const handleGuardarCambios = () => {
    console.log('Producto actualizado:', productData); // Mostrar los datos actualizados en la consola
  };

  // Manejar la modificación de la imagen principal
  const handleModificarImagenPrincipal = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]; // Obtener el archivo subido
      setProductData({
        ...productData,
        imagenPrincipal: URL.createObjectURL(file), // Actualizar la imagen principal con la URL del archivo
      });
    }
  };

  // Manejar la modificación de las imágenes adicionales
  const handleModificarImagenSecundaria = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]; // Obtener el archivo subido
      const nuevasImagenes = [...productData.imagenesSecundarias]; // Copiar el array de imágenes
      nuevasImagenes[index] = URL.createObjectURL(file); // Reemplazar la imagen seleccionada
      setProductData({
        ...productData,
        imagenesSecundarias: nuevasImagenes, // Actualizar las imágenes adicionales
      });
    }
  };

  // Navegar a la siguiente imagen adicional
  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % productData.imagenesSecundarias.length); // Cambiar al siguiente índice
  };

  // Navegar a la imagen anterior
  const handlePreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? productData.imagenesSecundarias.length - 1 : prevIndex - 1
    ); // Cambiar al índice anterior
  };

  return (
    <div className="editar-producto">
      <h1>Editar Producto</h1> {/* Título de la página */}

      <div className="edit-product-container">
        {/* Sección de Imágenes */}
        <div className="product-images">
          <div className="image-section">
            {/* Imagen Principal del Producto */}
            <img src={productData.imagenPrincipal} alt="Imagen principal del producto" className="main-image" />
            <div className="modify-buttons">
              <label htmlFor="main-image-upload">
                Modificar Imagen Principal
              </label>
              <input
                type="file"
                id="main-image-upload"
                accept="image/*"
                onChange={handleModificarImagenPrincipal} // Llamada al modificar la imagen principal
                style={{ display: "none" }}
              />
            </div>
          </div>

          {/* Imágenes Secundarias con Navegación */}
          <div className="additional-images">
            <div className="image-preview-card">
              {productData.imagenesSecundarias.length > 0 ? (
                <>
                  {/* Vista previa de la imagen adicional seleccionada */}
                  <img
                    src={productData.imagenesSecundarias[currentImageIndex]}
                    alt={`Imagen Adicional ${currentImageIndex + 1}`}
                    className="image-preview"
                  />
                  <div className="image-navigation">
                    <button onClick={handlePreviousImage}>←</button> {/* Botón para ir a la imagen anterior */}
                    <button onClick={handleNextImage}>→</button> {/* Botón para ir a la siguiente imagen */}
                  </div>
                </>
              ) : (
                <div className="image-placeholder">Imágenes Adicionales</div> // Placeholder si no hay imágenes
              )}
            </div>

            {/* Botón para modificar la imagen adicional seleccionada */}
            <div className="modify-buttons">
              <label htmlFor={`additional-image-upload-${currentImageIndex}`}>
                Modificar Imagen {currentImageIndex + 1}
              </label>
              <input
                type="file"
                id={`additional-image-upload-${currentImageIndex}`}
                accept="image/*"
                onChange={(e) => handleModificarImagenSecundaria(currentImageIndex, e)} // Cambiar la imagen adicional seleccionada
                style={{ display: "none" }}
              />
            </div>
          </div>
        </div>

        {/* Sección del Formulario */}
        <div className="product-details">
          <div className="details">
            <label>Nombre del producto</label>
            <input
              type="text"
              name="nombre"
              value={productData.nombre}
              onChange={handleInputChange} // Cambiar el nombre del producto
            />

            <label>Descripción</label>
            <textarea
              name="descripcion"
              value={productData.descripcion}
              onChange={handleInputChange} // Cambiar la descripción del producto
            />

            {/* Sección para el precio y stock */}
            <div className="price-stock">
              <div>
                <label>Precio</label>
                <input
                  type="text"
                  name="precio"
                  value={productData.precio}
                  onChange={handleInputChange} // Cambiar el precio del producto
                />
              </div>
              <div>
                <label>Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={productData.stock}
                  onChange={handleInputChange} // Cambiar el stock del producto
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="action-buttons">
        <Link to="/productos">
          <button className="atras-button">Página anterior</button> {/* Botón para volver a la página de productos */}
        </Link>
        <button className="save-button" onClick={handleGuardarCambios}>Guardar Cambios</button> {/* Botón para guardar cambios */}
      </div>
    </div>
  );
};

export default EditarProducto;
