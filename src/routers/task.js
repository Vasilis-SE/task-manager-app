const express = require("express");
const Task = require('../models/task');
const Group = require('../models/group');
const authentication = require("../middleware/authentication");
const router = new express.Router();

router.post('/tasks', authentication, async (request, response) => {
	let tempTaskObj = {
		...request.body,
		userid: request.user._id
	};

	// If group id is set then need to check if exists and then store the task.
	if(request.body.groupid !== undefined) {
		let group = await Group.findOne({ _id: request.body.groupid });
		if(!group) { return response.status(404).send(); }
		tempTaskObj.groupid = request.body.groupid;
		tempTaskObj.isAssignedToGroup = true;
	}

	let task = new Task(tempTaskObj);

	try {
		await task.save();
		response.status(201).send(task);
	} catch(err) {
		response.status(400).send(err);
	}
});

// GET /tasks?complete=true
// GET /tasks?&limit=10&skip=10
// GET /tasks?&sortBy=createdAt:asc
router.get('/tasks', authentication, async (request, response) => {
	let match = {};
	let sortOptions = {};

	if(request.query.complete) { match.complete = request.query.complete === 'true'; }
	if(request.query.sortBy) {
		let parts = request.query.sortBy.split(":");
		sortOptions[parts[0].trim()] = parts[1].trim() === 'desc' ? -1 : 1;
	}

	try { 
		await request.user.populate({
			path: 'tasks',
			match,
			options: {
				limit: parseInt(request.query.limit),
				skip: parseInt(request.query.skip),
				sort: sortOptions
			}
		}).execPopulate();
		response.send(request.user.tasks)
	} catch(err) {
		response.status(500).send(err);
	}
});

router.get('/tasks/:id', authentication, async (request, response) => {
	try {
		let task = await Task.findOne({
			_id: request.params.id, 
			userid: request.user._id 
		});
		if(!task) { return response.status(404).send(); }
		response.send(task);
	} catch(err) {
		response.status(500).send(err);
	}
});

router.patch('/tasks/:id', authentication, async (request, response) => {
	let updates = Object.keys(request.body);
	let allowedUpdates = ['complete', 'description'];
	let isValidUpdate = updates.every((update) => allowedUpdates.includes(update))

	if(!isValidUpdate) { return response.status(400).send("Error occured! You are trying to update an invalid field!"); }

	try {
		let task = await Task.findOne({
			_id: request.params.id,
			userid: request.user._id
		});

		if(!task) { return response.status(404).send(); }

		updates.forEach((update) => task[update] = request.body[update]);
		await task.save();
		response.send(task);
	} catch(err) {
		response.status(400).send(err);
	}
});

router.delete('/tasks/:id', authentication, async (request, response) => {
	try {
		let task = await Task.findOneAndDelete({
			_id: request.params.id,
			userid: request.user._id
		});
		
		if(!task) { response.status(404).send(); }
		response.send(task);
	} catch(err) {
		response.status(500).send(); 
	}
});

module.exports = router;