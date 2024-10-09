import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Para navegar entre páginas
import SearchBar from '../components/SearchBar'; // Componente de barra de búsqueda
import Pagination from '../components/Pagination'; // Componente de paginación
import "./../styles/products.css"; // Importar estilos

const ProductsPage: React.FC = () => {
  const productsPerPage = 17; // Número de productos por página
  const [currentPage, setCurrentPage] = useState(1); // Estado para la página actual
  const [products, setProducts] = useState<any[]>([]); // Estado para almacenar los productos
  const [loading, setLoading] = useState(true); // Estado para indicar si los productos están cargando
  const [showModal, setShowModal] = useState(false); // Estado para controlar si el modal está visible
  const [productToDelete, setProductToDelete] = useState<any | null>(null); // Estado para el producto seleccionado para eliminar

  // useEffect para obtener los productos al cargar el componente
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/productos"); // Hacer una solicitud a la API
        const data = await response.json(); // Convertir la respuesta en JSON
        setProducts(data); // Guardar los productos en el estado
        setLoading(false); // Indicar que ya no se está cargando
      } catch (error) {
        console.error("Error al obtener los productos:", error); // Mostrar error si ocurre
        setLoading(false); // Finalizar el estado de carga en caso de error
      }
    };

    fetchProducts(); // Llamar a la función para obtener los productos
  }, []); // El array vacío significa que este efecto se ejecuta solo una vez al montar el componente

  const totalPages = Math.ceil(products.length / productsPerPage); // Calcular el número total de páginas

  // Calcular los índices de los productos a mostrar en la página actual
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct); // Obtener los productos para la página actual

  // Función para manejar el cambio de página
  const handlePageChange = (page: number) => {
    setCurrentPage(page); // Actualizar el estado de la página actual
  };

  // Función que se llama cuando el usuario quiere eliminar un producto
  const handleDeleteClick = (product: any) => {
    setProductToDelete(product); // Establecer el producto que se desea eliminar
    setShowModal(true); // Mostrar el modal de confirmación
  };

  // Función para confirmar la eliminación de un producto
  const confirmDelete = async () => {
    if (productToDelete) {
      try {
        const response = await fetch(`/api/productos/${productToDelete.id_producto}`, {
          method: 'DELETE', // Realizar la solicitud DELETE a la API
        });

        if (response.ok) {
          setProducts(products.filter(p => p.id_producto !== productToDelete.id_producto)); // Actualizar la lista de productos eliminando el seleccionado
          setShowModal(false); // Ocultar el modal de confirmación
        } else {
          console.error("Error al eliminar el producto:", await response.text()); // Mostrar mensaje de error si no se pudo eliminar
        }
      } catch (error) {
        console.error("Error en la solicitud de eliminación:", error); // Mostrar error en consola si ocurre algún fallo
      }
    }
  };

  // Función para cancelar la eliminación
  const cancelDelete = () => {
    setShowModal(false); // Ocultar el modal
    setProductToDelete(null); // Limpiar el producto seleccionado para eliminar
  };

  // Mostrar un mensaje de carga mientras se obtienen los productos
  if (loading) {
    return <p>Cargando productos...</p>;
  }

  return (
    <div className="products-page">
      <h1>Productos</h1> {/* Título de la página */}

      {/* Barra de búsqueda con filtros */}
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

      {/* Grid de productos */}
      <div className="products-grid">
        {/* Opción para añadir un producto nuevo */}
        <Link to="/addproductos">
          <div className="product-card add-product">
            <div className="add-icon">+</div> {/* Icono de agregar */}
            <p>Agregar Producto</p> {/* Texto para añadir producto */}
          </div>
        </Link>

        {/* Mapeo de los productos actuales a tarjetas individuales */}
        {currentProducts.map(product => (
          <div className="product-card" key={product.id_producto}>
            <img src={`/api/imagenes/${product.ruta_img}`} className="products" />
            <p>{product.nombre_producto}</p> {/* Nombre del producto */}
            <p>${product.precio.toFixed(2)}</p> {/* Precio del producto */}
            <div className="product-actions">
              {/* Botón para editar el producto, incluyendo el ID en la URL */}
              <Link to={`/editarproductos/${product.id_producto}`}>
                <button className="edit-btn">Editar</button>
              </Link>
              <button className="delete-btn" onClick={() => handleDeleteClick(product)}>Eliminar</button> {/* Botón para eliminar */}
            </div>
          </div>
        ))}
      </div>

      {/* Componente de paginación */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange} // Función para cambiar de página
      />

      {/* Modal de confirmación de eliminación */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>¿Estás seguro de que deseas eliminar este producto?</h2>
            <p>{productToDelete?.nombre_producto}</p> {/* Nombre del producto a eliminar */}
            <button onClick={confirmDelete}>Confirmar</button> {/* Botón para confirmar eliminación */}
            <button onClick={cancelDelete}>Cancelar</button> {/* Botón para cancelar eliminación */}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
