const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
    this.isPaused = true; // 🚧 SERVICE EN PAUSE
    
    if (!this.isPaused) {
      this.initializeTransporter();
    } else {
      console.log('📧 Service email en pause - aucun email ne sera envoyé');
    }
  }

  initializeTransporter() {
    if (process.env.EMAIL_SERVICE === 'gmail') {
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
      });
    } else {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD
        }
      });
    }
  }

  async sendEmail(to, subject, text, html = null) {
    // 🚧 MODE PAUSE - Simulation d'envoi
    if (this.isPaused) {
      console.log('📧 [SIMULATION] Email qui aurait été envoyé:');
      console.log(`   À: ${to}`);
      console.log(`   Sujet: ${subject}`);
      console.log(`   Contenu: ${text.substring(0, 100)}...`);
      return { success: true, messageId: 'simulated-' + Date.now(), paused: true };
    }

    // Code d'envoi réel (quand service sera réactivé)
    try {
      const mailOptions = {
        from: `"Action Culture" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
        to,
        subject,
        text,
        html: html || text
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Email envoyé:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Erreur lors de l\'envoi d\'email:', error);
      return { success: false, error: error.message };
    }
  }

  async sendWelcomeEmail(user) {
    const subject = 'Bienvenue sur Action Culture !';
    const text = `
      Bonjour ${user.prenom} ${user.nom},
      
      Bienvenue sur la plateforme Action Culture !
      
      Votre compte a été créé avec succès. Vous pouvez maintenant :
      - Découvrir et ajouter des œuvres culturelles
      - Participer à des événements
      - Contribuer au patrimoine culturel algérien
      
      Cordialement,
      L'équipe Action Culture
    `;

    return await this.sendEmail(user.email, subject, text);
  }

  async sendEventNotification(user, evenement) {
    const subject = `Nouvel événement : ${evenement.nom_evenement}`;
    const text = `
      Bonjour ${user.prenom} ${user.nom},
      
      Un nouvel événement culturel a été ajouté :
      
      ${evenement.nom_evenement}
      Date : ${evenement.date_debut ? new Date(evenement.date_debut).toLocaleDateString('fr-FR') : 'À définir'}
      Lieu : ${evenement.Lieu?.nom || 'À définir'}
      
      ${evenement.description}
      
      Consultez les détails sur la plateforme Action Culture.
      
      Cordialement,
      L'équipe Action Culture
    `;

    return await this.sendEmail(user.email, subject, text);
  }

  async verifyConnection() {
    if (this.isPaused) {
      console.log('📧 Service email en pause - vérification ignorée');
      return true;
    }

    try {
      await this.transporter.verify();
      console.log('✅ Service email vérifié avec succès');
      return true;
    } catch (error) {
      console.error('❌ Erreur de configuration email:', error);
      return false;
    }
  }

  // 🔧 Méthodes pour gérer la pause
  pause() {
    this.isPaused = true;
    console.log('⏸️  Service email mis en pause');
  }

  resume() {
    this.isPaused = false;
    console.log('▶️  Service email repris');
    if (!this.transporter) {
      this.initializeTransporter();
    }
  }

  getStatus() {
    return this.isPaused ? 'EN PAUSE' : 'ACTIF';
  }
}

const emailService = new EmailService();

module.exports = emailService;