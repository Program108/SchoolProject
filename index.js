// Importing required modules

const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const schemas = require("./schemas");


// Declaring Constants

const DB = "mongodb+srv://testdb:mypassword@learnmongo.vatfe.mongodb.net/DataBase?retryWrites=true&w=majority";
const jwtKey = "yesecretha";
const AUTHTOKEN = "ultraprotoken";
app = express();
const port = process.env.PORT || 8080;
app.use(express.json());

// Connecting to Database

mongoose.connect(DB).then(() => {
	console.log("Connected to Database");
}).catch(err => console.log("Error while connecting - "+err));

mongoose.connection.on("error", err => console.log("Runtime Connection Error - "+err));

// Creating Models

const Admin = new mongoose.model("Admin", schemas.adminSchema);
const Message = new mongoose.model("Message", schemas.messageSchema);
const Notice = new mongoose.model("Notice", schemas.noticeSchema);

// Parameters validation function

function validateParams(a){
	var valid = true;
	a.forEach(function(item){
		if(item==""||item==null){
			valid = false;
		}
	});
	return valid;
}


// Endpoints

// 0 - Normal Endpoint

app.get("/", (req,res) => {
	res.end("Api Working - All endpoints starts with /api");
});

// 1 - Admin Creation Endpoint

app.post("/api/createAdmin", async(req,res) => {
	var name = req.body.name;
	var email = req.body.email;
	var password = req.body.password;
	var p = [name,email,password];
	if(req.query.token!=AUTHTOKEN){
		res.json({
			message:"Invalid Authtoken"
		});
	}else if(!validateParams(p)){
		res.json({
			message:"Invalid Parameters"
		});
	}else{
		var hashedPassword = bcrypt.hashSync(password, 10);
		const newAdmin = new Admin({
			name,
			email,
			password:hashedPassword
		});
		try{
			var result = await newAdmin.save();
			console.log("Admin Creation - "+result);
			res.json({
				message:"Admin Created",
				data:result
			});
		}catch(err){
			console.log("Admin Creation Error - "+err);
			res.json({
				messgae:"Admin Not Created",
				error:err
			});
		}
	}
});

// 2 - Admin Login Endpoint

app.post("/api/loginAdmin", async(req,res) => {
	var email = req.body.email;
	var password = req.body.password;
	var p = [email,password];
	if(req.query.token!=AUTHTOKEN){
		res.json({
			message:"Invalid Authtoken"
		});
	}else if(!validateParams(p)){
		res.json({
			message:"Invalid Parameters"
		});
	}else{
		var Admins = await Admin.find({email});
		if(!Admins.length>0){
			res.json({
				message:"Account not found"
			});
		}else if(!bcrypt.compareSync(password, Admins[0].password)){
			res.json({
				message:"Wrong Password"
			});
		}else{
			var data = {
				email,
				role:"admin"
			};
			var token = jwt.sign(data, jwtKey);
			res.json({
				message:"Login Successful",
				token
			});
		}
	}
});

// 3 - Verify Session Endpoint

app.post("/api/verifySession", async(req,res) => {
	var email = req.body.email;
	var token = req.body.token;
	var p = [email,token];
	if(req.query.token!=AUTHTOKEN){
		res.json({
			message:"Invalid Authtoken"
		});
	}else if(!validateParams(p)){
		res.json({
			message:"Invalid Parameters"
		});
	}else{
		try{
			var td = jwt.verify(token, jwtKey);
			if(td.email==email){
				res.json({
					message:"Token Valid"
				});
			}else{
				res.json({
					message:"Token Invalid"
				});
			}
		}catch(err){
			res.json({
				message:"Token Invalid"
			});
		}
	}
});

// 4 - Contact Message Endpoint

app.post("/api/addMessage", async(req,res) => {
	var name = req.body.name;
	var email = req.body.email;
	var msg = req.body.message;
	var p = [name,email,msg];
	if(req.query.token!=AUTHTOKEN){
		res.json({
			message:"Invalid Authtoken"
		});
	}else if(!validateParams(p)){
		res.json({
			message:"Invalid Parameters"
		});
	}else{
		var newMsg = new Message({
			name,email,msg
		});
		try{
			await newMsg.save();
			res.json({
				message:"Message Added"
			});
		}catch(err){
			res.json({
				message:"Error Occured",
				error:err
			});
		}
	}
});

// 5 - Get Messages Endpoint

app.post("/api/getMessage", async(req,res) => {
	var date = req.body.date;
	if(req.query.token!=AUTHTOKEN){
		res.json({
			message:"Invalid Authtoken"
		});
	}else if(date!=null){
		try{
			var data = await Message.find({addedOn:date.split("/")});
			res.json({
				message:"Success",
				total:data.length,
				data
			});
		}catch(err){
			res.json({
				message:"Error Occured",
				error:err
			});
		}
	}else{
		try{
			var data = await Message.find();
			res.json({
				message:"Success",
				total:data.length,
				data
			});
		}catch(err){
			res.json({
				message:"Error Occured",
				error:err
			});
		}
	}
});

// 6 - Add Notice Endpoint

app.post("/api/addNotice", async(req,res) => {
	var notice = req.body.notice;
	var p = [notice];
	if(req.query.token!=AUTHTOKEN){
		res.json({
			message:"Invalid Authtoken"
		});
	}else if(!validateParams(p)){
		res.json({
			message:"Invalid Parameters"
		});
	}else{
		var newNotice = new Notice({
			notice
		});
		try{
			await newNotice.save();
			res.json({
				message:"Notice Added"
			});
		}catch(err){
			res.json({
				message:"Error Occured",
				error:err
			});
		}
	}
});

// 7 - Get Notice Endpoint

app.post("/api/getNotice", async(req,res) => {
	var d = req.body.date;
	if(req.query.token!=AUTHTOKEN){
		res.json({
			message:"Invalid Authtoken"
		});
	}else if(d!=null){
		try{
			var date = d.split("/");
			var data = await Notice.find({date});
			res.json({
				message:"Success",
				total:data.length,
				data
			});
		}catch(err){
			res.json({
				message:"Error Occured",
				error:err
			});
		}
	}else{
		try{
			var data = await Notice.find();
			res.json({
				message:"Success",
				total:data.length,
				data
			});
		}catch(err){
			res.json({
				message:"Error Occured",
				error:err
			});
		}
	}
});

// 8 - Delete Notice Endpoint

app.post("/api/deleteNotice", async(req,res) => {
	var id = req.body.id;
	var p = [id];
	if(req.query.token!=AUTHTOKEN){
		res.json({
			message:"Invalid Authtoken"
		});
	}else if(!validateParams(p)){
		res.json({
			message:"Invalid Parameters"
		});
	}else{
		try{
			var result = await Notice.deleteOne({_id:id});
			res.json({
				result
			});
		}catch(err){
			res.json({
				message:"Error Occured",
				error:err
			});
		}
	}
});

// 9 - Edit Notice Endpoint

app.post("/api/editNotice", async(req,res) => {
	var notice = req.body.notice;
	var id = req.body.id;
	var p = [notice,id];
	if(req.query.token!=AUTHTOKEN){
		res.json({
			message:"Invalid Authtoken"
		});
	}else if(!validateParams(p)){
		res.json({
			message:"Invalid Parameters"
		});
	}else{
		try{
			var result = await Notice.updateOne({_id:id}, {
				$set:{
					notice
				}
			});
			res.json({
				result
			});
		}catch(err){
			res.json({
				message:"Error Occured",
				error:err
			});
		}
	}
});

// Starting the server

app.listen(port, function(){
        console.log(`Server running on port ${port}`);
});
