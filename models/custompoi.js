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
    } 
  });
  CustomPOI.associate = function(models) {
    // associations can be defined here
  };

  CustomPOI.radiusQuery = async function(latitude, longitude) {
    var resolve;
    await sequelize.query(
        'SELECT * FROM custompois a WHERE ( acos(sin(a.latitude * 0.0175) * sin(:latitude * 0.0175)+ cos(a.latitude * 0.0175) * cos(:latitude * 0.0175) * cos((:longitude * 0.0175) - (a.longitude * 0.0175))) * 6371 <= 20)'
        ,
    { replacements: { latitude: latitude, longitude: longitude}, type: sequelize.QueryTypes.SELECT }
    ).then(projects => {
        resolve = projects;
    })
    return resolve;
  }
  return CustomPOI;
};