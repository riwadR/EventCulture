require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const path = require('path');

// Importation des middlewares
const corsMiddleware = require('./middlewares/corsMiddleware');
const rateLimitMiddleware = require('./middlewares/rateLimitMiddleware');
const errorMiddleware = require('./middlewares/errorMiddleware');
const createAuthMiddleware = require('./middlewares/authMiddleware');

// Importation des routes
const initRoutes = require('./routes');

// Importation des services
const { initializeDatabase } = require('./models');
const emailService = require('./services/emailService');
const uploadService = require('./services/uploadService');

class App {
  constructor() {
    this.app = express();
    this.models = null;
    this.authMiddleware = null;
  }

  // Initialisation des middlewares de base
  initializeMiddlewares() {
    // Sécurité
    this.app.use(helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
        },
      }
    }));

    // CORS
    this.app.use(corsMiddleware);

    // Compression
    this.app.use(compression());

    // Rate limiting
    this.app.use('/api/users/login', rateLimitMiddleware.auth);
    this.app.use('/api/users/register', rateLimitMiddleware.auth);
    this.app.use('/api/', rateLimitMiddleware.general);

    // Logging
    if (process.env.NODE_ENV === 'development') {
      this.app.use(morgan('dev'));
    } else {
      this.app.use(morgan('combined'));
    }

    // Parsing des données
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Servir les fichiers statiques
    this.app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
    this.app.use('/public', express.static(path.join(__dirname, 'public')));

    console.log('✅ Middlewares de base initialisés');
  }

  // Initialisation de la base de données
  async initializeDatabase() {
    try {
      const dbConfig = {
        database: process.env.DB_NAME || 'actionculture',
        username: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT) || 3306,
        dialect: process.env.DB_DIALECT || 'mysql',
        logging: process.env.NODE_ENV === 'development' ? console.log : false
      };

      const { sequelize, models } = await initializeDatabase(dbConfig);
      this.models = models;
      this.sequelize = sequelize;

      // Initialiser le middleware d'authentification avec les modèles
      this.authMiddleware = createAuthMiddleware(models);

      console.log('✅ Base de données initialisée');
      return { sequelize, models };
    } catch (error) {
      console.error('❌ Erreur lors de l\'initialisation de la base de données:', error);
      throw error;
    }
  }

  // Initialisation des routes
  initializeRoutes() {
    if (!this.models) {
      throw new Error('Les modèles doivent être initialisés avant les routes');
    }

    // Route racine
    this.app.get('/', (req, res) => {
      res.json({
        message: 'API Action Culture - Système de gestion culturelle algérien',
        version: '1.0.0',
        status: 'running',
        documentation: '/api',
        health: '/api/health'
      });
    });

    // Routes API
    this.app.use('/api', initRoutes(this.models));

    // Route pour upload d'images
    this.app.post('/api/upload/image', 
      this.authMiddleware.authenticate,
      uploadService.uploadImage().single('image'),
      (req, res) => {
        try {
          if (!req.file) {
            return res.status(400).json({
              success: false,
              error: 'Aucun fichier fourni'
            });
          }

          const fileUrl = uploadService.getFileUrl(req.file.filename);
          
          res.json({
            success: true,
            message: 'Image uploadée avec succès',
            data: {
              filename: req.file.filename,
              originalName: req.file.originalname,
              url: fileUrl,
              size: req.file.size
            }
          });
        } catch (error) {
          console.error('Erreur lors de l\'upload:', error);
          res.status(500).json({
            success: false,
            error: 'Erreur lors de l\'upload de l\'image'
          });
        }
      }
    );

    // Route de recherche globale
    this.app.get('/api/search', async (req, res) => {
      try {
        const { q, types, limit } = req.query;
        
        if (!q || q.trim().length < 2) {
          return res.status(400).json({
            success: false,
            error: 'Le terme de recherche doit contenir au moins 2 caractères'
          });
        }

        const SearchService = require('./services/searchService');
        const searchService = new SearchService(this.models);
        
        const results = await searchService.globalSearch(q.trim(), {
          types: types ? types.split(',') : undefined,
          limit: limit ? parseInt(limit) : undefined
        });

        res.json(results);
      } catch (error) {
        console.error('Erreur lors de la recherche globale:', error);
        res.status(500).json({
          success: false,
          error: 'Erreur lors de la recherche'
        });
      }
    });

    // Route pour suggestions de recherche
    this.app.get('/api/search/suggestions', async (req, res) => {
      try {
        const { q, limit } = req.query;
        
        if (!q || q.trim().length < 1) {
          return res.json({ success: true, suggestions: [] });
        }

        const SearchService = require('./services/searchService');
        const searchService = new SearchService(this.models);
        
        const results = await searchService.getSuggestions(q.trim(), limit ? parseInt(limit) : undefined);

        res.json(results);
      } catch (error) {
        console.error('Erreur lors de la génération de suggestions:', error);
        res.status(500).json({
          success: false,
          error: 'Erreur lors de la génération de suggestions'
        });
      }
    });

    console.log('✅ Routes initialisées');
  }

  // Initialisation de la gestion d'erreurs
  initializeErrorHandling() {
    // Middleware 404
    this.app.use(errorMiddleware.notFound);

    // Gestionnaire d'erreurs global
    this.app.use(errorMiddleware.errorHandler);

    console.log('✅ Gestion d\'erreurs initialisée');
  }

  // Initialisation complète de l'application
  async initialize() {
    try {
      console.log('🚀 Initialisation de l\'application Action Culture...');
      
      this.initializeMiddlewares();
      await this.initializeDatabase();
      this.initializeRoutes();
      this.initializeErrorHandling();
      
      console.log('🎉 Application initialisée avec succès !');
      return this.app;
    } catch (error) {
      console.error('❌ Erreur lors de l\'initialisation de l\'application:', error);
      throw error;
    }
  }

  // Méthodes utilitaires
  getApp() {
    return this.app;
  }

  getModels() {
    return this.models;
  }

  async closeDatabase() {
    if (this.sequelize) {
      await this.sequelize.close();
      console.log('🔌 Connexion à la base de données fermée');
    }
  }
}

module.exports = App;