const request = require('supertest');

const app = require('../src/app');
const Task = require('../src/models/task');
const {existingUserId ,existingUser ,setupDatabase} = require('./fixtures/db.js');

// Runs for every test case in this suite.
beforeEach(setupDatabase);

test('Should create task for a user', async () => {
	// Create new task
	let response = await request(app)
		.post('/tasks')
		.set('Authorization', `Bearer ${existingUser.tokens[0].token}`)
		.send({description: "A test task description", complete: false})
		.expect(201)

	// Check if the response is not null
	expect(response).not.toBeNull();

	// Check if the same task has been successfully created.
	let task = await Task.findById(response.body._id);
	expect(task).not.toBeNull();
});

// test('Should not create task for a user', async () => {
// 	await request(app)
// 		.post('/tasks')
// 		.set('Authorization', `Bearer ${existingUser.tokens[0].token}`)
// 		.send({description: "A test task description", somethingWrong: false})
// 		.expect(400)
// });