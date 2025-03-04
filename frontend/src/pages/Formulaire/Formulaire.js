import React, { useState } from 'react';
import './Formulaire.css';

const Formulaire = () => {
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        tel: '',
        sexe: '',
        wilaya: '',
        experience: '',
        parcours: '',
        motivation: '',
        photos: []
    });

    const [errors, setErrors] = useState({
        nom: '',
        prenom: '',
        email: '',
        tel: '',
        sexe: '',
        wilaya: '',
        experience: '',
        parcours: '',
        motivation: '',
        photos: ''
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFileChange = (event) => {
        const { name, files } = event.target;
        setFormData({
            ...formData,
            [name]: files
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const { nom, prenom, email, tel, sexe, wilaya, experience, parcours, motivation, photos } = formData;
        let newErrors = {
            nom: '',
            prenom: '',
            email: '',
            tel: '',
            sexe: '',
            wilaya: '',
            experience: '',
            parcours: '',
            motivation: '',
            photos: ''
        };

        if (!nom) {
            newErrors.nom = 'Veuillez saisir le nom du participant';
        }

        if (!prenom) {
            newErrors.prenom = 'Veuillez saisir le prénom du participant';
        }

        if (!sexe) {
            newErrors.sexe = 'Veuillez choisir le sexe du participant';
        }

        if (!wilaya) {
            newErrors.wilaya = 'Veuillez choisir le département (wilaya) du participant';
        }

        if (!experience) {
            newErrors.experience = 'Veuillez choisir si vous avez déjà une expérience dans le domaine de la protection du patrimoine';
        }

        if (!photos || photos.length < 3) {
            newErrors.photos = 'Veuillez télécharger au moins 3 photos';
        }

        if (Object.values(newErrors).some(err => err)) {
            setErrors(newErrors);
        } else {
            console.log('Nom:', nom);
            console.log('Prénom:', prenom);
            console.log('Email:', email);
            console.log('Numéro de téléphone:', tel);
            console.log('Sexe:', sexe);
            console.log('Wilaya:', wilaya);
            console.log('Avez-vous déjà une expérience dans le domaine de la protection du patrimoine ?', experience);
            console.log('Si oui, décrivez votre parcours:', parcours);
            console.log('Pourquoi souhaitez vous participer à cet évènement ?', motivation);
            console.log('Télécharger au moins 3 photos:', photos);
        }
    };

    return (
        <form className="formulaire" onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="nom">Nom</label>
                <input type="text" id="nom" name="nom" value={formData.nom} onChange={handleChange} />
                {errors.nom && <span className="error">{errors.nom}</span>}
            </div>
            <div className="form-group">
                <label htmlFor="prenom">Prénom</label>
                <input type="text" id="prenom" name="prenom" value={formData.prenom} onChange={handleChange} />
                {errors.prenom && <span className="error">{errors.prenom}</span>}
            </div>
            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
                {errors.email && <span className="error">{errors.email}</span>}
            </div>
            <div className="form-group">
                <label htmlFor="tel">Numéro de téléphone</label>
                <input type="tel" id="tel" name="tel" value={formData.tel} onChange={handleChange} />
                {errors.tel && <span className="error">{errors.tel}</span>}
            </div>
            <div className="form-group">
                <label>Sexe</label>
                <div>
                    <label>
                        <input type="radio" name="sexe" value="Homme" checked={formData.sexe === 'Homme'} onChange={handleChange} />
                        Homme
                    </label>
                    <label>
                        <input type="radio" name="sexe" value="Femme" checked={formData.sexe === 'Femme'} onChange={handleChange} />
                        Femme
                    </label>
                </div>
                {errors.sexe && <span className="error">{errors.sexe}</span>}
            </div>
            <div className="form-group">
                <label>Wilaya</label>
                <select name="wilaya" value={formData.wilaya} onChange={handleChange}>
                    <option value="">Choisir une wilaya</option>
                    <option value="01">Adrar</option>
                    <option value="02">Chlef</option>
                    <option value="03">Laghouat</option>
                    <option value="04">Oum El Bouaghi</option>
                    <option value="05">Batna</option>
                    <option value="06">Béjaïa</option>
                    <option value="07">Biskra</option>
                    <option value="08">Béchar</option>
                    <option value="09">Blida</option>
                    <option value="10">Bouira</option>
                    <option value="11">Tamanrasset</option>
                    <option value="12">Tébessa</option>
                    <option value="13">Tlemcen</option>
                    <option value="14">Tiaret</option>
                    <option value="15">Tizi Ouzou</option>
                </select>
                {errors.wilaya && <span className="error">{errors.wilaya}</span>}
            </div>
            <div className="form-group">
                <label>Avez-vous déjà une expérience dans le domaine de la protection du patrimoine ? </label>
                <div>
                    <label>
                        <input type="radio" name="participation" value="Exposition uniquement" checked={formData.participation === 'Exposition uniquement'} onChange={handleChange} />
                        Exposition uniquement
                    </label>
                    <label>
                        <input type="radio" name="participation" value="Atelier" checked={formData.participation === 'Atelier'} onChange={handleChange} />
                        Atelier
                    </label>
                    <label>
                        <input type="radio" name="participation" value="Atelier et exposition" checked={formData.participation === 'Atelier et exposition'} onChange={handleChange} />
                        Atelier et exposition
                    </label>
                    <label>
                        <input type="radio" name="participation" value="Autre" checked={formData.participation === 'Autre'} onChange={handleChange} />
                        Autre
                    </label>
                    {formData.participation === 'Autre' && (
                        <input type="text" name="autreParticipation" value={formData.autreParticipation} onChange={handleChange} />
                    )}
                </div>
                {errors.participation && <span className="error">{errors.participation}</span>}
            </div>
            <div className="form-group">
                <label htmlFor="parcours">Si oui, décrivez votre parcours</label>
                <textarea id="parcours" name="parcours" value={formData.parcours} onChange={handleChange} />
                {errors.parcours && <span className="error">{errors.parcours}</span>}
            </div>
            <div className="form-group">
                <label htmlFor="motivation">Pourquoi souhaitez vous participer à cet évènement ?</label>
                <textarea id="motivation" name="motivation" value={formData.motivation} onChange={handleChange} />
                {errors.motivation && <span className="error">{errors.motivation}</span>}
            </div>
            <div className="form-group">
                <label htmlFor="photos">Télécharger au moins 3 photos</label>
                <input type="file" id="photos" name="photos" multiple accept="image/*" onChange={handleFileChange} />
                {errors.photos && <span className="error">{errors.photos}</span>}
            </div>
            <button type="submit">Envoyer</button>
        </form>
    );
};

export default Formulaire;