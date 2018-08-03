'use strict'
// const Promise = require('bluebird')
// const bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'))

// async function hashPassword(user, options){
// 	const SALT_FACTOR = 10
// 	if(!user.changed('Password')){
// 		return
// 	}

// 	if(!user.Cpassword)
// 		return Promise.reject({code:1002, msg:"Please confirm your password"});
// 	if(user.Cpassword)
// 		if(user.Password !== user.Cpassword)
// 			return Promise.reject({code:1002, msg:"Passwords don't match"});
// 	return bcrypt.genSaltAsync(SALT_FACTOR)
// 		.then((salt)=>bcrypt.hashAsync(user.dataValues.Password,salt, null))
// 		.then(hash=>{
// 			user.setDataValue('Password', hash)
// 		})
// }

module.exports = (sequelize, DataTypes) => {
	const User = sequelize.define('User', {
		uid: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV1,
			primaryKey: true
		},
		Name: {
			type: DataTypes.STRING, 
			allowNull: false,
            validate: {
            	 len: {
                    args: [3, 32],
                    msg: 'Please give us a correct name'
                }
            }
		},
		Gender: {
			type:DataTypes.ENUM('Male', 'Female'),
			defaultValue: 'Male'
		},
		IsActive: {
			type: DataTypes.BOOLEAN, 
			allowNull: false, 
			defaultValue: false
		}

	},
	{
		hooks: {
			//beforeCreate:hashPassword,
			//beforeUpdate:hashPassword,
			//beforeSave:hashPassword
		}

	})


	User.associate = function (models) {
	    User.hasMany(models.Github, {
	    	onDelete: "CASCADE",
	    	onUpdate: "CASCADE",
			foreignKey: {
				allowNull: false
			}
	    });
	    
	    User.hasMany(models.Facebook, {
	    	onDelete: "CASCADE",
	    	onUpdate: "CASCADE",
			foreignKey: {
				allowNull: false
			}
	    });

	    User.hasMany(models.Google, {
	    	onDelete: "CASCADE",
	    	onUpdate: "CASCADE",
			foreignKey: {
				allowNull: false
			}
	    });

		User.hasMany(models.Emailprofile, {
		    	// as: 'Emailprofile',
	    	onDelete: "CASCADE",
	    	onUpdate: "CASCADE",
			foreignKey: {
				allowNull: false
			}
	    });
	}


	// User.prototype.comparePass = async function(password){
	// 	return bcrypt.compareAsync(password, this.Password)
	// }


	 return User;
}
