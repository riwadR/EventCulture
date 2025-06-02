import React, { useState } from "react";
import {
  HiMiniEye as Eye,
  HiMiniEyeSlash as EyeOff,
  HiMiniEnvelope as Mail,
  HiMiniLockClosed as Lock,
  HiMiniUser as User,
  HiMiniPhone as Phone,
  HiMiniCalendar as Calendar,
  HiMiniMapPin as MapPin,
  HiMiniExclamationCircle as AlertCircle,
  HiMiniCheckCircle as CheckCircle,
  HiMiniArrowPath as Loader,
  HiMiniArrowLeft as ArrowLeft,
  HiMiniStar as Star,
  HiMiniGlobeAlt as Globe,
  HiMiniUsers as Users,
  HiMiniTrophy as Award,
  HiMiniBookOpen as Book,
  HiMiniCamera as Camera,
} from "react-icons/hi2";

// =============================================================================
// TYPES
// =============================================================================

interface LoginFormData {
  email: string;
  password: string;
  remember: boolean;
}

interface RegisterFormData {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  confirmPassword: string;
  type_user: string;
  telephone: string;
  date_naissance: string;
  bio: string;
  acceptTerms: boolean;
}

// =============================================================================
// COMPOSANT DE CONNEXION
// =============================================================================

