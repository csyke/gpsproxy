const Csystem = require(__dirname+"/../../apps/csystem/index");
const csystem = Csystem.csystem;
const router = Csystem.router;
const globalConfig = Csystem.globalConfig;

class csystemroutes
{
	constructor(app)
	{
		let returnto = "/#"
		/*
		 * common query string
		 * middleware function to set_defaults_
		 */
		app.use('/:app?/:method?/:v1?/:v2?/:v3?/:v4?/:v5?/:v6?/:v7?/:v8?/:v9?/', 
			router.defaults,
			function (req, res) {
		  	router.loadpage( req, res, function(err, results){
		  		// return next()
		  	})

		})
	}
}

module.exports = csystemroutes