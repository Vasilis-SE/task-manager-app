const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
	userid: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'User'
	},
	description: {
		type: String,
		trim: true,
		required: true,
		minlength: 10
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

const Groups = mongoose.model("Group", groupSchema);

module.exports = Groups;