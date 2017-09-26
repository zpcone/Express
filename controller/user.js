var userModel = require("../model/mongoose/model/userModel");
var _ = require("underscore");
var express = require('express');
var app = express();

// exports.user_req = function(req,res,next){
// 	var user = req.session.user;

// 	if(!user){
// 		console.log('未登陆，没有访问权限');
// 		return res.redirect('/signin');
// 	}

// 	next();
// };

exports.show_signup = function(req,res){
	res.render('signup',{
		title:"注册页"
	});
};

exports.show_signin = function(req,res){
	res,render('signin',{
		title: '登录页'
	});
};

exports.signup = function(req,res){
	var userObj = req.body;
	console.log(userObj);
	var reg = /[0-9]+/g;
	
	userModel.findOne({name:userObj.name},function(err, user){
		if(err){
			console.log(err);
		}
		if(user){
			console.log(user)
			console.log("注册失败，用户名已存在！");
			res.send({
				name:"no"
			});
		} else {
			if(userObj.password){
				if(reg.test(userObj.password)){
					res.send({
						name:"no",
						password:"no"
					})
				}
			}
		}
		// else{
		// 	var newUser = new userModel(userObj);
		// 	console.log(newUser.name);
		// 	newUser.save(function(err,user){
		// 		if(err){
		// 			console.log(err);
		// 		}
		// 		console.log("注册成功！");
		// 		res.redirect('/signin');
		// 	});
		// }
	});
};

exports.updates = function(req,username,url){
	// var userObj = req.body;
	console.log(username+"  "+url)
	userModel.update({name:username},{$set:{image:url}},function(err,result){
		if(err){
			console.log(err);
		}
	});
};

exports.login = function(req,res){
	var userObj = req.body;
	var name = userObj.name;
	var password = userObj.password;
	userModel.findOne({name: name},function(err,result){
		if(err){
			console.log(err);
		}
		if(!result){
			res.send({"check":"name-err"});
		} else {
			result.comparePassword(password,function(err,isMatch){
				if(err){
					console.log(err);
				} 
				if(!isMatch){
					res.send({"check":"password-err"});
				} else {
					req.session.user = result;
					res.render("index");
				}
			})
		}
	})
};

