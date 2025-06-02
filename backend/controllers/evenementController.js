const { Op } = require('sequelize');

class EvenementController {
  constructor(models) {
    this.models = models;
  }

  // Récupérer tous les événements
  async getAllEvenements(req, res) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        type,
        lieu,
        date_debut,
        date_fin,
        status = 'active',
        search,
        wilaya,
        organisateur
      } = req.query;

      const offset = (page - 1) * limit;
      const where = {};
      const include = [
        { 
          model: this.models.TypeEvenement,
          attributes: ['nom_type', 'description']
        },
        { 
          model: this.models.Lieu,
          attributes: ['nom', 'adresse', 'latitude', 'longitude'],
          include: [
            { model: this.models.Wilaya, attributes: ['nom'] },
            { model: this.models.Commune, attributes: ['nom'] }
          ]
        },
        { 
          model: this.models.User,
          attributes: ['nom', 'prenom', 'type_user']
        }
      ];

      // Filtres
      if (type) where.id_type_evenement = type;
      if (lieu) where.id_lieu = lieu;
      if (organisateur) where.id_user = organisateur;

      // Filtrage par dates
      if (date_debut) {
        where.date_debut = { [Op.gte]: new Date(date_debut) };
      }
      if (date_fin) {
        where.date_fin = { [Op.lte]: new Date(date_fin) };
      }

      // Filtrage par statut temporel
      if (status === 'active') {
        where.date_fin = { [Op.gte]: new Date() };
      } else if (status === 'past') {
        where.date_fin = { [Op.lt]: new Date() };
      } else if (status === 'upcoming') {
        where.date_debut = { [Op.gt]: new Date() };
      }

      // Recherche textuelle
      if (search) {
        where[Op.or] = [
          { nom_evenement: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } }
        ];
      }

      // Filtrage par wilaya
      if (wilaya) {
        include[1].where = { wilayaId: wilaya };
        include[1].required = true;
      }

      const evenements = await this.models.Evenement.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset: parseInt(offset),
        include,
        order: [['date_debut', 'ASC']],
        distinct: true
      });

      res.json({
        success: true,
        data: {
          evenements: evenements.rows,
          pagination: {
            total: evenements.count,
            page: parseInt(page),
            pages: Math.ceil(evenements.count / limit),
            limit: parseInt(limit)
          }
        }
      });

    } catch (error) {
      console.error('Erreur lors de la récupération des événements:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erreur serveur lors de la récupération des événements' 
      });
    }
  }

  // Récupérer un événement par ID
  async getEvenementById(req, res) {
    try {
      const { id } = req.params;

      const evenement = await this.models.Evenement.findByPk(id, {
        include: [
          { model: this.models.TypeEvenement },
          { 
            model: this.models.Lieu,
            include: [
              { model: this.models.DetailLieu },
              { model: this.models.Wilaya },
              { model: this.models.Daira },
              { model: this.models.Commune }
            ]
          },
          { model: this.models.User, attributes: ['nom', 'prenom', 'email', 'telephone'] },
          {
            model: this.models.Programme,
            include: [
              {
                model: this.models.User,
                through: { model: this.models.ProgrammeIntervenant },
                attributes: ['nom', 'prenom', 'type_user']
              }
            ],
            order: [['ordre', 'ASC'], ['heure_debut', 'ASC']]
          },
          {
            model: this.models.Oeuvre,
            through: { 
              model: this.models.EvenementOeuvre,
              include: [
                { model: this.models.User, as: 'Presentateur', attributes: ['nom', 'prenom'] }
              ]
            },
            attributes: ['titre', 'annee_creation', 'description']
          },
          {
            model: this.models.User,
            through: { 
              model: this.models.EvenementUser,
              attributes: ['role_participation', 'statut_participation']
            },
            attributes: ['nom', 'prenom', 'type_user']
          },
          {
            model: this.models.Organisation,
            through: { 
              model: this.models.EvenementOrganisation,
              attributes: ['role']
            },
            attributes: ['nom', 'description', 'site_web']
          },
          { model: this.models.Media }
        ]
      });

      if (!evenement) {
        return res.status(404).json({ 
          success: false, 
          error: 'Événement non trouvé' 
        });
      }

      res.json({
        success: true,
        data: evenement
      });

    } catch (error) {
      console.error('Erreur lors de la récupération de l\'événement:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erreur serveur lors de la récupération de l\'événement' 
      });
    }
  }

  // Créer un nouvel événement
  async createEvenement(req, res) {
    const transaction = await this.models.sequelize.transaction();

    try {
      const {
        nom_evenement,
        description,
        date_debut,
        date_fin,
        id_lieu,
        id_type_evenement,
        contact_email,
        contact_telephone,
        image_url,
        oeuvres = [],
        participants = [],
        organisations = [],
        programmes = []
      } = req.body;

      // Validation des champs obligatoires
      if (!nom_evenement || !id_lieu || !id_type_evenement) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          error: 'Les champs nom_evenement, lieu et type d\'événement sont obligatoires'
        });
      }

      // Créer l'événement
      const evenement = await this.models.Evenement.create({
        nom_evenement,
        description,
        date_debut: date_debut ? new Date(date_debut) : null,
        date_fin: date_fin ? new Date(date_fin) : null,
        id_lieu,
        id_type_evenement,
        id_user: req.user?.id_user,
        contact_email,
        contact_telephone,
        image_url
      }, { transaction });

      // Ajouter les œuvres présentées
      if (oeuvres.length > 0) {
        for (const oeuvre of oeuvres) {
          await this.models.EvenementOeuvre.create({
            id_evenement: evenement.id_evenement,
            id_oeuvre: oeuvre.id_oeuvre,
            id_presentateur: oeuvre.id_presentateur
          }, { transaction });
        }
      }

      // Ajouter les participants
      if (participants.length > 0) {
        for (const participant of participants) {
          await this.models.EvenementUser.create({
            id_evenement: evenement.id_evenement,
            id_user: participant.id_user,
            role_participation: participant.role_participation || 'participant',
            statut_participation: 'confirme'
          }, { transaction });
        }
      }

      // Ajouter les organisations partenaires
      if (organisations.length > 0) {
        for (const org of organisations) {
          await this.models.EvenementOrganisation.create({
            id_evenement: evenement.id_evenement,
            id_organisation: org.id_organisation,
            role: org.role || 'partenaire'
          }, { transaction });
        }
      }

      // Ajouter les programmes
      if (programmes.length > 0) {
        for (const prog of programmes) {
          const programme = await this.models.Programme.create({
            id_evenement: evenement.id_evenement,
            titre: prog.titre,
            description: prog.description,
            heure_debut: prog.heure_debut ? new Date(prog.heure_debut) : null,
            heure_fin: prog.heure_fin ? new Date(prog.heure_fin) : null,
            type_activite: prog.type_activite,
            ordre: prog.ordre || 1
          }, { transaction });

          // Ajouter les intervenants du programme
          if (prog.intervenants && prog.intervenants.length > 0) {
            const intervenants = await this.models.User.findAll({
              where: { id_user: { [Op.in]: prog.intervenants } }
            });
            await programme.addUsers(intervenants, { transaction });
          }
        }
      }

      await transaction.commit();

      // Récupérer l'événement complet pour la réponse
      const evenementComplet = await this.getEvenementComplet(evenement.id_evenement);

      res.status(201).json({
        success: true,
        message: 'Événement créé avec succès',
        data: evenementComplet
      });

    } catch (error) {
      await transaction.rollback();
      console.error('Erreur lors de la création de l\'événement:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erreur serveur lors de la création de l\'événement' 
      });
    }
  }

  // MÉTHODE MANQUANTE: Mettre à jour un événement
  async updateEvenement(req, res) {
    const transaction = await this.models.sequelize.transaction();

    try {
      const { id } = req.params;
      const updates = req.body;

      // Vérifier que l'événement existe
      const evenement = await this.models.Evenement.findByPk(id);
      if (!evenement) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          error: 'Événement non trouvé'
        });
      }

      // Supprimer les champs sensibles des mises à jour
      delete updates.id_evenement;
      delete updates.id_user;

      // Mettre à jour l'événement
      await evenement.update(updates, { transaction });

      await transaction.commit();

      // Récupérer l'événement mis à jour
      const evenementMisAJour = await this.getEvenementComplet(id);

      res.json({
        success: true,
        message: 'Événement mis à jour avec succès',
        data: evenementMisAJour
      });

    } catch (error) {
      await transaction.rollback();
      console.error('Erreur lors de la mise à jour de l\'événement:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erreur serveur lors de la mise à jour de l\'événement' 
      });
    }
  }

  // Inscription à un événement
  async inscrireUtilisateur(req, res) {
    try {
      const { id } = req.params;
      const { role_participation = 'participant', notes } = req.body;
      const { id_user } = req.user;

      // Vérifier si l'événement existe
      const evenement = await this.models.Evenement.findByPk(id);
      if (!evenement) {
        return res.status(404).json({
          success: false,
          error: 'Événement non trouvé'
        });
      }

      // Vérifier si l'utilisateur n'est pas déjà inscrit
      const inscriptionExistante = await this.models.EvenementUser.findOne({
        where: { id_evenement: id, id_user }
      });

      if (inscriptionExistante) {
        return res.status(409).json({
          success: false,
          error: 'Vous êtes déjà inscrit à cet événement'
        });
      }

      // Créer l'inscription
      await this.models.EvenementUser.create({
        id_evenement: id,
        id_user,
        role_participation,
        date_inscription: new Date(),
        statut_participation: 'inscrit',
        notes
      });

      res.status(201).json({
        success: true,
        message: 'Inscription réussie'
      });

    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erreur serveur lors de l\'inscription' 
      });
    }
  }

  // MÉTHODE MANQUANTE: Valider la participation d'un utilisateur
  async validateParticipation(req, res) {
    try {
      const { id, userId } = req.params;
      const { statut_participation, notes } = req.body;

      // Vérifier que l'événement existe
      const evenement = await this.models.Evenement.findByPk(id);
      if (!evenement) {
        return res.status(404).json({
          success: false,
          error: 'Événement non trouvé'
        });
      }

      // Vérifier que l'inscription existe
      const inscription = await this.models.EvenementUser.findOne({
        where: { 
          id_evenement: id, 
          id_user: userId 
        }
      });

      if (!inscription) {
        return res.status(404).json({
          success: false,
          error: 'Inscription non trouvée'
        });
      }

      // Mettre à jour le statut de participation
      await inscription.update({
        statut_participation,
        notes,
        date_validation: new Date(),
        valide_par: req.user.id_user
      });

      res.json({
        success: true,
        message: `Participation ${statut_participation === 'confirme' ? 'confirmée' : 'rejetée'} avec succès`
      });

    } catch (error) {
      console.error('Erreur lors de la validation de participation:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erreur serveur lors de la validation de participation' 
      });
    }
  }

  // Événements à venir
  async getEvenementsAvenir(req, res) {
    try {
      const { limit = 10, wilaya } = req.query;
      const where = {
        date_debut: { [Op.gte]: new Date() }
      };

      const include = [
        { model: this.models.TypeEvenement, attributes: ['nom_type'] },
        { 
          model: this.models.Lieu,
          attributes: ['nom', 'adresse'],
          include: [{ model: this.models.Wilaya, attributes: ['nom'] }]
        }
      ];

      if (wilaya) {
        include[1].where = { wilayaId: wilaya };
        include[1].required = true;
      }

      const evenements = await this.models.Evenement.findAll({
        where,
        include,
        limit: parseInt(limit),
        order: [['date_debut', 'ASC']]
      });

      res.json({
        success: true,
        data: evenements
      });

    } catch (error) {
      console.error('Erreur lors de la récupération des événements à venir:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erreur serveur' 
      });
    }
  }

  // Méthode utilitaire pour récupérer un événement complet
  async getEvenementComplet(id) {
    return await this.models.Evenement.findByPk(id, {
      include: [
        { model: this.models.TypeEvenement },
        { model: this.models.Lieu },
        { model: this.models.User, attributes: ['nom', 'prenom'] }
      ]
    });
  }
}

module.exports = EvenementController;