'use strict';
module.exports = (sequelize, DataTypes) => {
  const PoiTag = sequelize.define('PoiTag', {
    id: {

        type: DataTypes.INTEGER,

        primaryKey: true,

        autoIncrement: true,

        allowNull: false

    },

    custompoiId:{

        type: DataTypes.INTEGER.UNSIGNED,

        allowNull: false

    },

    tagId:{

        type: DataTypes.INTEGER.UNSIGNED,

        allowNull: false

    }
}, {freezeTableName:true});
  PoiTag.associate = function(models) {
    // associations can be defined here
  };
  return PoiTag;
};