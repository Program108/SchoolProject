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
		default: `${new Date().getDate()}/${new Date().getMonth()+1}/${new Date().getFullYear()}`
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
		type: String,
		default: `${new Date().getDate()}/${new Date().getMonth()+1}/${new Date().getFullYear()}`
	}
});

const noticeSchema = new mongoose.Schema({
	date: {
		type: String,
		default: `${new Date().getDate()}/${new Date().getMonth()+1}/${new Date().getFullYear()}`
	},
	time: {
		type: String,
		default: `${new Date().getHours()}:${new Date().getMinutes()}`
	},
	notice: {
		type: String,
		required: true
	}
});

const studentSchema = new mongoose.Schema({
	admNo:{
		type: String,
		required: true,
		unique: true
	},
	cls:{
		type: String,
		required:true
	},
	section:{
		type: String,
		required:true
	},
	password:{
		type: String,
		default:""
	},
	details:{
		type:Object,
		required:true
	},
	halfYearlyResults:{
		type: Object,
		default:{
			englishRhymes:"",
			englishConversation:"",
			englishOral:"",
			englishHandwriting:"",
			englishWrittenOne:"",
			englishWrittenTwo:"",
			hindiRhymes:"",
			hindiOral:"",
			hindiHandwriting:"",
			hindiWritten:"",
			sanskrit:"",
			mathsOral:"",
			mathsWritten:"",
			physics:"",
			chemistry:"",
			biology:"",
			history:"",
			geography:"",
			genScience:"",
			socScience:"",
			computer:"",
			commerce:"",
			drawing:"",
			genKnowledge:"",
			moralScience:"",
			attendence:"",
			percentage:"",
			manners:{
				behaviour:"",
				neatnessOfWork:"",
				neatnessOfAppearance:"",
				punctuality:"",
				coCirricular:""
			}
		}
	},
	annualResults:{
		type: Object,
		default:{
			englishRhymes:"",
			englishConversation:"",
			englishOral:"",
			englishHandwriting:"",
			englishWrittenOne:"",
			englishWrittenTwo:"",
			hindiRhymes:"",
			hindiOral:"",
			hindiHandwriting:"",
			hindiWritten:"",
			sanskrit:"",
			mathsOral:"",
			mathsWritten:"",
			physics:"",
			chemistry:"",
			biology:"",
			history:"",
			geography:"",
			genScience:"",
			socScience:"",
			computer:"",
			commerce:"",
			drawing:"",
			genKnowledge:"",
			moralScience:"",
			attendence:"",
			percentage:"",
			manners:{
				behaviour:"",
				neatnessOfWork:"",
				neatnessOfAppearance:"",
				punctuality:"",
				coCirricular:""
			}
		}
	},
	feeDeatils:{
		type: Object,
		default:{
			january:false,
			february:false,
			march:false,
			april:false,
			may:false,
			june:false,
			july:false,
			august:false,
			september:false,
			october:false,
			november:false,
			december:false
		}
	}
});


module.exports = {
	adminSchema,
	messageSchema,
	noticeSchema,
	studentSchema
};
