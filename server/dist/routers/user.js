"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var express = require("express");

var multer = require('multer');

var sharp = require('sharp');

var User = require('../models/user');

var AcountEmails = require('../emails/account.js');

var authentication = require('../middleware/authentication');

var router = new express.Router();
var uploader = multer({
  limits: {
    fileSize: 1000000 // 1 Megabyte

  },
  fileFilter: function fileFilter(request, file, callback) {
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)) {
      return callback(new Error('Please uploade a valid image extension!'));
    }

    callback(undefined, true);
  }
});
router.post('/users', /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(request, response) {
    var user, token;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            user = new User(request.body);
            _context.prev = 1;
            _context.next = 4;
            return user.generateAuthToken();

          case 4:
            token = _context.sent;
            _context.next = 7;
            return user.save();

          case 7:
            AcountEmails.sendWelcomeEmail(user.email, user.name);
            response.status(201).send({
              user: user,
              token: token
            });
            _context.next = 14;
            break;

          case 11:
            _context.prev = 11;
            _context.t0 = _context["catch"](1);
            response.status(400).send(_context.t0);

          case 14:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[1, 11]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
router.post('/users/login', /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(request, response) {
    var user, token;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return User.findByCredentials(request.body.email, request.body.password);

          case 3:
            user = _context2.sent;
            _context2.next = 6;
            return user.generateAuthToken();

          case 6:
            token = _context2.sent;
            response.send({
              user: user,
              token: token
            });
            _context2.next = 13;
            break;

          case 10:
            _context2.prev = 10;
            _context2.t0 = _context2["catch"](0);
            response.status(400).send();

          case 13:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 10]]);
  }));

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}());
router.post('/users/logout', authentication, /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(request, response) {
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            // Remove the token of the device that you want to logout from...
            request.user.tokens = request.user.tokens.filter(function (token) {
              return token.token !== request.token;
            });
            _context3.next = 4;
            return request.user.save();

          case 4:
            response.send();
            _context3.next = 10;
            break;

          case 7:
            _context3.prev = 7;
            _context3.t0 = _context3["catch"](0);
            response.status(500).send();

          case 10:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 7]]);
  }));

  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}());
router.post('/users/logout/all', authentication, /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(request, response) {
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            // Remove all tokens of a user to logout from all the devices...
            request.user.tokens = [];
            _context4.next = 4;
            return request.user.save();

          case 4:
            response.send();
            _context4.next = 10;
            break;

          case 7:
            _context4.prev = 7;
            _context4.t0 = _context4["catch"](0);
            response.status(500).send();

          case 10:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[0, 7]]);
  }));

  return function (_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}());
router.get('/users/profile', authentication, /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(request, response) {
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            response.send(request.user);

          case 1:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function (_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}());
router.patch('/users/profile', authentication, /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(request, response) {
    var updates, allowedUpdates, isValidUpdate;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            updates = Object.keys(request.body);
            allowedUpdates = ['name', 'email', 'password', 'age'];
            isValidUpdate = updates.every(function (update) {
              return allowedUpdates.includes(update);
            });

            if (isValidUpdate) {
              _context6.next = 5;
              break;
            }

            return _context6.abrupt("return", response.status(400).send("Error occured! You are trying to update an invalid field!"));

          case 5:
            _context6.prev = 5;
            updates.forEach(function (update) {
              return request.user[update] = request.body[update];
            });
            _context6.next = 9;
            return request.user.save();

          case 9:
            if (request.user) {
              _context6.next = 11;
              break;
            }

            return _context6.abrupt("return", response.status(404).send());

          case 11:
            response.send(request.user);
            _context6.next = 17;
            break;

          case 14:
            _context6.prev = 14;
            _context6.t0 = _context6["catch"](5);
            response.status(400).send(_context6.t0);

          case 17:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[5, 14]]);
  }));

  return function (_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}());
router["delete"]('/users/profile', authentication, /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(request, response) {
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.prev = 0;
            AcountEmails.sendCancelationEmail(request.user.email, request.user.name);
            _context7.next = 4;
            return request.user.remove();

          case 4:
            response.send(request.user);
            _context7.next = 10;
            break;

          case 7:
            _context7.prev = 7;
            _context7.t0 = _context7["catch"](0);
            response.status(500).send();

          case 10:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, null, [[0, 7]]);
  }));

  return function (_x13, _x14) {
    return _ref7.apply(this, arguments);
  };
}());
router.post('/users/profile/avatar', authentication, uploader.single('avatar'), /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(request, response) {
    var buffer;
    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.next = 2;
            return sharp(request.file.buffer).resize({
              width: 250,
              height: 250
            }).png().toBuffer();

          case 2:
            buffer = _context8.sent;
            request.user.avatar = buffer;
            _context8.next = 6;
            return request.user.save();

          case 6:
            response.status(200).send();

          case 7:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  }));

  return function (_x15, _x16) {
    return _ref8.apply(this, arguments);
  };
}(), function (error, request, response, next) {
  response.status(400).send({
    error: error.message
  });
});
router["delete"]('/users/profile/avatar', authentication, /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(request, response) {
    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.prev = 0;
            request.user.avatar = undefined;
            _context9.next = 4;
            return request.user.save();

          case 4:
            response.status(200).send();
            _context9.next = 10;
            break;

          case 7:
            _context9.prev = 7;
            _context9.t0 = _context9["catch"](0);
            response.status(500).send();

          case 10:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9, null, [[0, 7]]);
  }));

  return function (_x17, _x18) {
    return _ref9.apply(this, arguments);
  };
}());
router.get('/users/:id/avatar', /*#__PURE__*/function () {
  var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(request, response) {
    var user;
    return regeneratorRuntime.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            _context10.prev = 0;
            _context10.next = 3;
            return User.findById(request.params.id);

          case 3:
            user = _context10.sent;

            if (!(!user || !user.avatar)) {
              _context10.next = 6;
              break;
            }

            throw new Error();

          case 6:
            response.set('Content-Type', 'image/png');
            response.send(user.avatar);
            _context10.next = 13;
            break;

          case 10:
            _context10.prev = 10;
            _context10.t0 = _context10["catch"](0);
            response.status(404).send();

          case 13:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10, null, [[0, 10]]);
  }));

  return function (_x19, _x20) {
    return _ref10.apply(this, arguments);
  };
}());
module.exports = router;