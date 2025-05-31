const jwt = require('jsonwebtoken');

class AuthMiddleware {
  constructor(models) {
    this.models = models;
  }

  // Middleware d'authentification
  authenticate = async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          success: false,
          error: 'Token d\'authentification requis'
        });
      }

      const token = authHeader.substring(7);
      
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await this.models.User.findByPk(decoded.id_user, {
          include: [
            {
              model: this.models.Role,
              through: { model: this.models.UserRole },
              attributes: ['nom_role']
            }
          ]
        });

        if (!user) {
          return res.status(401).json({
            success: false,
            error: 'Utilisateur non trouvé'
          });
        }

        // Vérifier si l'utilisateur professionnel est validé
        if (user.type_user !== 'visiteur' && !user.professionnel_valide) {
          return res.status(403).json({
            success: false,
            error: 'Compte professionnel en attente de validation par un administrateur'
          });
        }

        req.user = {
          id_user: user.id_user,
          nom: user.nom,
          prenom: user.prenom,
          email: user.email,
          type_user: user.type_user,
          professionnel_valide: user.professionnel_valide,
          roles: user.Roles.map(role => role.nom_role),
          isAdmin: user.Roles.some(role => role.nom_role === 'Admin'),
          isVisiteur: user.Roles.some(role => role.nom_role === 'Visiteur'),
          isProfessionnel: user.Roles.some(role => role.nom_role === 'Professionnel')
        };

        next();
      } catch (jwtError) {
        return res.status(401).json({
          success: false,
          error: 'Token invalide ou expiré'
        });
      }
    } catch (error) {
      console.error('Erreur dans le middleware d\'authentification:', error);
      return res.status(500).json({
        success: false,
        error: 'Erreur serveur lors de l\'authentification'
      });
    }
  };

  // Middleware pour vérifier les rôles spécifiques
  requireRole = (allowedRoles) => {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Authentification requise'
        });
      }

      const userRoles = req.user.roles || [];
      const hasRequiredRole = allowedRoles.some(role => userRoles.includes(role));

      if (!hasRequiredRole) {
        return res.status(403).json({
          success: false,
          error: 'Permissions insuffisantes',
          required_roles: allowedRoles,
          user_roles: userRoles
        });
      }

      next();
    };
  };

  // Middleware pour les administrateurs uniquement
  requireAdmin = (req, res, next) => {
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'Accès réservé aux administrateurs'
      });
    }
    next();
  };

  // Middleware pour les professionnels validés
  requireValidatedProfessional = (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentification requise'
      });
    }

    if (!req.user.isProfessionnel || !req.user.professionnel_valide) {
      return res.status(403).json({
        success: false,
        error: 'Accès réservé aux professionnels validés'
      });
    }

    next();
  };

  // Middleware pour vérifier la propriété d'une ressource
  requireOwnership = (resourceModel, resourceIdParam = 'id', userIdField = 'saisi_par') => {
    return async (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Authentification requise'
        });
      }

      // Les admins peuvent tout modifier
      if (req.user.isAdmin) {
        return next();
      }

      try {
        const resourceId = req.params[resourceIdParam];
        const resource = await this.models[resourceModel].findByPk(resourceId);

        if (!resource) {
          return res.status(404).json({
            success: false,
            error: 'Ressource non trouvée'
          });
        }

        if (resource[userIdField] !== req.user.id_user) {
          return res.status(403).json({
            success: false,
            error: 'Vous ne pouvez modifier que vos propres ressources'
          });
        }

        req.resource = resource;
        next();
      } catch (error) {
        console.error('Erreur lors de la vérification de propriété:', error);
        return res.status(500).json({
          success: false,
          error: 'Erreur serveur'
        });
      }
    };
  };

  // Middleware pour vérifier l'appartenance à une organisation (pour les événements)
  requireOrganizationMembership = async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentification requise'
      });
    }

    // Les admins peuvent créer des événements sans organisation
    if (req.user.isAdmin) {
      return next();
    }

    if (!req.user.isProfessionnel) {
      return res.status(403).json({
        success: false,
        error: 'Seuls les professionnels peuvent créer des événements'
      });
    }

    try {
      // Vérifier si l'utilisateur est lié à au moins une organisation
      const userOrganizations = await this.models.User.findByPk(req.user.id_user, {
        include: [
          {
            model: this.models.Organisation,
            through: { model: this.models.UserOrganisation },
            attributes: ['id_organisation', 'nom']
          }
        ]
      });

      if (!userOrganizations.Organisations || userOrganizations.Organisations.length === 0) {
        return res.status(403).json({
          success: false,
          error: 'Vous devez être lié à une organisation pour créer des événements'
        });
      }

      req.userOrganizations = userOrganizations.Organisations;
      next();
    } catch (error) {
      console.error('Erreur lors de la vérification d\'organisation:', error);
      return res.status(500).json({
        success: false,
        error: 'Erreur serveur'
      });
    }
  };
}

// Factory function pour créer le middleware avec les modèles
const createAuthMiddleware = (models) => {
  const authMiddleware = new AuthMiddleware(models);
  return {
    authenticate: authMiddleware.authenticate,
    requireRole: authMiddleware.requireRole,
    requireAdmin: authMiddleware.requireAdmin,
    requireValidatedProfessional: authMiddleware.requireValidatedProfessional,
    requireOwnership: authMiddleware.requireOwnership,
    requireOrganizationMembership: authMiddleware.requireOrganizationMembership
  };
};

module.exports = createAuthMiddleware;
