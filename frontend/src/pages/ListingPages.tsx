import React, { useState, useEffect } from 'react';
import { HiMusicNote } from 'react-icons/hi';
import {
  HiMagnifyingGlass,             // Search
  HiFunnel,                      // Filter
  HiSquares2X2,                  // Grid
  HiBars3,                       // List
  HiMapPin,                      // MapPin
  HiCalendar,                    // Calendar
  HiStar,                        // Star
  HiEye,                         // Eye
  HiHeart,                       // Heart
  HiChevronDown,                 // ChevronDown
  HiAdjustmentsHorizontal,       // SlidersHorizontal
  HiArrowsUpDown,                // ArrowUpDown
  HiBookOpen,                    // Book
  HiFilm,                        // Film
  HiMusicalNote,                 // Music
  HiCamera,                      // Camera
  HiTrophy,                      // Award
  HiUsers,                       // Users
  HiClock,                       // Clock
  HiBookmark,                    // Bookmark
  HiShare,                       // Share2
  HiArrowTopRightOnSquare,       // ExternalLink
  HiPlus,                        // Plus
  HiMap,                         // Map
  HiXMark                        // X
} from 'react-icons/hi2';


// =============================================================================
// TYPES
// =============================================================================

interface FilterState {
  search: string;
  type?: string;
  langue?: string;
  annee_min?: number;
  annee_max?: number;
  categories: string[];
  sort: string;
  order: 'ASC' | 'DESC';
  wilaya?: string;
  date_debut?: string;
  date_fin?: string;
  prix_max?: number;
  statut?: string;
}

// =============================================================================
// DONNÉES SIMULÉES
// =============================================================================

const typesOeuvres = [
  { id: 1, nom: 'Livre', icon: HiBookmark },
  { id: 2, nom: 'Film', icon: HiFilm },
  { id: 3, nom: 'Album Musical', icon: HiMusicNote },
  { id: 4, nom: 'Photographie', icon: HiCamera },
  { id: 5, nom: 'Artisanat', icon: HiTrophy }
];

const langues = [
  { id: 1, nom: 'Arabe', code: 'ar' },
  { id: 2, nom: 'Tamazight', code: 'ber' },
  { id: 3, nom: 'Français', code: 'fr' },
  { id: 4, nom: 'Anglais', code: 'en' }
];

const wilayas = [
  { id: 16, nom: 'Alger' },
  { id: 31, nom: 'Oran' },
  { id: 25, nom: 'Constantine' },
  { id: 6, nom: 'Béjaïa' },
  { id: 15, nom: 'Tizi Ouzou' }
];

const oeuvresData = [
  {
    id_oeuvre: 1,
    titre: "L'Étranger",
    description: "Roman philosophique d'Albert Camus explorant les thèmes de l'absurde et de l'aliénation.",
    annee_creation: 1942,
    statut: 'publie',
    TypeOeuvre: { nom_type: 'Livre' },
    Langue: { nom: 'Français' },
    Users: [{ nom: 'Camus', prenom: 'Albert' }],
    Categories: [{ nom: 'Roman' }, { nom: 'Philosophie' }],
    images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400'],
    note_moyenne: 4.8,
    nombre_vues: 2547,
    nombre_commentaires: 89
  },
  {
    id_oeuvre: 2,
    titre: "Nedjma",
    description: "Roman de Kateb Yacine, œuvre majeure de la littérature algérienne.",
    annee_creation: 1956,
    statut: 'publie',
    TypeOeuvre: { nom_type: 'Livre' },
    Langue: { nom: 'Français' },
    Users: [{ nom: 'Yacine', prenom: 'Kateb' }],
    Categories: [{ nom: 'Roman' }, { nom: 'Littérature algérienne' }],
    images: ['https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400'],
    note_moyenne: 4.6,
    nombre_vues: 1823,
    nombre_commentaires: 67
  },
  {
    id_oeuvre: 3,
    titre: "Tapis traditionnel de Ghardaïa",
    description: "Artisanat traditionnel du M'Zab aux motifs géométriques berbères.",
    annee_creation: 2024,
    statut: 'publie',
    TypeOeuvre: { nom_type: 'Artisanat' },
    Langue: { nom: 'Arabe' },
    Users: [{ nom: 'Bensalem', prenom: 'Fatima' }],
    Categories: [{ nom: 'Artisanat' }, { nom: 'Textile' }],
    images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400'],
    note_moyenne: 4.9,
    nombre_vues: 967,
    nombre_commentaires: 23
  }
];

