var categories_model = require('../categories/category_model.js');
var dbservice = require("../../services/dbservice.js");

exports.index = function(req, res) {
	res.send('Welcome to home page..');
}

exports.testUrl = function(req, res) {

	dbservice.sequalizeconnect().then(function(sequelize) {
		try {
			mod = categories_model(sequelize);

			/*
			 * var data = { "categoryId" : 10, "categoryName" : "Bows",
			 * "categoryDesciption" : "Bows Collections", "parentId" : 3,
			 * "pcIsActive" : true };
			 * 
			 * var options = { where : { categoryId : 10 } };
			 * 
			 * mod.update(data, options).then(function(status) {
			 * console.log("update status: " + status); });
			 */

			var whereConditions = {
				where : {
					pcIsActive : true
				}
			};

			mod.findAll(whereConditions).then(function(data) {
				res.send(data);
				sequelize.close();
			});

		} catch (e) {
			sequelize.close();
			console.log(e);
		}
	});

}