'use strict'
const csystem = require(__dirname+"/../csystem").csystem;
const to = require('await-to-js').to
const gpsservers = require('../../config/config.gpsservers');
const Async = require('async');
const request = require('request');

class Api extends csystem
{

	constructor()
	{
		super()
	}

	async forward(method, req, res){
		// console.log(req.body)
		// console.log(req.path)
		// console.log(req.query)
		// console.log(req.originalUrl)
		let forwardstr = '?'
		let tmpArr = []
		for(let i in req.query) {
			tmpArr.push(i+'='+req.query[i])
		}
		forwardstr += tmpArr.join('&')
		// console.log(forwardstr)
		let servers;
		servers = gpsservers.get("/gpsservers")

		Async.each(servers, function(url, next) {
			url = url+forwardstr
			switch(method)
			{
				case "POST":
					request.post(url, {}, function (error, response, body) {
				    	next();
					});
					break;
				case "GET":
					request(url, function (error, response, body) {
				    	next();
					});
					break;
				case "PATCH": 
					break;
				case "PUT":
					break;
				case "DELETE":
					break;
				default:
					return Promise.reject({message: "Method not allowed", status: 405})
			}

		}, function(errcode) {
			// next()
		});


		// switch(method)
		// {
		// 	case "POST":
		// 		;[err, dontcare] = await to(self.forward(t_req, res, next));
		// 		break;
		// 	case "GET":
		// 		;[err, dontcare] = await to(self.testGet(t_req, res, next));
		// 		break;
		// 	case "PATCH": //not implemented
		// 		;[err, dontcare] = await to(self.patchUser(t_req, res, next));
		// 		break;
		// 	case "PUT":
		// 		;[err, dontcare] = await to(self.putUser(t_req, res, next));
		// 		break;
		// 	case "DELETE":
		// 		;[err, dontcare] = await to(self.dropUser(t_req, res, next));
		// 		break;
		// 	default:
		// 		return Promise.reject({message: "Method not allowed", status: 405})
		// }

		// get forward 
		//forward to servers then return correct format of response for device
		// Async.each(servers, function(url, next1) {
        	// upStr = log
		//     let sendto = url +log;
		//     request(sendto, function (error, response, body) {
		// 	if(body === undefined || body == undefined)error = {code:"WRONGBODY"}    
		// 	try
		//     	{
		//     		if(body.length > 400)
		//     			if(!error)error = {code:"WRONGBODY"}
		    		
		//     	}catch(err){if(!error)error = {code:"WRONGBODY"} }					    	
		//     	try
		//     	{
		//     		if(response.statusCode !== 200)
		//     		serverNotFound.push(true)
		// 	    }catch(error)
		// 	    {
		// 	    	serverNotFound.push(true)
		// 	    }
		    	
		//     	if(numServers === serverNotFound.length)
  //   				if(!error)error = {code:"SERVERMISCONFIGURATION"}
		//     	if(error)
		//     	{
		//     		connectionError = true;
		//     		return next1(error.code)
		//     	}
		//     	if(deleted[ind_next] === false)
		//     	{
		//     		deleted[parseInt(ind)+1] = true
		// 		hasBeenDeleted = true;
		//     		let cmd2 = `sed -n '${ind_next}p;' vipimo_${device}.logs`
		//     		let child2 = shell.exec(cmd2, {async:true, silent:true});
		//     		child2.stdout.on('data', function(line) {
		//     			let cmd3 = `find vipimo_${device}.logs -type f -exec  sed -i 's/${line.replace(/[\r\n]/g, '')}/:::::::/g' {} +`
		//     			// console.log(cmd3)
		//     			let child3 = shell.exec(cmd3, {async:true, silent:true});
		//     		});
		//     	}
		    	
		//     	if(body === undefined) next1();
		// 		if(response.statusCode !== 200)
		// 		{
		// 			console.log(`from kcs statusCode: ${response.statusCode} `)
		// 			 next1()
		// 		}else console.log('from kcs:', body);  
		// 		if(device !== "gateway")next1()
		// 		else
		// 		{
		// 			let commands = body.match(/\+CLI(.)*/ig);
		// 			Async.each(commands, function(command, callback_inner) {
		// 				command = command.replace(/\+CLI([.]*)/ig, '$1');

		// 				let cmd = command;
		// 				console.log(cmd)
		// 				let child = shell.exec(cmd, {async:true, silent:true});
		// 				let calledback = false;
		// 				child.stdout.on('data', function(data) {
		// 					// console.log(data)
		// 					if(calledback === false) 
		// 						callback_inner();
		// 				});
		// 			});
					
		// 			next1()
		// 		}

		// 	});

		// }, function(errcode) {
		// 	errcode = hasBeenDeleted===false?"DONOTHING":errcode
		// 	self.saveForLater(errcode, upStr, device);
		// 	if(errcode)
		// 	{
		// 		return callback(null, 0)
				
		// 	}
		// 	else next()
		// });
		res.send('') //empty response
		return [];
	}

	async main(req, res, next)
	{

		let self = this;
		let [err, dontcare, care] = [];
		// self.makeMePrivate(req, ["POST","GET","PUT","DELETE","PATCH"]);		
		self.isMethodAllowed(req, ["POST","GET","PUT","DELETE"]);

		let method = req.method;
		let t_req = self.trimReq(req);
		t_req.body = self.sentenceCase(req.body)


		;[err, dontcare] = await to(self.forward(method, req, res, next));
		// switch(method)
		// {
		// 	case "POST":
		// 		;[err, dontcare] = await to(self.forward(t_req, res, next));
		// 		break;
		// 	case "GET":
		// 		;[err, dontcare] = await to(self.testGet(t_req, res, next));
		// 		break;
		// 	case "PATCH": //not implemented
		// 		;[err, dontcare] = await to(self.patchUser(t_req, res, next));
		// 		break;
		// 	case "PUT":
		// 		;[err, dontcare] = await to(self.putUser(t_req, res, next));
		// 		break;
		// 	case "DELETE":
		// 		;[err, dontcare] = await to(self.dropUser(t_req, res, next));
		// 		break;
		// 	default:
		// 		return Promise.reject({message: "Method not allowed", status: 405})
		// }

		if(err) {
			console.log(err)
			return Promise.reject(err)
		}

		return true;
	}
}

module.exports = Api