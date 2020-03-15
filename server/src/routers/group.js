const express = require("express");
const Group = require('../models/group');
const Task = require('../models/task');
const authentication = require("../middleware/authentication");
const router = new express.Router();

router.post('/groups', authentication, async (request, response) => {
	let group = new Group({
		...request.body,
		userid: request.user._id
	});

	try {
		await group.save();
		response.status(201).send(group);
	} catch(err) {
		response.status(400).send(err);
	}
});

router.get('/groups/:id', authentication, async (request, response) => {
	try {
		let group = await Group.findOne({ 
			userid: request.user._id,
			_id:request.params.id 
		});
		response.status(200).send(group);
	} catch(err) {
		response.status(404).send(err);
	}
});

// GET /groups?complete=true/false.
// GET /groups?desc=Name of group, or part of it.
// GET /groups?from=1256894578 from stamp to search.
// GET /groups?to=1256894578 until stamp to search.
router.get('/groups', authentication, async (request, response) => {
	let match = { userid: request.user._id };
	
	if(request.query.complete) { match.complete = request.query.complete === 'true'; }
	if(request.query.from) { match.createdAt = { $gte: parseInt(request.query.from) } }
	if(request.query.to) { match.createdAt = { $lte: parseInt(request.query.to) } }
	if(request.query.desc) { 
		let description = request.query.desc.trim();
		match.description = new RegExp(description, 'i');
	}

	try {
		let groups = await Group.find(match);
		response.status(200).send(groups);
	} catch(err) {
		response.status(404).send(err);
	}
});

router.delete('/groups/:id', authentication, async (request, response) => {
	try {
		let group = await Group.findOneAndDelete({
			_id: request.params.id,
			userid: request.user._id
		});

		let tasks = await Task.deleteMany({
			groupid: request.params.id,
			userid: request.user._id
		});
		
		if(!group) { response.status(404).send(); }
		response.send({group, tasks});
	} catch(err) {
		response.status(500).send(err);
	}
});

router.patch('/groups/:id', authentication, async (request, response) => {
	let updates = Object.keys(request.body);
	let eligibleFields = ['description', 'complete'];
	let isValidUpdate = updates.every((update) => eligibleFields.includes(update));

	if(!isValidUpdate) { response.status(400).send(); }

	try {
		let group = await Group.findOne({
			_id: request.params.id,
			userid: request.user._id
		});

		updates.forEach((update) => group[update] = request.body[update]);
		await group.save();
		response.send(group);
	} catch(err) {
		response.status(500).send(err);
	}
});




module.exports = router;