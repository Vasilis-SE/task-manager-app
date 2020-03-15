const mongoose = require("mongoose");

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
	},
	createdAt: Number,
  	updatedAt: Number
}, {
	timestamps: { currentTime: () => Math.floor(Date.now() / 1000) }
});

const Tasks = mongoose.model("Tasks", taskSchema);

module.exports = Tasks;