const errorMiddleware = {
  // Gestionnaire d'erreurs 404
  notFound: (req, res, next) => {
    const error = new Error(`Route non trouvée - ${req.originalUrl}`);
    error.status = 404;
    next(error);
  },

  // Gestionnaire d'erreurs global
  errorHandler: (error, req, res, next) => {
    let statusCode = error.status || error.statusCode || 500;
    let message = error.message || 'Erreur interne du serveur';

    // Erreurs Sequelize
    if (error.name === 'SequelizeValidationError') {
      statusCode = 400;
      message = 'Erreur de validation des données';
      const details = error.errors.map(err => ({
        field: err.path,
        message: err.message,
        value: err.value
      }));
      
      return res.status(statusCode).json({
        success: false,
        error: message,
        details
      });
    }

    if (error.name === 'SequelizeUniqueConstraintError') {
      statusCode = 409;
      message = 'Cette ressource existe déjà';
      const details = error.errors.map(err => ({
        field: err.path,
        message: `${err.path} doit être unique`,
        value: err.value
      }));
      
      return res.status(statusCode).json({
        success: false,
        error: message,
        details
      });
    }

    if (error.name === 'SequelizeForeignKeyConstraintError') {
      statusCode = 400;
      message = 'Référence invalide vers une ressource inexistante';
    }

    if (error.name === 'SequelizeDatabaseError') {
      statusCode = 500;
      message = 'Erreur de base de données';
      console.error('Erreur de base de données:', error);
    }

    // Erreurs JWT
    if (error.name === 'JsonWebTokenError') {
      statusCode = 401;
      message = 'Token invalide';
    }

    if (error.name === 'TokenExpiredError') {
      statusCode = 401;
      message = 'Token expiré';
    }

    // Log de l'erreur en développement
    if (process.env.NODE_ENV === 'development') {
      console.error('Erreur:', error);
    }

    res.status(statusCode).json({
      success: false,
      error: message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  }
};

module.exports = errorMiddleware;
