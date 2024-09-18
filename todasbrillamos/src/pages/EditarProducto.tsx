import React, { useState } from 'react';
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

  return (
    <div className="editar-producto">
      <h1>Editar Producto</h1>
      <div className="product-images">
        <img src={productData.imagenPrincipal} alt="Imagen principal del producto" className="main-image" />
        <div className="additional-images">
          {productData.imagenesSecundarias.map((img, index) => (
            <img key={index} src={img} alt={`Imagen ${index + 1}`} />
          ))}
        </div>
      </div>
      <div className="product-details">
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
      <div className="action-buttons">
        <button className="edit-button">Editar producto</button>
        <button className="save-button" onClick={handleGuardarCambios}>Guardar Cambios</button>
      </div>
    </div>
  );
};

export default EditarProducto;
