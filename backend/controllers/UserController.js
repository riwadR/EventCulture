// controllers/userController.js - Version complète avec toutes les méthodes
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const RoleService = require('../services/roleService');

class UserController {
  constructor(models) {
    this.models = models;
    this.roleService = new RoleService(models);
  }

  // Créer un nouvel utilisateur avec attribution automatique du rôle
  async createUser(req, res) {
    try {
      const {
        nom,
        prenom,
        email,
        password,
        date_naissance,
        biographie,
        type_user = 'visiteur',
        telephone,
        documents_justificatifs = []
      } = req.body;

      // Validation des champs obligatoires
      if (!nom || !prenom || !email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Les champs nom, prénom, email et mot de passe sont obligatoires'
        });
      }

      // Vérifier si l'email existe déjà
      const existingUser = await this.models.User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          error: 'Un utilisateur avec cet email existe déjà'
        });
      }

      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(password, 12);

      // Déterminer le statut initial selon le type
      let statutCompte = 'actif';
      let professionnelValide = false;

      if (type_user !== 'visiteur') {
        // Les professionnels sont en attente de validation
        statutCompte = 'en_attente_validation';
        professionnelValide = false;
      }

      // Créer l'utilisateur
      const user = await this.models.User.create({
        nom,
        prenom,
        email,
        password: hashedPassword,
        date_naissance,
        biographie,
        type_user,
        telephone,
        documents_justificatifs,
        professionnel_valide: professionnelValide,
        statut_compte: statutCompte
      });

      // Assigner automatiquement le rôle approprié
      await this.roleService.assignRoleToUser(user);

      // Récupérer l'utilisateur complet pour la réponse
      const userComplete = await this.models.User.findByPk(user.id_user, {
        attributes: { exclude: ['password'] },
        include: [
          {
            model: this.models.Role,
            through: { model: this.models.UserRole },
            attributes: ['nom_role']
          }
        ]
      });

      // Message différent selon le type
      let message = 'Utilisateur créé avec succès';
      if (type_user !== 'visiteur') {
        message = 'Compte professionnel créé. En attente de validation par un administrateur.';
      }

      res.status(201).json({
        success: true,
        message,
        data: userComplete
      });

    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erreur serveur lors de la création de l\'utilisateur' 
      });
    }
  }

  // Connexion avec vérification du statut professionnel
  async loginUser(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Email et mot de passe requis'
        });
      }

      // Trouver l'utilisateur avec ses rôles
      const user = await this.models.User.findOne({
        where: { email },
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
          error: 'Identifiants invalides'
        });
      }

      // Vérifier le mot de passe
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          error: 'Identifiants invalides'
        });
      }

      // Vérifier le statut du compte
      if (user.statut_compte === 'suspendu') {
        return res.status(403).json({
          success: false,
          error: 'Votre compte a été suspendu. Contactez un administrateur.'
        });
      }

      if (user.statut_compte === 'desactive') {
        return res.status(403).json({
          success: false,
          error: 'Votre compte a été désactivé.'
        });
      }

      // Générer le token JWT
      const token = jwt.sign(
        { 
          id_user: user.id_user, 
          email: user.email,
          type_user: user.type_user,
          professionnel_valide: user.professionnel_valide,
          roles: user.Roles.map(role => role.nom_role)
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Données utilisateur pour la réponse
      const userData = {
        id_user: user.id_user,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        type_user: user.type_user,
        professionnel_valide: user.professionnel_valide,
        statut_compte: user.statut_compte,
        roles: user.Roles
      };

      // Message spécial pour les professionnels en attente
      let message = 'Connexion réussie';
      if (user.type_user !== 'visiteur' && !user.professionnel_valide) {
        message = 'Connexion réussie. Votre compte professionnel est en attente de validation.';
      }

      res.json({
        success: true,
        message,
        data: {
          user: userData,
          token
        }
      });

    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erreur serveur lors de la connexion' 
      });
    }
  }

  // MÉTHODE MANQUANTE: Récupérer le profil de l'utilisateur connecté
  async getProfile(req, res) {
    try {
      const { id_user } = req.user;

      const user = await this.models.User.findByPk(id_user, {
        attributes: { exclude: ['password'] },
        include: [
          {
            model: this.models.Role,
            through: { model: this.models.UserRole },
            attributes: ['nom_role']
          },
          {
            model: this.models.Organisation,
            through: { model: this.models.UserOrganisation },
            attributes: ['id_organisation', 'nom', 'type']
          }
        ]
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'Utilisateur non trouvé'
        });
      }

      res.json({
        success: true,
        data: user
      });

    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erreur serveur lors de la récupération du profil' 
      });
    }
  }

  // MÉTHODE MANQUANTE: Récupérer un utilisateur par son ID (route publique)
  async getUserById(req, res) {
    try {
      const { id } = req.params;

      const user = await this.models.User.findByPk(id, {
        attributes: { 
          exclude: ['password', 'documents_justificatifs', 'statut_compte'] 
        },
        include: [
          {
            model: this.models.Role,
            through: { model: this.models.UserRole },
            attributes: ['nom_role']
          }
        ]
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'Utilisateur non trouvé'
        });
      }

      res.json({
        success: true,
        data: user
      });

    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erreur serveur lors de la récupération de l\'utilisateur' 
      });
    }
  }

  // MÉTHODE MANQUANTE: Changer le mot de passe
  async changePassword(req, res) {
    try {
      const { id_user } = req.user;
      const { current_password, new_password } = req.body;

      if (!current_password || !new_password) {
        return res.status(400).json({
          success: false,
          error: 'Mot de passe actuel et nouveau mot de passe requis'
        });
      }

      // Récupérer l'utilisateur avec son mot de passe
      const user = await this.models.User.findByPk(id_user);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'Utilisateur non trouvé'
        });
      }

      // Vérifier le mot de passe actuel
      const isValidPassword = await bcrypt.compare(current_password, user.password);
      if (!isValidPassword) {
        return res.status(400).json({
          success: false,
          error: 'Mot de passe actuel incorrect'
        });
      }

      // Hasher le nouveau mot de passe
      const hashedNewPassword = await bcrypt.hash(new_password, 12);

      // Mettre à jour le mot de passe
      await user.update({ password: hashedNewPassword });

      res.json({
        success: true,
        message: 'Mot de passe modifié avec succès'
      });

    } catch (error) {
      console.error('Erreur lors du changement de mot de passe:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erreur serveur lors du changement de mot de passe' 
      });
    }
  }

  // Mettre à jour le profil avec gestion des changements de type
  async updateProfile(req, res) {
    try {
      const { id_user } = req.user;
      const updates = req.body;

      // Supprimer les champs sensibles des mises à jour
      delete updates.password;
      delete updates.email;
      delete updates.professionnel_valide;
      delete updates.statut_compte;

      const user = await this.models.User.findByPk(id_user);
      const oldTypeUser = user.type_user;

      await user.update(updates);

      // Si le type d'utilisateur a changé, mettre à jour les rôles
      if (updates.type_user && updates.type_user !== oldTypeUser) {
        await this.roleService.updateUserRole(user, oldTypeUser);
      }

      const userUpdated = await this.models.User.findByPk(id_user, {
        attributes: { exclude: ['password'] },
        include: [
          {
            model: this.models.Role,
            through: { model: this.models.UserRole },
            attributes: ['nom_role']
          }
        ]
      });

      let message = 'Profil mis à jour avec succès';
      if (updates.type_user && updates.type_user !== oldTypeUser && updates.type_user !== 'visiteur') {
        message = 'Profil mis à jour. Votre nouveau statut professionnel est en attente de validation.';
      }

      res.json({
        success: true,
        message,
        data: userUpdated
      });

    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erreur serveur lors de la mise à jour du profil' 
      });
    }
  }

  // Valider un professionnel (Admin uniquement)
  async validateProfessional(req, res) {
    try {
      const { id } = req.params;
      const { valide, raison_rejet } = req.body;

      if (!req.user.isAdmin) {
        return res.status(403).json({
          success: false,
          error: 'Seuls les administrateurs peuvent valider les professionnels'
        });
      }

      const user = await this.models.User.findByPk(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'Utilisateur non trouvé'
        });
      }

      if (user.type_user === 'visiteur') {
        return res.status(400).json({
          success: false,
          error: 'Les visiteurs ne peuvent pas être validés comme professionnels'
        });
      }

      if (valide) {
        await this.roleService.validateProfessional(id, req.user.id_user);
        
        res.json({
          success: true,
          message: 'Professionnel validé avec succès'
        });
      } else {
        await user.update({
          statut_compte: 'suspendu',
          raison_rejet
        });

        res.json({
          success: true,
          message: 'Demande de validation rejetée'
        });
      }

    } catch (error) {
      console.error('Erreur lors de la validation du professionnel:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erreur serveur lors de la validation' 
      });
    }
  }

  // Récupérer les professionnels en attente (Admin uniquement)
  async getPendingProfessionals(req, res) {
    try {
      if (!req.user.isAdmin) {
        return res.status(403).json({
          success: false,
          error: 'Accès réservé aux administrateurs'
        });
      }

      const professionals = await this.roleService.getPendingProfessionals();

      res.json({
        success: true,
        data: professionals,
        count: professionals.length
      });

    } catch (error) {
      console.error('Erreur lors de la récupération des professionnels en attente:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erreur serveur' 
      });
    }
  }

  // Récupérer tous les utilisateurs avec filtres (Admin uniquement)
  async getAllUsers(req, res) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        type_user,
        statut_compte,
        search,
        role
      } = req.query;

      const offset = (page - 1) * limit;
      const where = {};

      if (type_user) where.type_user = type_user;
      if (statut_compte) where.statut_compte = statut_compte;
      
      if (search) {
        where[this.models.Sequelize.Op.or] = [
          { nom: { [this.models.Sequelize.Op.like]: `%${search}%` } },
          { prenom: { [this.models.Sequelize.Op.like]: `%${search}%` } },
          { email: { [this.models.Sequelize.Op.like]: `%${search}%` } }
        ];
      }

      const include = [
        {
          model: this.models.Role,
          through: { model: this.models.UserRole },
          attributes: ['nom_role']
        }
      ];

      // Filtrer par rôle si spécifié
      if (role) {
        include[0].where = { nom_role: role };
        include[0].required = true;
      }

      const users = await this.models.User.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset: parseInt(offset),
        attributes: { exclude: ['password'] },
        include,
        order: [['date_creation', 'DESC']]
      });

      res.json({
        success: true,
        data: {
          users: users.rows,
          pagination: {
            total: users.count,
            page: parseInt(page),
            pages: Math.ceil(users.count / limit),
            limit: parseInt(limit)
          }
        }
      });

    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erreur serveur lors de la récupération des utilisateurs' 
      });
    }
  }
}

module.exports = UserController;