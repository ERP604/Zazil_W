import React, { useState } from 'react';
import { Link } from "react-router-dom";
import "../styles/editarProducto.css";

const EditarProducto: React.FC = () => {
  // Simulación de datos del producto
  const [productData, setProductData] = useState({
    nombre: 'Tenis Nike Deportivos',
    descripcion: 'Tenis cómodos y confortables para deportes.',
    precio: '$578.90',
    stock: 10,
    imagenPrincipal: 'url-de-imagen-principal.jpg',  // URL de la imagen cargada
    imagenesSecundarias: ['url-de-imagen-1.jpg', 'url-de-imagen-2.jpg'],
  });

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProductData({
      ...productData,
      [name]: value,
    });
  };

  const handleGuardarCambios = () => {
    // Lógica para guardar los cambios en la base de datos
    console.log('Producto actualizado:', productData);
  };

  const handleModificarImagenPrincipal = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProductData({
        ...productData,
        imagenPrincipal: URL.createObjectURL(file),
      });
    }
  };

  const handleModificarImagenSecundaria = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const nuevasImagenes = [...productData.imagenesSecundarias];
      nuevasImagenes[index] = URL.createObjectURL(file);
      setProductData({
        ...productData,
        imagenesSecundarias: nuevasImagenes,
      });
    }
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % productData.imagenesSecundarias.length);
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? productData.imagenesSecundarias.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="editar-producto">
      <h1>Editar Producto</h1>
      <div className="edit-product-container">
        {/* Sección de imágenes */}
        <div className="product-images">
          <div className="image-section">
            {/* Imagen Principal */}
            <img src={productData.imagenPrincipal} alt="Imagen principal del producto" className="main-image" />
            <div className="modify-buttons">
              <label htmlFor="main-image-upload">
                Modificar Imagen Principal
              </label>
              <input
                type="file"
                id="main-image-upload"
                accept="image/*"
                onChange={handleModificarImagenPrincipal}
                style={{ display: "none" }}
              />
            </div>
          </div>

          {/* Imágenes Adicionales con navegación */}
          <div className="additional-images">
            <div className="image-preview-card">
              {productData.imagenesSecundarias.length > 0 ? (
                <>
                  <img
                    src={productData.imagenesSecundarias[currentImageIndex]}
                    alt={`Imagen Adicional ${currentImageIndex + 1}`}
                    className="image-preview"
                  />
                  <div className="image-navigation">
                    <button onClick={handlePreviousImage}>←</button>
                    <button onClick={handleNextImage}>→</button>
                  </div>
                </>
              ) : (
                <div className="image-placeholder">Imágenes Adicionales</div>
              )}
            </div>

            {/* Botón para modificar la imagen adicional actual */}
            <div className="modify-buttons">
              <label htmlFor={`additional-image-upload-${currentImageIndex}`}>
                Modificar Imagen {currentImageIndex + 1}
              </label>
              <input
                type="file"
                id={`additional-image-upload-${currentImageIndex}`}
                accept="image/*"
                onChange={(e) => handleModificarImagenSecundaria(currentImageIndex, e)}
                style={{ display: "none" }}
              />
            </div>
          </div>
        </div>

        {/* Sección del formulario */}
        <div className="product-details">
          <div className="details">
            <label>Nombre del producto</label>
            <input
              type="text"
              name="nombre"
              value={productData.nombre}
              onChange={handleInputChange}
            />

            <label>Descripción</label>
            <textarea
              name="descripcion"
              value={productData.descripcion}
              onChange={handleInputChange}
            />

            <div className="price-stock">
              <div>
                <label>Precio</label>
                <input
                  type="text"
                  name="precio"
                  value={productData.precio}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label>Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={productData.stock}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="action-buttons">
        <Link to="/productos">
          <button className="atras-button">Página anterior</button>
        </Link>
        <button className="save-button" onClick={handleGuardarCambios}>Guardar Cambios</button>
      </div>
    </div>
  );
};

export default EditarProducto;
