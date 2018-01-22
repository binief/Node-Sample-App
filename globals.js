var config = require('./configs/config.js');
var mysql = require('mysql');
var fs = require('fs');
var q = require('q');

var Globals = {};

Globals.getDbSettings = function() {
	return config.dbSettings;
}

Globals.toBase64EncodedFile = function(file) {
	// read binary data
	var bitmap = fs.readFileSync(file);
	// convert binary data to base64 encoded string
	return new Buffer(bitmap).toString('base64');
}

Globals.saveFileToPath = function(file, path) {
	var d = q.defer();

	var old_path = file.path, file_size = file.size, file_ext = file.name
			.split('.').pop();
	
	fs.readFile(old_path, function(err, data) {
		if (err)
			d.reject({
				'status' : false,
				"message" : err
			});

		fs.writeFile(path, data, function(err) {
			if (err)
				d.reject({
					'status' : false,
					"message" : err
				});

			fs.unlink(old_path, function(err) {
				if (err) {
					d.reject();
				} else {
					d.resolve({
						'status' : true,
						"message" : "File uploaded successfully.."
					});
				}
			});
		});
	});
	

	return d.promise;
}

module.exports = Globals;