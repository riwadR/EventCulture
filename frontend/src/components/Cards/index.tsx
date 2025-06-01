import React, { useState } from "react";
import {
  HiMiniCalendar as Calendar,
  HiMiniMapPin as MapPin,
  HiMiniUser as User,
  HiMiniHeart as Heart,
  HiMiniStar as Star,
  HiMiniEye as Eye,
  HiMiniChatBubbleBottomCenterText as MessageCircle,
  HiMiniClock as Clock,
  HiMiniBookOpen as Book,
  HiMiniFilm as Film,
  HiMiniMusicalNote as Music,
  HiMiniCamera as Camera,
  HiMiniTrophy as Award,
  HiMiniUsers as Users,
  HiMiniArrowTopRightOnSquare as ExternalLink,
  HiMiniShare as Share2,
  HiMiniBookmark as Bookmark,
  HiMiniChevronRight as ChevronRight
} from "react-icons/hi2";

// =============================================================================
// TYPES
// =============================================================================

interface Oeuvre {
  id_oeuvre: number;
  titre: string;
  description?: string;
  annee_creation?: number;
  statut: string;
  TypeOeuvre?: { nom_type: string };
  Langue?: { nom: string };
  Users?: Array<{ nom: string; prenom: string }>;
  Categories?: Array<{ nom: string }>;
  images?: string[];
  note_moyenne?: number;
  nombre_vues?: number;
  nombre_commentaires?: number;
}

interface Evenement {
  id_evenement: number;
  nom_evenement: string;
  description?: string;
  date_debut?: string;
  date_fin?: string;
  image_url?: string;
  TypeEvenement?: { nom_type: string };
  Lieu?: { nom: string; Wilaya?: { nom: string } };
  User?: { nom: string; prenom: string };
  nombre_participants?: number;
  tarif?: number;
  statut?: string;
}

interface Lieu {
  id_lieu: number;
  nom: string;
  adresse: string;
  latitude: number;
  longitude: number;
  typePatrimoine?: "monument" | "vestige" | "site_culturel";
  Wilaya?: { nom: string };
  DetailLieu?: {
    description?: string;
    noteMoyenne?: number;
    periode_historique?: string;
  };
  imagePrincipale?: string;
  nombreImages?: number;
  distance?: number;
}

// =============================================================================
// COMPOSANT CARD ŒUVRE
// =============================================================================

interface OeuvreCardProps {
  oeuvre: Oeuvre;
  onClick?: () => void;
  showActions?: boolean;
  compact?: boolean;
}

