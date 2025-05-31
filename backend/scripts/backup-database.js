require('dotenv').config();
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const main = async () => {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join(__dirname, '../backups');
    
    // Créer le dossier de sauvegarde s'il n'existe pas
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    
    const backupFile = path.join(backupDir, `actionculture_${timestamp}.sql`);
    
    const command = `mysqldump -h ${process.env.DB_HOST || 'localhost'} -P ${process.env.DB_PORT || 3306} -u ${process.env.DB_USER || 'root'} -p${process.env.DB_PASSWORD || ''} ${process.env.DB_NAME || 'actionculture'} > ${backupFile}`;
    
    console.log('💾 Création de la sauvegarde...');
    
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error('❌ Erreur lors de la sauvegarde:', error);
        return;
      }
      
      console.log(`✅ Sauvegarde créée: ${backupFile}`);
      
      // Afficher la taille du fichier
      const stats = fs.statSync(backupFile);
      const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
      console.log(`📊 Taille: ${fileSizeInMB} MB`);
    });
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
};

main();
