

import React, { useState, useEffect } from 'react';

import { 
  HiSearch as Search, 
  HiTrendingUp as TrendingUp, 
  HiLocationMarker as MapPin, // MapPin → LocationMarker
  HiCalendar as Calendar, 
  HiStar as Star, 
  HiArrowRight as ArrowRight,
  HiUsers as Users,
  HiCamera,
  HiGlobeAlt as Globe,
  HiChevronLeft as ChevronLeft,
  HiChevronRight as ChevronRight,
  HiFilter as Filter,
  HiViewGrid as Grid,
  HiViewList as List,
  HiHeart as Heart,
  HiEye as Eye,
  HiMenu as Menu,
  HiX as X,
  HiBell as Bell,
  HiCog as Settings,
  HiLogout as LogOut,
  HiPlus as Plus,
  HiHome as Home,
  HiChevronDown as ChevronDown,
  HiBookmark as Bookmark,
  HiExternalLink as ExternalLink,
  HiClock as Clock,
   HiMusicNote as Music
} from 'react-icons/hi';

// Pour Book et Award, tu peux importer depuis react-icons/md ou fa si tu veux un style cohérent,
// Sinon, choisis une autre icône de la liste Heroicons

import { MdBook as Book, MdEmojiEvents as Award, MdMovie as Film } from 'react-icons/md';
// Remarque : Film n’existe pas non plus dans hi, donc MdMovie (Material) est un choix courant

// =============================================================================
// COMPOSANTS CARDS INTÉGRÉS
// =============================================================================

