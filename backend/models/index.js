const fs = require('fs');
const path = require('path');
const { createDatabaseConnection } = require('../config/database');

// Fonction d'import des données géographiques modifiée
async function importData(models) {
  try {
    console.log('📍 Import des données géographiques d\'Algérie...');
    
    const rawData = fs.readFileSync(path.join(__dirname, 'algeria_cities.json'), 'utf-8');
    const data = JSON.parse(rawData);

    const wilayaCache = new Map();
    const dairaCache = new Map();

    for (const entry of data) {
      const codeW = parseInt(entry.wilaya_code, 10);
      const wilayaNom = entry.wilaya_name;
      const wilayaNomAscii = entry.wilaya_name_ascii;

      const dairaNom = entry.daira_name;
      const dairaNomAscii = entry.daira_name_ascii;

      const communeNom = entry.commune_name;
      const communeNomAscii = entry.commune_name_ascii;

      // Wilaya
      let wilaya = wilayaCache.get(codeW);
      if (!wilaya) {
        wilaya = await models.Wilaya.findOne({ where: { codeW } });
        if (!wilaya) {
          wilaya = await models.Wilaya.create({
            codeW,
            nom: wilayaNom,
            wilaya_name_ascii: wilayaNomAscii,
          });
        }
        wilayaCache.set(codeW, wilaya);
      }

      // Daira
      const dairaKey = `${codeW}-${dairaNomAscii}`;
      let daira = dairaCache.get(dairaKey);
      if (!daira) {
        daira = await models.Daira.findOne({
          where: {
            nom: dairaNom,
            wilayaId: wilaya.id_wilaya
          }
        });
        if (!daira) {
          daira = await models.Daira.create({
            nom: dairaNom,
            daira_name_ascii: dairaNomAscii,
            wilayaId: wilaya.id_wilaya,
          });
        }
        dairaCache.set(dairaKey, daira);
      }

      // Commune
      const exists = await models.Commune.findOne({
        where: {
          nom: communeNom,
          dairaId: daira.id_daira
        }
      });
      if (!exists) {
        await models.Commune.create({
          nom: communeNom,
          commune_name_ascii: communeNomAscii,
          dairaId: daira.id_daira,
        });
      }
    }

    console.log('✅ Import des données géographiques terminé avec succès.');
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'import des données géographiques:', error);
    throw error;
  }
}

// Fonction utilitaire pour charger un modèle de manière sécurisée
const loadModelSafely = (modelPath, modelName, sequelize) => {
  try {
    const model = require(modelPath)(sequelize);
    console.log(`✅ Modèle ${modelName} chargé avec succès`);
    return model;
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      console.log(`⚠️  Modèle ${modelName} non trouvé (${modelPath}) - ignoré`);
      return null;
    } else {
      console.error(`❌ Erreur lors du chargement de ${modelName}:`, error.message);
      throw error;
    }
  }
};

