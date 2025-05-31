const multer = require('multer');
const path = require('path');
const fs = require('fs');

class UploadService {
  constructor() {
    this.uploadPath = path.join(__dirname, '../uploads');
    this.ensureUploadDirectories();
  }

  ensureUploadDirectories() {
    const directories = [
      this.uploadPath,
      path.join(this.uploadPath, 'images'),
      path.join(this.uploadPath, 'documents'),
      path.join(this.uploadPath, 'media')
    ];

    directories.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  // Configuration de stockage pour les images
  getImageStorage() {
    return multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, path.join(this.uploadPath, 'images'));
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
      }
    });
  }

  // Filtres pour les types de fichiers
  imageFilter(req, file, cb) {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Type de fichier non autorisé. Seules les images sont acceptées.'), false);
    }
  }

  documentFilter(req, file, cb) {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Type de fichier non autorisé. Seuls PDF et DOC sont acceptés.'), false);
    }
  }

  // Middleware pour upload d'images
  uploadImage() {
    return multer({
      storage: this.getImageStorage(),
      fileFilter: this.imageFilter,
      limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
      }
    });
  }

  // Supprimer un fichier
  deleteFile(filename, type = 'images') {
    const filePath = path.join(this.uploadPath, type, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  }

  // Obtenir l'URL d'un fichier
  getFileUrl(filename, type = 'images') {
    return `/uploads/${type}/${filename}`;
  }
}

const uploadService = new UploadService();

module.exports = uploadService;