import React, { useState } from "react";
import "../styles/addProduct.css";

const AddProductPage: React.FC = () => {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [additionalImages, setAdditionalImages] = useState<File[]>([]);

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setMainImage(e.target.files[0]);
    }
  };

  const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAdditionalImages([...additionalImages, ...Array.from(e.target.files)]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica para enviar el formulario
    console.log({ productName, description, price, stock, mainImage, additionalImages });
  };

  return (
    <div className="add-product-page">
      <h2>Agregar Producto</h2>
      <div className="add-product-container">
        <div className="image-upload-section">
          <div className="image-upload-card">
            <label htmlFor="main-image-upload">
              <div className="upload-placeholder">+</div>
              <p>Agregar Imagen Principal</p>
            </label>
            <input 
              type="file" 
              id="main-image-upload" 
              accept="image/*" 
              onChange={handleMainImageChange} 
              style={{ display: "none" }} 
            />
          </div>

          <div className="image-upload-card">
            <label htmlFor="additional-image-upload">
              <div className="upload-placeholder">+</div>
              <p>Agregar Imágenes</p>
            </label>
            <input 
              type="file" 
              id="additional-image-upload" 
              accept="image/*" 
              multiple 
              onChange={handleAdditionalImagesChange} 
              style={{ display: "none" }} 
            />
          </div>
        </div>

        <form className="product-info-section" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre del producto</label>
            <input 
              type="text" 
              placeholder="Escribe el nombre del producto" 
              value={productName} 
              onChange={(e) => setProductName(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group">
            <label>Descripción</label>
            <textarea 
              placeholder="Escribe una pequeña descripción del producto.." 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group-inline">
            <div className="form-group">
              <label>Precio</label>
              <input 
                type="number" 
                placeholder="Precio" 
                value={price} 
                onChange={(e) => setPrice(e.target.value)} 
                required 
              />
            </div>

            <div className="form-group">
              <label>Stock</label>
              <input 
                type="number" 
                placeholder="Stock" 
                value={stock} 
                onChange={(e) => setStock(e.target.value)} 
                required 
              />
            </div>
          </div>

          <button type="submit" className="save-button">Guardar Cambios</button>
        </form>
      </div>
    </div>
  );
};

export default AddProductPage;