const loadModels = (sequelize) => {
  const models = {};

  console.log('📦 Chargement des modèles...');

  // Modèles géographiques
  const wilayaModel = loadModelSafely('./geography/Wilaya', 'Wilaya', sequelize);
  if (wilayaModel) models.Wilaya = wilayaModel;
  
  const dairaModel = loadModelSafely('./geography/Daira', 'Daira', sequelize);
  if (dairaModel) models.Daira = dairaModel;
  
  const communeModel = loadModelSafely('./geography/Commune', 'Commune', sequelize);
  if (communeModel) models.Commune = communeModel;
  
  const localiteModel = loadModelSafely('./geography/Localite', 'Localite', sequelize);
  if (localiteModel) models.Localite = localiteModel;

  // Modèles utilisateurs
  const userModel = loadModelSafely('./users/User', 'User', sequelize);
  if (userModel) models.User = userModel;
  
  const roleModel = loadModelSafely('./users/Role', 'Role', sequelize);
  if (roleModel) models.Role = roleModel;
  
  const userRoleModel = loadModelSafely('./users/UserRole', 'UserRole', sequelize);
  if (userRoleModel) models.UserRole = userRoleModel;

  // Modèles de classification
  const langueModel = loadModelSafely('./classifications/Langue', 'Langue', sequelize);
  if (langueModel) models.Langue = langueModel;
  
  const categorieModel = loadModelSafely('./classifications/Categorie', 'Categorie', sequelize);
  if (categorieModel) models.Categorie = categorieModel;
  
  const genreModel = loadModelSafely('./classifications/Genre', 'Genre', sequelize);
  if (genreModel) models.Genre = genreModel;
  
  const typeOeuvreModel = loadModelSafely('./classifications/TypeOeuvre', 'TypeOeuvre', sequelize);
  if (typeOeuvreModel) models.TypeOeuvre = typeOeuvreModel;
  
  const tagMotCleModel = loadModelSafely('./classifications/TagMotCle', 'TagMotCle', sequelize);
  if (tagMotCleModel) models.TagMotCle = tagMotCleModel;
  
  const materiauModel = loadModelSafely('./classifications/Materiau', 'Materiau', sequelize);
  if (materiauModel) models.Materiau = materiauModel;
  
  const techniqueModel = loadModelSafely('./classifications/Technique', 'Technique', sequelize);
  if (techniqueModel) models.Technique = techniqueModel;

  // Modèles d'organisations
  const typeOrganisationModel = loadModelSafely('./organisations/TypeOrganisation', 'TypeOrganisation', sequelize);
  if (typeOrganisationModel) models.TypeOrganisation = typeOrganisationModel;
  
  const organisationModel = loadModelSafely('./organisations/Organisation', 'Organisation', sequelize);
  if (organisationModel) models.Organisation = organisationModel;
  
  const editeurModel = loadModelSafely('./organisations/Editeur', 'Editeur', sequelize);
  if (editeurModel) models.Editeur = editeurModel;

  // Modèles d'œuvres
  const oeuvreModel = loadModelSafely('./oeuvres/Oeuvre', 'Oeuvre', sequelize);
  if (oeuvreModel) models.Oeuvre = oeuvreModel;
  
  const livreModel = loadModelSafely('./oeuvres/Livre', 'Livre', sequelize);
  if (livreModel) models.Livre = livreModel;
  
  const filmModel = loadModelSafely('./oeuvres/Film', 'Film', sequelize);
  if (filmModel) models.Film = filmModel;
  
  const albumMusicalModel = loadModelSafely('./oeuvres/AlbumMusical', 'AlbumMusical', sequelize);
  if (albumMusicalModel) models.AlbumMusical = albumMusicalModel;
  
  const articleModel = loadModelSafely('./oeuvres/Article', 'Article', sequelize);
  if (articleModel) models.Article = articleModel;
  
  const articleScientifiqueModel = loadModelSafely('./oeuvres/ArticleScientifique', 'ArticleScientifique', sequelize);
  if (articleScientifiqueModel) models.ArticleScientifique = articleScientifiqueModel;
  
  const artisanatModel = loadModelSafely('./oeuvres/Artisanat', 'Artisanat', sequelize);
  if (artisanatModel) models.Artisanat = artisanatModel;
  
  const oeuvreArtModel = loadModelSafely('./oeuvres/OeuvreArt', 'OeuvreArt', sequelize);
  if (oeuvreArtModel) models.OeuvreArt = oeuvreArtModel;

  // Modèles de lieux
  const lieuModel = loadModelSafely('./places/Lieu', 'Lieu', sequelize);
  if (lieuModel) models.Lieu = lieuModel;
  
  const detailLieuModel = loadModelSafely('./places/DetailLieu', 'DetailLieu', sequelize);
  if (detailLieuModel) models.DetailLieu = detailLieuModel;
  
  const serviceModel = loadModelSafely('./places/Service', 'Service', sequelize);
  if (serviceModel) models.Service = serviceModel;
  
  const lieuMediaModel = loadModelSafely('./places/LieuMedia', 'LieuMedia', sequelize);
  if (lieuMediaModel) models.LieuMedia = lieuMediaModel;
  
  const monumentModel = loadModelSafely('./places/Monument', 'Monument', sequelize);
  if (monumentModel) models.Monument = monumentModel;
  
  const vestigeModel = loadModelSafely('./places/Vestige', 'Vestige', sequelize);
  if (vestigeModel) models.Vestige = vestigeModel;

  // Modèles d'événements
  const typeEvenementModel = loadModelSafely('./events/TypeEvenement', 'TypeEvenement', sequelize);
  if (typeEvenementModel) models.TypeEvenement = typeEvenementModel;
  
  const evenementModel = loadModelSafely('./events/Evenement', 'Evenement', sequelize);
  if (evenementModel) models.Evenement = evenementModel;
  
  const programmeModel = loadModelSafely('./events/Programme', 'Programme', sequelize);
  if (programmeModel) models.Programme = programmeModel;
  
  const parcoursModel = loadModelSafely('./events/Parcours', 'Parcours', sequelize);
  if (parcoursModel) models.Parcours = parcoursModel;

  // Tables de liaison
  const oeuvreUserModel = loadModelSafely('./associations/OeuvreUser', 'OeuvreUser', sequelize);
  if (oeuvreUserModel) models.OeuvreUser = oeuvreUserModel;
  
  const oeuvreEditeurModel = loadModelSafely('./associations/OeuvreEditeur', 'OeuvreEditeur', sequelize);
  if (oeuvreEditeurModel) models.OeuvreEditeur = oeuvreEditeurModel;
  
  const oeuvreCategorieModel = loadModelSafely('./associations/OeuvreCategorie', 'OeuvreCategorie', sequelize);
  if (oeuvreCategorieModel) models.OeuvreCategorie = oeuvreCategorieModel;
  
  const oeuvreTagModel = loadModelSafely('./associations/OeuvreTag', 'OeuvreTag', sequelize);
  if (oeuvreTagModel) models.OeuvreTag = oeuvreTagModel;
  
  const evenementOeuvreModel = loadModelSafely('./associations/EvenementOeuvre', 'EvenementOeuvre', sequelize);
  if (evenementOeuvreModel) models.EvenementOeuvre = evenementOeuvreModel;
  
  const evenementUserModel = loadModelSafely('./associations/EvenementUser', 'EvenementUser', sequelize);
  if (evenementUserModel) models.EvenementUser = evenementUserModel;
  
  const evenementOrganisationModel = loadModelSafely('./associations/EvenementOrganisation', 'EvenementOrganisation', sequelize);
  if (evenementOrganisationModel) models.EvenementOrganisation = evenementOrganisationModel;
  
  const programmeIntervenantModel = loadModelSafely('./associations/ProgrammeIntervenant', 'ProgrammeIntervenant', sequelize);
  if (programmeIntervenantModel) models.ProgrammeIntervenant = programmeIntervenantModel;
  
  const parcoursLieuModel = loadModelSafely('./associations/ParcoursLieu', 'ParcoursLieu', sequelize);
  if (parcoursLieuModel) models.ParcoursLieu = parcoursLieuModel;
  
  // IMPORTANT: Modèle UserOrganisation
  const userOrganisationModel = loadModelSafely('./associations/UserOrganisation', 'UserOrganisation', sequelize);
  if (userOrganisationModel) models.UserOrganisation = userOrganisationModel;

  // Modèles divers
  const mediaModel = loadModelSafely('./misc/Media', 'Media', sequelize);
  if (mediaModel) models.Media = mediaModel;
  
  const commentaireModel = loadModelSafely('./misc/Commentaire', 'Commentaire', sequelize);
  if (commentaireModel) models.Commentaire = commentaireModel;
  
  const critiqueEvaluationModel = loadModelSafely('./misc/CritiqueEvaluation', 'CritiqueEvaluation', sequelize);
  if (critiqueEvaluationModel) models.CritiqueEvaluation = critiqueEvaluationModel;

  console.log(`📦 ${Object.keys(models).length} modèles chargés avec succès`);
  
  return models;
};