const evenementsData = [
  {
    id_evenement: 1,
    nom_evenement: "Festival International du Film d'Alger",
    description: "15ème édition du festival célébrant le cinéma algérien et international.",
    date_debut: '2025-06-15T09:00:00',
    date_fin: '2025-06-22T22:00:00',
    image_url: 'https://images.unsplash.com/photo-1489599142821-bed30d3ddd6c?w=400',
    TypeEvenement: { nom_type: 'Festival' },
    Lieu: { nom: 'Palais de la Culture', Wilaya: { nom: 'Alger' } },
    User: { nom: 'Benali', prenom: 'Rachid' },
    nombre_participants: 156,
    tarif: 0,
    statut: 'confirme'
  },
  {
    id_evenement: 2,
    nom_evenement: "Concert de Musique Andalouse",
    description: "Soirée dédiée à la musique andalouse avec l'orchestre de Constantine.",
    date_debut: '2025-06-08T20:00:00',
    date_fin: '2025-06-08T23:00:00',
    image_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
    TypeEvenement: { nom_type: 'Concert' },
    Lieu: { nom: 'Théâtre Régional', Wilaya: { nom: 'Constantine' } },
    User: { nom: 'Boutaiba', prenom: 'Mohamed' },
    nombre_participants: 234,
    tarif: 1200,
    statut: 'confirme'
  }
];

const lieuxData = [
  {
    id_lieu: 1,
    nom: "Casbah d'Alger",
    adresse: "Vieille ville d'Alger",
    latitude: 36.7853,
    longitude: 3.0586,
    typePatrimoine: 'monument' as const,
    Wilaya: { nom: 'Alger' },
    DetailLieu: { 
      description: "Site du patrimoine mondial de l'UNESCO, cœur historique d'Alger.",
      noteMoyenne: 4.7,
      periode_historique: 'Période ottomane'
    },
    imagePrincipale: 'https://images.unsplash.com/photo-1539650116574-75c0c6d1d3b8?w=400',
    nombreImages: 47
  },
  {
    id_lieu: 2,
    nom: "Timgad",
    adresse: "Batna",
    latitude: 35.4842,
    longitude: 6.4669,
    typePatrimoine: 'vestige' as const,
    Wilaya: { nom: 'Batna' },
    DetailLieu: { 
      description: "Ancienne ville romaine remarquablement conservée.",
      noteMoyenne: 4.9,
      periode_historique: 'Période romaine'
    },
    imagePrincipale: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
    nombreImages: 123
  }
];

// =============================================================================
// COMPOSANTS DE CARDS INTÉGRÉS
// =============================================================================

