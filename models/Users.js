const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const UserSchema = new Schema ({
	firstname: {
		type: String,
		requred: true
	},
	lastname: {
		type: String,
		requred: true
	},
	email: {
		type: String,
		requred: true,
		unique: true
	},
	password: {
		type: String,
		requred: true
	},
	dateCreated : {
		type : Date,
		default : Date.now
	},
	role: {
		type: String,
		default: "user"
	},
	status: {
		type: String,
		default: "Suspend"
	}
})

const User = mongoose.model('User', UserSchema)
module.exports = User