// Initialiser les associations
const initializeAssociations = (models) => {
  Object.keys(models).forEach(modelName => {
    if (models[modelName].associate) {
      models[modelName].associate(models);
    }
  });
};

// Fonction utilitaire pour insérer des données si le modèle existe
const insertDataIfModelExists = async (models, modelName, data, insertFunction) => {
  if (models[modelName]) {
    try {
      await insertFunction(models[modelName], data);
      console.log(`✅ Données pour ${modelName} insérées`);
    } catch (error) {
      console.error(`❌ Erreur lors de l'insertion des données pour ${modelName}:`, error.message);
    }
  } else {
    console.log(`⚠️  Modèle ${modelName} non disponible - données ignorées`);
  }
};

// Données par défaut
const insertDefaultData = async (models) => {
  try {
    console.log('📊 Insertion des données par défaut...');
    
    // APPEL À LA FONCTION IMPORTDATA() POUR LES DONNÉES GÉOGRAPHIQUES
    // Vérifier d'abord que les modèles géographiques existent
    if (models.Wilaya && models.Daira && models.Commune) {
      await importData(models);
    } else {
      console.log('⚠️  Modèles géographiques manquants - import des données d\'Algérie ignoré');
    }
    
    // Langues par défaut
    const defaultLangues = [
      { nom: 'Tamazight', code: 'tm' },
      { nom: 'Tifinagh', code: 'tif' },
      { nom: 'Arabe', code: 'ar' },
      { nom: 'Derja', code: 'de' },
      { nom: 'Français', code: 'fr' },
      { nom: 'Anglais', code: 'en' }
    ];
    
    await insertDataIfModelExists(models, 'Langue', defaultLangues, async (model, data) => {
      for (const langue of data) {
        await model.findOrCreate({
          where: { nom: langue.nom },
          defaults: langue
        });
      }
    });
    
    // Catégories par défaut
    const defaultCategories = [
      'Roman', 'Poésie', 'Bande dessinée', 'Essai', 'Histoire', 'Biographie',
      'Peinture', 'Sculpture', 'Documentaire', 'Fiction', 'Jazz', 'Classique',
      'Musique traditionnelle', 'Cinéma d\'auteur', 'Comédie', 'Drame',
      'Court métrage', 'Photographie'
    ];
    
    await insertDataIfModelExists(models, 'Categorie', defaultCategories, async (model, data) => {
      for (const nom of data) {
        await model.findOrCreate({
          where: { nom },
          defaults: { nom }
        });
      }
    });
    
    // Types d'œuvres par défaut
    const defaultTypesOeuvres = [
      { nom_type: 'Livre', description: 'Œuvres littéraires et ouvrages' },
      { nom_type: 'Film', description: 'Œuvres cinématographiques' },
      { nom_type: 'Album Musical', description: 'Œuvres musicales' },
      { nom_type: 'Article', description: 'Articles de presse et blogs' },
      { nom_type: 'Article Scientifique', description: 'Publications scientifiques' },
      { nom_type: 'Artisanat', description: 'Œuvres artisanales' },
      { nom_type: 'Œuvre d\'Art', description: 'Œuvres d\'art visuel' },
      { nom_type: 'Photographie', description: 'Œuvres photographiques' },
      { nom_type: 'Théâtre', description: 'Pièces de théâtre' },
      { nom_type: 'Danse', description: 'Spectacles de danse' },
      { nom_type: 'Performance', description: 'Art performance' },
      { nom_type: 'Installation', description: 'Installations artistiques' }
    ];
    
    await insertDataIfModelExists(models, 'TypeOeuvre', defaultTypesOeuvres, async (model, data) => {
      for (const typeOeuvre of data) {
        await model.findOrCreate({
          where: { nom_type: typeOeuvre.nom_type },
          defaults: typeOeuvre
        });
      }
    });
    
    // Types d'événements par défaut
    const defaultTypesEvenements = [
      { nom_type: 'Festival', description: 'Festivals culturels' },
      { nom_type: 'Exposition', description: 'Expositions d\'art' },
      { nom_type: 'Concert', description: 'Concerts et spectacles musicaux' },
      { nom_type: 'Conférence', description: 'Conférences et colloques' },
      { nom_type: 'Atelier', description: 'Ateliers créatifs' },
      { nom_type: 'Visite guidée', description: 'Visites culturelles' },
      { nom_type: 'Spectacle', description: 'Spectacles vivants' },
      { nom_type: 'Projection', description: 'Projections cinématographiques' },
      { nom_type: 'Lecture', description: 'Lectures publiques' },
      { nom_type: 'Débat', description: 'Débats culturels' }
    ];
    
    await insertDataIfModelExists(models, 'TypeEvenement', defaultTypesEvenements, async (model, data) => {
      for (const typeEvenement of data) {
        await model.findOrCreate({
          where: { nom_type: typeEvenement.nom_type },
          defaults: typeEvenement
        });
      }
    });
    
    // Types d'organisations par défaut
    const defaultTypesOrganisations = [
      'Association culturelle',
      'Ministère',
      'Collectivité territoriale',
      'Institution publique',
      'Fondation',
      'ONG',
      'Entreprise privée',
      'Université',
      'École',
      'Musée',
      'Bibliothèque'
    ];
    
    await insertDataIfModelExists(models, 'TypeOrganisation', defaultTypesOrganisations, async (model, data) => {
      for (const nom of data) {
        await model.findOrCreate({
          where: { nom },
          defaults: { nom }
        });
      }
    });
    
    // Rôles par défaut
    const defaultRoles = [
      { nom_role: 'Administrateur', description: 'Accès complet au système' },
      { nom_role: 'Modérateur', description: 'Modération du contenu' },
      { nom_role: 'Contributeur', description: 'Ajout et modification de contenu' },
      { nom_role: 'Utilisateur', description: 'Consultation et participation' },
      { nom_role: 'Organisateur', description: 'Organisation d\'événements' },
      { nom_role: 'Critique', description: 'Évaluation des œuvres' }
    ];
    
    await insertDataIfModelExists(models, 'Role', defaultRoles, async (model, data) => {
      for (const role of data) {
        await model.findOrCreate({
          where: { nom_role: role.nom_role },
          defaults: role
        });
      }
    });
    
    // Matériaux par défaut
    const defaultMateriaux = [
      { nom: 'Bois', description: 'Matériau naturel' },
      { nom: 'Pierre', description: 'Matériau minéral' },
      { nom: 'Métal', description: 'Matériau métallique' },
      { nom: 'Céramique', description: 'Terre cuite' },
      { nom: 'Textile', description: 'Fibres textiles' },
      { nom: 'Cuir', description: 'Peau animale traitée' },
      { nom: 'Verre', description: 'Matériau transparent' },
      { nom: 'Papier', description: 'Support d\'écriture' },
      { nom: 'Plastique', description: 'Matériau synthétique' }
    ];
    
    await insertDataIfModelExists(models, 'Materiau', defaultMateriaux, async (model, data) => {
      for (const materiau of data) {
        await model.findOrCreate({
          where: { nom: materiau.nom },
          defaults: materiau
        });
      }
    });
    
    // Techniques par défaut
    const defaultTechniques = [
      { nom: 'Sculpture', description: 'Art du volume' },
      { nom: 'Peinture', description: 'Art pictural' },
      { nom: 'Gravure', description: 'Art de l\'estampe' },
      { nom: 'Tissage', description: 'Entrelacement de fils' },
      { nom: 'Poterie', description: 'Façonnage de l\'argile' },
      { nom: 'Broderie', description: 'Ornementation textile' },
      { nom: 'Marqueterie', description: 'Décoration en bois' },
      { nom: 'Ciselure', description: 'Travail du métal' },
      { nom: 'Calligraphie', description: 'Art de l\'écriture' },
      { nom: 'Photographie', description: 'Capture d\'images' }
    ];
    
    await insertDataIfModelExists(models, 'Technique', defaultTechniques, async (model, data) => {
      for (const technique of data) {
        await model.findOrCreate({
          where: { nom: technique.nom },
          defaults: technique
        });
      }
    });
    
    console.log('✅ Données par défaut insérées avec succès.');
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'insertion des données par défaut:', error);
    throw error;
  }
};

