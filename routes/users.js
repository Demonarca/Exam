const router = require('express').Router();
const User = require('./../models/Users')
const bcrypt = require('bcrypt');
const passport = require('passport');
require('./../passport-setup');
const jwt = require('jsonwebtoken');
const validate =require('./../validate.js');


router.post('/register', (req, res, next) => {

	let firstname = req.body.firstname
	let lastname = req.body.lastname
	let email = req.body.email
	let password = req.body.password
	let confirmPassword = req.body.confirmPassword

	if (!firstname || !lastname || !email || !password || !confirmPassword) {
		return res.status(400).send({
			message : "Incomplete fields"
		})
	}

	if(password.length < 8){
		return res.status(400).send({
			message : "Password is too short"
		})
	}

	if(password !== confirmPassword){
		return res.status(400).send({
			message : "Password did not matched!"
		})
	}

	// check if email is already use
	User.findOne({email : email})
	.then( user => {
		if(user){
			res.status(400).send({
				message : "email is already in use!"
			})
		} else {
			const saltRounds = 10;
			bcrypt.genSalt(saltRounds, function(err, salt){
				bcrypt.hash(password, salt, function(err, hash){
					User.create({
						firstname, 
						lastname, 
						password : hash, 
						email
					})
					.then(user => {
						res.send({message: "Registered Successfully"})
					})
				})
			})
			
		}
	})

})

//to get all the users
router.get('/', function(req,res, next){
	User.find()
	.then( users => {
		res.json(users)
	})
	.catch(next);
})


router.post('/login', (req, res, next)=> {
	let email = req.body.email;
	let password = req.body.password;

	// check if there are credentials
	if (!email || !password){
		return res.status(400).send({
			message : "Something went wrong"
		})
	}
	// check if it is registered match
	User.findOne({email})
	.then( user => {
		// if there are no email matched 
		if(!user){
			return  res.status(400).send({
				message : "Something went wrong"
			})
		} else {
			// check if matched password with email holder
			bcrypt.compare(password, user.password, (err, passwordMatch) => {
				if (passwordMatch){
					let token = jwt.sign({id : user._id}, 'secret');
					return res.send({message : "Login Successfully",
						token : token,
						user : {
							firstname : user.firstname,
							lastname : user.lastname,
							role : user.role,
							id : user._id
						}
				})
				} else {
					return res.send({message: "Something went wrong"})
				}
			})
		}
	}) 
})

//to update the status of suspend
router.put('/status/:id', passport.authenticate('jwt', { session: false }), validate.isAdmin, (req, res, next)=>{

	User.findOneAndUpdate(
		{ 
			_id : req.params.id
		}, 
		{
			status : req.body.status
		},
		{
			new : true,
		}
	)
	.then(user => res.json(user))
	.catch(next)
})

//to delete a user
router.delete('/:id', passport.authenticate('jwt', { session: false }), validate.isAdmin, (req, res, next)=>{
	User.findOneAndDelete({ _id : req.params.id})
	.then( user => res.json(user))
	.catch(next)
})

module.exports = router;