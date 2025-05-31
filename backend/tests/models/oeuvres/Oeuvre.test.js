const { setupTestDatabase, teardownTestDatabase } = require('../setup');

describe('Modèle Oeuvre', () => {
  let models, sequelize;

  beforeAll(async () => {
    const result = await setupTestDatabase();
    models = result.models;
    sequelize = result.sequelize;
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  beforeEach(async () => {
    // Nettoyer les données avant chaque test
    await sequelize.sync({ force: true });
    
    // Insérer les données de base nécessaires
    await models.TypeOeuvre.create({
      nom_type: 'Livre',
      description: 'Œuvres littéraires'
    });
    
    await models.Langue.create({
      nom: 'Français',
      code: 'fr'
    });
  });

  test('Doit créer une œuvre valide', async () => {
    const typeOeuvre = await models.TypeOeuvre.findOne();
    const langue = await models.Langue.findOne();

    const oeuvre = await models.Oeuvre.create({
      titre: 'Test Livre',
      id_type_oeuvre: typeOeuvre.id_type_oeuvre,
      id_langue: langue.id_langue,
      annee_creation: 2024,
      description: 'Livre de test',
      statut: 'publie'
    });

    expect(oeuvre.titre).toBe('Test Livre');
    expect(oeuvre.statut).toBe('publie');
    expect(oeuvre.id_oeuvre).toBeDefined();
  });

  test('Doit valider les champs obligatoires', async () => {
    await expect(models.Oeuvre.create({
      description: 'Sans titre'
    })).rejects.toThrow();
  });

  test('Doit avoir un statut par défaut', async () => {
    const typeOeuvre = await models.TypeOeuvre.findOne();
    const langue = await models.Langue.findOne();

    const oeuvre = await models.Oeuvre.create({
      titre: 'Test Default Status',
      id_type_oeuvre: typeOeuvre.id_type_oeuvre,
      id_langue: langue.id_langue
    });

    expect(oeuvre.statut).toBe('brouillon');
  });
});