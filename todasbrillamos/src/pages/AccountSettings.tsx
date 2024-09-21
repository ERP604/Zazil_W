import React, { useState, useEffect } from 'react';
import '../styles/accoutSettings.css';

const AccountSettings = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [profileImage, setProfileImage] = useState<File | null>(null);

  useEffect(() => {
    try {
      // Llamada API
      const fetchUserData = () => {
        setUser({
          name: 'Nombre del usuario',
          email: 'usuario@ejemplo.com',
          password: '********'
        });
      };
      
      fetchUserData();
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setProfileImage(e.target.files[0]);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="account-settings-container">
      <h2 className="title">Ajustes</h2>
      <div className="settings-content">
        <div className="image-section">
          <div className="profile-image">
            <img 
              src={profileImage ? URL.createObjectURL(profileImage) : ""} 
              alt="Profile" 
            />
          </div>
          <label htmlFor="profile-image-upload" className="change-image-btn">
            Cambiar Imagen
          </label>
          <input
            type="file"
            id="profile-image-upload"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />
        </div>

        <div className="form-section">
          <div className="input-group">
            <label>Nombre</label>
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleInputChange}
            />
          </div>
          <div className="input-group">
            <label>E-mail</label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="input-group">
            <label>Contraseña</label>
            <input
              type="password"
              name="password"
              value={user.password}
              onChange={handleInputChange}
            />
          </div>

          <div className="button-group">
            <button type="submit" className="edit-profile-btn">Editar Perfil</button>
            <button type="submit" className="save-changes-btn">Guardar Cambios</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