export const OeuvreCard: React.FC<OeuvreCardProps> = ({
  oeuvre,
  onClick,
  showActions = true,
  compact = false
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Icône du type d'œuvre
  const getTypeIcon = (type?: string) => {
    switch (type?.toLowerCase()) {
      case "livre":
        return Book;
      case "film":
        return Film;
      case "album musical":
        return Music;
      case "photographie":
        return Camera;
      case "artisanat":
        return Award;
      default:
        return Book;
    }
  };

  const TypeIcon = getTypeIcon(oeuvre.TypeOeuvre?.nom_type);
  const auteurs = oeuvre.Users?.map((u) => `${u.prenom} ${u.nom}`).join(", ") || "Auteur inconnu";
  const imageUrl = oeuvre.images?.[0] || "/api/placeholder/400/300";

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
          {oeuvre.annee_creation && (
            <p className="text-xs text-gray-400">{oeuvre.annee_creation}</p>
          )}
        </div>

        <div className="flex-shrink-0">
          <ChevronRight size={16} className="text-gray-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 group">
      {/* Image */}
      <div className="relative aspect-video bg-gray-100">
        <img
          src={imageUrl}
          alt={oeuvre.titre}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Badge type */}
        <div className="absolute top-2 left-2">
          <div className="flex items-center space-x-1 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium">
            <TypeIcon size={12} />
            <span>{oeuvre.TypeOeuvre?.nom_type}</span>
          </div>
        </div>

        {/* Actions rapides */}
        {showActions && (
          <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsFavorite(!isFavorite);
              }}
              className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                isFavorite
                  ? "bg-red-500 text-white"
                  : "bg-white/80 text-gray-600 hover:bg-white"
              }`}
            >
              <Heart size={14} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsBookmarked(!isBookmarked);
              }}
              className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                isBookmarked
                  ? "bg-blue-500 text-white"
                  : "bg-white/80 text-gray-600 hover:bg-white"
              }`}
            >
              <Bookmark size={14} />
            </button>
          </div>
        )}

        {/* Statut */}
        {oeuvre.statut !== "publie" && (
          <div className="absolute bottom-2 left-2">
            <span
              className={`px-2 py-1 text-xs rounded-full ${
                oeuvre.statut === "en_attente"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {oeuvre.statut === "en_attente" ? "En attente" : oeuvre.statut}
            </span>
          </div>
        )}
      </div>

      {/* Contenu */}
      <div className="p-4" onClick={onClick}>
        <div className="cursor-pointer">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">{oeuvre.titre}</h3>

          <p className="text-sm text-emerald-600 mb-2">{auteurs}</p>

          {oeuvre.description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{oeuvre.description}</p>
          )}

          {/* Métadonnées */}
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

          {/* Catégories */}
          {oeuvre.Categories && oeuvre.Categories.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {oeuvre.Categories.slice(0, 2).map((categorie, index) => (
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

// =============================================================================
// COMPOSANT CARD ÉVÉNEMENT
// =============================================================================

interface EvenementCardProps {
  evenement: Evenement;
  onClick?: () => void;
  showActions?: boolean;
  compact?: boolean;
}

export const EvenementCard: React.FC<EvenementCardProps> = ({
  evenement,
  onClick,
  showActions = true,
  compact = false
}) => {
  const [isInterested, setIsInterested] = useState(false);

  // Formatage des dates
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  const formatTime = (dateStr?: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Vérifier si l'événement est à venir
  const isUpcoming = evenement.date_debut ? new Date(evenement.date_debut) > new Date() : false;
  const isPast = evenement.date_fin ? new Date(evenement.date_fin) < new Date() : false;

  const imageUrl = evenement.image_url || "/api/placeholder/400/300";
  const lieu = evenement.Lieu ? `${evenement.Lieu.nom}, ${evenement.Lieu.Wilaya?.nom}` : "Lieu à définir";

  if (compact) {
    return (
      <div
        className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-emerald-300 hover:shadow-md transition-all duration-200 cursor-pointer"
        onClick={onClick}
      >
        <div className="flex-shrink-0">
          <div
            className={`w-12 h-12 rounded-lg flex flex-col items-center justify-center text-white text-xs font-medium ${
              isUpcoming
                ? "bg-emerald-500"
                : isPast
                ? "bg-gray-400"
                : "bg-blue-500"
            }`}
          >
            {evenement.date_debut && (
              <>
                <span>{new Date(evenement.date_debut).getDate()}</span>
                <span>
                  {new Date(evenement.date_debut).toLocaleDateString("fr-FR", { month: "short" })}
                </span>
              </>
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 truncate">{evenement.nom_evenement}</h3>
          <p className="text-xs text-gray-500 truncate">{lieu}</p>
          {evenement.date_debut && (
            <p className="text-xs text-gray-400">{formatTime(evenement.date_debut)}</p>
          )}
        </div>

        <div className="flex-shrink-0">
          <ChevronRight size={16} className="text-gray-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 group">
      {/* Image */}
      <div className="relative aspect-video bg-gray-100">
        <img
          src={imageUrl}
          alt={evenement.nom_evenement}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Date badge */}
        <div className="absolute top-2 left-2">
          <div
            className={`px-3 py-2 rounded-lg text-white font-medium text-sm ${
              isUpcoming
                ? "bg-emerald-500"
                : isPast
                ? "bg-gray-500"
                : "bg-blue-500"
            }`}
          >
            {evenement.date_debut && formatDate(evenement.date_debut)}
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsInterested(!isInterested);
              }}
              className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                isInterested
                  ? "bg-emerald-500 text-white"
                  : "bg-white/80 text-gray-600 hover:bg-white"
              }`}
            >
              <Star size={14} />
            </button>

            <button
              onClick={(e) => e.stopPropagation()}
              className="p-2 rounded-full bg-white/80 text-gray-600 hover:bg-white backdrop-blur-sm transition-colors"
            >
              <Share2 size={14} />
            </button>
          </div>
        )}

        {/* Statut */}
        <div className="absolute bottom-2 right-2">
          {evenement.tarif === 0 ? (
            <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">
              Gratuit
            </span>
          ) : (
            evenement.tarif && (
              <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
                {evenement.tarif} DZD
              </span>
            )
          )}
        </div>
      </div>

      {/* Contenu */}
      <div className="p-4" onClick={onClick}>
        <div className="cursor-pointer">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 flex-1 line-clamp-2">
              {evenement.nom_evenement}
            </h3>
            {evenement.TypeEvenement && (
              <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full flex-shrink-0">
                {evenement.TypeEvenement.nom_type}
              </span>
            )}
          </div>

          {/* Organisateur */}
          {evenement.User && (
            <p className="text-sm text-emerald-600 mb-2">
              Par {evenement.User.prenom} {evenement.User.nom}
            </p>
          )}

          {/* Description */}
          {evenement.description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {evenement.description}
            </p>
          )}

          {/* Informations pratiques */}
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

// =============================================================================
// COMPOSANT CARD LIEU PATRIMONIAL
// =============================================================================

// ... (Garde le composant LieuCard et UserCard, adapte juste les imports d'icônes de la même façon !)