const OeuvreCard = ({ oeuvre, onClick, compact = false }: any) => {
  const [isFavorite, setIsFavorite] = useState(false);
  
  const getTypeIcon = (type?: string) => {
    switch (type?.toLowerCase()) {
      case 'livre': return HiBookmark;
      case 'film': return HiFilm;
      case 'album musical': return HiMusicNote;
      case 'photographie': return HiCamera;
      case 'artisanat': return HiTrophy;
      default: return HiBookmark;
    }
  };

  const TypeIcon = getTypeIcon(oeuvre.TypeOeuvre?.nom_type);
  const auteurs = oeuvre.Users?.map((u: any) => `${u.prenom} ${u.nom}`).join(', ') || 'Auteur inconnu';
  const imageUrl = oeuvre.images?.[0] || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400';

  if (compact) {
    return (
      <div 
        className="flex items-center space-x-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-emerald-300 hover:shadow-md transition-all duration-200 cursor-pointer"
        onClick={onClick}
      >
        <img src={imageUrl} alt={oeuvre.titre} className="w-16 h-20 object-cover rounded" />
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{oeuvre.titre}</h3>
          <p className="text-sm text-emerald-600 truncate">{auteurs}</p>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{oeuvre.description}</p>
          
          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <TypeIcon size={12} />
              <span>{oeuvre.TypeOeuvre?.nom_type}</span>
            </div>
            {oeuvre.annee_creation && <span>{oeuvre.annee_creation}</span>}
            {oeuvre.note_moyenne && (
              <div className="flex items-center space-x-1">
                <HiStar size={12} className="text-yellow-400 fill-current" />
                <span>{oeuvre.note_moyenne}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center space-y-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsFavorite(!isFavorite);
            }}
            className={`p-2 rounded-full transition-colors ${
              isFavorite ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-400 hover:text-red-500'
            }`}
          >
            <HiHeart size={16} />
          </button>
          {oeuvre.nombre_vues && (
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <HiEye size={12} />
              <span>{oeuvre.nombre_vues}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 group">
      <div className="relative aspect-video bg-gray-100">
        <img 
          src={imageUrl} 
          alt={oeuvre.titre}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
          onClick={onClick}
        />
        
        <div className="absolute top-2 left-2">
          <div className="flex items-center space-x-1 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium">
            <TypeIcon size={12} />
            <span>{oeuvre.TypeOeuvre?.nom_type}</span>
          </div>
        </div>

        <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsFavorite(!isFavorite);
            }}
            className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
              isFavorite ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-600 hover:bg-white'
            }`}
          >
            <HiHeart size={14} />
          </button>
        </div>
      </div>

      <div className="p-4" onClick={onClick}>
        <div className="cursor-pointer">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">{oeuvre.titre}</h3>
          <p className="text-sm text-emerald-600 mb-2">{auteurs}</p>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{oeuvre.description}</p>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-4">
              {oeuvre.annee_creation && <span>{oeuvre.annee_creation}</span>}
              {oeuvre.Langue && <span>{oeuvre.Langue.nom}</span>}
            </div>
            
            <div className="flex items-center space-x-3">
              {oeuvre.note_moyenne && (
                <div className="flex items-center space-x-1">
                  <HiStar size={12} className="text-yellow-400 fill-current" />
                  <span>{oeuvre.note_moyenne}</span>
                </div>
              )}
              {oeuvre.nombre_vues && (
                <div className="flex items-center space-x-1">
                  <HiEye size={12} />
                  <span>{oeuvre.nombre_vues}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EvenementCard = ({ evenement, onClick, compact = false }: any) => {
  const [isInterested, setIsInterested] = useState(false);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
  };

  const formatTime = (dateStr?: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const isUpcoming = evenement.date_debut ? new Date(evenement.date_debut) > new Date() : false;
  const isPast = evenement.date_fin ? new Date(evenement.date_fin) < new Date() : false;

  const imageUrl = evenement.image_url || 'https://images.unsplash.com/photo-1489599142821-bed30d3ddd6c?w=400';
  const lieu = evenement.Lieu ? `${evenement.Lieu.nom}, ${evenement.Lieu.Wilaya?.nom}` : 'Lieu à définir';

  if (compact) {
    return (
      <div 
        className="flex items-center space-x-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-emerald-300 hover:shadow-md transition-all duration-200 cursor-pointer"
        onClick={onClick}
      >
        <div className={`w-16 h-16 rounded-lg flex flex-col items-center justify-center text-white text-xs font-medium ${
          isUpcoming ? 'bg-emerald-500' : isPast ? 'bg-gray-400' : 'bg-blue-500'
        }`}>
          {evenement.date_debut && (
            <>
              <span className="text-lg font-bold">{new Date(evenement.date_debut).getDate()}</span>
              <span>{formatDate(evenement.date_debut).split(' ')[1]}</span>
            </>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{evenement.nom_evenement}</h3>
          <p className="text-sm text-gray-600 truncate">{lieu}</p>
          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <HiClock size={12} />
              <span>{formatTime(evenement.date_debut)}</span>
            </div>
            {evenement.tarif === 0 ? (
              <span className="text-green-600 font-medium">Gratuit</span>
            ) : (
              <span>{evenement.tarif} DZD</span>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center space-y-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsInterested(!isInterested);
            }}
            className={`p-2 rounded-full transition-colors ${
              isInterested ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400 hover:text-emerald-500'
            }`}
          >
            <HiStar size={16} />
          </button>
          {evenement.nombre_participants && (
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <HiUsers size={12} />
              <span>{evenement.nombre_participants}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 group">
      <div className="relative aspect-video bg-gray-100">
        <img 
          src={imageUrl} 
          alt={evenement.nom_evenement}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
          onClick={onClick}
        />
        
        <div className="absolute top-2 left-2">
          <div className={`px-3 py-2 rounded-lg text-white font-medium text-sm ${
            isUpcoming ? 'bg-emerald-500' : isPast ? 'bg-gray-500' : 'bg-blue-500'
          }`}>
            {evenement.date_debut && formatDate(evenement.date_debut)}
          </div>
        </div>

        <div className="absolute bottom-2 right-2">
          {evenement.tarif === 0 ? (
            <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">Gratuit</span>
          ) : (
            <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full">{evenement.tarif} DZD</span>
          )}
        </div>
      </div>

      <div className="p-4" onClick={onClick}>
        <div className="cursor-pointer">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{evenement.nom_evenement}</h3>
          
          <div className="space-y-2 text-sm text-gray-600 mb-3">
            <div className="flex items-center space-x-2">
              <HiMapPin size={14} className="text-gray-400" />
              <span className="truncate">{lieu}</span>
            </div>
            
            {evenement.date_debut && (
              <div className="flex items-center space-x-2">
                <HiClock size={14} className="text-gray-400" />
                <span>{formatTime(evenement.date_debut)}</span>
              </div>
            )}
            
            {evenement.nombre_participants !== undefined && (
              <div className="flex items-center space-x-2">
                <HiUsers size={14} className="text-gray-400" />
                <span>{evenement.nombre_participants} participants</span>
              </div>
            )}
          </div>

          {evenement.description && (
            <p className="text-sm text-gray-600 line-clamp-2">{evenement.description}</p>
          )}
        </div>
      </div>
    </div>
  );
};

const LieuCard = ({ lieu, onClick, compact = false }: any) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const getPatrimoineIcon = (type?: string) => {
    switch (type) {
      case 'monument': return HiTrophy;
      case 'vestige': return HiCamera;
      default: return HiMapPin;
    }
  };

  const PatrimoineIcon = getPatrimoineIcon(lieu.typePatrimoine);
  const imageUrl = lieu.imagePrincipale || 'https://images.unsplash.com/photo-1539650116574-75c0c6d1d3b8?w=400';

  if (compact) {
    return (
      <div 
        className="flex items-center space-x-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-emerald-300 hover:shadow-md transition-all duration-200 cursor-pointer"
        onClick={onClick}
      >
        <img src={imageUrl} alt={lieu.nom} className="w-16 h-16 object-cover rounded-lg" />
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{lieu.nom}</h3>
          <p className="text-sm text-gray-600 truncate">{lieu.Wilaya?.nom}</p>
          {lieu.DetailLieu?.description && (
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{lieu.DetailLieu.description}</p>
          )}
          
          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <PatrimoineIcon size={12} />
              <span className="capitalize">{lieu.typePatrimoine || 'site'}</span>
            </div>
            {lieu.DetailLieu?.periode_historique && <span>{lieu.DetailLieu.periode_historique}</span>}
          </div>
        </div>

        <div className="flex flex-col items-center space-y-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsBookmarked(!isBookmarked);
            }}
            className={`p-2 rounded-full transition-colors ${
              isBookmarked ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400 hover:text-blue-500'
            }`}
          >
            <HiBookmark size={16} />
          </button>
          {lieu.DetailLieu?.noteMoyenne && (
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <HiStar size={12} className="text-yellow-400 fill-current" />
              <span>{lieu.DetailLieu.noteMoyenne}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 group">
      <div className="relative aspect-video bg-gray-100">
        <img 
          src={imageUrl} 
          alt={lieu.nom}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
          onClick={onClick}
        />
        
        <div className="absolute top-2 left-2">
          <div className="flex items-center space-x-1 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium">
            <PatrimoineIcon size={12} />
            <span className="capitalize">{lieu.typePatrimoine || 'site'}</span>
          </div>
        </div>

        {lieu.nombreImages && lieu.nombreImages > 1 && (
          <div className="absolute bottom-2 right-2">
            <div className="flex items-center space-x-1 px-2 py-1 bg-black/50 text-white text-xs rounded-full">
              <HiCamera size={12} />
              <span>{lieu.nombreImages}</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4" onClick={onClick}>
        <div className="cursor-pointer">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">{lieu.nom}</h3>

          <div className="flex items-center space-x-1 text-sm text-gray-600 mb-2">
            <HiMapPin size={14} className="text-gray-400" />
            <span>{lieu.Wilaya?.nom}</span>
          </div>

          {lieu.DetailLieu?.description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{lieu.DetailLieu.description}</p>
          )}

          <div className="flex items-center justify-between text-xs text-gray-500">
            <div>
              {lieu.DetailLieu?.periode_historique && <span>{lieu.DetailLieu.periode_historique}</span>}
            </div>
            
            <div className="flex items-center space-x-3">
              {lieu.DetailLieu?.noteMoyenne && lieu.DetailLieu.noteMoyenne > 0 && (
                <div className="flex items-center space-x-1">
                  <HiStar size={12} className="text-yellow-400 fill-current" />
                  <span>{lieu.DetailLieu.noteMoyenne}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// COMPOSANT DE FILTRES
// =============================================================================

const FilterPanel: React.FC<{
  type: 'oeuvres' | 'evenements' | 'lieux';
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  isOpen: boolean;
  onClose: () => void;
}> = ({ type, filters, onFiltersChange, isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Filtres</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <HiXMark size={20} />
        </button>
      </div>

      {type === 'oeuvres' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type d'œuvre</label>
            <select
              value={filters.type || ''}
              onChange={(e) => handleFilterChange('type', e.target.value || undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">Tous les types</option>
              {typesOeuvres.map((type) => (
                <option key={type.id} value={type.nom}>{type.nom}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Langue</label>
            <select
              value={filters.langue || ''}
              onChange={(e) => handleFilterChange('langue', e.target.value || undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">Toutes les langues</option>
              {langues.map((langue) => (
                <option key={langue.id} value={langue.nom}>{langue.nom}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Période</label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                placeholder="Année min"
                value={filters.annee_min || ''}
                onChange={(e) => handleFilterChange('annee_min', e.target.value ? parseInt(e.target.value) : undefined)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              <input
                type="number"
                placeholder="Année max"
                value={filters.annee_max || ''}
                onChange={(e) => handleFilterChange('annee_max', e.target.value ? parseInt(e.target.value) : undefined)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>
        </>
      )}

      {type === 'evenements' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Wilaya</label>
            <select
              value={filters.wilaya || ''}
              onChange={(e) => handleFilterChange('wilaya', e.target.value || undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">Toutes les wilayas</option>
              {wilayas.map((wilaya) => (
                <option key={wilaya.id} value={wilaya.nom}>{wilaya.nom}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Période</label>
            <div className="space-y-3">
              <input
                type="date"
                value={filters.date_debut || ''}
                onChange={(e) => handleFilterChange('date_debut', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              <input
                type="date"
                value={filters.date_fin || ''}
                onChange={(e) => handleFilterChange('date_fin', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Prix maximum (DZD)</label>
            <input
              type="number"
              placeholder="Prix max"
              value={filters.prix_max || ''}
              onChange={(e) => handleFilterChange('prix_max', e.target.value ? parseInt(e.target.value) : undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </>
      )}

      {type === 'lieux' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Wilaya</label>
            <select
              value={filters.wilaya || ''}
              onChange={(e) => handleFilterChange('wilaya', e.target.value || undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">Toutes les wilayas</option>
              {wilayas.map((wilaya) => (
                <option key={wilaya.id} value={wilaya.nom}>{wilaya.nom}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type de patrimoine</label>
            <select
              value={filters.type || ''}
              onChange={(e) => handleFilterChange('type', e.target.value || undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">Tous les types</option>
              <option value="monument">Monuments</option>
              <option value="vestige">Vestiges</option>
              <option value="site_culturel">Sites culturels</option>
            </select>
          </div>
        </>
      )}

      <div className="pt-4 border-t border-gray-200">
        <button
          onClick={() => onFiltersChange({
            search: '',
            categories: [],
            sort: 'date_creation',
            order: 'DESC'
          })}
          className="w-full px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Réinitialiser les filtres
        </button>
      </div>
    </div>
  );
};

// =============================================================================
// COMPOSANT PAGE LISTING GÉNÉRIQUE
// =============================================================================

interface ListingPageProps {
  type: 'oeuvres' | 'evenements' | 'lieux';
  title: string;
  description: string;
  data: any[];
  showCreateButton?: boolean;
}

const ListingPage: React.FC<ListingPageProps> = ({ 
  type, 
  title, 
  description, 
  data, 
  showCreateButton = true 
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    categories: [],
    sort: 'date_creation',
    order: 'DESC'
  });

  // Filtrage et tri des données
  const filteredData = data.filter(item => {
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const title = type === 'oeuvres' ? item.titre : 
                   type === 'evenements' ? item.nom_evenement : item.nom;
      if (!title.toLowerCase().includes(searchTerm)) return false;
    }
    // Ajouter d'autres filtres selon le type
    return true;
  });

  const sortOptions = [
    { value: 'date_creation', label: 'Plus récent' },
    { value: 'titre', label: 'Alphabétique' },
    { value: 'note_moyenne', label: 'Mieux noté' },
    { value: 'nombre_vues', label: 'Plus consulté' }
  ];

  const renderCard = (item: any) => {
    const onClick = () => {
      const baseUrl = type === 'oeuvres' ? '/oeuvres' : 
                     type === 'evenements' ? '/evenements' : '/patrimoine';
      const id = type === 'oeuvres' ? item.id_oeuvre : 
                type === 'evenements' ? item.id_evenement : item.id_lieu;
      window.location.href = `${baseUrl}/${id}`;
    };

    if (type === 'oeuvres') {
      return <OeuvreCard key={item.id_oeuvre} oeuvre={item} onClick={onClick} compact={viewMode === 'list'} />;
    } else if (type === 'evenements') {
      return <EvenementCard key={item.id_evenement} evenement={item} onClick={onClick} compact={viewMode === 'list'} />;
    } else {
      return <LieuCard key={item.id_lieu} lieu={item} onClick={onClick} compact={viewMode === 'list'} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
              <p className="text-gray-600 mt-2">{description}</p>
            </div>
            {showCreateButton && (
              <button 
                onClick={() => window.location.href = `/${type}/nouveau`}
                className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <HiPlus size={16} />
                <span>Ajouter</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Barre de recherche et filtres */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            
            {/* Recherche */}
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <HiMagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  placeholder={`Rechercher ${type}...`}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-4">
              
              {/* Tri */}
              <select
                value={filters.sort}
                onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>

              {/* Filtres */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 px-4 py-2 border rounded-lg transition-colors ${
                  showFilters ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <HiAdjustmentsHorizontal size={16} />
                <span>Filtres</span>
              </button>

              {/* Vue */}
              <div className="flex border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-400'}`}
                >
                  <HiSquares2X2 size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-400'}`}
                >
                  <HiBars3 size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Panel de filtres */}
        {showFilters && (
          <div className="mb-8">
            <FilterPanel
              type={type}
              filters={filters}
              onFiltersChange={setFilters}
              isOpen={showFilters}
              onClose={() => setShowFilters(false)}
            />
          </div>
        )}

        {/* Résultats */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              {filteredData.length} résultat{filteredData.length !== 1 ? 's' : ''} trouvé{filteredData.length !== 1 ? 's' : ''}
            </p>
          </div>

          {filteredData.length > 0 ? (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
            }>
              {filteredData.map(item => renderCard(item))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                {type === 'oeuvres' && <HiBookmark size={48} className="mx-auto" />}
                {type === 'evenements' && <HiCalendar size={48} className="mx-auto" />}
                {type === 'lieux' && <HiMapPin size={48} className="mx-auto" />}
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun résultat</h3>
              <p className="text-gray-600">Essayez de modifier vos critères de recherche ou vos filtres.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// PAGES SPÉCIALISÉES
// =============================================================================

export const OeuvresPage: React.FC = () => (
  <ListingPage
    type="oeuvres"
    title="Œuvres culturelles"
    description="Découvrez les créations artistiques et littéraires du patrimoine algérien"
    data={oeuvresData}
  />
);

export const EvenementsPage: React.FC = () => (
  <ListingPage
    type="evenements"
    title="Événements culturels"
    description="Participez aux événements culturels à travers l'Algérie"
    data={evenementsData}
  />
);

export const PatrimoinePage: React.FC = () => (
  <ListingPage
    type="lieux"
    title="Patrimoine d'Algérie"
    description="Explorez les sites historiques et monuments du pays"
    data={lieuxData}
  />
);