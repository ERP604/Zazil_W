import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom"; // Para navegar entre páginas
import SearchBar from '../components/SearchBar'; // Componente de barra de búsqueda
import Pagination from '../components/Pagination'; // Componente de paginación
import "./../styles/products.css"; // Importar estilos

interface Product {
  id_producto: number;
  nombre_producto: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria: string;
  ruta_img: string;
}

const ProductsPage: React.FC = () => {
  const productsPerPage = 17; // Número de productos por página
  const [currentPage, setCurrentPage] = useState(1); // Estado para la página actual
  const [products, setProducts] = useState<Product[]>([]); // Estado para almacenar los productos
  const [loading, setLoading] = useState(true); // Estado para indicar si los productos están cargando
  const [showModal, setShowModal] = useState(false); // Estado para controlar si el modal está visible
  const [productToDelete, setProductToDelete] = useState<Product | null>(null); // Estado para el producto seleccionado para eliminar

  // Estados para búsqueda y filtros
  const [searchQuery, setSearchQuery] = useState<string>(''); // Búsqueda
  const [selectedCategory, setSelectedCategory] = useState<string>(''); // Filtro de categoría
  const [priceOrder, setPriceOrder] = useState<string>(''); // Orden de precio: 'asc' o 'desc'

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

  // Función para manejar el cambio de página
  const handlePageChange = (page: number) => {
    setCurrentPage(page); // Actualizar el estado de la página actual
  };

  // Función que se llama cuando el usuario quiere eliminar un producto
  const handleDeleteClick = (product: Product) => {
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
          const errorMessage = await response.json();
          alert(`Error al eliminar el producto: ${errorMessage.alert}`); // Mostrar mensaje de error al usuario
          console.error("Error al eliminar el producto:", await response.text()); // Mostrar mensaje de error en consola
        }
      } catch (error) {
        console.error("Error en la solicitud de eliminación:", error); // Mostrar error en consola si ocurre algún fallo
        alert("Ocurrió un error al intentar eliminar el producto."); // Mostrar mensaje de error al usuario
      }
    }
  };

  // Función para cancelar la eliminación
  const cancelDelete = () => {
    setShowModal(false); // Ocultar el modal
    setProductToDelete(null); // Limpiar el producto seleccionado para eliminar
  };

  // Filtrar y ordenar los productos
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    // Filtrar por búsqueda
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.nombre_producto.toLowerCase().includes(query) ||
        product.descripcion.toLowerCase().includes(query)
      );
    }

    // Filtrar por categoría
    if (selectedCategory !== '') {
      filtered = filtered.filter(product => product.categoria === selectedCategory);
    }

    // Ordenar por precio
    if (priceOrder === 'asc') {
      filtered.sort((a, b) => a.precio - b.precio);
    } else if (priceOrder === 'desc') {
      filtered.sort((a, b) => b.precio - a.precio);
    }

    return filtered;
  }, [products, searchQuery, selectedCategory, priceOrder]);

  const totalPages = Math.ceil(filteredAndSortedProducts.length / productsPerPage); // Calcular el número total de páginas

  // Calcular los índices de los productos a mostrar en la página actual
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredAndSortedProducts.slice(indexOfFirstProduct, indexOfLastProduct); // Obtener los productos para la página actual

  // Obtener todas las categorías únicas para el filtro
  const categories = useMemo(() => {
    const cats = products.map(product => product.categoria);
    return Array.from(new Set(cats));
  }, [products]);

  // Funciones para manejar cambios en la búsqueda y filtros
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reiniciar a la primera página
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1); // Reiniciar a la primera página
  };

  const handlePriceOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPriceOrder(e.target.value);
    setCurrentPage(1); // Reiniciar a la primera página
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
        value={searchQuery}
        onChange={handleSearchChange}
        filters={
          <div className="filters">
            <label>Filtrar por Categoría:</label>
            <select value={selectedCategory} onChange={handleCategoryChange}>
              <option value="">Todas las Categorías</option>
              {categories.map((cat, index) => (
                <option key={index} value={cat}>{cat}</option>
              ))}
            </select>

            <label>Ordenar por Precio:</label>
            <select value={priceOrder} onChange={handlePriceOrderChange}>
              <option value="">Sin Ordenar</option>
              <option value="asc">Menor a Mayor</option>
              <option value="desc">Mayor a Menor</option>
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
            <img src={`/api/imagenes/${product.ruta_img}`} alt={product.nombre_producto} className="products" />
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
      {showModal && productToDelete && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>¿Estás seguro de que deseas eliminar este producto?</h2>
            <p>{productToDelete.nombre_producto}</p> {/* Nombre del producto a eliminar */}
            <button onClick={confirmDelete}>Confirmar</button> {/* Botón para confirmar eliminación */}
            <button onClick={cancelDelete}>Cancelar</button> {/* Botón para cancelar eliminación */}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
