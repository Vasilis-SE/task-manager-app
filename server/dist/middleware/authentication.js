"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var jwt = require('jsonwebtoken');

var User = require('../models/user');

var auth = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(request, response, next) {
    var token, decodedToken, user;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            token = request.header('Authorization').replace('Bearer', '').trim();
            decodedToken = jwt.verify(token, '4!L4pL9W@LqtgL*3Q@cg'); // Fetch the user which token matches the on that the client send and that it is
            // one of the stored tokens from the tokens array that the user has (tokens.token: token).

            _context.next = 5;
            return User.findOne({
              _id: decodedToken._id,
              'tokens.token': token
            });

          case 5:
            user = _context.sent;

            if (user) {
              _context.next = 8;
              break;
            }

            throw new Error();

          case 8:
            request.token = token;
            request.user = user;
            next();
            _context.next = 16;
            break;

          case 13:
            _context.prev = 13;
            _context.t0 = _context["catch"](0);
            response.status(401).send({
              error: "Please authenticate!"
            });

          case 16:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 13]]);
  }));

  return function auth(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

module.exports = auth;