/**
 * http://usejsdoc.org/
 */
var dbservice = require("../../services/dbservice.js");
var config = require('../../configs/config.js');
var globals = require('../../globals.js');
var fs = require('fs');
var formidable = require('express-formidable');
var categories_model = require('../categories/category_model.js');

var CategoriesController = {};

CategoriesController.getCategoriesByPage = function(req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Content-Type");

	var pageNumber = req.query.pageNumber;
	var rowsOnPage = req.query.rowsOnPage;
	var statusFilter = req.query.statusFilter;
	var searchFilter = req.query.searchFilter;
	/*
	 * dbservice.sequalizeconnect().then(function(sequelize) { try { model =
	 * categories_model(sequelize);
	 * 
	 * var statusCondition, searchCondition = "'%%'";
	 * 
	 * if (statusFilter === "active") { statusCondition = true; } else if
	 * (statusFilter === "inactive") { statusCondition = false; }
	 * 
	 * if (searchFilter !== '' && searchFilter !== undefined) { searchCondition =
	 * "'%" + searchFilter + "%'" }
	 * 
	 * var whereConditions = { where : { pcIsActive : statusCondition,
	 * categoryName : { $like : searchCondition } } };
	 * 
	 * model.findAll(whereConditions).then(function(data) {
	 * res.send(JSON.parse(data)); sequelize.close(); }); } catch (e) {
	 * sequelize.close(); console.log(e); } });
	 * 
	 */

	dbservice
			.mysqlconnect()
			.then(
					function(con) {
						con.on('error', function(err, result) {
							console.log('error occurred. Reconneting...');
						});

						var conditions = "";

						if (statusFilter === "active") {
							conditions += " and pcIsActive=1";
						} else if (statusFilter === "inactive") {
							conditions += " and pcIsActive=0";
						}

						if (searchFilter !== '' && searchFilter !== undefined) {
							conditions += "and categoryName like '%"
									+ searchFilter + "%'";
						}

						var getcategoriesQuery = "select * from tblPCategory where 1=1"
								+ conditions + " LIMIT " + (pageNumber - 1)
						rowsOnPage + "," + rowsOnPage;

						var getcategoriesCountQuery = "select count(*) 'count' from tblPCategory where 1=1"
								+ conditions;

						var count, categories;

						con.query(getcategoriesCountQuery,
								function(err, result) {
									if (err) {
										console.log('err', err);
									}

									count = result[0].count;

									con.query(getcategoriesQuery, function(err,
											result) {
										if (err) {
											console.log('err', err);
										} else {
											categories = result; //
											console.log("categories is "
													+ categories);
											var obj = {
												count : count,
												data : categories
											}
											res.send(obj);
										}
									});

								});

						dbservice
								.doMySqlQuery(con, getcategoriesCountQuery)
								.then(
										function(data) {

											data.on('error', function(err,
													result) {
												console.log('error occurred..'
														+ err);
											});

											count = data;

											dbservice
													.doMySqlQuery(con,
															getcategoriesQuery)
													.then(
															function(data) {
																data
																		.on(
																				'error',
																				function(
																						err,
																						result) {
																					console
																							.log('error occurred..'
																									+ err);
																				});

																categories = data;

																var obj = {
																	count : 10,
																	data : categories
																}
																res.send(obj);
															});
										});

					});

	con.connect(function(err) {
		if (err) {
			throw err;
		}
		con.query(sql, function(err, result) {
			if (err) {
				throw err;
			}
			var obj = {
				count : 10,
				data : result
			}
			res.send(obj);
		});
	});

};

