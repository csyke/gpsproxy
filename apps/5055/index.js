'use strict'
const csystem = require(__dirname+"/../csystem").csystem;

class Api extends csystem
{

	constructor()
	{
		super()
	}

	async testGet(req, res){
		console.log(req.body)
		return [];
	}

	async main(req, res)
	{
		let self = this;
		let [err, dontcare, care] = [];
		// self.makeMePrivate(req, ["POST","GET","PUT","DELETE","PATCH"]);		
		self.isMethodAllowed(req, ["POST","GET","PUT","DELETE"]);

		let method = req.method;
		let t_req = self.trimReq(req);
		t_req.body = self.sentenceCase(req.body)

		switch(method)
		{
			case "POST":
				;[err, dontcare] = await to(self.register(t_req, res, next));
				break;
			case "GET":
				;[err, dontcare] = await to(self.testGet(t_req, res, next));
				break;
			case "PATCH": //not implemented
				;[err, dontcare] = await to(self.patchUser(t_req, res, next));
				break;
			case "PUT":
				;[err, dontcare] = await to(self.putUser(t_req, res, next));
				break;
			case "DELETE":
				;[err, dontcare] = await to(self.dropUser(t_req, res, next));
				break;
			default:
				return Promise.reject({message: "Method not allowed", status: 405})
		}

		if(err) {
			console.log(err)
			return Promise.reject(err)
		}

		return true;
	}
}

module.exports = Api