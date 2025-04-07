import React, { useState } from "react";
import "./Register.css";

const Register = () => {
    const [formData, setFormData] = useState({
        role: 'user',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        genre: "Homme",
        departement: "Mascara",
        participation: "Exposition uniquement",
        autreParticipation:''
    });

    const [photos, setPhotos] = useState([]);
    const [error, setError] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleFileChange = (e) => {
        setPhotos([...e.target.files]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // Create FormData object
        const formDataToSend = new FormData();
        
        // Append text fields
        Object.keys(formData).forEach(key => {
            formDataToSend.append(key, formData[key]);
        });

        // Append photos
        photos.forEach((photo, index) => {
            formDataToSend.append('photos', photo);
        });

        try {
            const response = await fetch('http://localhost:3003/api/users/new', {
                method: 'POST',
                body: formDataToSend,
                // No need to set Content-Type header, browser will set it automatically
            });

            // Log full response for debugging
            console.log('Full Response:', response);

            // Parse response text for more details
            const responseText = await response.text();
            console.log('Response Text:', responseText);

            // Try to parse the response as JSON
            let data;
            try {
                data = JSON.parse(responseText);
            } catch (parseError) {
                console.error('Failed to parse response:', parseError);
                setError(`Unexpected server response: ${responseText}`);
                return;
            }

            // Handle response
            if (response.ok) {
                if (data.success) {
                    // Show success modal instead of alert
                    setShowSuccessModal(true);
                    
                    // Reset form
                    setFormData({
                        role: 'user',
                        firstName: '',
                        lastName: '',
                        email: '',
                        password: '',
                        phone: '',
                        genre: "Homme",
                        departement: "Mascara",
                        participation: "Exposition uniquement",
                        autreParticipation: ''
                    });
                    setPhotos([]);
                } else {
                    setError(data.error || 'Registration failed');
                }
            } else {
                // Handle error responses
                setError(data.error || 'An unexpected error occurred');
            }
        } catch (error) {
            console.error('Full Error:', error);
            setError(error.message);
        }
    };

    // Function to close the modal
    const closeModal = () => {
        setShowSuccessModal(false);
    };

    return (
        <div className="register-page">
            <h2>Inscription</h2>
            
            {/* Success Modal */}
            {showSuccessModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Inscription réussie</h3>
                        </div>
                        <div className="modal-body">
                            <p>Votre compte a été créé avec succès!</p>
                            <p>Vous pouvez maintenant vous connecter avec vos identifiants.</p>
                        </div>
                        <div className="modal-footer">
                            <button onClick={closeModal} className="modal-button">Fermer</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Error message display */}
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="form-group">
                    <label htmlFor="role">Role:</label>
                    <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        required
                    >
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="firstName">Prénom :</label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="lastName">Nom de famille :</label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Adresse Email :</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Mot de passe :</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="phone">Numéro de téléphone :</label>
                    <input
                        type="text"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Entrez votre numéro de téléphone en précisant l'indicatif."
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="genre">Genre :</label>
                    <select
                        id="genre"
                        name="genre"
                        value={formData.genre}
                        onChange={handleChange}
                        required
                    >
                        <option value="Homme">Homme</option>
                        <option value="Femme">Femme</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="departement">Departement:</label>
                    <select
                        id="departement"
                        name="departement"
                        value={formData.departement}
                        onChange={handleChange}
                        required
                    >
                        <option value="Adrar">Adrar</option>
                        <option value="Chlef">Chlef</option>
                        <option value="Laghouat">Laghouat</option>
                        <option value="Oum El Bouaghi">Oum El Bouaghi</option>
                        <option value="Batna">Batna</option>
                        <option value="Béjaïa">Béjaïa</option>
                        <option value="Biskra">Biskra</option>
                        <option value="Béchar">Béchar</option>
                        <option value="Blida">Blida</option>
                        <option value="Bouira">Bouira</option>
                        <option value="Tamanrasset">Tamanrasset</option>
                        <option value="Tébessa">Tébessa</option>
                        <option value="Tlemcen">Tlemcen</option>
                        <option value="Tiaret">Tiaret</option>
                        <option value="Tizi Ouzou">Tizi Ouzou</option>
                        <option value="Alger">Alger</option>
                        <option value="Djelfa">Djelfa</option>
                        <option value="Jijel">Jijel</option>
                        <option value="Sétif">Sétif</option>
                        <option value="Saïda">Saïda</option>
                        <option value="Skikda">Skikda</option>
                        <option value="Sidi Bel Abbès">Sidi Bel Abbès</option>
                        <option value="Annaba">Annaba</option>
                        <option value="Guelma">Guelma</option>
                        <option value="Constantine">Constantine</option>
                        <option value="Médéa">Médéa</option>
                        <option value="Mostaganem">Mostaganem</option>
                        <option value="M'Sila">M'Sila</option>
                        <option value="Mascara">Mascara</option>
                        <option value="Ouargla">Ouargla</option>
                        <option value="Oran">Oran</option>
                        <option value="El Bayadh">El Bayadh</option>
                        <option value="Illizi">Illizi</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="participation">Participation :</label>
                    <select
                        id="participation"
                        name="participation"
                        value={formData.participation}
                        onChange={handleChange}
                        required
                    >
                        <option value="Exposition uniquement">Exposition uniquement</option>
                        <option value="Atelier uniquement">Atelier uniquement</option>
                        <option value="Atelier et exposition">Atelier et exposition</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="autreParticipation">Autre participation :</label>
                    <input
                        id="autreParticipation"
                        name="autreParticipation"
                        value={formData.autreParticipation}
                        onChange={handleChange}
                        placeholder="Décrivez ici vos éventuelles autres participations (optionnel)."
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="photos">Photos (optionnel) :</label>
                    <input
                        type="file"
                        id="photos"
                        name="photos"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                    {photos.length > 0 && (
                        <p>{photos.length} fichier(s) sélectionné(s)</p>
                    )}
                </div>
                
                <button type="submit">Inscription</button>
            </form>
        </div>
    );
}

export default Register;