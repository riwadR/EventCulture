const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class UserController {
  constructor(models) {
    this.models = models;
  }

  // Récupérer tous les utilisateurs
  async getAllUsers(req, res) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        type_user,
        search,
        active_only = true
      } = req.query;

      const offset = (page - 1) * limit;
      const where = {};

      if (type_user) where.type_user = type_user;
      if (search) {
        where[Op.or] = [
          { nom: { [Op.like]: `%${search}%` } },
          { prenom: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } }
        ];
      }

      const users = await this.models.User.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset: parseInt(offset),
        attributes: { exclude: ['password'] }, // Ne pas retourner le mot de passe
        include: [
          {
            model: this.models.Role,
            through: { model: this.models.UserRole },
            attributes: ['nom_role', 'description']
          }
        ],
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

  // Récupérer un utilisateur par ID
  async getUserById(req, res) {
    try {
      const { id } = req.params;

      const user = await this.models.User.findByPk(id, {
        attributes: { exclude: ['password'] },
        include: [
          {
            model: this.models.Role,
            through: { model: this.models.UserRole },
            attributes: ['nom_role', 'description']
          },
          {
            model: this.models.Oeuvre,
            through: { 
              model: this.models.OeuvreUser,
              attributes: ['role_dans_oeuvre', 'role_principal']
            },
            attributes: ['titre', 'annee_creation', 'statut']
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

  // Créer un nouvel utilisateur
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
        roles = []
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

      // Créer l'utilisateur
      const user = await this.models.User.create({
        nom,
        prenom,
        email,
        password: hashedPassword,
        date_naissance,
        biographie,
        type_user,
        telephone
      });

      // Ajouter les rôles si spécifiés
      if (roles.length > 0) {
        const rolesExistants = await this.models.Role.findAll({
          where: { id_role: { [Op.in]: roles } }
        });
        await user.addRoles(rolesExistants);
      } else {
        // Ajouter le rôle "Utilisateur" par défaut
        const defaultRole = await this.models.Role.findOne({ 
          where: { nom_role: 'Utilisateur' } 
        });
        if (defaultRole) {
          await user.addRole(defaultRole);
        }
      }

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

      res.status(201).json({
        success: true,
        message: 'Utilisateur créé avec succès',
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

  // Connexion utilisateur
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

      // Générer le token JWT
      const token = jwt.sign(
        { 
          id_user: user.id_user, 
          email: user.email,
          roles: user.Roles.map(role => role.nom_role)
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Retourner les données utilisateur (sans mot de passe) et le token
      const userData = {
        id_user: user.id_user,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        type_user: user.type_user,
        roles: user.Roles
      };

      res.json({
        success: true,
        message: 'Connexion réussie',
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

  // Profil utilisateur (utilisateur connecté)
  async getProfile(req, res) {
    try {
      const user = await this.models.User.findByPk(req.user.id_user, {
        attributes: { exclude: ['password'] },
        include: [
          {
            model: this.models.Role,
            through: { model: this.models.UserRole },
            attributes: ['nom_role', 'description']
          },
          {
            model: this.models.Oeuvre,
            as: 'OeuvresSaisies',
            attributes: ['id_oeuvre', 'titre', 'statut', 'date_creation']
          }
        ]
      });

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

  // Mettre à jour le profil
  async updateProfile(req, res) {
    try {
      const { id_user } = req.user;
      const updates = req.body;

      // Supprimer les champs sensibles des mises à jour
      delete updates.password;
      delete updates.email; // L'email ne peut pas être modifié via cette route

      const user = await this.models.User.findByPk(id_user);
      await user.update(updates);

      const userUpdated = await this.models.User.findByPk(id_user, {
        attributes: { exclude: ['password'] }
      });

      res.json({
        success: true,
        message: 'Profil mis à jour avec succès',
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

  // Changer le mot de passe
  async changePassword(req, res) {
    try {
      const { current_password, new_password } = req.body;
      const { id_user } = req.user;

      if (!current_password || !new_password) {
        return res.status(400).json({
          success: false,
          error: 'Mot de passe actuel et nouveau mot de passe requis'
        });
      }

      const user = await this.models.User.findByPk(id_user);
      
      // Vérifier le mot de passe actuel
      const isValidPassword = await bcrypt.compare(current_password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          error: 'Mot de passe actuel incorrect'
        });
      }

      // Hasher le nouveau mot de passe
      const hashedNewPassword = await bcrypt.hash(new_password, 12);
      await user.update({ password: hashedNewPassword });

      res.json({
        success: true,
        message: 'Mot de passe mis à jour avec succès'
      });

    } catch (error) {
      console.error('Erreur lors du changement de mot de passe:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erreur serveur lors du changement de mot de passe' 
      });
    }
  }
}

module.exports = UserController;