import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import "../styles/editarProducto.css"; // Importación de los estilos.

const EditarProducto: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Obtener el ID de la URL.
  const [productData, setProductData] = useState({
    nombre_producto: '',
    descripcion: '',
    categoria: 'Nocturnas', // Valor por defecto.
    precio: '',
    stock: '',
    ruta_img: '', // Ruta de la imagen principal del producto.
  });
  const [mainImage, setMainImage] = useState<File | null>(null); // Estado para la imagen principal.
  const [error, setError] = useState(''); // Estado para mensajes de error.
  const [success, setSuccess] = useState(''); // Estado para mensajes de éxito.

  // Función para obtener los datos del producto desde el backend.
  const fetchProductData = async () => {
    try {
      const response = await fetch(`/api/productos/${id}`);
      const data = await response.json();
      setProductData({
        nombre_producto: data.nombre_producto,
        descripcion: data.descripcion,
        categoria: data.categoria,
        precio: data.precio,
        stock: data.stock,
        ruta_img: data.ruta_img,
      });
    } catch (error) {
      console.error('Error al obtener los datos del producto:', error);
    }
  };

  // Cargar los datos del producto cuando el componente se monte.
  useEffect(() => {
    fetchProductData();
  }, [id]);

  // Manejar cambios en los inputs de texto, textarea y select.
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProductData({
      ...productData,
      [name]: value,
    });
  };

  // Manejar la selección de la imagen principal.
  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setMainImage(e.target.files[0]);
    }
  };
  //Guardar la imagen en el servidor.
  const handleGuardarImagen = async () => {
    if (!mainImage) {
      setError('Selecciona una imagen para actualizar');
      return;
    }
  
    const formData = new FormData();
    formData.append('mainImage', mainImage); // Añade la imagen principal
  
    try {
      const response = await fetch(`/api/productos/${id}/img`, {
        method: 'PUT',
        body: formData,
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setSuccess('Imagen actualizada exitosamente');
        setError('');
      } else {
        setError(data.alert || 'Error al actualizar la imagen');
        setSuccess('');
      }
    } catch (error) {
      setError('Error al conectar con el servidor');
      setSuccess('');
    }
  };
  
  // Manejar el envío del formulario (actualización del producto).
  const handleGuardarCambios = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('nombre_producto', productData.nombre_producto);
      formData.append('descripcion', productData.descripcion);
      formData.append('precio', productData.precio);
      formData.append('stock', productData.stock);
      formData.append('categoria', productData.categoria);

      const response = await fetch(`/api/productos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData), // Enviar el email y la contraseña en el cuerpo de la solicitud
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Producto actualizado exitosamente'); // Mensaje de éxito.
        setError(''); // Limpia cualquier mensaje de error.
      } else {
        setError(data.alert || 'Error al actualizar el producto'); // Muestra el error recibido.
        setSuccess(''); // Limpia el mensaje de éxito.
      }
    } catch (error) {
      setError('Error al conectar con el servidor'); // Error genérico de conexión.
    }
  };

  return (
    <div className="editar-producto">
      <h2>Editar Producto</h2>
      <div className="edit-product-container">
        <div className="image-upload-section">
          <div className="image-preview-card">
            {mainImage ? (
              <img src={URL.createObjectURL(mainImage)} alt="Imagen Principal" className="image-preview" />
            ) : (
              <img src={`/api/imagenes/${productData.ruta_img}`} alt="Imagen actual del producto" className="image-preview" />
            )}
          </div>
          <div className="image-upload-card small-button">
            <label htmlFor="main-image-upload">
              <p>Modificar Imagen Principal</p>
            </label>
            <input
              type="file"
              id="main-image-upload"
              accept="image/*"
              onChange={handleMainImageChange}
              style={{ display: "none" }}
            />
          </div>
        </div>

        <form className="product-info-section" onSubmit={handleGuardarCambios}>
          <div className="form-group">
            <label>Nombre del producto</label>
            <input
              type="text"
              name="nombre_producto"
              value={productData.nombre_producto}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Descripción</label>
            <textarea
              name="descripcion"
              value={productData.descripcion}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group-inline">
            <div className="form-group">
              <label>Precio</label>
              <input
                type="number"
                name="precio"
                value={productData.precio}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Stock</label>
              <input
                type="number"
                name="stock"
                value={productData.stock}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Categoría</label>
            <select
              name="categoria"
              value={productData.categoria}
              onChange={handleInputChange}
              required
            >
              <option value="Nocturnas">Nocturnas</option>
              <option value="Teen">Teen</option>
              <option value="Regular">Regular</option>
              <option value="Promociones">Promociones</option>
            </select>
          </div>

          <div className="action-buttons">
            <Link to="/productos">
              <button className="atras-button">Página anterior</button>
            </Link>
            <button type="submit" className="save-button">Guardar Cambios</button>
            <button type="button" className="save-image-button" onClick={handleGuardarImagen}>
              Guardar Imagen
            </button>
          </div>



          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
        </form>
      </div>
    </div>
  );
};

export default EditarProducto;
