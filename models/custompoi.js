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

  CustomPOI.radiusQuery = async function(args) {
	var replacements = { latitude: args.latitude, longitude: args.longitude, radius: args.radius};
    var termAppend1 = "";
    var termAppend2 = "";
    var term = args.term;
	if (term) {
		replacements.term = `%${term}%`
        termAppend1 = " AND (p.name LIKE :term OR p.description LIKE :term) ";
        termAppend2 = " OR t.name LIKE :term ";
    }
    var categoryAppend = "";
    
    if (args.yelpCategories) {
        var categoryReplacements = [];
        var categories = args.yelpCategories.split(',');
        categoryAppend = " AND t.name IN(:category)"
        for (var i = 0; i < categories.length; i++) {
            categoryReplacements[i] = `${categories[i]}`;
        }    
        replacements.category = categories;
    }
    var resolve;
    await sequelize.query(
        "SELECT DISTINCT p.id, p.name, p.description, p.longitude, p.latitude, p.createdAt, p.updatedAt FROM custompois p "
        + "LEFT JOIN poi_tag pt ON p.id = pt.custompoiId LEFT JOIN tags t ON t.id = pt.tagId " + termAppend2
        + "WHERE ( acos(sin(p.latitude * 0.0175) * sin(:latitude * 0.0175) + cos(p.latitude * 0.0175) * cos(:latitude * 0.0175) * cos((:longitude * 0.0175) - (p.longitude * 0.0175))) * 6.371 <= :radius) "
        + termAppend1 + categoryAppend
        ,
    { replacements: replacements, type: sequelize.QueryTypes.SELECT }
    ).then(projects => {
        resolve = projects;
    })
    return resolve;
  }

//   CustomPOI.radiusQueryWithCategory = async function(latitude, longitude, term, category, radius) {
//     var categories = category.split(',');
//     var replacements = { latitude: latitude, longitude: longitude, radius: radius};
// 	if (term != null && term != undefined) {
// 		replacements.term = `%${term}%`
// 		queryAppend = "AND (p.name LIKE :term OR p.description LIKE :term OR (t.name LIKE :term))"
// 	}
//     var categoryReplacements = [];
//     for (var i = 0; i < categories.length; i++) {
//         categoryReplacements[i] = `${categories[i]}`;
//     }

//     replacements.category = categories;

//     var resolve;
//     await sequelize.query(
//         "SELECT DISTINCT p.id, p.name, p.description, p.longitude, p.latitude, p.createdAt, p.updatedAt FROM custompois p "
//         + "JOIN poi_tag pt ON p.id = pt.custompoiId JOIN tags t ON t.id = pt.tagId "
//         + "WHERE ( acos(sin(p.latitude * 0.0175) * sin(:latitude * 0.0175) + cos(p.latitude * 0.0175) * cos(:latitude * 0.0175) * cos((:longitude * 0.0175) - (p.longitude * 0.0175))) * 6.371 <= :radius) "
//         + queryAppend + " AND t.name IN(:category)"
//         ,
//     { replacements: replacements, type: sequelize.QueryTypes.SELECT }
//     ).then(projects => {
//         resolve = projects;
//     })
//     return resolve;
//   }

  return CustomPOI;
};