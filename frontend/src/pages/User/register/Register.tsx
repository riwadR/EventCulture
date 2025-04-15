import React, { useState, useEffect } from "react";
import "./Register.scss";
import { useNavigate } from 'react-router-dom';

interface FormData {
    role: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone: string;
    genre: string;
    departement: string;
    participation: string;
    autreParticipation: string;
}

interface ValidationErrors {
    [key: string]: string | string[] | null;
}

const Register: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<FormData>({
        role: 'user',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '', // Ajout de la confirmation du mot de passe
        phone: '',
        genre: "Homme",
        departement: "Mascara",
        participation: "Exposition uniquement",
        autreParticipation:''
    });

    const [photos, setPhotos] = useState<File[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
    const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

    // Règles de validation du mot de passe
    const passwordRules = {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true
    };

    // Fonction pour valider le mot de passe
    const validatePassword = (password: string): string[] => {
        const errors: string[] = [];
        
        if (password.length < passwordRules.minLength) {
            errors.push(`Le mot de passe doit contenir au moins ${passwordRules.minLength} caractères`);
        }
        
        if (passwordRules.requireUppercase && !/[A-Z]/.test(password)) {
            errors.push("Le mot de passe doit contenir au moins une lettre majuscule");
        }
        
        if (passwordRules.requireLowercase && !/[a-z]/.test(password)) {
            errors.push("Le mot de passe doit contenir au moins une lettre minuscule");
        }
        
        if (passwordRules.requireNumbers && !/[0-9]/.test(password)) {
            errors.push("Le mot de passe doit contenir au moins un chiffre");
        }
        
        if (passwordRules.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            errors.push("Le mot de passe doit contenir au moins un caractère spécial (!@#$%^&*(),.?\":{}|<>)");
        }
        
        return errors;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        
        // Effacer l'erreur spécifique lorsque l'utilisateur modifie un champ
        if (validationErrors[name]) {
            setValidationErrors({
                ...validationErrors,
                [name]: null
            });
        }
    };

    // Valider le formulaire avant soumission
    const validateForm = (): ValidationErrors => {
        const errors: ValidationErrors = {};
        
        // Valider l'email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            errors.email = "Veuillez entrer une adresse email valide";
        }
        
        // Valider le mot de passe
        const passwordErrors = validatePassword(formData.password);
        if (passwordErrors.length > 0) {
            errors.password = passwordErrors;
        }
        
        // Vérifier que les mots de passe correspondent
        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = "Les mots de passe ne correspondent pas";
        }
        
        // Valider le numéro de téléphone (format international recommandé)
        const phoneRegex = /^\+?[0-9]{10,15}$/;
        if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
            errors.phone = "Veuillez entrer un numéro de téléphone valide (format international recommandé: +XXX XXXXXXXXX)";
        }
        
        return errors;
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        if (e.target.files) {
            setPhotos(Array.from(e.target.files));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setError(null);
        
        // Valider le formulaire
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setValidationErrors(formErrors);
            // Trouver la première erreur pour l'afficher globalement
            const firstError = Object.values(formErrors).find(error => error);
            if (firstError) {
                setError(Array.isArray(firstError) ? firstError[0] || "Erreur de validation" : firstError);
            } else {
                setError("Erreur de validation du formulaire");
            }
            return;
        }
        
        // Réinitialiser les erreurs de validation
        setValidationErrors({});
    
        // Create FormData object
        const formDataToSend = new FormData();
        
        // Append text fields (exclure confirmPassword)
        Object.keys(formData).forEach(key => {
            if (key !== 'confirmPassword') {
                formDataToSend.append(key, formData[key as keyof FormData]);
            }
        });
    
        // Append photos
        photos.forEach((photo, index) => {
            formDataToSend.append('photos', photo);
        });
    
        try {
            console.log('Sending request to server...');
            
            const response = await fetch(process.env.REACT_APP_API_URL + '/users/new', {
                method: 'POST',
                body: formDataToSend,
            });
    
            console.log('Response received:', response.status, response.statusText);
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Server responded with status: ${response.status}`);
            }
    
            const responseText = await response.text();
            console.log('Response Text:', responseText);
    
            let data;
            try {
                data = JSON.parse(responseText);
            } catch (parseError) {
                console.error('Failed to parse response:', parseError);
                setError(`Unexpected server response format: ${responseText.substring(0, 100)}...`);
                return;
            }
    
            // Show success modal
            setShowSuccessModal(true);
            
            // Reset form
            setFormData({
                role: 'user',
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                confirmPassword: '',
                phone: '',
                genre: "Homme",
                departement: "Mascara",
                participation: "Exposition uniquement",
                autreParticipation: ''
            });
            setPhotos([]);
            
        } catch (error: any) {
            console.error('Error during form submission:', error);
            
            if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
                setError("Problème de connexion réseau. Votre inscription a peut-être été traitée, mais nous n'avons pas pu recevoir la confirmation.");
                
                setTimeout(async () => {
                    try {
                        const checkResponse = await fetch(process.env.REACT_APP_API_URL + '/users/check-email?email=' + formData.email);
                        const checkData = await checkResponse.json();
                        
                        if (checkData.exists) {
                            setShowSuccessModal(true);
                            setError(null);
                        }
                    } catch (e) {
                        console.error("Couldn't verify user creation:", e);
                    }
                }, 2000);
            } else {
                setError(`Erreur: ${error.message}`);
            }
        }
    };

    const closeModal = (): void => {
        setShowSuccessModal(false);
        navigate('/', { replace: true });
    };
    
    // Fonction helper pour afficher les erreurs de validation d'un champ
    const renderFieldError = (fieldName: string) => {
        if (!validationErrors[fieldName]) return null;
        
        if (Array.isArray(validationErrors[fieldName])) {
            return (
                <ul className="field-error-list">
                    {(validationErrors[fieldName] as string[]).map((err, index) => (
                        <li key={index}>{err}</li>
                    ))}
                </ul>
            );
        }
        
        return <p className="field-error">{validationErrors[fieldName] as string}</p>;
    };

    // Style pour les messages d'erreur des champs
    const errorFieldStyle = {
        border: '1px solid #ff4d4f'
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
                        style={validationErrors.email ? errorFieldStyle : {}}
                    />
                    {renderFieldError('email')}
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
                        style={validationErrors.password ? errorFieldStyle : {}}
                    />
                    {renderFieldError('password')}
                </div>
                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirmer le mot de passe :</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        style={validationErrors.confirmPassword ? errorFieldStyle : {}}
                    />
                    {renderFieldError('confirmPassword')}
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
                        style={validationErrors.phone ? errorFieldStyle : {}}
                    />
                    {renderFieldError('phone')}
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