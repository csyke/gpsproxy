/*
 * File:     first_time_setup.js
 * Author:   Brian Onang'o
 * Company:	Csyber Systems
 * Website:  http://familyfe.csymapp.com
 * E-mail:   brian@csymapp.com, brian@cseco.co.ke, surgbc@gmail.com
 * Created:	Feb 2018
 *
 * Description
 * This script is used for setting up the databases and default users when setting up familyfe-challenge for the first time
 *
 T
*/

'use strict'
const dotenv = require('dotenv');
const chalk = require('chalk');
const to = require('await-to-js').to;
const Promptly = require('promptly');

const csystem = require(__dirname+'/../apps/csystem').csystem
const globalConfig = require(__dirname+'/../apps/csystem').globalConfig
const {sequelize} = require(__dirname+'/../apps/csystem').models
const Familyfe = require(__dirname+'/../modules/node-familyfe')(sequelize)

// const World = familyfe.World(sequelize)
// dotenv.config({ silent: false });
// dotenv.load({ path: __dirname+'/../.env' });
//setup with system defaults or user inputs

class firstTimeSetup extends csystem
{

	constructor()
	{
		super()
	}

	async first_time_setup()
	{
		let self = this
		let [err, dontcare, care] = [];

		// //sync db
		;[err, dontcare] = await to (self.dbSync(true))
		if(err)return Promise.reject(err)
	
		let rootEmail = globalConfig.get('/rootEmail');
		console.log(`rootEmail: ${rootEmail}`);
		;[err, care] = await to(self.rootPassword())
		if(err)return Promise.reject(err)
		let rootPassword = care;
		console.log(`password: ${rootPassword}`)

		;[err, care] = await to (Familyfe.World.create({
			Name:"Brian Onang'o Admin", 
			Gender: "Male",
			Emailprofiles:{
				Email:rootEmail.toLowerCase(), 
				Password:rootPassword, 
				Cpassword:rootPassword, 
				IsActive:true,
				},
			IsActive:true
		}));
		if(err){
			console.log(err)
			return Promise.reject(err)
		}

		let guestEmail = globalConfig.get('/guestEmail');
		;[err, care] = await to (Familyfe.Person.beget({
			Name:"Brian Onang'o Guest", 
			Gender: "Male",
			Emailprofiles:{
				Email:guestEmail.toLowerCase(), 
				Password:rootPassword, 
				Cpassword:rootPassword, 
				IsActive:true,
				},
			IsActive:true
		}))
		
		if(err){
			console.log(err)
			return Promise.reject(err)
		}
		// console.log(care)
		
		// //errors
		// // ;[err, care] = await to (Familyfe.Person.beget({Name:"Brian Onang'o", Email:guestEmail.toLowerCase(), Password:guestEmail, Cpassword:guestEmail, IsActive:true}))
		// // console.log(err)
		// // if(err)return Promise.reject(err)
		// // ;[err, care] = await to (Familyfe.Person.beget({Name:"Brian Onang'o", Email:guestEmail.toLowerCase(), Password:"DUS", Cpassword:guestEmail, IsActive:true}))
		// // console.log(err)
		// // if(err)return Promise.reject(err)
		// // ;[err, care] = await to (Familyfe.Person.beget({Name:"Brian Onang'o", Email:guestEmail.toLowerCase(), Cpassword:guestEmail, IsActive:true}))
		// // console.log(err)
		// // if(err)return Promise.reject(err)
		return true
	}

	async rootPassword ()
	{	
		let password, dontcare, err;
		if(process.env.ENV === "development" || process.env.ENV === "dev")
        {
        	password = globalConfig.get('/rootEmail')
            return password
        }
        const validator = function (value) {
		    if (value.length < 5) {
		        throw new Error('Password less than 5 characters');
		    }
		    return value;
		};
		 
		// password = await Promptly.password('Root user password(atleast 5 characters): ', { validator ,replace: '*'});
		password = await Promptly.password('Root user password(atleast 5 characters): ', { validator});
        return password
	}

	async createAdmin()
	{

	}
}



let setup = async () => {
	let setup = new firstTimeSetup;
	let [err, dontcare] = await to( setup.first_time_setup(false));
	if(err)
	{
		console.log(chalk.red('✗ Set up failed'));
		process.exit(1)
	}
	console.log(chalk.green('✓ Done setting up'));
	process.exit(0)
}

setup()
