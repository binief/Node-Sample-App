'use strict';
var config = require('./../configs/config.js');
var colors = require('colors');
var mysql = require('mysql');
var Sequelize = require('sequelize');
var q = require('q');
var DBService = {};

DBService.mysqlconnect = function() {
	var d = q.defer();
	var dbSettings = config.dbSettings;
	DBService.connection = mysql.createConnection({
		host : dbSettings.host,
		user : dbSettings.user,
		password : dbSettings.password,
		database : dbSettings.database
	});

	DBService.connection.connect(function(err) {
		if (err) {
			console.log('Not connected '.red, err.toString().red,
					' RETRYING...'.blue);
			d.reject();
		} else {
			// console.log('Connected to Mysql. Exporting..'.blue);
			d.resolve(DBService.connection);
		}
	});
	return d.promise;
};

DBService.doMySqlQuery = function(con, sql) {
	var d = q.defer();

	con.query(sql, function(err, result) {
		if (err) {
			console.log('err', err);
			d.reject();
		} else {
			d.resolve(result);
		}
	});
	return d.promise;
};

DBService.getMysqlConn = function() {
	var dbSettings = config.dbSettings;
	var con = mysql.createConnection({
		host : dbSettings.host,
		user : dbSettings.user,
		password : dbSettings.password,
		database : dbSettings.database
	});
	return con;
};

DBService.sequalizeconnect = function() {
	var d = q.defer();

	var dbSettings = config.dbSettings;
	var sequelize = new Sequelize(dbSettings.database, dbSettings.user,
			dbSettings.password, {
				host : dbSettings.host,
				dialect : dbSettings.dialect,
				logging : !config.isProduction,
				pool : {
					max : 5,
					min : 0,
					idle : 10000,
					handleDisconnects : true
				}
			});

	sequelize
			.authenticate()
			.then(
					function() {
						console
								.log('Connection has been established successfully using sequelize.');
						d.resolve(sequelize);
					});

	return d.promise;
};

module.exports = DBService;