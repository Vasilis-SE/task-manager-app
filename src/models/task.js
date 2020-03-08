const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const taskSchema = new mongoose.Schema({
	userid: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'User' // The model name, to connect tasks to users
	},
	description: {
		type: String,
		trim: true,
		required: true,
		minlength: 10
	},
	isAssignedToGroup: {
		type: Boolean,
		default: false
	},
	groupid: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Group'
	},
	complete: {
		type: Boolean,
		default: false
	}
}, {
	timestamps: true
});

const Tasks = mongoose.model("Tasks", taskSchema);

module.exports = Tasks;