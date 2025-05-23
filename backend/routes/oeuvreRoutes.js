const express = require('express');
const router = express.Router();
const { create, getAll, getById, update, delete: deleteOeuvre, getStats } = require('../controllers/oeuvreController');

// Middleware de validation pour la création/modification d'oeuvre
const validateOeuvre = (req, res, next) => {
  const { titre, id_type_oeuvre, id_langue } = req.body;
  
  const errors = [];
  
  if (!titre || typeof titre !== 'string' || titre.trim().length === 0) {
    errors.push('Le titre est obligatoire et doit être une chaîne non vide');
  }
  
  if (!id_type_oeuvre || !Number.isInteger(Number(id_type_oeuvre))) {
    errors.push('L\'ID du type d\'oeuvre est obligatoire et doit être un entier');
  }
  
  if (!id_langue || !Number.isInteger(Number(id_langue))) {
    errors.push('L\'ID de la langue est obligatoire et doit être un entier');
  }
  
  if (req.body.annee_creation !== undefined && req.body.annee_creation !== null) {
    const annee = Number(req.body.annee_creation);
    if (!Number.isInteger(annee) || annee < 0 || annee > new Date().getFullYear()) {
      errors.push('L\'année de création doit être un entier valide');
    }
  }
  
  if (req.body.image_url && typeof req.body.image_url !== 'string') {
    errors.push('L\'URL de l\'image doit être une chaîne de caractères');
  }
  
  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Données invalides',
      details: errors
    });
  }
  
  next();
};

// Middleware de validation pour les paramètres ID
const validateId = (req, res, next) => {
  const { id } = req.params;
  
  if (!id || !Number.isInteger(Number(id)) || Number(id) <= 0) {
    return res.status(400).json({
      error: 'ID invalide - doit être un entier positif'
    });
  }
  
  next();
};

// Routes CRUD principales

/**
 * @route   GET /api/oeuvres
 * @desc    Récupérer toutes les oeuvres avec pagination et filtres
 * @query   page, limit, search, type_oeuvre, langue, annee_min, annee_max
 * @access  Public
 */
router.get('/', getAll);

/**
 * @route   GET /api/oeuvres/stats
 * @desc    Récupérer les statistiques des oeuvres
 * @access  Public
 */
router.get('/stats', getStats);

/**
 * @route   GET /api/oeuvres/:id
 * @desc    Récupérer une oeuvre par ID avec toutes ses relations
 * @param   id - ID de l'oeuvre
 * @access  Public
 */
router.get('/:id', validateId, getById);

/**
 * @route   POST /api/oeuvres
 * @desc    Créer une nouvelle oeuvre
 * @body    titre, id_type_oeuvre, id_langue, annee_creation, description, image_url
 * @access  Private (nécessite authentification)
 */
router.post('/', validateOeuvre, create);

/**
 * @route   PUT /api/oeuvres/:id
 * @desc    Mettre à jour une oeuvre
 * @param   id - ID de l'oeuvre
 * @body    titre, id_type_oeuvre, id_langue, annee_creation, description, image_url
 * @access  Private (nécessite authentification)
 */
router.put('/:id', validateId, validateOeuvre, update);

/**
 * @route   PATCH /api/oeuvres/:id
 * @desc    Mise à jour partielle d'une oeuvre
 * @param   id - ID de l'oeuvre
 * @body    Champs à modifier (optionnels)
 * @access  Private (nécessite authentification)
 */
router.patch('/:id', validateId, (req, res, next) => {
  // Pour PATCH, on permet des mises à jour partielles
  // Pas de validation stricte des champs obligatoires
  const { annee_creation, image_url } = req.body;
  
  const errors = [];
  
  if (annee_creation !== undefined && annee_creation !== null) {
    const annee = Number(annee_creation);
    if (!Number.isInteger(annee) || annee < 0 || annee > new Date().getFullYear()) {
      errors.push('L\'année de création doit être un entier valide');
    }
  }
  
  if (image_url !== undefined && image_url !== null && typeof image_url !== 'string') {
    errors.push('L\'URL de l\'image doit être une chaîne de caractères');
  }
  
  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Données invalides',
      details: errors
    });
  }
  
  next();
}, update);

/**
 * @route   DELETE /api/oeuvres/:id
 * @desc    Supprimer une oeuvre
 * @param   id - ID de l'oeuvre
 * @access  Private (nécessite authentification admin)
 */
router.delete('/:id', validateId, deleteOeuvre);

// Routes supplémentaires pour des fonctionnalités spécifiques

/**
 * @route   GET /api/oeuvres/type/:typeId
 * @desc    Récupérer les oeuvres par type
 * @param   typeId - ID du type d'oeuvre
 * @access  Public
 */
router.get('/type/:typeId', (req, res) => {
  req.query.type_oeuvre = req.params.typeId;
  getAll(req, res);
});

/**
 * @route   GET /api/oeuvres/langue/:langueId
 * @desc    Récupérer les oeuvres par langue
 * @param   langueId - ID de la langue
 * @access  Public
 */
router.get('/langue/:langueId', (req, res) => {
  req.query.langue = req.params.langueId;
  getAll(req, res);
});

/**
 * @route   GET /api/oeuvres/annee/:annee
 * @desc    Récupérer les oeuvres par année
 * @param   annee - Année de création
 * @access  Public
 */
router.get('/annee/:annee', (req, res) => {
  req.query.annee_min = req.params.annee;
  req.query.annee_max = req.params.annee;
  getAll(req, res);
});

module.exports = router;