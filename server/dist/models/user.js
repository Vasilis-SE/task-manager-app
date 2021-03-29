"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var mongoose = require("mongoose");

var validator = require("validator");

var bcrypt = require("bcryptjs");

var jwt = require('jsonwebtoken');

var Task = require('./task');

var userSchema = new mongoose.Schema({
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
    validate: function validate(value) {
      if (!validator.isEmail(value)) {
        // Custom validation.
        throw new Error('This is not a valid email!');
      }
    }
  },
  age: {
    type: Number,
    "default": 0,
    validate: function validate(value) {
      // Custom validation.
      if (value < 0) {
        throw new Error('Age must be a positive number!');
      }
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
    trim: true,
    validate: function validate(value) {
      if (value.toLowerCase().includes("password")) {
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
  },
  createdAt: Number,
  updatedAt: Number
}, {
  timestamps: {
    currentTime: function currentTime() {
      return Math.floor(Date.now() / 1000);
    }
  }
});
userSchema.virtual('tasks', {
  ref: 'Tasks',
  localField: '_id',
  foreignField: 'userid'
});

userSchema.methods.toJSON = function () {
  var userObject = this.toObject(); // Remove user data when send back to user.

  delete userObject.password;
  delete userObject.tokens;
  delete userObject.avatar;
  return userObject;
};

userSchema.methods.generateAuthToken = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
  var token;
  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          token = jwt.sign({
            _id: this._id.toString()
          }, process.env.JWT_SECRET);
          this.tokens = this.tokens.concat({
            token: token
          });
          _context.next = 4;
          return this.save();

        case 4:
          return _context.abrupt("return", token);

        case 5:
        case "end":
          return _context.stop();
      }
    }
  }, _callee, this);
}));

userSchema.statics.findByCredentials = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(email, pass) {
    var user, isMatch;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return User.findOne({
              "email": email
            });

          case 2:
            user = _context2.sent;

            if (user) {
              _context2.next = 5;
              break;
            }

            throw new Error("Unable to login");

          case 5:
            _context2.next = 7;
            return bcrypt.compare(pass, user.password);

          case 7:
            isMatch = _context2.sent;

            if (isMatch) {
              _context2.next = 10;
              break;
            }

            throw new Error("Unable to login");

          case 10:
            return _context2.abrupt("return", user);

          case 11:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x, _x2) {
    return _ref2.apply(this, arguments);
  };
}(); // Using mongoose middleware in order to handle data before submission.


userSchema.pre('save', /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(next) {
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            if (!this.isModified('password')) {
              _context3.next = 4;
              break;
            }

            _context3.next = 3;
            return bcrypt.hash(this.password, 8);

          case 3:
            this.password = _context3.sent;

          case 4:
            next(); // Finishing pre save process handler

          case 5:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function (_x3) {
    return _ref3.apply(this, arguments);
  };
}());
userSchema.pre('remove', /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(next) {
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return Task.deleteMany({
              userid: this._id
            });

          case 2:
            next();

          case 3:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function (_x4) {
    return _ref4.apply(this, arguments);
  };
}());
var User = mongoose.model("User", userSchema);
module.exports = User;