const OeuvreCard = ({ oeuvre, onClick, compact = false }: any) => {
  const [isFavorite, setIsFavorite] = useState(false);
  
  const getTypeIcon = (type?: string) => {
    switch (type?.toLowerCase()) {
      case 'livre': return Book;
      case 'film': return Film;
      case 'album musical': return Music;
      case 'photographie': return HiCamera;
      case 'artisanat': return Award;
      default: return Book;
    }
  };

  const TypeIcon = getTypeIcon(oeuvre.TypeOeuvre?.nom_type);
  const auteurs = oeuvre.Users?.map((u: any) => `${u.prenom} ${u.nom}`).join(', ') || 'Auteur inconnu';
  const imageUrl = oeuvre.images?.[0] || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400';

  if (compact) {
    return (
      <div 
        className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-emerald-300 hover:shadow-md transition-all duration-200 cursor-pointer"
        onClick={onClick}
      >
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-lg flex items-center justify-center">
            <TypeIcon size={20} className="text-emerald-600" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 truncate">{oeuvre.titre}</h3>
          <p className="text-xs text-gray-500 truncate">{auteurs}</p>
          {oeuvre.annee_creation && <p className="text-xs text-gray-400">{oeuvre.annee_creation}</p>}
        </div>

        <div className="flex-shrink-0">
          <ChevronRight size={16} className="text-gray-400" />
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
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
            <Heart size={14} />
          </button>
        </div>
      </div>

      <div className="p-4" onClick={onClick}>
        <div className="cursor-pointer">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">{oeuvre.titre}</h3>
          <p className="text-sm text-emerald-600 mb-2">{auteurs}</p>
          {oeuvre.description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{oeuvre.description}</p>
          )}

          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-4">
              {oeuvre.annee_creation && <span>{oeuvre.annee_creation}</span>}
              {oeuvre.Langue && <span>{oeuvre.Langue.nom}</span>}
            </div>
            
            <div className="flex items-center space-x-3">
              {oeuvre.note_moyenne && (
                <div className="flex items-center space-x-1">
                  <Star size={12} className="text-yellow-400 fill-current" />
                  <span>{oeuvre.note_moyenne.toFixed(1)}</span>
                </div>
              )}
              {oeuvre.nombre_vues && (
                <div className="flex items-center space-x-1">
                  <Eye size={12} />
                  <span>{oeuvre.nombre_vues}</span>
                </div>
              )}
            </div>
          </div>

          {oeuvre.Categories && oeuvre.Categories.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {oeuvre.Categories.slice(0, 2).map((categorie: any, index: number) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-full"
                >
                  {categorie.nom}
                </span>
              ))}
              {oeuvre.Categories.length > 2 && (
                <span className="px-2 py-1 bg-gray-50 text-gray-500 text-xs rounded-full">
                  +{oeuvre.Categories.length - 2}
                </span>
              )}
            </div>
          )}
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
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
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
        className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-emerald-300 hover:shadow-md transition-all duration-200 cursor-pointer"
        onClick={onClick}
      >
        <div className="flex-shrink-0">
          <div className={`w-12 h-12 rounded-lg flex flex-col items-center justify-center text-white text-xs font-medium ${
            isUpcoming ? 'bg-emerald-500' : isPast ? 'bg-gray-400' : 'bg-blue-500'
          }`}>
            {evenement.date_debut && (
              <>
                <span>{new Date(evenement.date_debut).getDate()}</span>
                <span>{new Date(evenement.date_debut).toLocaleDateString('fr-FR', { month: 'short' })}</span>
              </>
            )}
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 truncate">{evenement.nom_evenement}</h3>
          <p className="text-xs text-gray-500 truncate">{lieu}</p>
          {evenement.date_debut && <p className="text-xs text-gray-400">{formatTime(evenement.date_debut)}</p>}
        </div>

        <div className="flex-shrink-0">
          <ChevronRight size={16} className="text-gray-400" />
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
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        <div className="absolute top-2 left-2">
          <div className={`px-3 py-2 rounded-lg text-white font-medium text-sm ${
            isUpcoming ? 'bg-emerald-500' : isPast ? 'bg-gray-500' : 'bg-blue-500'
          }`}>
            {evenement.date_debut && formatDate(evenement.date_debut)}
          </div>
        </div>

        <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsInterested(!isInterested);
            }}
            className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
              isInterested ? 'bg-emerald-500 text-white' : 'bg-white/80 text-gray-600 hover:bg-white'
            }`}
          >
            <Star size={14} />
          </button>
        </div>

        <div className="absolute bottom-2 right-2">
          {evenement.tarif === 0 ? (
            <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">Gratuit</span>
          ) : evenement.tarif && (
            <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full">{evenement.tarif} DZD</span>
          )}
        </div>
      </div>

      <div className="p-4" onClick={onClick}>
        <div className="cursor-pointer">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 flex-1 line-clamp-2">{evenement.nom_evenement}</h3>
            {evenement.TypeEvenement && (
              <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full flex-shrink-0">
                {evenement.TypeEvenement.nom_type}
              </span>
            )}
          </div>

          {evenement.User && (
            <p className="text-sm text-emerald-600 mb-2">Par {evenement.User.prenom} {evenement.User.nom}</p>
          )}

          {evenement.description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{evenement.description}</p>
          )}

          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <MapPin size={14} className="text-gray-400" />
              <span className="truncate">{lieu}</span>
            </div>
            
            {evenement.date_debut && (
              <div className="flex items-center space-x-2">
                <Clock size={14} className="text-gray-400" />
                <span>
                  {formatTime(evenement.date_debut)}
                  {evenement.date_fin && evenement.date_fin !== evenement.date_debut && (
                    <span> - {formatTime(evenement.date_fin)}</span>
                  )}
                </span>
              </div>
            )}
            
            {evenement.nombre_participants !== undefined && (
              <div className="flex items-center space-x-2">
                <Users size={14} className="text-gray-400" />
                <span>{evenement.nombre_participants} participants</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const LieuCard = ({ lieu, onClick, compact = false }: any) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const getPatrimoineIcon = (type?: string) => {
    switch (type) {
      case 'monument': return Award;
      case 'vestige': return HiCamera;
      default: return MapPin;
    }
  };

  const PatrimoineIcon = getPatrimoineIcon(lieu.typePatrimoine);
  const imageUrl = lieu.imagePrincipale || 'https://images.unsplash.com/photo-1539650116574-75c0c6d1d3b8?w=400';

  const getTypeColor = (type?: string) => {
    switch (type) {
      case 'monument': return 'bg-yellow-100 text-yellow-800';
      case 'vestige': return 'bg-orange-100 text-orange-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  if (compact) {
    return (
      <div 
        className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-emerald-300 hover:shadow-md transition-all duration-200 cursor-pointer"
        onClick={onClick}
      >
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg flex items-center justify-center">
            <PatrimoineIcon size={20} className="text-amber-600" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 truncate">{lieu.nom}</h3>
          <p className="text-xs text-gray-500 truncate">{lieu.Wilaya?.nom}</p>
          {lieu.distance && <p className="text-xs text-gray-400">À {lieu.distance.toFixed(1)} km</p>}
        </div>

        <div className="flex-shrink-0">
          <ChevronRight size={16} className="text-gray-400" />
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
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        <div className="absolute top-2 left-2">
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(lieu.typePatrimoine)}`}>
            <PatrimoineIcon size={12} />
            <span className="capitalize">{lieu.typePatrimoine || 'site'}</span>
          </div>
        </div>

        <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsBookmarked(!isBookmarked);
            }}
            className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
              isBookmarked ? 'bg-blue-500 text-white' : 'bg-white/80 text-gray-600 hover:bg-white'
            }`}
          >
            <Bookmark size={14} />
          </button>
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
            <MapPin size={14} className="text-gray-400" />
            <span>{lieu.Wilaya?.nom}</span>
            {lieu.distance && <span className="text-gray-400">• À {lieu.distance.toFixed(1)} km</span>}
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
                  <Star size={12} className="text-yellow-400 fill-current" />
                  <span>{lieu.DetailLieu.noteMoyenne.toFixed(1)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const UserCard = ({ user, onClick }: any) => {
  const initials = `${user.prenom.charAt(0)}${user.nom.charAt(0)}`.toUpperCase();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
      <div className="text-center" onClick={onClick}>
        <div className="cursor-pointer">
          <div className="mb-3">
            {user.photo_profil ? (
              <img
                src={user.photo_profil}
                alt={`${user.prenom} ${user.nom}`}
                className="w-16 h-16 rounded-full object-cover mx-auto"
              />
            ) : (
              <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-white text-lg font-medium mx-auto">
                {initials}
              </div>
            )}
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-1">{user.prenom} {user.nom}</h3>
          <p className="text-sm text-emerald-600 mb-2 capitalize">{user.type_user}</p>

          {user.bio && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{user.bio}</p>
          )}

          {user.specialites && user.specialites.length > 0 && (
            <div className="flex flex-wrap justify-center gap-1 mb-3">
              {user.specialites.slice(0, 2).map((specialite: string, index: number) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                >
                  {specialite}
                </span>
              ))}
              {user.specialites.length > 2 && (
                <span className="px-2 py-1 bg-gray-50 text-gray-500 text-xs rounded-full">
                  +{user.specialites.length - 2}
                </span>
              )}
            </div>
          )}

          <div className="flex justify-center space-x-4 text-sm text-gray-600">
            {user.nombre_oeuvres !== undefined && (
              <div className="flex items-center space-x-1">
                <Book size={14} />
                <span>{user.nombre_oeuvres}</span>
              </div>
            )}
            
            {user.nombre_evenements !== undefined && (
              <div className="flex items-center space-x-1">
                <Calendar size={14} />
                <span>{user.nombre_evenements}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// LAYOUT SIMPLE INTÉGRÉ
// =============================================================================

const SimpleLayout = ({ children }: { children: React.ReactNode }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      window.location.href = `/recherche?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header simple */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Star className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Action Culture</h1>
                <p className="text-xs text-gray-500">Patrimoine Algérien</p>
              </div>
            </div>

            {/* Navigation desktop */}
            <nav className="hidden md:flex space-x-8">
              <a href="/" className="text-gray-700 hover:text-emerald-600">Accueil</a>
              <a href="/oeuvres" className="text-gray-700 hover:text-emerald-600">Œuvres</a>
              <a href="/evenements" className="text-gray-700 hover:text-emerald-600">Événements</a>
              <a href="/patrimoine" className="text-gray-700 hover:text-emerald-600">Patrimoine</a>
              <a href="/communaute" className="text-gray-700 hover:text-emerald-600">Communauté</a>
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <button 
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <a href="/connexion" className="text-gray-700 hover:text-emerald-600">Connexion</a>
              <a href="/inscription" className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700">S'inscrire</a>
            </div>
          </div>
        </div>

        {/* Menu mobile */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <div className="px-4 py-3 space-y-2">
              <a href="/" className="block text-gray-700 hover:text-emerald-600 py-2">Accueil</a>
              <a href="/oeuvres" className="block text-gray-700 hover:text-emerald-600 py-2">Œuvres</a>
              <a href="/evenements" className="block text-gray-700 hover:text-emerald-600 py-2">Événements</a>
              <a href="/patrimoine" className="block text-gray-700 hover:text-emerald-600 py-2">Patrimoine</a>
              <a href="/communaute" className="block text-gray-700 hover:text-emerald-600 py-2">Communauté</a>
            </div>
          </div>
        )}
      </header>

      {/* Contenu */}
      <main className="flex-1">{children}</main>

      {/* Footer simple */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Action Culture</h3>
            <p className="text-gray-300 text-sm">
              Plateforme dédiée à la préservation et à la promotion du patrimoine culturel algérien.
            </p>
            <div className="mt-4 text-xs text-gray-400">
              © 2025 Action Culture. Patrimoine d'Algérie.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// =============================================================================
// DONNÉES SIMULÉES (normalement viendraient de l'API)
// =============================================================================

const featuredOeuvres = [
  {
    id_oeuvre: 1,
    titre: "L'Étranger",
    description: "Roman philosophique d'Albert Camus, figure emblématique de la littérature algérienne française.",
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
    titre: "Tajmaât",
    description: "Film documentaire sur la tradition berbère du conseil de village en Kabylie.",
    annee_creation: 2023,
    statut: 'publie',
    TypeOeuvre: { nom_type: 'Film' },
    Langue: { nom: 'Tamazight' },
    Users: [{ nom: 'Amellal', prenom: 'Yasmina' }],
    Categories: [{ nom: 'Documentaire' }, { nom: 'Tradition' }],
    images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400'],
    note_moyenne: 4.6,
    nombre_vues: 1823,
    nombre_commentaires: 45
  },
  {
    id_oeuvre: 3,
    titre: "Tapis de Ghardaïa",
    description: "Artisanat traditionnel du M'Zab, tissage ancestral aux motifs géométriques berbères.",
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

const upcomingEvents = [
  {
    id_evenement: 1,
    nom_evenement: "Festival International du Film d'Alger",
    description: "Découvrez le cinéma algérien et international lors de cette 15ème édition.",
    date_debut: '2025-06-15T09:00:00',
    date_fin: '2025-06-22T22:00:00',
    image_url: 'https://images.unsplash.com/photo-1489599142821-bed30d3ddd6c?w=400',
    TypeEvenement: { nom_type: 'Festival' },
    Lieu: { nom: 'Palais de la Culture', Wilaya: { nom: 'Alger' } },
    User: { nom: 'Benali', prenom: 'Rachid' },
    nombre_participants: 156,
    tarif: 0
  },
  {
    id_evenement: 2,
    nom_evenement: "Exposition Art Contemporain Algérien",
    description: "Exposition collective mettant en valeur les artistes contemporains d'Algérie.",
    date_debut: '2025-06-10T10:00:00',
    date_fin: '2025-07-10T18:00:00',
    image_url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400',
    TypeEvenement: { nom_type: 'Exposition' },
    Lieu: { nom: 'Musée des Beaux-Arts', Wilaya: { nom: 'Oran' } },
    User: { nom: 'Medjahdi', prenom: 'Leila' },
    nombre_participants: 89,
    tarif: 500
  },
  {
    id_evenement: 3,
    nom_evenement: "Concert de Musique Andalouse",
    description: "Soirée dédiée à la musique andalouse avec l'orchestre de Constantine.",
    date_debut: '2025-06-08T20:00:00',
    date_fin: '2025-06-08T23:00:00',
    image_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
    TypeEvenement: { nom_type: 'Concert' },
    Lieu: { nom: 'Théâtre Régional', Wilaya: { nom: 'Constantine' } },
    User: { nom: 'Boutaiba', prenom: 'Mohamed' },
    nombre_participants: 234,
    tarif: 1200
  }
];

const patrimoineSites = [
  {
    id_lieu: 1,
    nom: "Casbah d'Alger",
    adresse: "Vieille ville d'Alger",
    latitude: 36.7853,
    longitude: 3.0586,
    typePatrimoine: 'monument' as const,
    Wilaya: { nom: 'Alger' },
    DetailLieu: { 
      description: "Site du patrimoine mondial de l'UNESCO, cœur historique d'Alger avec ses ruelles et architecture ottomane.",
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
      description: "Ancienne ville romaine remarquablement conservée, fondée par l'empereur Trajan en 100 après J.-C.",
      noteMoyenne: 4.9,
      periode_historique: 'Période romaine'
    },
    imagePrincipale: 'https://images.unsplash.com/photo-1539650116574-75c0c6d1d3b8?w=400',
    nombreImages: 123
  },
  {
    id_lieu: 3,
    nom: "Vallée du M'Zab",
    adresse: "Ghardaïa",
    latitude: 32.4011,
    longitude: 3.6708,
    typePatrimoine: 'monument' as const,
    Wilaya: { nom: 'Ghardaïa' },
    DetailLieu: { 
      description: "Ensemble architectural mozabite unique, inscrit au patrimoine mondial pour son urbanisme traditionnel.",
      noteMoyenne: 4.8,
      periode_historique: 'Xe siècle'
    },
    imagePrincipale: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
    nombreImages: 89
  }
];

const topContributors = [
  {
    id_user: 1,
    nom: 'Benaissa',
    prenom: 'Amina',
    type_user: 'artiste',
    bio: 'Peintre et calligraphe spécialisée dans l\'art contemporain algérien',
    specialites: ['Peinture', 'Calligraphie'],
    nombre_oeuvres: 23,
    nombre_evenements: 8
  },
  {
    id_user: 2,
    nom: 'Khaled',
    prenom: 'Omar',
    type_user: 'chercheur',
    bio: 'Historien spécialiste du patrimoine architectural algérien',
    specialites: ['Histoire', 'Architecture'],
    nombre_oeuvres: 15,
    nombre_evenements: 12
  },
  {
    id_user: 3,
    nom: 'Boudjemaa',
    prenom: 'Salima',
    type_user: 'guide_touristique',
    bio: 'Guide passionnée par le patrimoine berbère et l\'artisanat traditionnel',
    specialites: ['Patrimoine', 'Tourisme'],
    nombre_oeuvres: 8,
    nombre_evenements: 25
  }
];

// =============================================================================
// STATISTIQUES GÉNÉRALES
// =============================================================================

const stats = [
  { 
    label: 'Œuvres répertoriées', 
    value: '2,847', 
    icon: Book, 
    color: 'text-blue-600 bg-blue-100',
    trend: '+12%'
  },
  { 
    label: 'Sites patrimoniaux', 
    value: '1,234', 
    icon: MapPin, 
    color: 'text-emerald-600 bg-emerald-100',
    trend: '+8%'
  },
  { 
    label: 'Événements à venir', 
    value: '89', 
    icon: Calendar, 
    color: 'text-purple-600 bg-purple-100',
    trend: '+23%'
  },
  { 
    label: 'Contributeurs actifs', 
    value: '456', 
    icon: Users, 
    color: 'text-orange-600 bg-orange-100',
    trend: '+15%'
  }
];

// =============================================================================
// COMPOSANT PRINCIPAL
// =============================================================================

const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Simulation de recherche
  const handleSearch = () => {
    if (searchQuery.trim()) {
      window.location.href = `/recherche?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const categories = [
    { id: 'all', name: 'Tout', count: 2847 },
    { id: 'livres', name: 'Livres', count: 1243 },
    { id: 'films', name: 'Films', count: 567 },
    { id: 'musique', name: 'Musique', count: 423 },
    { id: 'artisanat', name: 'Artisanat', count: 389 },
    { id: 'patrimoine', name: 'Patrimoine', count: 225 }
  ];

  return (
    <SimpleLayout>
      <div className="min-h-screen bg-gray-50">
        
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-emerald-500 via-blue-600 to-purple-700 text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,...')] opacity-10"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Patrimoine Culturel
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-100">
                  d'Algérie
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
                Découvrez, partagez et préservez les trésors culturels de l'Algérie. 
                Une plateforme collaborative pour notre patrimoine commun.
              </p>

              {/* Barre de recherche principale */}
              <div className="max-w-2xl mx-auto mb-8">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Rechercher œuvres, événements, sites patrimoniaux..."
                    className="w-full pl-12 pr-6 py-4 text-lg rounded-2xl border-0 shadow-xl focus:ring-4 focus:ring-white/25 text-gray-900 placeholder-gray-500"
                  />
                  <button
                    onClick={handleSearch}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-emerald-500 text-white px-6 py-2 rounded-xl hover:bg-emerald-600 transition-colors"
                  >
                    Rechercher
                  </button>
                </div>
              </div>

              {/* Statistiques en hero */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="text-center">
                      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${stat.color} mb-2`}>
                        <Icon size={24} />
                      </div>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <div className="text-sm text-blue-100">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Navigation par catégories */}
        <section className="bg-white border-b sticky top-20 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center space-x-6 overflow-x-auto">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
                    }`}
                  >
                    <span>{category.name}</span>
                    <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>

              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100">
                  <Filter size={20} />
                </button>
                
                <div className="flex border border-gray-200 rounded-lg">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-400'}`}
                  >
                    <Grid size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-400'}`}
                  >
                    <List size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contenu principal */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Œuvres en vedette */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Œuvres en vedette</h2>
                <p className="text-gray-600">Découvrez les créations culturelles algériennes les plus remarquables</p>
              </div>
              <a 
                href="/oeuvres" 
                className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 font-medium"
              >
                <span>Voir tout</span>
                <ArrowRight size={16} />
              </a>
            </div>

            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {featuredOeuvres.map((oeuvre) => (
                <OeuvreCard
                  key={oeuvre.id_oeuvre}
                  oeuvre={oeuvre}
                  onClick={() => window.location.href = `/oeuvres/${oeuvre.id_oeuvre}`}
                  compact={viewMode === 'list'}
                />
              ))}
            </div>
          </section>

          {/* Événements à venir */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Événements à venir</h2>
                <p className="text-gray-600">Ne manquez pas les prochains événements culturels</p>
              </div>
              <a 
                href="/evenements" 
                className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 font-medium"
              >
                <span>Voir tout</span>
                <ArrowRight size={16} />
              </a>
            </div>

            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {upcomingEvents.map((evenement) => (
                <EvenementCard
                  key={evenement.id_evenement}
                  evenement={evenement}
                  onClick={() => window.location.href = `/evenements/${evenement.id_evenement}`}
                  compact={viewMode === 'list'}
                />
              ))}
            </div>
          </section>

          {/* Sites patrimoniaux */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Patrimoine d'Algérie</h2>
                <p className="text-gray-600">Explorez les sites historiques et monuments du pays</p>
              </div>
              <a 
                href="/patrimoine" 
                className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 font-medium"
              >
                <span>Voir tout</span>
                <ArrowRight size={16} />
              </a>
            </div>

            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {patrimoineSites.map((lieu) => (
                <LieuCard
                  key={lieu.id_lieu}
                  lieu={lieu}
                  onClick={() => window.location.href = `/patrimoine/${lieu.id_lieu}`}
                  compact={viewMode === 'list'}
                />
              ))}
            </div>
          </section>

          {/* Grid avec sections côte à côte */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Contributeurs actifs */}
            <section className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Contributeurs actifs</h2>
                  <p className="text-gray-600">Ceux qui enrichissent notre patrimoine</p>
                </div>
                <a 
                  href="/communaute" 
                  className="text-emerald-600 hover:text-emerald-700 font-medium text-sm"
                >
                  Voir tout
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {topContributors.map((user) => (
                  <UserCard
                    key={user.id_user}
                    user={user}
                    onClick={() => window.location.href = `/profil/${user.id_user}`}
                  />
                ))}
              </div>
            </section>

            {/* Actualités et liens rapides */}
            <section className="space-y-6">
              
              {/* Statistiques détaillées */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Statistiques en temps réel
                </h3>
                
                <div className="space-y-4">
                  {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${stat.color}`}>
                            <Icon size={16} />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{stat.value}</div>
                            <div className="text-sm text-gray-500">{stat.label}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1 text-green-600 text-sm">
                          <TrendingUp size={14} />
                          <span>{stat.trend}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Actions rapides */}
              <div className="bg-gradient-to-br from-emerald-500 to-blue-600 rounded-lg p-6 text-white">
                <h3 className="text-lg font-semibold mb-4">
                  Contribuez au patrimoine
                </h3>
                
                <div className="space-y-3">
                  <a 
                    href="/oeuvres/nouvelle"
                    className="flex items-center space-x-3 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    <Book size={20} />
                    <span>Ajouter une œuvre</span>
                  </a>
                  
                  <a 
                    href="/evenements/nouveau"
                    className="flex items-center space-x-3 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    <Calendar size={20} />
                    <span>Créer un événement</span>
                  </a>
                  
                  <a 
                    href="/patrimoine/nouveau"
                    className="flex items-center space-x-3 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    <MapPin size={20} />
                    <span>Signaler un site</span>
                  </a>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </SimpleLayout>
  );
};

export default HomePage;
