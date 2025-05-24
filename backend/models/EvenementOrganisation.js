module.exports = (sequelize, DataTypes) => {
  const EvenementOrganisation = sequelize.define('EvenementOrganisation', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_evenement: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_organisation: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    date_creation: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    date_modification: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'EvenementOrganisation',
    timestamps: false,
    indexes: [
      {
        unique: true,
        name: 'org_event_unique', // Nom court pour la contrainte unique
        fields: ['id_organisation', 'id_evenement'],
      },
    ],
  });

  EvenementOrganisation.associate = (models) => {
    EvenementOrganisation.belongsTo(models.Evenement, {
      foreignKey: 'id_evenement',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    EvenementOrganisation.belongsTo(models.Organisation, {
      foreignKey: 'id_organisation',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };

  return EvenementOrganisation;
};