const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const app = require('../src/app');
const User = require('../src/models/user');

// ========= Default dataset to work with tests =========
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

// Runs for every test case in this suite.
beforeEach(async () => {
	await User.deleteMany();
	
	// After wipping the whole users document insert a new one
	// to have a registry to work with. Some test may need it 
	// such as uploading avatar image or even logging in.
	await new User(existingUser).save(); 
});

// =============== User test cases ===============

test('Should signup a new user', async () => {
	// Save user into the database.
	let response = await request(app)
		.post('/users')
		.send({
			name: 'test123',
			email: 'cedaper354@finxmail.com',
			password: 'test123mypass'
		})
		.expect(201);

	// Assert that the user was successfully saved.
	let user = await User.findById(response.body.user._id);
	expect(user).not.toBeNull();

	// Assert that the user with name was successfully create & there is a token
	expect(response.body).toMatchObject({
		user: { name: 'test123' },
		token: user.tokens[0].token
	});

	expect(user.password).not.toBe('testpasss3123231');

});

test('Should login existing user', async () => {
	let response = await request(app)
		.post('/users/login')
		.send({
			email: existingUser.email,
			password: existingUser.password
		})
		.expect(200);

	let user = await User.findById(response.body.user._id);
	expect(user.tokens[1].token).toBe(response.body.token);
});

test('Should not login none existing user', async () => {
	await request(app)
		.post('/users/login')
		.send({
			email: 'cedaper354@finxmail.com',
			password: 'test123mypass'
		})
		.expect(400);
});

test('Should get profile of user', async () => {
	await request(app)
		.get('/users/profile')
		.set('Authorization', `Bearer ${existingUser.tokens[0].token}`)
		.send()
		.expect(200);
});

test('Should not get profile of unauthenticated user', async () => {
	await request(app)
		.get('/users/profile')
		.send()
		.expect(401);
});

test('Should delete account for user', async () => {
	let response = await request(app)
		.delete('/users/profile')
		.set('Authorization', `Bearer ${existingUser.tokens[0].token}`)
		.send()
		.expect(200)

	// Check if the user was been successfully deleted. 
	let user = await User.findById(response._id);
	expect(user).toBeNull();
});

test('Should not delete account for unauthenticated user', async () => {
	await request(app)
		.delete('/users/profile')
		.send()
		.expect(401)
});


test('Should not upload avatar image', async () => {
	await request(app)
		.post('/users/profile/avatar')
		.set('Authorization', `Bearer ${existingUser.tokens[0].token}`)
		.attach('avatar', 'unit_tests/fixtures/avatar1.jpg')
		.expect(200)

	let user = await User.findById(existingUserId);
	expect(user.avatar).toEqual(expect.any(Buffer));
});
