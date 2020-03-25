const express = require("express");
const multer = require('multer');
const sharp = require('sharp');

const User = require('../models/user');
const AcountEmails = require('../emails/account.js');
const authentication = require('../middleware/authentication');

const router = new express.Router();
const uploader = multer({
	limits: {
		fileSize: 1000000 // 1 Megabyte
	},
	fileFilter(request, file, callback) {
		if(!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)) {
			return callback(new Error('Please uploade a valid image extension!'));
		}

		callback(undefined, true)
	}
});

router.post('/users', async (request, response) => {
	let user = new User(request.body);

	try {
		const token = await user.generateAuthToken();
		await user.save();
		AcountEmails.sendWelcomeEmail(user.email, user.name);
		response.status(201).send({
			user: user,
			token: token
		});
	} catch(err) {
		response.status(400).send(err);
	}
});

router.post('/users/login', async (request, response) => {
	try {
		const user = await User.findByCredentials(request.body.email, request.body.password);
		const token = await user.generateAuthToken();
		response.send({ user, token });
	} catch(err) {
		response.status(400).send()
	}
});

router.post('/users/logout', authentication, async (request, response) => {
	try {
		// Remove the token of the device that you want to logout from...
		request.user.tokens = request.user.tokens.filter((token) => {
			return token.token !== request.token
		});

		await request.user.save();
		response.send();
	} catch(err) {
		response.status(500).send();
	}
});

router.post('/users/logout/all', authentication, async (request, response) => {
	try {
		// Remove all tokens of a user to logout from all the devices...
		request.user.tokens = [];
		await request.user.save();
		response.send();
	} catch(err) {
		response.status(500).send();
	}
});

router.get('/users/profile', authentication, async (request, response) => {
	response.send(request.user);
});

router.patch('/users/profile', authentication, async (request, response) => {
	let updates = Object.keys(request.body);
	let allowedUpdates = ['name', 'email', 'password', 'age'];
	let isValidUpdate = updates.every((update) => allowedUpdates.includes(update))

	if(!isValidUpdate) { return response.status(400).send("Error occured! You are trying to update an invalid field!"); }

	try {
		updates.forEach((update) => request.user[update] = request.body[update]);
		await request.user.save();
		if(!request.user) { return response.status(404).send(); }
		response.send(request.user);
	} catch(err) {
		response.status(400).send(err);
	}
});

router.delete('/users/profile', authentication, async (request, response) => {
	try {
		AcountEmails.sendCancelationEmail(request.user.email, request.user.name);
		await request.user.remove();
		response.send(request.user);
	} catch(err) {
		response.status(500).send(); 
	}
});

router.post('/users/profile/avatar', authentication, uploader.single('avatar'), async (request, response) => {
	// Take tha raw image data `request.file.buffer` convert it to buffer and set extension to png and resize it to 250x250.
	let buffer = await sharp(request.file.buffer).resize({width:250, height:250}).png().toBuffer();
	request.user.avatar = buffer;
	await request.user.save();
	response.status(200).send();
}, (error, request, response, next) => {
	response.status(400).send({
		error: error.message
	});
});

router.delete('/users/profile/avatar', authentication, async (request, response) => {
	try {
		request.user.avatar = undefined;
		await request.user.save();
		response.status(200).send();
	} catch(err) {
		response.status(500).send();
	}
});

router.get('/users/:id/avatar', async (request, response) => {
	try {
		let user = await User.findById(request.params.id);

		if(!user || !user.avatar) {
			throw new Error();
		} 

		response.set('Content-Type', 'image/png');
		response.send(user.avatar);
	} catch(err) {
		response.status(404).send();
	}
});

module.exports = router;