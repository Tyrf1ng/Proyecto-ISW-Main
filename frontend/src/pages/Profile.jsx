import React, { useState } from 'react';
import useAuth from '../hooks/auth/useAuth'; // Importamos el hook

function Profile() {
    const { user, error, loading, updateUserProfile } = useAuth();
    const [updatedUser, setUpdatedUser] = useState({
        nombre: user?.nombre || '',
        apellido: user?.apellido || '',
        email: user?.email || '',
    });
    
    // Manejo de cambios en los campos del formulario
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedUser(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = () => {
        // Actualizamos el perfil con los nuevos datos
        updateUserProfile(updatedUser);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Perfil</h2>
            {error && <p>{error}</p>}

            <div>
                <label>Nombre</label>
                <input
                    type="text"
                    name="nombre"
                    value={updatedUser.nombre}
                    onChange={handleInputChange}
                />
            </div>

            <div>
                <label>Apellido</label>
                <input
                    type="text"
                    name="apellido"
                    value={updatedUser.apellido}
                    onChange={handleInputChange}
                />
            </div>

            <div>
                <label>Correo</label>
                <input
                    type="email"
                    name="email"
                    value={updatedUser.email}
                    onChange={handleInputChange}
                />
            </div>

            <button onClick={handleSubmit}>Guardar cambios</button>
        </div>
    );
}

export default Profile;
