var formidable = require('express-formidable');
var bodyParser = require('body-parser');

module.exports = function(app) {

	app.get('/',bodyParser.text({type:"*/*",limit: '500mb'}),function(req, res){
		var home = require('./controllers/home/home');
		home.index(req, res);
	});
	
	app.get('/test',bodyParser.text({type:"*/*",limit: '500mb'}),function(req, res){
		var home = require('./controllers/home/home');
		home.testUrl(req, res);
	});
	
	app.get('/loadcategories',bodyParser.text({type:"*/*",limit: '500mb'}),function(req, res){
		var categories = require('./controllers/categories/categories');
		categories.getAllCategories(req, res);
	});
	
	app.get('/loadcategoriesbypage',bodyParser.text({type:"*/*",limit: '500mb'}),function(req, res){
		var categories = require('./controllers/categories/categories');
		categories.getCategoriesByPage(req, res);
	});
	
	app.post('/changestatus',bodyParser.text({type:"*/*",limit: '500mb'}),function(req, res){
		var categories = require('./controllers/categories/categories');
		categories.changeStatus(req, res);
	});
	
	app.post('/loadcategorybyid',bodyParser.text({type:"*/*",limit: '500mb'}),function(req, res){
		var categories = require('./controllers/categories/categories');
		categories.getCategoryById(req, res);
	});
	
	app.post('/loadimage',bodyParser.text({type:"*/*",limit: '500mb'}),function(req, res){
		var categories = require('./controllers/categories/categories');
		categories.loadImage(req, res);
	});
	
	app.post('/uploadcategoryimage',formidable(),function(req, res){
		var categories = require('./controllers/categories/categories');
		categories.uploadImage(req, res);
	});

};
