const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const User = require('../../src/models/user');
const Task = require('../../src/models/task');

// User Mock Data
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

const secondExistingUserId = new mongoose.Types.ObjectId();
const secondExistingUser = {
	_id: secondExistingUserId,
	name: 'tamy',
	email: 'tamy@ohmygod.com',
	password: '1234HACKED!@!@',
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

// Task Mock Data
const firstTask = {
	_id: mongoose.Types.ObjectId(),
	description: 'Test first task',
	completed: false,
	userid: existingUserId
};

const secondTask = {
	_id: mongoose.Types.ObjectId(),
	description: 'Test second task test test',
	completed: true,
	userid: secondExistingUserId
};

const thirdTask = {
	_id: mongoose.Types.ObjectId(),
	description: 'Test third task .....',
	completed: true,
	userid: existingUserId
};


const setupDatabase = async () => {
	await User.deleteMany();
	await Task.deleteMany();
	
	// After wipping the whole users document insert a new one
	// to have a registry to work with. Some test may need it 
	// such as uploading avatar image or even logging in.
	await new User(existingUser).save(); 
	await new User(secondExistingUser).save(); 
	
	await new Task(firstTask).save(); 
	await new Task(secondTask).save(); 
	await new Task(thirdTask).save(); 
};

module.exports = {
	existingUserId,
	existingUser,
	secondExistingUserId,
	secondExistingUser,
	nonExistingUserId,
	nonExistingUser,
	setupDatabase,
	firstTask,
	secondTask,
	thirdTask
};