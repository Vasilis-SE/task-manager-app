const request = require('supertest');

const app = require('../src/app');
const Task = require('../src/models/task');
const {
	existingUserId,
	existingUser, 
	secondExistingUserI,
	secondExistingUser,
	setupDatabase, 
	firstTask,
	secondTask, 
	thirdTask
} = require('./fixtures/db.js');

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

test('Fetch all user tasks', async () => {
	// Fetch tasks
	let response = await request(app)
		.get('/tasks')
		.set('Authorization', `Bearer ${existingUser.tokens[0].token}`)
		.send()
		.expect(200);

	// Check if the response is not null
	expect(response).not.toBeNull();

	// Check if the current number of tasks of the first users is 2 
	// (the default tasks that we insert the beforeEach method)
	expect(response.body.length).toEqual(2);
});

test('Should not delete other user task', async () => {
	// Attempt to delete user task through another user (should fail)
	let response = await request(app)
		.delete('/tasks/:id')
		.set('Authorization', `Bearer ${secondExistingUser.tokens[0].token}`)
		.send({ id: firstTask._id })
		.expect(500);

	// Assert that the task of the user that was attempted to be deleted is still in the database.
	let task = await Task.findById(firstTask._id);
	expect(task).not.toBeNull();
});