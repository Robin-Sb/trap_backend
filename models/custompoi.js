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
  });
  CustomPOI.associate = function(models) {
      CustomPOI.hasMany(models.Tag, {foreignKey: 'poiId'});
  };

  CustomPOI.radiusQuery = async function(latitude, longitude, term) {
    var resolve;
    await sequelize.query(
        "SELECT a.name, a.description, a.longitude, a.latitude, a.createdAt, a.updatedAt FROM custompois a, tags b " 
        + "WHERE ( acos(sin(a.latitude * 0.0175) * sin(:latitude * 0.0175) + cos(a.latitude * 0.0175) * cos(:latitude * 0.0175) * cos((:longitude * 0.0175) - (a.longitude * 0.0175))) * 6371 <= 20) "
        + "AND (a.name LIKE :term OR a.description LIKE :term " 
        + "OR (b.poiId = a.id AND b.name LIKE :term)) group by a.id;"
        ,
    { replacements: { latitude: latitude, longitude: longitude, term: `%${term}%`}, type: sequelize.QueryTypes.SELECT }
    ).then(projects => {
        resolve = projects;
    })
    return resolve;
  }
  return CustomPOI;
};