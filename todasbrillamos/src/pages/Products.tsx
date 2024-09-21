import React, { useState } from "react";
import { Link } from "react-router-dom";
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import "./../styles/products.css";

const ProductsPage: React.FC = () => {
  const productsPerPage = 3; // Define cuántos productos mostrar por página
  const [currentPage, setCurrentPage] = useState(1);

  // Datos de ejemplo, esto se reemplazará por datos de la base de datos
  const products = [
    { id: 1, name: "Tenis deportivos", price: 500.89, image: "path/to/tenis.jpg" },
    { id: 2, name: "Pantalón azul", price: 300.89, image: "path/to/pantalon.jpg" },
    { id: 3, name: "Camisa café", price: 340.39, image: "path/to/camisa.jpg" },
    { id: 4, name: "Converse", price: 500.89, image: "path/to/converse.jpg" },
    { id: 5, name: "Tenis deportivos", price: 500.89, image: "path/to/tenis.jpg" }
  ];

  // Calcula el número total de páginas
  const totalPages = Math.ceil(products.length / productsPerPage);

  // Obtener los productos que se van a mostrar en la página actual
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  // Función para cambiar de página
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="products-page">
      <h1>Productos</h1>
      
      {/* Barra de búsqueda */}
      <SearchBar 
        placeholder="Buscar..." 
        filters={
          <div>
            <label>Filtrar por:</label>
            <select>
              <option value="">Categoria</option>
              <option value="categoria1">Categoría 1</option>
              <option value="categoria2">Categoría 2</option>
            </select>
            <select>
              <option value="">Precio</option>
              <option value="precio1">Más costoso</option>
              <option value="precio2">Menos costoso</option>
            </select>
            <select>
              <option value="">Prenda</option>
              <option value="prenda1">Prenda 1</option>
              <option value="prenda2">Prenda 2</option>
            </select>
          </div>
        } 
      />

      <div className="products-grid">
        {/* Botón para agregar nuevo producto */}
        <Link to="/añadirproductos">
          <div className="product-card add-product">
            <div className="add-icon">+</div>
            <p>Agregar Producto</p>
          </div>
        </Link>

        {/* Renderizando productos de la página actual */}
        {currentProducts.map(product => (
          <div className="product-card" key={product.id}>
            <img src={product.image} alt={product.name} className="product-image" />
            <p>{product.name}</p>
            <p>${product.price.toFixed(2)}</p>
            <div className="product-actions">
              <Link to="/editarproductos">
                <button className="edit-btn">Editar</button>
              </Link>
              <button className="delete-btn">Eliminar</button>
            </div>
          </div>
        ))}
      </div>

      {/* Componente de Paginación */}
      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default ProductsPage;