// Initialisation complète de la base de données
const initializeDatabase = async (config = {}) => {
  try {
    console.log('🚀 Initialisation de la base de données...');
    
    // 1. Créer la connexion
    const sequelize = createDatabaseConnection(config);
    
    // 2. Tester la connexion
    await sequelize.authenticate();
    console.log('✅ Connexion à la base de données établie avec succès.');
    
    // 3. Charger tous les modèles
    const models = loadModels(sequelize);
    console.log(`✅ ${Object.keys(models).length} modèles chargés.`);
    
    // 4. Initialiser les associations
    initializeAssociations(models);
    console.log('✅ Associations entre modèles configurées.');
    
    // 5. Synchroniser avec la base de données
    await sequelize.sync({ force: false }); // Changer à true pour recréer les tables
    console.log('✅ Base de données synchronisée.');
    
    // 6. Insérer les données par défaut (inclut maintenant l'import géographique)
    await insertDefaultData(models);
    console.log('✅ Données par défaut insérées.');
    
    console.log('🎉 Base de données initialisée avec succès !');
    
    return { sequelize, models };
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation de la base de données:', error);
    throw error;
  }
};

// Utilitaire pour remettre à zéro la base
const resetDatabase = async (config = {}) => {
  console.log('⚠️  ATTENTION: Remise à zéro de la base de données !');
  
  const sequelize = createDatabaseConnection(config);
  
  try {
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0;');
    await sequelize.drop();
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1;');
    console.log('✅ Base de données remise à zéro.');
    
    return await initializeDatabase(config);
    
  } catch (error) {
    console.error('❌ Erreur lors de la remise à zéro:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
};

module.exports = {
  initializeDatabase,
  resetDatabase,
  loadModels,
  initializeAssociations,
  insertDefaultData,
  importData // Export de la fonction importData pour utilisation séparée si nécessaire
};