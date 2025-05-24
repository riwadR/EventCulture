async function seedMateriaux(Materiau) {
  await Materiau.bulkCreate([
    { nom: 'Coton', description: 'Fibre naturelle textile douce, souvent utilisée en couture.' },
    { nom: 'Laine', description: 'Fibre textile provenant du mouton, utilisée pour tricoter et tisser.' },
    { nom: 'Soie', description: 'Fibre naturelle fine et brillante, utilisée en couture et broderie.' },
    { nom: 'Lin', description: 'Fibre végétale utilisée pour des tissus résistants et légers.' },
    { nom: 'Chanvre', description: 'Fibre végétale robuste utilisée pour tissage et couture.' },
    { nom: 'Peau de chèvre', description: 'Matériau utilisé pour la fabrication de vêtements et accessoires.' },
    { nom: 'Argile', description: 'Terre utilisée pour la poterie et la céramique.' },
    { nom: 'Bois', description: 'Matériau dur utilisé en sculpture et menuiserie.' },
    { nom: 'Métal', description: 'Matériau utilisé en forge et gravure.' },
    { nom: 'Verre', description: 'Matériau transparent utilisé en vitrail et décoration.' },
    { nom: 'Cuir', description: 'Peau travaillée d’animaux, utilisée en maroquinerie et couture.' },
    { nom: 'Pierre', description: 'Matériau naturel utilisé en sculpture et construction.' },
    { nom: 'Papier', description: 'Matériau fin utilisé pour la calligraphie, origami et création artisanale.' },
    { nom: 'Paille', description: 'Matériau végétal utilisé en vannerie et tressage.' },
    { nom: 'Perles', description: 'Petites billes décoratives souvent utilisées en bijouterie et couture.' },
    { nom: 'Tissu synthétique', description: 'Matériau textile fabriqué industriellement, utilisé en couture moderne.' },
    { nom: 'Plâtre', description: 'Matériau utilisé pour le moulage et la sculpture.' },
    { nom: 'Cire', description: 'Matériau utilisé pour la fabrication de bougies et le modelage.' },
  ], { ignoreDuplicates: true });
  console.log('Matériaux insérés');
}

async function seedTechniques(Technique) {
  await Technique.bulkCreate([
    { nom: 'Couture', description: 'Assemblage de tissus par des points avec une aiguille et du fil.' },
    { nom: 'Tissage', description: 'Entrelacement de fils pour fabriquer un tissu.' },
    { nom: 'Tricot', description: 'Technique de fabrication de tissu à partir de fils bouclés.' },
    { nom: 'Sculpture', description: 'Art de modeler ou tailler des matériaux solides.' },
    { nom: 'Forge', description: 'Travail du métal à chaud pour façonner des objets.' },
    { nom: 'Poterie', description: 'Modelage et cuisson de l’argile pour créer des objets.' },
    { nom: 'Vannerie', description: 'Tressage de fibres végétales pour fabriquer des objets.' },
    { nom: 'Broderie', description: 'Décoration textile par des points réalisés avec du fil.' },
    { nom: 'Calligraphie', description: 'Art de la belle écriture manuscrite.' },
    { nom: 'Gravure', description: 'Technique de marquage ou incision sur différents matériaux.' },
  ], { ignoreDuplicates: true });
  console.log('Techniques insérées');
}

async function seedAll({ Materiau, Technique }) {
  await seedMateriaux(Materiau);
  await seedTechniques(Technique);
  console.log('Seed complet terminé');
}

// --- Exemple d'utilisation directe ---
// Imaginons que tu as déjà importé ou défini tes modèles Materiau et Technique
// Par exemple : const { Materiau, Technique } = require('./models');

// Appel immédiat du seed si tu as accès aux modèles ici
async function runSeed() {
  try {
    // Remplace par l'import réel de tes modèles
    const Materiau = require('./models').Materiau;
    const Technique = require('./models').Technique;

    await seedAll({ Materiau, Technique });
    process.exit(0);
  } catch (error) {
    console.error('Erreur lors du seed:', error);
    process.exit(1);
  }
}

runSeed();
