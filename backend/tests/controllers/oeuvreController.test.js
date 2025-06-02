const request = require('supertest');
const App = require('../../app');
const { setupTestDatabase, teardownTestDatabase } = require('../Setup');

describe('OeuvreController', () => {
  let app, models, sequelize;

  beforeAll(async () => {
    const appInstance = new App();
    app = await appInstance.initialize();
    models = appInstance.getModels();
    sequelize = appInstance.sequelize;
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  beforeEach(async () => {
    await sequelize.sync({ force: true });
    
    // Créer les données de base
    await models.TypeOeuvre.create({
      nom_type: 'Livre',
      description: 'Œuvres littéraires'
    });
    
    await models.Langue.create({
      nom: 'Français',
      code: 'fr'
    });
  });

  describe('GET /api/oeuvres', () => {
    test('Doit retourner une liste vide par défaut', async () => {
      const response = await request(app)
        .get('/api/oeuvres')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.oeuvres).toEqual([]);
      expect(response.body.data.pagination.total).toBe(0);
    });

    test('Doit retourner les œuvres publiées', async () => {
      const typeOeuvre = await models.TypeOeuvre.findOne();
      const langue = await models.Langue.findOne();

      await models.Oeuvre.create({
        titre: 'Œuvre Publiée',
        id_type_oeuvre: typeOeuvre.id_type_oeuvre,
        id_langue: langue.id_langue,
        statut: 'publie'
      });

      await models.Oeuvre.create({
        titre: 'Œuvre Brouillon',
        id_type_oeuvre: typeOeuvre.id_type_oeuvre,
        id_langue: langue.id_langue,
        statut: 'brouillon'
      });

      const response = await request(app)
        .get('/api/oeuvres')
        .expect(200);

      expect(response.body.data.oeuvres).toHaveLength(1);
      expect(response.body.data.oeuvres[0].titre).toBe('Œuvre Publiée');
    });

    test('Doit supporter la pagination', async () => {
      const typeOeuvre = await models.TypeOeuvre.findOne();
      const langue = await models.Langue.findOne();

      // Créer 15 œuvres
      for (let i = 1; i <= 15; i++) {
        await models.Oeuvre.create({
          titre: `Œuvre ${i}`,
          id_type_oeuvre: typeOeuvre.id_type_oeuvre,
          id_langue: langue.id_langue,
          statut: 'publie'
        });
      }

      const response = await request(app)
        .get('/api/oeuvres?page=2&limit=10')
        .expect(200);

      expect(response.body.data.oeuvres).toHaveLength(5);
      expect(response.body.data.pagination.page).toBe(2);
      expect(response.body.data.pagination.total).toBe(15);
    });
  });

  describe('GET /api/oeuvres/:id', () => {
    test('Doit retourner une œuvre existante', async () => {
      const typeOeuvre = await models.TypeOeuvre.findOne();
      const langue = await models.Langue.findOne();

      const oeuvre = await models.Oeuvre.create({
        titre: 'Œuvre Test',
        id_type_oeuvre: typeOeuvre.id_type_oeuvre,
        id_langue: langue.id_langue,
        description: 'Description test',
        statut: 'publie'
      });

      const response = await request(app)
        .get(`/api/oeuvres/${oeuvre.id_oeuvre}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.titre).toBe('Œuvre Test');
      expect(response.body.data.description).toBe('Description test');
    });

    test('Doit retourner 404 pour une œuvre inexistante', async () => {
      const response = await request(app)
        .get('/api/oeuvres/99999')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Œuvre non trouvée');
    });
  });
});