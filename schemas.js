const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	createdOn: {
		type: String,
		default: Date()
	},
	sessions: {
		type: Array,
		default: []
	}
});

const messageSchema = new mongoose.Schema({
	name:{
		type: String,
		required: true
	},
	email:{
		type: String,
		required: true
	},
	msg:{
		type: String,
		required: true
	}
});

const noticeSchema = new mongoose.Schema({
	date: {
		type: Array,
		required: true
	},
	time: {
		type: Array,
		required: true
	},
	notice: {
		type: String,
		required: true
	}
});



module.exports = {
	adminSchema,
	messageSchema,
	noticeSchema
};
