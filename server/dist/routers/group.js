"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var express = require("express");

var Group = require('../models/group');

var Task = require('../models/task');

var authentication = require("../middleware/authentication");

var router = new express.Router();
router.post('/groups', authentication, /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(request, response) {
    var group;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            group = new Group(_objectSpread(_objectSpread({}, request.body), {}, {
              userid: request.user._id
            }));
            _context.prev = 1;
            _context.next = 4;
            return group.save();

          case 4:
            response.status(201).send(group);
            _context.next = 10;
            break;

          case 7:
            _context.prev = 7;
            _context.t0 = _context["catch"](1);
            response.status(400).send(_context.t0);

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[1, 7]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
router.get('/groups/:id', authentication, /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(request, response) {
    var group;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return Group.findOne({
              userid: request.user._id,
              _id: request.params.id
            });

          case 3:
            group = _context2.sent;
            response.status(200).send(group);
            _context2.next = 10;
            break;

          case 7:
            _context2.prev = 7;
            _context2.t0 = _context2["catch"](0);
            response.status(404).send(_context2.t0);

          case 10:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 7]]);
  }));

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}()); // GET /groups?complete=true/false.
// GET /groups?desc=Name of group, or part of it.
// GET /groups?from=1256894578 from stamp to search.
// GET /groups?to=1256894578 until stamp to search.

router.get('/groups', authentication, /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(request, response) {
    var match, description, groups;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            match = {
              userid: request.user._id
            };

            if (request.query.complete) {
              match.complete = request.query.complete === 'true';
            }

            if (request.query.from) {
              match.createdAt = {
                $gte: parseInt(request.query.from)
              };
            }

            if (request.query.to) {
              match.createdAt = {
                $lte: parseInt(request.query.to)
              };
            }

            if (request.query.desc) {
              description = request.query.desc.trim();
              match.description = new RegExp(description, 'i');
            }

            _context3.prev = 5;
            _context3.next = 8;
            return Group.find(match);

          case 8:
            groups = _context3.sent;
            response.status(200).send(groups);
            _context3.next = 15;
            break;

          case 12:
            _context3.prev = 12;
            _context3.t0 = _context3["catch"](5);
            response.status(404).send(_context3.t0);

          case 15:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[5, 12]]);
  }));

  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}());
router["delete"]('/groups/:id', authentication, /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(request, response) {
    var group, tasks;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.next = 3;
            return Group.findOneAndDelete({
              _id: request.params.id,
              userid: request.user._id
            });

          case 3:
            group = _context4.sent;
            _context4.next = 6;
            return Task.deleteMany({
              groupid: request.params.id,
              userid: request.user._id
            });

          case 6:
            tasks = _context4.sent;

            if (!group) {
              response.status(404).send();
            }

            response.send({
              group: group,
              tasks: tasks
            });
            _context4.next = 14;
            break;

          case 11:
            _context4.prev = 11;
            _context4.t0 = _context4["catch"](0);
            response.status(500).send(_context4.t0);

          case 14:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[0, 11]]);
  }));

  return function (_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}());
router.patch('/groups/:id', authentication, /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(request, response) {
    var updates, eligibleFields, isValidUpdate, group;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            updates = Object.keys(request.body);
            eligibleFields = ['description', 'complete'];
            isValidUpdate = updates.every(function (update) {
              return eligibleFields.includes(update);
            });

            if (!isValidUpdate) {
              response.status(400).send();
            }

            _context5.prev = 4;
            _context5.next = 7;
            return Group.findOne({
              _id: request.params.id,
              userid: request.user._id
            });

          case 7:
            group = _context5.sent;
            updates.forEach(function (update) {
              return group[update] = request.body[update];
            });
            _context5.next = 11;
            return group.save();

          case 11:
            response.send(group);
            _context5.next = 17;
            break;

          case 14:
            _context5.prev = 14;
            _context5.t0 = _context5["catch"](4);
            response.status(500).send(_context5.t0);

          case 17:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[4, 14]]);
  }));

  return function (_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}());
module.exports = router;