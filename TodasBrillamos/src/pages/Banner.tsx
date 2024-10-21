import React, { useState, useEffect, useMemo } from "react";
import Pagination from "../components/Pagination";
import "./../styles/banner.css";

// Interfaz que define la estructura de un objeto Banner
interface Banner {
  id_banner: number;          // Identificador único del banner
  nombre_banner: string;      // Nombre del banner
  ruta_banner: string;        // Ruta de la imagen del banner
}

// Componente funcional Anuncio
const Anuncio: React.FC = () => {
  // Configuración de la paginación
  const bannersPerPage = 6; // Número de banners por página
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const [banners, setBanners] = useState<Banner[]>([]); // Lista de banners
  const [loading, setLoading] = useState(true); // Indicador de carga
  const [showModal, setShowModal] = useState(false); // Estado para mostrar el modal de confirmación de eliminación
  const [bannerToDelete, setBannerToDelete] = useState<Banner | null>(null); // Banner seleccionado para eliminación
  const [showPopup, setShowPopup] = useState(false); // Estado para mostrar el popup de agregar nuevo banner
  const [newBanner, setNewBanner] = useState<{ nombre_banner: string; ruta_banner: File | null }>({
    nombre_banner: "",
    ruta_banner: null,
  }); // Estado del nuevo banner a agregar

  // useEffect para obtener los banners al montar el componente
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch("/api/banners"); // Solicitud para obtener los banners
        const data = await response.json();
        setBanners(data);
        setLoading(false); // Finaliza la carga
      } catch (error) {
        console.error("Error al obtener los banners:", error);
        setLoading(false);
      }
    };

    fetchBanners(); // Ejecuta la función para obtener los banners
  }, []);

  // Maneja el cambio de página en la paginación
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Configura el modal para eliminar un banner seleccionado
  const handleDeleteClick = (banner: Banner) => {
    setBannerToDelete(banner);
    setShowModal(true);
  };

  // Confirma la eliminación del banner seleccionado
  const confirmDelete = async () => {
    if (bannerToDelete) {
      try {
        const response = await fetch(`/api/banners/${bannerToDelete.id_banner}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          // Elimina el banner de la lista local
          setBanners(banners.filter(b => b.id_banner !== bannerToDelete.id_banner));
          setShowModal(false);
        } else {
          const errorMessage = await response.json();
          alert(`Error al eliminar el banner: ${errorMessage.alert}`);
          console.error("Error al eliminar el banner:", await response.text());
        }
      } catch (error) {
        console.error("Error en la solicitud de eliminación:", error);
        alert("Ocurrió un error al intentar eliminar el banner.");
      }
    }
  };

  // Cancela la eliminación del banner
  const cancelDelete = () => {
    setShowModal(false);
    setBannerToDelete(null);
  };

  // Maneja la apertura y cierre del popup para agregar nuevo banner
  const handleOpenPopup = () => setShowPopup(true);
  const handleClosePopup = () => setShowPopup(false);

  // Maneja el cambio en los campos de entrada del nuevo banner
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewBanner(prevState => ({ ...prevState, [name]: value }));
  };

  // Maneja el cambio en el archivo de imagen del nuevo banner
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setNewBanner(prevState => ({ ...prevState, ruta_banner: files[0] }));
    }
  };

  // Maneja la adición de un nuevo banner
  const handleAddBanner = async () => {
    if (newBanner.nombre_banner && newBanner.ruta_banner) {
      const formData = new FormData();
      formData.append("nombre_banner", newBanner.nombre_banner);
      formData.append("ruta_banner", newBanner.ruta_banner);

      try {
        const response = await fetch("/api/banners", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const addedBanner = await response.json();
          setBanners([...banners, addedBanner]);
          setNewBanner({ nombre_banner: "", ruta_banner: null });
          handleClosePopup();
        } else {
          const errorMessage = await response.json();
          alert(`Error al agregar el banner: ${errorMessage.alert}`);
          console.error("Error al agregar el banner:", await response.text());
        }
      } catch (error) {
        console.error("Error en la solicitud de agregar:", error);
        alert("Ocurrió un error al intentar agregar el banner.");
      }
    }
  };

  // Calcula los banners que se deben mostrar en la página actual
  const displayedBanners = useMemo(() => {
    const indexOfLastBanner = currentPage * bannersPerPage;
    const indexOfFirstBanner = indexOfLastBanner - bannersPerPage;
    return banners.slice(indexOfFirstBanner, indexOfLastBanner);
  }, [banners, currentPage]);

  // Calcula el número total de páginas
  const totalPages = Math.ceil(banners.length / bannersPerPage);

  // Muestra un mensaje de carga mientras se obtienen los banners
  if (loading) {
    return <p>Cargando banners...</p>;
  }

  // Renderiza el componente
  return (
    <div className="banners-page">
      <h1>Anuncios</h1>
      <div className="banners-grid">
        <div className="banner-card add-banner" onClick={handleOpenPopup}>
          <div className="add-icon">+</div>
          <p>Agregar Banner</p>
        </div>

        {displayedBanners.map(banner => (
          <div className="banner-card" key={banner.id_banner}>
            <img src={`/api/banners/${banner.ruta_banner}`} alt={banner.nombre_banner} className="banner-image" />
            <p>{banner.nombre_banner}</p>
            <div className="banner-actions">
              <button className="delete-btn" onClick={() => handleDeleteClick(banner)}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {showModal && bannerToDelete && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>¿Estás seguro de que deseas eliminar este banner?</h2>
            <p>{bannerToDelete.nombre_banner}</p>
            <button onClick={confirmDelete}>Confirmar</button>
            <button onClick={cancelDelete}>Cancelar</button>
          </div>
        </div>
      )}

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>Agregar Nuevo Banner</h2>
            <label>
              Nombre:
              <input 
                type="text" 
                name="nombre_banner" 
                value={newBanner.nombre_banner} 
                onChange={handleInputChange} 
              />
            </label>
            <label>
              Imagen:
              <input 
                type="file" 
                name="ruta_banner" 
                accept="image/*" 
                onChange={handleFileChange} 
              />
            </label>
            <div className="popup-actions">
              <button className="add-btn" onClick={handleAddBanner}>Agregar</button>
              <button className="cancel-btn" onClick={handleClosePopup}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Anuncio;