export const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
    remember: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async () => {
    setErrors({});

    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.email) newErrors.email = "Email requis";
    if (!formData.password) newErrors.password = "Mot de passe requis";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      // Simulation de connexion - en réalité appel à votre API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Redirection après connexion réussie
      window.location.href = "/";
    } catch (error) {
      setErrors({ general: "Identifiants incorrects" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-500 via-blue-600 to-purple-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-blue-600 p-6 text-white text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold">Action Culture</h1>
          <p className="text-blue-100 text-sm">Patrimoine Algérien</p>
        </div>

        {/* Formulaire */}
        <div className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Connexion
            </h2>
            <p className="text-gray-600">Accédez à votre espace culturel</p>
          </div>

          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 text-red-700">
              <AlertCircle size={16} />
              <span className="text-sm">{errors.general}</span>
            </div>
          )}

          <div className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                    errors.email ? "border-red-300 bg-red-50" : "border-gray-300"
                  }`}
                  placeholder="votre.email@exemple.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Mot de passe */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                    errors.password
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Options */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.remember}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      remember: e.target.checked,
                    }))
                  }
                  className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm text-gray-700">Se souvenir de moi</span>
              </label>
              <a
                href="/mot-de-passe-oublie"
                className="text-sm text-emerald-600 hover:text-emerald-700"
              >
                Mot de passe oublié ?
              </a>
            </div>

            {/* Bouton de connexion */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-emerald-500 to-blue-600 text-white py-3 rounded-lg font-medium hover:from-emerald-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-all"
            >
              {isLoading ? (
                <>
                  <Loader size={20} className="animate-spin" />
                  <span>Connexion...</span>
                </>
              ) : (
                <span>Se connecter</span>
              )}
            </button>
          </div>

          {/* Lien vers inscription */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Pas encore de compte ?{" "}
              <a
                href="/inscription"
                className="text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Créer un compte
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// COMPOSANT D'INSCRIPTION
// =============================================================================

export const RegisterPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<RegisterFormData>({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    confirmPassword: "",
    type_user: "visiteur",
    telephone: "",
    date_naissance: "",
    bio: "",
    acceptTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const TYPES_USER = [
    {
      value: "visiteur",
      label: "Visiteur",
      description: "Découvrir et explorer le patrimoine",
      icon: Users,
      color: "text-blue-600 bg-blue-100",
    },
    {
      value: "artiste",
      label: "Artiste",
      description: "Partager vos créations artistiques",
      icon: Camera,
      color: "text-purple-600 bg-purple-100",
    },
    {
      value: "ecrivain",
      label: "Écrivain",
      description: "Publier vos œuvres littéraires",
      icon: Book,
      color: "text-green-600 bg-green-100",
    },
    {
      value: "historien",
      label: "Historien",
      description: "Contribuer à la recherche historique",
      icon: Award,
      color: "text-orange-600 bg-orange-100",
    },
  ];

  const validateStep = (step: number): boolean => {
    setErrors({});
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.nom.trim()) newErrors.nom = "Nom requis";
      if (!formData.prenom.trim()) newErrors.prenom = "Prénom requis";
      if (!formData.email.trim()) newErrors.email = "Email requis";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Email invalide";
      }
    } else if (step === 2) {
      if (!formData.password) newErrors.password = "Mot de passe requis";
      else if (formData.password.length < 8) {
        newErrors.password = "Minimum 8 caractères";
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
      }
      if (!formData.type_user) newErrors.type_user = "Type de compte requis";
    } else if (step === 3) {
      if (!formData.acceptTerms) {
        newErrors.acceptTerms = "Vous devez accepter les conditions";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setIsLoading(true);

    try {
      // Simulation d'inscription - en réalité appel à votre API
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Redirection après inscription réussie
      window.location.href = "/";
    } catch (error) {
      setErrors({ general: "Erreur lors de l'inscription" });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Informations personnelles
        </h2>
        <p className="text-gray-600">Étape 1 sur 3</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nom *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={formData.nom}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  nom: e.target.value,
                }))
              }
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                errors.nom ? "border-red-300 bg-red-50" : "border-gray-300"
              }`}
              placeholder="Nom"
            />
          </div>
          {errors.nom && (
            <p className="mt-1 text-sm text-red-600">{errors.nom}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Prénom *
          </label>
          <input
            type="text"
            value={formData.prenom}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                prenom: e.target.value,
              }))
            }
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
              errors.prenom ? "border-red-300 bg-red-50" : "border-gray-300"
            }`}
            placeholder="Prénom"
          />
          {errors.prenom && (
            <p className="mt-1 text-sm text-red-600">{errors.prenom}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email *
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                email: e.target.value,
              }))
            }
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
              errors.email ? "border-red-300 bg-red-50" : "border-gray-300"
            }`}
            placeholder="votre.email@exemple.com"
          />
        </div>
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Téléphone
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="tel"
            value={formData.telephone}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                telephone: e.target.value,
              }))
            }
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="+213 XX XX XX XX XX"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date de naissance
        </label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="date"
            value={formData.date_naissance}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                date_naissance: e.target.value,
              }))
            }
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Sécurité et profil
        </h2>
        <p className="text-gray-600">Étape 2 sur 3</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Mot de passe *
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                password: e.target.value,
              }))
            }
            className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
              errors.password ? "border-red-300 bg-red-50" : "border-gray-300"
            }`}
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Confirmer le mot de passe *
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type={showConfirmPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                confirmPassword: e.target.value,
              }))
            }
            className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
              errors.confirmPassword
                ? "border-red-300 bg-red-50"
                : "border-gray-300"
            }`}
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600">
            {errors.confirmPassword}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Type de compte *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {TYPES_USER.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.value}
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    type_user: type.value,
                  }))
                }
                className={`p-4 border rounded-lg text-left transition-all ${
                  formData.type_user === type.value
                    ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-200"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${type.color}`}>
                    <Icon size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{type.label}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {type.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        {errors.type_user && (
          <p className="mt-1 text-sm text-red-600">{errors.type_user}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Biographie (optionnel)
        </label>
        <textarea
          value={formData.bio}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              bio: e.target.value,
            }))
          }
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          placeholder="Parlez-nous un peu de vous, vos intérêts culturels..."
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Finalisation
        </h2>
        <p className="text-gray-600">Étape 3 sur 3</p>
      </div>

      {/* Récapitulatif */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
        <h3 className="font-medium text-gray-900">
          Récapitulatif de votre compte
        </h3>
        <div className="text-sm text-gray-600 space-y-1">
          <p>
            <span className="font-medium">Nom :</span> {formData.prenom} {formData.nom}
          </p>
          <p>
            <span className="font-medium">Email :</span> {formData.email}
          </p>
          <p>
            <span className="font-medium">Type :</span>{" "}
            {TYPES_USER.find((t) => t.value === formData.type_user)?.label}
          </p>
          {formData.telephone && (
            <p>
              <span className="font-medium">Téléphone :</span> {formData.telephone}
            </p>
          )}
        </div>
      </div>

      {/* Information pour professionnels */}
      {formData.type_user !== "visiteur" && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle size={20} className="text-blue-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-900">
                Compte professionnel
              </p>
              <p className="text-blue-700 mt-1">
                Votre compte sera examiné par nos modérateurs avant validation.
                Vous recevrez un email de confirmation une fois votre profil approuvé.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Conditions d'utilisation */}
      <div className="space-y-4">
        <label className="flex items-start space-x-3">
          <input
            type="checkbox"
            checked={formData.acceptTerms}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                acceptTerms: e.target.checked,
              }))
            }
            className="mt-1 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
          />
          <span className="text-sm text-gray-700">
            J'accepte les{" "}
            <a
              href="/conditions"
              className="text-emerald-600 hover:text-emerald-700"
            >
              conditions d'utilisation
            </a>{" "}
            et la{" "}
            <a
              href="/confidentialite"
              className="text-emerald-600 hover:text-emerald-700"
            >
              politique de confidentialité
            </a>
          </span>
        </label>
        {errors.acceptTerms && (
          <p className="text-sm text-red-600">{errors.acceptTerms}</p>
        )}

        <label className="flex items-start space-x-3">
          <input
            type="checkbox"
            className="mt-1 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
          />
          <span className="text-sm text-gray-700">
            Je souhaite recevoir des informations sur les nouveaux événements
            culturels (optionnel)
          </span>
        </label>
      </div>

      {errors.general && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 text-red-700">
          <AlertCircle size={16} />
          <span className="text-sm">{errors.general}</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-500 via-blue-600 to-purple-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-blue-600 p-6 text-white">
          <div className="flex items-center justify-between">
            {currentStep > 1 && (
              <button
                onClick={prevStep}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <div className="flex-1 text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star size={32} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold">Rejoindre Action Culture</h1>
              <p className="text-blue-100 text-sm">Contribuez au patrimoine algérien</p>
            </div>
            {currentStep > 1 && <div className="w-10"></div>}
          </div>

          {/* Indicateur de progression */}
          <div className="mt-6 flex items-center justify-center space-x-2">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`w-8 h-2 rounded-full transition-colors ${
                  step <= currentStep ? "bg-white" : "bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Contenu */}
        <div className="p-6">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}

          {/* Actions */}
          <div className="mt-8 flex justify-between">
            <div>
              {currentStep === 1 && (
                <a
                  href="/connexion"
                  className="text-gray-600 hover:text-gray-800"
                >
                  Déjà un compte ? Se connecter
                </a>
              )}
            </div>

            <div className="flex space-x-3">
              {currentStep < 3 ? (
                <button
                  onClick={nextStep}
                  className="bg-gradient-to-r from-emerald-500 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-emerald-600 hover:to-blue-700 transition-all"
                >
                  Continuer
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-emerald-500 to-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:from-emerald-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-all"
                >
                  {isLoading ? (
                    <>
                      <Loader size={20} className="animate-spin" />
                      <span>Création du compte...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle size={20} />
                      <span>Créer mon compte</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
