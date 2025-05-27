const { OeuvreTag } = require('../models');

exports.getAllOeuvreTags = async (req, res) => {
  try {
    const oeuvreTags = await OeuvreTag.findAll({
      include: [
        { model: OeuvreTag.associations.Oeuvre },
        { model: OeuvreTag.associations.TagMotCle }
      ]
    });
    res.status(200).json(oeuvreTags);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des relations œuvre-tag' });
  }
};

exports.getOeuvreTag = async (req, res) => {
  try {
    const { id_oeuvre, id_tag } = req.params;
    const oeuvreTag = await OeuvreTag.findOne({
      where: { id_oeuvre, id_tag },
      include: [
        { model: OeuvreTag.associations.Oeuvre },
        { model: OeuvreTag.associations.TagMotCle }
      ]
    });
    if (oeuvreTag) {
      res.status(200).json(oeuvreTag);
    } else {
      res.status(404).json({ error: 'Relation œuvre-tag non trouvée' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de la relation œuvre-tag' });
  }
};

exports.createOeuvreTag = async (req, res) => {
  try {
    const { id_oeuvre, id_tag } = req.body;
    const newOeuvreTag = await OeuvreTag.create({
      id_oeuvre,
      id_tag
    });
    res.status(201).json(newOeuvreTag);
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la création de la relation œuvre-tag' });
  }
};

exports.deleteOeuvreTag = async (req, res) => {
  try {
    const { id_oeuvre, id_tag } = req.params;
    const oeuvreTag = await OeuvreTag.findOne({
      where: { id_oeuvre, id_tag }
    });
    if (oeuvreTag) {
      await oeuvreTag.destroy();
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'Relation œuvre-tag non trouvée' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de la relation œuvre-tag' });
  }
};