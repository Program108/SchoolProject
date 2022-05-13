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


// Endpoints
// 0 - Normal Endpoint

app.get("/", (req,res) => {
	res.end("Api Working");
});

// 1 - Admin Creation Endpoint

app.post("/api/createAdmin", async(req,res) => {
	if(req.query.token.trim()==AUTHTOKEN){
		var name = req.body.name.trim();
		var email = req.body.email.trim();
		var password = req.body.password.trim();
		let paramsValid = name!=null&&email!=null&&password!=null&&name!=""&&email!=""&&password!="";
		if(paramsValid){
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
		}else{
			res.json({
				message:"Invalid Parameters"
			});
		}
	}else{
		res.json({
			message:"Invalid Authtoken"
		});
	}
});

// 2 - Login Admin Endpoint

app.post("/api/loginAdmin", async(req,res) => {
	if(req.query.token.trim()==AUTHTOKEN){
		var email = req.body.email.trim();
		var password = req.body.password.trim();
		let paramsValid = email!=null&&password!=null&&email!=""&&password!="";
		if(paramsValid){
			var Admins = await Admin.find({email});
			if(Admins.length>0){
				var passwordValid = bcrypt.compareSync(password, Admins[0].password);
				if(passwordValid){
					var token = jwt.sign({email}, jwtKey);
					var newSessList = Admins[0].sessions.concat([{
						token,
						createdOn:Date()
					}]);
					try{
						await Admin.updateOne({email},{
							$set: {
								sessions:newSessList
							}
						});
						res.json({
							message:"Login Successful",
							token
						});
					}catch(err){
						console.log("Sessions Updating Error - "+err);
						res.json({
							message:"Error Occured",
							error:err
						});
					}
				}else{
					res.json({
						messgae:"Wrong Password"
					});
				}
			}else{
				res.json({
					message:"Admin do not exists"
				});
			}
		}else{
			res.json({
				message:"Invalid Parameters"
			});
		}
	}else{
		res.json({
			message:"Invalid Authtoken"
		});
	}
});

// 3 - Verify Admin Session Endpoint

app.post("/api/verifySession", async(req,res) => {
	if(req.query.token.trim()==AUTHTOKEN){
		var email = req.body.email.trim();
		var token = req.body.token.trim();
		let paramsValid = email!=null&&token!=null&&email!=""&&token!="";
		if(paramsValid){
			var Admins = await Admin.find({email});
			if(Admins.length>0){
				var sessions = Admins[0].sessions;
				var flag=0;
				for(let i=0;i<sessions.length;i++){
					if(sessions[i].token==token){
						try{
							var tdata = jwt.verify(token, jwtKey);
							if(tdata.email==email){
								res.json({
									message:"Token Valid",
									data:sessions[i]
								});
								flag=1;
								break;
							}
						}catch(err){
							res.json({
								message:"Token Invalid"
							});
							flag=1;
							break;
						}
					}
				}
				if(flag==0){
					res.json({
						message:"Session do not exists"
					});
				}
			}else{
				res.json({
					message:"Admin do not exists"
				});
			}
		}else{
			res.json({
				message:"Invalid Parameters"
			});
		}
	}else{
		res.json({
			message:"Invalid Authtoken"
		});
	}
});

// 4 - Delete Session Endpoint

app.post("/api/deleteSession", async(req,res) => {
	if(req.query.token.trim()==AUTHTOKEN){
		var email = req.body.email.trim();
		var token = req.body.token.trim();
		let paramsValid = email!=null&&token!=null&&email!=""&&token!="";
		if(paramsValid){
			var Admins = await Admin.find({email});
			if(Admins.length>0){
				var sessions = Admins[0].sessions;
				var flag=0;
				for(let i=0;i<sessions.length;i++){
					if(sessions[i].token==token){
						try{
							var newSessList = sessions.slice(i+1);
							await Admin.updateOne({email},{
								$set: {
									sessions:newSessList
								}
							});
							res.json({
								message:"Session Deleted"
							});
							flag=1;
							break;
						}catch(err){
							res.json({
								message:"Error Occured",
								error:err
							});
							flag=1;
							break;
						}
					}
				}
				if(flag==0){
					res.json({
						message:"Session do not exists"
					});
				}
			}else{
				res.json({
					message:"Admin do not exists"
				});
			}
		}else{
			res.json({
				message:"Invalid Parameters"
			});
		}
	}else{
		res.json({
			message:"Invalid Authtoken"
		});
	}
});

// 5 - Contact Message Endpoint

app.post("/api/addMessage", async(req,res) => {
	if(req.query.token.trim()==AUTHTOKEN){
		var name = req.body.name.trim();
		var email = req.body.email.trim();
		var msg = req.body.password.trim();
		let paramsValid = name!=null&&email!=null&&msg!=null&&name!=""&&email!=""&&msg!="";
		if(paramsValid){
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
		}else{
			res.json({
				message:"Invalid Parameters"
			});
		}
	}else{
		res.json({
			message:"Invalid Authtoken"
		});
	}
});

// 6 - Get Notices Endpoint

app.post("/api/getNotice", async(req,res) => {
	if(req.query.token.trim()==AUTHTOKEN){
		let paramsValid = true;
		if(paramsValid){
			try{
				var notices = await Notice.find();
				var total = notices.length;
				res.json({
					message:"Success",
					total,
					notices
				});
			}catch(err){
				res.json({
					message:"Error Occured",
					error:err
				});
			}
		}else{
			res.json({
				message:"Invalid Parameters"
			});
		}
	}else{
		res.json({
			message:"Invalid Authtoken"
		});
	}
});

// 7 - Add Notice Endpoint

app.post("/api/addNotice", async(req,res) => {
	if(req.query.token.trim()==AUTHTOKEN){
		var notice = req.body.notice.trim();
		let paramsValid = notice!=null&&notice!="";
		if(paramsValid){
			var now = new Date();
			var date = [now.getDate(), now.getMonth()+1, now.getFullYear()];
			var time = [now.getHours(),now.getMinutes(),now.getSeconds()];
			var newNotice = new Notice({
				date,time,notice
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
		}else{
			res.json({
				message:"Invalid Parameters"
			});
		}
	}else{
		res.json({
			message:"Invalid Authtoken"
		});
	}
});

// 8 - Delete Notice Endpoint

app.post("/api/deleteNotice", async(req,res) => {
	if(req.query.token.trim()==AUTHTOKEN){
		var id = req.body.id.trim();
		let paramsValid = id!=null&&id!="";
		if(paramsValid){
			try{
				var result = await Notice.deleteOne({__id:id});
				res.json(result);
			}catch(err){
				res.json({
					message:"Error Occured",
					error:err
				});
			}
		}else{
			res.json({
				message:"Invalid Parameters"
			});
		}
	}else{
		res.json({
			message:"Invalid Authtoken"
		});
	}
});


// Starting the server

app.listen(port, function(){
        console.log(`Server running on port ${port}`);
});
