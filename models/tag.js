'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define('Tag', {
    id: {

        type: DataTypes.INTEGER,

        primaryKey: true,

        autoIncrement: true,

        allowNull: false

    },

    name: {

        type: DataTypes.STRING,

        unique: true,

        allowNull: false

    },
    }, 
    {
      tableName: "tags"
    }
    );
  Tag.associate = function(models) {
    Tag.belongsToMany(models.CustomPOI, { through: 'poi_tag' });
  };
  return Tag;
};