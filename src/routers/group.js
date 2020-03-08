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



module.exports = router;