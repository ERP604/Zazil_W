import React, { useState } from 'react'; // Importa React y useState.
import { Link } from "react-router-dom"; // Importa Link para la navegación entre rutas.
import '../styles/addProduct.css'; // Importa los estilos del componente.

const AddProductPage: React.FC = () => {
  // Estado inicial del producto.
  const [product, setProduct] = useState({
    nombre_producto: '',
    descripcion: '',
    precio: '',
    stock: '',
    categoria: 'Nocturnas' // Valor por defecto.
  });

  const [mainImage, setMainImage] = useState<File | null>(null); // Estado para la imagen principal.
  const [error, setError] = useState(''); // Estado para manejar mensajes de error.
  const [success, setSuccess] = useState(''); // Estado para manejar mensajes de éxito.

  // Maneja cambios en los campos de entrada.
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: value // Actualiza el estado del producto.
    });
  };

  // Maneja la selección de la imagen principal.
  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setMainImage(e.target.files[0]); // Establece la imagen principal seleccionada.
    }
  };

  // Maneja el envío del formulario.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario.
    
    try {
      const formData = new FormData(); // Crea un nuevo objeto FormData.
      formData.append('nombre_producto', product.nombre_producto);
      formData.append('descripcion', product.descripcion);
      formData.append('precio', product.precio);
      formData.append('stock', product.stock);
      formData.append('categoria', product.categoria); // Añade la categoría.
      
      if (mainImage) {
        formData.append('mainImage', mainImage); // Añade la imagen principal.
      }
  
      const response = await fetch('/api/productos', {
        method: 'POST',
        body: formData // Envía los datos como FormData para manejar archivos.
      });
  
      const data = await response.json(); // Convierte la respuesta a JSON.
  
      if (response.ok) {
        setSuccess('Producto registrado exitosamente'); // Mensaje de éxito.
        setError(''); // Resetea el mensaje de error.
      } else {
        setError(data.alert || 'Error al registrar el producto'); // Establece un mensaje de error.
        setSuccess(''); // Resetea el mensaje de éxito.
      }
    } catch (error) {
      setError('Error al conectar con el servidor'); // Mensaje de error de conexión.
    }
  };

  return (
    <div className="add-product-page">
      <h2>Agregar Producto</h2>
      <div className="add-product-container">
        <div className="image-upload-section">
          <div className="image-preview-card">
            {mainImage ? (
              <img src={URL.createObjectURL(mainImage)} alt="Imagen Principal" className="image-preview" />
            ) : (
              <div className="image-placeholder">Imagen Principal</div> // Placeholder para la imagen.
            )}
          </div>

          <div className="image-upload-card small-button">
            <label htmlFor="main-image-upload">
              <p>Agregar Imagen Principal</p>
            </label>
            <input
              type="file"
              id="main-image-upload"
              accept="image/*"
              onChange={handleMainImageChange}
              style={{ display: "none" }} // Oculta el input de archivo.
            />
          </div>
        </div>

        <form className="product-info-section" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre del producto</label>
            <input
              type="text"
              name="nombre_producto"
              placeholder="Escribe el nombre del producto"
              value={product.nombre_producto}
              onChange={handleInputChange} // Maneja cambios en el campo.
              required // Campo requerido.
            />
          </div>

          <div className="form-group">
            <label>Descripción</label>
            <textarea
              name="descripcion"
              placeholder="Escribe una pequeña descripción del producto.."
              value={product.descripcion}
              onChange={handleInputChange} // Maneja cambios en el campo.
              required // Campo requerido.
            />
          </div>

          <div className="form-group-inline">
            <div className="form-group">
              <label>Precio</label>
              <input
                type="number"
                name="precio"
                placeholder="Precio"
                value={product.precio}
                onChange={handleInputChange} // Maneja cambios en el campo.
                required // Campo requerido.
              />
            </div>

            <div className="form-group">
              <label>Stock</label>
              <input
                type="number"
                name="stock"
                placeholder="Stock"
                value={product.stock}
                onChange={handleInputChange} // Maneja cambios en el campo.
                required // Campo requerido.
              />
            </div>
          </div>

          <div className="form-group">
            <label>Categoría</label>
            <select
              name="categoria"
              value={product.categoria}
              onChange={handleInputChange} // Maneja cambios en el campo.
              required // Campo requerido.
            >
              <option value="Nocturnas">Nocturnas</option>
              <option value="Teen">Teen</option>
              <option value="Regular">Regular</option>
              <option value="Promociones">Promociones</option>
            </select>
          </div>

          <div className="action-buttons">
            <Link to="/productos">
              <button className="atras-button">Página anterior</button> {/* Botón para regresar. */}
            </Link>
            <button type="submit" className="save-button">Guardar Cambios</button> {/* Botón para enviar el formulario. */}
          </div>

          {error && <div className="error-message">{error}</div>} {/* Mensaje de error. */}
          {success && <div className="success-message">{success}</div>} {/* Mensaje de éxito. */}
        </form>
      </div>
    </div>
  );
};

export default AddProductPage; // Exporta el componente para usarlo en otras partes de la aplicación.
