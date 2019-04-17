'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define('Tag', {
    name: DataTypes.STRING
  }, {});
  Tag.associate = function(models) {
      Tag.belongsTo(models.CustomPOI, {foreignKey: 'poiId'});
    // associations can be defined here
  };
  return Tag;
};