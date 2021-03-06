'use strict'
// =================================================================
// get the packages we need ========================================
// =================================================================
const express 	= require('express');
const app         = express();
const bodyParser  = require('body-parser');
const morgan      = require('morgan');
const to = require('await-to-js').to;
const chalk = require('chalk');
const dotenv = require('dotenv');
const fse = require('fs-extra');
const path = require('path');
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const expressValidator = require('express-validator');
const expressStatusMonitor = require('express-status-monitor');
// const jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens

// =================================================================
// Other modules ===================================================
// =================================================================
const csystem = require(__dirname+'/../apps/csystem').csystem
const csErroHandler = require(__dirname+'/../apps/csystem').csErrors


const passportConfig = require(__dirname+'/../apps/csystem').passportConfig
let opts = {}
// var mongoose    = require('mongoose');

// =================================================================
// configuration ===================================================
// =================================================================
if (fse.existsSync('.env'))
	dotenv.load({ path: __dirname+'/../env' });
else
  dotenv.load({ path: __dirname+'/../env.example' });

app.set('port', process.env.PORT || 3000);
app.set('superSecret', process.env.JWT_SECRET); // secret variable

// use morgan to log requests to the console
app.use(morgan('combined'));
// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//cross-origin, not needed now
// app.use(cors())



// =================================================================
// routes ==========================================================
// =================================================================
app.get('/setup', function(req, res) {

	// create a sample user
	var nick = new User({ 
		name: 'Nick Cerminara', 
		password: 'password',
		admin: true 
	});
	nick.save(function(err) {
		if (err) throw err;

		console.log('User saved successfully');
		res.json({ success: true });
	});
});

// basic route (http://localhost:8080)
app.get('/', function(req, res) {
	res.json({Routes: ['/api']});
});


app.use(passport.initialize());		/////////////check

{
	let routes = {};
	console.log("Loading routes...")

  	/*
	 * read all folders in ../routes
	 * 		go to their models folders and load all the models
	 */
	fse
	.readdirSync(__dirname+"/../routes")
	.forEach((folda)=>{
		let routeFilePath = path.join(__dirname,"/../routes", folda)
		fse
		.readdirSync(routeFilePath)
		.filter((file) =>
			// all js files in folder
			file.split(".")[file.split(".").length-1] === "js"
		)
		.forEach((file)=>{
			let routename = file.split(".")[0];
            console.log("%s %s %s", chalk.green('✓'), chalk.green('✓'), routename);	
            routeFilePath = path.join(routeFilePath, file);
            routes[routename] = routeFilePath;
            new (require(routeFilePath)) (app)
		})
		
		
	})
}


// =================================================================
// Routes ==========================================================
// =================================================================

/**
 * 404
 */
app.route('*')
.get( function(req, res){
  csErroHandler.error404(req, res)
  //res.render('404');
})
.post( function(req, res){
// res.status(404);
  //res.send('what???');
  csErroHandler.error404(req, res)
});

/**
 * Error Handler
 */
app.use(function(err, req, res, next) {
  csErroHandler.error500(err, req, res, app.get("env"), function(err){
    next(err);
  });
  
});


// =================================================================
// start the server ================================================
// =================================================================
let start_server = async () => {
  let csystem_ = new csystem
  let [err, care, dontcare] = [];
  // [err, dontcare] = await to(csystem_.dbSync(false));
  [err, dontcare] = [null,null];
  if(err) {
    console.log(`Db error: ${err}`)
    process.exit(1);
  }
  /**
   * Start Express server.
   */
  app.listen(app.get('port'), () => {
    console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env')); 
    console.log('  Press CTRL-C to stop\n');
  });
}

start_server();