'use strict';
module.exports = (sequelize, DataTypes) => {
  const CustomPOI = sequelize.define('CustomPOI', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    longitude: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    latitude: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    isEnabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
  }, {
      tableName: "custompois"
  });
  CustomPOI.associate = function(models) {
      CustomPOI.belongsToMany(models.Tag, {through: 'poi_tag'});
  };

  CustomPOI.radiusQuery = async function(latitude, longitude, term) {
    var resolve;
    await sequelize.query(
        "SELECT DISTINCT p.id, p.name, p.description, p.longitude, p.latitude, p.createdAt, p.updatedAt FROM custompois p "
        + "JOIN poi_tag pt ON p.id = pt.custompoiId JOIN tags t ON t.id = pt.tagId "
        + "WHERE ( acos(sin(p.latitude * 0.0175) * sin(:latitude * 0.0175) + cos(p.latitude * 0.0175) * cos(:latitude * 0.0175) * cos((:longitude * 0.0175) - (p.longitude * 0.0175))) * 6371 <= 20) "
        + "AND (p.name LIKE :term OR p.description LIKE :term " 
        + "OR (t.name LIKE :term))" // AND t.poiId = p.id)) group by p.id;"
        ,
    { replacements: { latitude: latitude, longitude: longitude, term: `%${term}%`}, type: sequelize.QueryTypes.SELECT }
    ).then(projects => {
        resolve = projects;
    })
    return resolve;
  }
  return CustomPOI;
};