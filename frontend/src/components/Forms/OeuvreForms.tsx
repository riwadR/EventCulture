import React, { useState, useEffect } from 'react';
// ICÔNES — On pioche dans plusieurs librairies pour que tout fonctionne !
import { HiCamera } from 'react-icons/hi';
import {
  MdBook as Book,
  MdMovie as Film,
  MdMusicNote as Music,
  MdNewspaper as Newspaper,
  MdPalette as Palette,
  MdEmojiEvents as Award
} from 'react-icons/md';
import {
  FiTrash2 as Trash2,
  FiAlertCircle as AlertCircle,
  FiCheckCircle as CheckCircle,
  FiLoader as Loader,
  FiPlus as Plus,
  FiSave as Save,
  FiX as X
} from 'react-icons/fi';

// Composant d'upload intégré
const FileUpload = ({
  onFileUploaded,
  placeholder,
}: { onFileUploaded?: (urls: string[]) => void; placeholder?: string }) => {
  const [files, setFiles] = useState<string[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      const newUrls = Array.from(selectedFiles).map(file => URL.createObjectURL(file));
      setFiles(prev => [...prev, ...newUrls]);
      onFileUploaded?.(newUrls);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      const newUrls = Array.from(droppedFiles).map(file => URL.createObjectURL(file));
      setFiles(prev => [...prev, ...newUrls]);
      onFileUploaded?.(newUrls);
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragOver ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300 hover:border-emerald-400 bg-gray-50'
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        <div className="space-y-4">
          <HiCamera size={32} className={isDragOver ? 'text-emerald-500 mx-auto' : 'text-gray-400 mx-auto'} />
          <div>
            <p className="text-sm font-medium text-gray-900">{placeholder || 'Cliquez ou glissez vos images ici'}</p>
            <p className="text-xs text-gray-500 mt-1">Formats acceptés • Max 5MB • Plusieurs fichiers</p>
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {files.map((url, index) => (
            <div key={index} className="relative group">
              <img src={url} alt={`Upload ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
              <button
                onClick={() => setFiles(prev => prev.filter((_, i) => i !== index))}
                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface OeuvreFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isEditing?: boolean;
}

// Types d'œuvres avec leurs icônes
const TYPES_OEUVRES = [
  { id: 1, nom: 'Livre', icon: Book, color: 'bg-blue-500' },
  { id: 2, nom: 'Film', icon: Film, color: 'bg-purple-500' },
  { id: 3, nom: 'Album Musical', icon: Music, color: 'bg-green-500' },
  { id: 4, nom: 'Article', icon: Newspaper, color: 'bg-yellow-500' },
  { id: 5, nom: "Œuvre d'Art", icon: Palette, color: 'bg-pink-500' },
  { id: 6, nom: 'Artisanat', icon: Award, color: 'bg-orange-500' }
];

// Langues disponibles 
const LANGUES = [
  { id: 3, nom: 'Arabe', code: 'ar' },
  { id: 1, nom: 'Tamazight', code: 'tm' },
  { id: 2, nom: 'Tifinagh', code: 'tif' },
  { id: 4, nom: 'Derja', code: 'de' },
  { id: 5, nom: 'Français', code: 'fr' },
  { id: 6, nom: 'Anglais', code: 'en' }
];

// Catégories principales
const CATEGORIES = [
  { id: 1, nom: 'Roman' },
  { id: 2, nom: 'Poésie' },
  { id: 3, nom: 'Bande dessinée' },
  { id: 4, nom: 'Essai' },
  { id: 5, nom: 'Histoire' },
  { id: 6, nom: 'Biographie' },
  { id: 7, nom: 'Peinture' },
  { id: 8, nom: 'Sculpture' },
  { id: 9, nom: 'Documentaire' },
  { id: 10, nom: 'Fiction' }
];

const OeuvreForm: React.FC<OeuvreFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isEditing = false
}) => {
  const [formData, setFormData] = useState({
    titre: '',
    id_type_oeuvre: '',
    id_langue: '',
    annee_creation: '',
    description: '',
    categories: [] as number[],
    tags: [] as string[],
    auteurs: [] as any[],
    details_specifiques: {} as any,
    images: [] as string[]
  });

  const [newTag, setNewTag] = useState('');
  const [newAuteur, setNewAuteur] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeSection, setActiveSection] = useState('general');

  // Charger les données initiales
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
        categories: initialData.categories || [],
        tags: initialData.tags || [],
        auteurs: initialData.auteurs || [],
        images: initialData.images || []
      }));
    }
  }, [initialData]);

  // Type d'œuvre sélectionné
  const selectedType = TYPES_OEUVRES.find(t => t.id.toString() === formData.id_type_oeuvre);

  // Validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.titre.trim()) {
      newErrors.titre = 'Le titre est obligatoire';
    }
    if (!formData.id_type_oeuvre) {
      newErrors.id_type_oeuvre = "Le type d'œuvre est obligatoire";
    }
    if (!formData.id_langue) {
      newErrors.id_langue = 'La langue est obligatoire';
    }
    if (formData.annee_creation) {
      const annee = parseInt(formData.annee_creation);
      const currentYear = new Date().getFullYear();
      if (isNaN(annee) || annee < 1000 || annee > currentYear + 10) {
        newErrors.annee_creation = 'Année invalide';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Gestion des champs
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Gestion des détails spécifiques
  const handleDetailChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      details_specifiques: {
        ...prev.details_specifiques,
        [field]: value
      }
    }));
  };

  // Ajouter un tag
  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      handleInputChange('tags', [...formData.tags, newTag.trim()]);
      setNewTag('');
    }
  };

  // Supprimer un tag
  const removeTag = (tagToRemove: string) => {
    handleInputChange('tags', formData.tags.filter(tag => tag !== tagToRemove));
  };

  // Ajouter un auteur
  const addAuteur = () => {
    if (newAuteur.trim()) {
      const nouvelAuteur = {
        nom: newAuteur.trim(),
        role: 'auteur',
        role_principal: formData.auteurs.length === 0
      };
      handleInputChange('auteurs', [...formData.auteurs, nouvelAuteur]);
      setNewAuteur('');
    }
  };

  // Supprimer un auteur
  const removeAuteur = (index: number) => {
    const nouveauxAuteurs = formData.auteurs.filter((_, i) => i !== index);
    handleInputChange('auteurs', nouveauxAuteurs);
  };

  // Gestion des catégories
  const toggleCategory = (categoryId: number) => {
    const isSelected = formData.categories.includes(categoryId);
    if (isSelected) {
      handleInputChange('categories', formData.categories.filter(id => id !== categoryId));
    } else {
      handleInputChange('categories', [...formData.categories, categoryId]);
    }
  };

  // Soumission du formulaire
  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Rendu des détails spécifiques selon le type
  const renderTypeSpecificFields = () => {
    switch (selectedType?.nom) {
      case 'Livre':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
              <Book size={20} />
              <span>Détails du livre</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ISBN</label>
                <input
                  type="text"
                  value={formData.details_specifiques.isbn || ''}
                  onChange={(e) => handleDetailChange('isbn', e.target.value)}
                  placeholder="978-3-16-148410-0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de pages</label>
                <input
                  type="number"
                  value={formData.details_specifiques.nb_pages || ''}
                  onChange={(e) => handleDetailChange('nb_pages', parseInt(e.target.value))}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Éditeur original</label>
                <input
                  type="text"
                  value={formData.details_specifiques.editeur_original || ''}
                  onChange={(e) => handleDetailChange('editeur_original', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Première édition</label>
                <input
                  type="date"
                  value={formData.details_specifiques.premiere_edition || ''}
                  onChange={(e) => handleDetailChange('premiere_edition', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>
          </div>
        );
      case 'Film':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
              <Film size={20} />
              <span>Détails du film</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Durée (minutes)</label>
                <input
                  type="number"
                  value={formData.details_specifiques.duree_minutes || ''}
                  onChange={(e) => handleDetailChange('duree_minutes', parseInt(e.target.value))}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Réalisateur</label>
                <input
                  type="text"
                  value={formData.details_specifiques.realisateur || ''}
                  onChange={(e) => handleDetailChange('realisateur', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Classification</label>
                <select
                  value={formData.details_specifiques.classification || ''}
                  onChange={(e) => handleDetailChange('classification', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">Sélectionner...</option>
                  <option value="G">Tout public</option>
                  <option value="PG">Accord parental souhaitable</option>
                  <option value="PG-13">Déconseillé aux moins de 13 ans</option>
                  <option value="R">Interdit aux moins de 17 ans</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="couleur"
                  checked={formData.details_specifiques.couleur || false}
                  onChange={(e) => handleDetailChange('couleur', e.target.checked)}
                  className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="couleur" className="text-sm text-gray-700">
                  Film en couleur
                </label>
              </div>
            </div>
          </div>
        );
      case 'Album Musical':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
              <Music size={20} />
              <span>Détails de l'album</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Durée totale (minutes)</label>
                <input
                  type="number"
                  value={formData.details_specifiques.duree || ''}
                  onChange={(e) => handleDetailChange('duree', parseInt(e.target.value))}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de pistes</label>
                <input
                  type="number"
                  value={formData.details_specifiques.nombre_pistes || ''}
                  onChange={(e) => handleDetailChange('nombre_pistes', parseInt(e.target.value))}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Label/Maison de disques</label>
                <input
                  type="text"
                  value={formData.details_specifiques.label || ''}
                  onChange={(e) => handleDetailChange('label', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Producteur</label>
                <input
                  type="text"
                  value={formData.details_specifiques.producteur || ''}
                  onChange={(e) => handleDetailChange('producteur', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditing ? "Modifier l'œuvre" : "Nouvelle œuvre"}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Navigation par sections */}
      <div className="px-6 py-3 border-b border-gray-200">
        <nav className="flex space-x-6">
          {[
            { id: 'general', name: 'Informations générales' },
            { id: 'details', name: 'Détails spécifiques' },
            { id: 'media', name: 'Médias' }
          ].map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`text-sm font-medium pb-2 border-b-2 transition-colors ${
                activeSection === section.id
                  ? 'text-emerald-600 border-emerald-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              {section.name}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-6">
        {/* Section Général */}
        {activeSection === 'general' && (
          <div className="space-y-6">
            {/* Titre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Titre de l'œuvre *
              </label>
              <input
                type="text"
                value={formData.titre}
                onChange={(e) => handleInputChange('titre', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-emerald-500 focus:border-emerald-500 ${
                  errors.titre ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Entrez le titre de l'œuvre..."
              />
              {errors.titre && (
                <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle size={14} />
                  <span>{errors.titre}</span>
                </p>
              )}
            </div>

            {/* Type et Langue */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type d'œuvre *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {TYPES_OEUVRES.map((type) => {
                    const Icon = type.icon;
                    const isSelected = formData.id_type_oeuvre === type.id.toString();
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => handleInputChange('id_type_oeuvre', type.id.toString())}
                        className={`p-3 border rounded-lg text-left transition-colors ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${type.color}`}>
                            <Icon size={16} className="text-white" />
                          </div>
                          <span className="text-sm font-medium">{type.nom}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
                {errors.id_type_oeuvre && (
                  <p className="mt-1 text-sm text-red-600">{errors.id_type_oeuvre}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Langue *
                </label>
                <select
                  value={formData.id_langue}
                  onChange={(e) => handleInputChange('id_langue', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-emerald-500 focus:border-emerald-500 ${
                    errors.id_langue ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Sélectionner une langue...</option>
                  {LANGUES.map((langue) => (
                    <option key={langue.id} value={langue.id}>
                      {langue.nom} ({langue.code})
                    </option>
                  ))}
                </select>
                {errors.id_langue && (
                  <p className="mt-1 text-sm text-red-600">{errors.id_langue}</p>
                )}
              </div>
            </div>

            {/* Année et Description */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Année de création
                </label>
                <input
                  type="number"
                  value={formData.annee_creation}
                  onChange={(e) => handleInputChange('annee_creation', e.target.value)}
                  min="1000"
                  max={new Date().getFullYear() + 10}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-emerald-500 focus:border-emerald-500 ${
                    errors.annee_creation ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="2024"
                />
                {errors.annee_creation && (
                  <p className="mt-1 text-sm text-red-600">{errors.annee_creation}</p>
                )}
              </div>

              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Décrivez l'œuvre, son contexte, son importance..."
                />
              </div>
            </div>

            {/* Catégories */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catégories
              </label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => toggleCategory(category.id)}
                    className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                      formData.categories.includes(category.id)
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {category.nom}
                  </button>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mots-clés
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center space-x-1 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="Ajouter un mot-clé..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Auteurs */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Auteurs/Contributeurs
              </label>
              {formData.auteurs.length > 0 && (
                <div className="space-y-2 mb-3">
                  {formData.auteurs.map((auteur, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <div>
                        <span className="font-medium">{auteur.nom}</span>
                        <span className="text-sm text-gray-500 ml-2">({auteur.role})</span>
                        {auteur.role_principal && (
                          <span className="ml-2 px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full">
                            Principal
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAuteur(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newAuteur}
                  onChange={(e) => setNewAuteur(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAuteur())}
                  placeholder="Nom de l'auteur..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={addAuteur}
                  className="px-3 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Section Détails spécifiques */}
        {activeSection === 'details' && (
          <div className="space-y-6">
            {selectedType ? (
              renderTypeSpecificFields()
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Veuillez d'abord sélectionner un type d'œuvre dans la section "Informations générales"</p>
              </div>
            )}
          </div>
        )}

        {/* Section Médias */}
        {activeSection === 'media' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Images et médias
              </h3>
              <FileUpload
                onFileUploaded={(urls) => handleInputChange('images', [...formData.images, ...urls])}
                placeholder="Ajoutez des images de l'œuvre"
              />

              {/* Images existantes */}
              {formData.images.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Images ajoutées ({formData.images.length})
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.images.map((imageUrl, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={imageUrl}
                          alt={`Image ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newImages = formData.images.filter((_, i) => i !== index);
                            handleInputChange('images', newImages);
                          }}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 mt-8">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Annuler
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <Loader size={16} className="animate-spin" />
                <span>Enregistrement...</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>{isEditing ? 'Mettre à jour' : "Créer l'œuvre"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OeuvreForm;
