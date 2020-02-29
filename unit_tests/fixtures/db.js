const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../../src/models/user');

const existingUserId = new mongoose.Types.ObjectId();
const existingUser = {
	_id: existingUserId,
	name: 'existingUser',
	email: 'terte353@example.com',
	password: 'existingUser154489652!@!@',
	tokens: [{
		token: jwt.sign({ _id: existingUserId }, process.env.JWT_SECRET)
	}] 
};

const nonExistingUserId = new mongoose.Types.ObjectId();
const nonExistingUser = {
	_id: nonExistingUserId,
	name: 'nonExistingUser',
	email: 'cedaper353@example.com',
	password: 'nonExistingUser154489652!@!@',
	tokens: [{
		token: jwt.sign({ _id: nonExistingUserId }, process.env.JWT_SECRET)
	}] 
};

const setupDatabase = async () => {
	await User.deleteMany();
	
	// After wipping the whole users document insert a new one
	// to have a registry to work with. Some test may need it 
	// such as uploading avatar image or even logging in.
	await new User(existingUser).save(); 
};

module.exports = {
	existingUserId,
	existingUser,
	nonExistingUserId,
	nonExistingUser,
	setupDatabase
};