CategoriesController.getAllCategories = function(req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Content-Type");

	dbservice.sequalizeconnect().then(function(sequelize) {
		try {
			model = categories_model(sequelize);

			var whereConditions = {
				where : {
					pcIsActive : true
				}
			};

			model.findAll(whereConditions).then(function(data) {
				res.send(JSON.parse(data));
				sequelize.close();
			});
		} catch (e) {
			sequelize.close();
			console.log(e);
		}
	});

	/*
	 * dbservice.mysqlconnect().then(function(con) { con.on('error',
	 * function(err, result) { console.log('error occurred. Reconneting...');
	 * });
	 * 
	 * var query = "select * from tblPCategory where pcIsActive=1";
	 * 
	 * con.query(query, function(err, result) { if (err) { console.log('err',
	 * err); }
	 * 
	 * var string = JSON.stringify(result); var json = JSON.parse(string);
	 * 
	 * res.send(json); }); });
	 */
}

CategoriesController.changeStatus = function(req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Content-Type");

	var post_data = JSON.parse(req.body); // req.body;

	var id = post_data.id;
	var status = post_data.status;

	dbservice
			.mysqlconnect()
			.then(
					function(con) {
						con.on('error', function(err, result) {
							console.log('error occurred. Reconneting...');
						});

						var query = "";

						if (status === "active") {
							query = "update tblPCategory set pcIsActive=1 where categoryId="
									+ id;
						} else if (status === "inactive") {
							query = "update tblPCategory set pcIsActive=0 where categoryId="
									+ id;
						}

						// console.log(query);

						con.query(query, function(err, result) {
							if (err) {
								console.log('err', err);
							}
						});

						var obj = {
							message : "Status changed successfully.."
						};

						res.send(obj);

					});
}

CategoriesController.getCategoryById = function(req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Content-Type");

	var post_data = req.body;

	var id = post_data;

	dbservice.sequalizeconnect().then(function(sequelize) {
		try {
			model = categories_model(sequelize);

			var whereConditions = {
				where : {
					categoryId : id
				}
			};

			model.findOne(whereConditions).then(function(data) {
				res.send(JSON.parse(data));
				sequelize.close();
			});
		} catch (e) {
			sequelize.close();
			console.log(e);
		}
	});

	/*
	 * dbservice.mysqlconnect().then(function(con) { con.on('error',
	 * function(err, result) { console.log('error occurred. Reconneting...');
	 * });
	 * 
	 * var query = " select * from tblPCategory where categoryId=" + id;
	 * 
	 * con.query(query, function(err, result) { if (err) { console.log('err',
	 * err); }
	 * 
	 * var string = JSON.stringify(result); var json = JSON.parse(string);
	 * 
	 * res.send(json[0]); }); });
	 */
};

CategoriesController.loadImage = function(req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Content-Type");

	var post_data = req.body;

	var id = post_data;

	var imageUploadPath = config.uploadLocation.imageUploads
			+ "CategoryImages/" + id + ".jpg";

	if (fs.existsSync(imageUploadPath)) {
		var fileData = globals.toBase64EncodedFile(imageUploadPath);

		var retObj = {
			"filedata" : fileData,
			"filename" : id + ".jpg",
			"path" : imageUploadPath
		}

		res.send(retObj);
	} else {
		res.send({});
	}

};

CategoriesController.uploadImage = function(req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Content-Type");

	var categoryId = req.fields.categoryId;
	var file = req.files.uploadFile;
	var imageUploadPath = config.uploadLocation.imageUploads
			+ "CategoryImages/" + categoryId + ".jpg";

	globals.saveFileToPath(file, imageUploadPath).then(function(result) {

		if (result.status) {
			res.json({
				status : "success",
				"message" : "File uploaded successfully.."
			})
		} else {
			res.json({
				status : "error",
				"message" : result.message
			})
		}

	});

};

module.exports = CategoriesController;

/*
 * getCategoryCount = function(con, query) { var d = q.defer();
 * 
 * con.query(sql, function(err, results) { if (err) { console.log('err', err);
 * d.reject(); } else { d.resolve(results); } }); return d.promise; }
 * 
 * getCategories = function(con, query) { var d = q.defer();
 * 
 * con.query(sql, function(err, results) { if (err) { console.log('err', err);
 * d.reject(); } else { d.resolve(results); } }); return d.promise; }
 */
