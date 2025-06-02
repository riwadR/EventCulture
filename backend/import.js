const fs = require('fs');
const path = require('path');
const db = require('./models');  // Assure-toi que ce fichier exporte { Wilaya, Daira, Commune, sequelize }

async function importData() {
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
      wilaya = await db.Wilaya.findOne({ where: { codeW } });
      if (!wilaya) {
        wilaya = await db.Wilaya.create({
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
      daira = await db.Daira.findOne({
        where: {
          nom: dairaNom,
          wilayaId: wilaya.id_wilaya
        }
      });
      if (!daira) {
        daira = await db.Daira.create({
          nom: dairaNom,
          daira_name_ascii: dairaNomAscii,
          wilayaId: wilaya.id_wilaya,
        });
      }
      dairaCache.set(dairaKey, daira);
    }

    // Commune
    const exists = await db.Commune.findOne({
      where: {
        nom: communeNom,
        dairaId: daira.id_daira
      }
    });
    if (!exists) {
      await db.Commune.create({
        nom: communeNom,
        commune_name_ascii: communeNomAscii,
        dairaId: daira.id_daira,
      });
    }
  }

  console.log('✅ Import terminé avec succès.');
  process.exit(0);
}

db.sequelize.sync()
  .then(() => importData())
  .catch(err => {
    console.error('❌ Erreur d’importation :', err);
    process.exit(1);
  });
