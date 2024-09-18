import React, { useState } from "react";
import "./../styles/products.css";

const ProductsPage: React.FC = () => {
  // Datos de ejemplo, esto se reemplazará por datos de la base de datos
  //const [products, setProducts] = useState([
  const [products] = useState([
    // Ejemplo de productos iniciales
    { id: 1, name: "Tenis deportivos", price: 500.89, image: "path/to/tenis.jpg" },
    { id: 2, name: "Pantalón azul", price: 300.89, image: "path/to/pantalon.jpg" },
    { id: 3, name: "Camisa café", price: 340.39, image: "path/to/camisa.jpg" },
    { id: 4, name: "Converse", price: 500.89, image: "path/to/converse.jpg" },
    { id: 5, name: "Tenis deportivos", price: 500.89, image: "path/to/tenis.jpg" }
  ]);

  return (
    <div className="products-page">
      <div className="products-header">
        <h2>Productos</h2>
        <div className="products-search-filter">
          <input type="text" placeholder="🔍 Search ..." />
          <div className="filter-options">
            <label>Filtrar por:</label>
            <select>
              <option>Categoría</option>
              <option>Precio</option>
              <option>Prenda</option>
            </select>
          </div>
        </div>
      </div>

      <div className="products-grid">
        {/* Botón para agregar nuevo producto */}
        <div className="product-card add-product">
          <div className="add-icon">+</div>
          <p>Agregar Producto</p>
        </div>

        {/* Renderizando productos (ejemplo) */}
        {products.map(product => (
          <div className="product-card" key={product.id}>
            <img src={product.image} alt={product.name} className="product-image" />
            <p>{product.name}</p>
            <p>${product.price.toFixed(2)}</p>
            <div className="product-actions">
              <button className="edit-btn">Editar</button>
              <button className="delete-btn">Eliminar</button>
            </div>
          </div>
        ))}
      </div>

      {/* Barra de navegación entre subpáginas */}
      <div className="pagination">
        <button>Anterior</button>
        <div className="pages">
          <span className="page-number">1</span>
          <span className="page-number">2</span>
          <span className="page-number">3</span>
          <span className="page-number">4</span>
          <span className="page-number">5</span>
        </div>
        <button>Siguiente</button>
      </div>
    </div>
  );
};

export default ProductsPage;
