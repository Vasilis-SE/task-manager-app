const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken');
const Task = require('./task');

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true
	},
	email: {
		type: String,
		unique: true,
		required: true,
		trim: true,
		lowercase: true,
		validate(value) {
			if(!validator.isEmail(value)) { // Custom validation.
				throw new Error('This is not a valid email!')
			}
		}
	},
	age: {
		type: Number,
		default: 0,
		validate(value) { // Custom validation.
			if(value < 0) {
				throw new Error('Age must be a positive number!');
			}

		}
	},
	password: {
		type: String,
		required: true,
		minlength: 7,
		trim: true,
		validate(value) {
			if(value.toLowerCase().includes("password")) {
				throw new Error("The passowrd contains invalid sub string!");
			}
		}
	},
	tokens: [{
		token: {
			type: String,
			required: true
		} 
	}],
	avatar: {
		type: Buffer
	}
}, {
	timestamps: true
});

userSchema.virtual('tasks', {
	ref: 'Tasks',
	localField: '_id',
	foreignField: 'userid'
});

userSchema.methods.toJSON  = function() {
	let userObject = this.toObject();

	// Remove user data when send back to user.
	delete userObject.password;
	delete userObject.tokens;
	delete userObject.avatar;

	return userObject;
};

userSchema.methods.generateAuthToken = async function () {
	let token = jwt.sign({_id: this._id.toString()}, process.env.JWT_SECRET);
	this.tokens = this.tokens.concat({token: token});
	await this.save();
	return token;
};

userSchema.statics.findByCredentials = async (email, pass) => {
	let user = await User.findOne({"email": email});
	if(!user) {
		throw new Error("Unable to login");
	}

	let isMatch = await bcrypt.compare(pass, user.password);
	if(!isMatch) {
		throw new Error("Unable to login")
	}

	return user;
};

// Using mongoose middleware in order to handle data before submission.
userSchema.pre('save', async function(next) {
	if(this.isModified('password')) {
		this.password = await bcrypt.hash(this.password, 8);
	}

	next(); // Finishing pre save process handler
});

userSchema.pre('remove', async function(next) {
	await Task.deleteMany({userid: this._id});
	next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
