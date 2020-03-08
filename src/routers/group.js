const express = require("express");
const Group = require('../models/group');
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

// GET ?complete=true/false 
// GET ?desc=Name of group, or part of it 
router.get('/groups', authentication, async (request, response) => {
	let match = { userid: request.user._id };
	if(request.query.complete) { match.complete = request.query.complete === 'true'; }
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


module.exports = router;