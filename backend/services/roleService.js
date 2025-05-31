//services/roleService.js - Service pour la gestion automatique des rôles
class RoleService {
  constructor(models) {
    this.models = models;
  }

  // Détermine le rôle selon le type d'utilisateur
  getRoleByUserType(type_user) {
    const professionalTypes = [
      'ecrivain', 'journaliste', 'scientifique', 'acteur', 'artiste', 
      'artisan', 'realisateur', 'musicien', 'photographe', 'danseur', 'sculpteur'
    ];

    if (type_user === 'visiteur') {
      return 'Visiteur';
    } else if (professionalTypes.includes(type_user)) {
      return 'Professionnel';
    } else {
      return 'Visiteur'; // Par défaut
    }
  }

  // Assigner automatiquement le rôle à un utilisateur
  async assignRoleToUser(user) {
    try {
      const roleName = this.getRoleByUserType(user.type_user);
      
      // Trouver le rôle dans la base de données
      const role = await this.models.Role.findOne({
        where: { nom_role: roleName }
      });

      if (!role) {
        throw new Error(`Rôle "${roleName}" non trouvé`);
      }

      // Vérifier si l'utilisateur a déjà ce rôle
      const existingRole = await this.models.UserRole.findOne({
        where: { 
          id_user: user.id_user, 
          id_role: role.id_role 
        }
      });

      if (!existingRole) {
        // Assigner le nouveau rôle
        await this.models.UserRole.create({
          id_user: user.id_user,
          id_role: role.id_role
        });

        console.log(`Rôle "${roleName}" assigné à l'utilisateur ${user.email}`);
      }

      return role;
    } catch (error) {
      console.error('Erreur lors de l\'assignation du rôle:', error);
      throw error;
    }
  }

  // Mettre à jour le rôle si le type d'utilisateur change
  async updateUserRole(user, oldTypeUser) {
    try {
      const oldRoleName = this.getRoleByUserType(oldTypeUser);
      const newRoleName = this.getRoleByUserType(user.type_user);

      if (oldRoleName !== newRoleName) {
        // Supprimer l'ancien rôle
        const oldRole = await this.models.Role.findOne({
          where: { nom_role: oldRoleName }
        });

        if (oldRole) {
          await this.models.UserRole.destroy({
            where: { 
              id_user: user.id_user, 
              id_role: oldRole.id_role 
            }
          });
        }

        // Assigner le nouveau rôle
        await this.assignRoleToUser(user);

        // Si l'utilisateur devient professionnel, marquer comme non validé
        if (newRoleName === 'Professionnel') {
          await user.update({
            professionnel_valide: false,
            statut_compte: 'en_attente_validation'
          });
        } else if (newRoleName === 'Visiteur') {
          await user.update({
            professionnel_valide: false,
            statut_compte: 'actif'
          });
        }

        console.log(`Rôle utilisateur mis à jour de "${oldRoleName}" vers "${newRoleName}"`);
      }

      return true;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du rôle:', error);
      throw error;
    }
  }

  // Valider un professionnel (Admin uniquement)
  async validateProfessional(userId, validatorId) {
    try {
      const user = await this.models.User.findByPk(userId);
      
      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }

      if (user.type_user === 'visiteur') {
        throw new Error('Les visiteurs ne peuvent pas être validés comme professionnels');
      }

      await user.update({
        professionnel_valide: true,
        date_validation_professionnel: new Date(),
        validateur_professionnel_id: validatorId,
        statut_compte: 'actif'
      });

      console.log(`Professionnel ${user.email} validé par l'admin ${validatorId}`);
      return user;
    } catch (error) {
      console.error('Erreur lors de la validation du professionnel:', error);
      throw error;
    }
  }

  // Récupérer les professionnels en attente de validation
  async getPendingProfessionals() {
    try {
      return await this.models.User.findAll({
        where: {
          type_user: {
            [this.models.Sequelize.Op.ne]: 'visiteur'
          },
          professionnel_valide: false,
          statut_compte: 'en_attente_validation'
        },
        attributes: { exclude: ['password'] },
        include: [
          {
            model: this.models.Role,
            through: { model: this.models.UserRole },
            attributes: ['nom_role']
          }
        ],
        order: [['date_creation', 'ASC']]
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des professionnels en attente:', error);
      throw error;
    }
  }
}

module.exports = RoleService;
