var Sequelize = require('sequelize');

var configs = {
	timestamps : false,
	tableName : 'tblPCategory',
};

var coloumnDefinitions = {
	categoryId : {
		type : Sequelize.INTEGER,
		primaryKey : true,
		autoIncrement : true

	},
	categoryName : {
		type : Sequelize.STRING
	},
	categoryDesciption : {
		type : Sequelize.STRING
	},
	parentId : {
		type : Sequelize.INTEGER
	},
	pcIsActive : {
		type : Sequelize.BOOLEAN
	},
	pcLastModifiedOn : {
		type : Sequelize.DATE
	},
	pcLastModifiedBy : {
		type : Sequelize.STRING
	}
};

module.exports = function(sequelize) {

	const
	Category = sequelize.define('tblPCategory', coloumnDefinitions, configs);

	return Category;
}
