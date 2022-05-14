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
		type: Array,
		default: [new Date().getDate(), new Date().getMonth()+1, new Date().getFullYear()]
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
	},
	addedOn: {
		type: Array,
		default: [new Date().getDate(), new Date().getMonth()+1, new Date().getFullYear()]
	}
});

const noticeSchema = new mongoose.Schema({
	date: {
		type: Array,
		default: [new Date().getDate(), new Date().getMonth()+1, new Date().getFullYear()]
	},
	time: {
		type: Array,
		default: [new Date().getHours(), new Date().getMinutes()]
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
