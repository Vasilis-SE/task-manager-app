"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var express = require("express");

var Task = require('../models/task');

var Group = require('../models/group');

var authentication = require("../middleware/authentication");

var router = new express.Router();
router.post('/tasks', authentication, /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(request, response) {
    var tempTaskObj, group, task;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            tempTaskObj = _objectSpread(_objectSpread({}, request.body), {}, {
              userid: request.user._id
            }); // If group id is set then need to check if exists and then store the task.

            if (!(request.body.groupid !== undefined)) {
              _context.next = 9;
              break;
            }

            _context.next = 4;
            return Group.findOne({
              _id: request.body.groupid
            });

          case 4:
            group = _context.sent;

            if (group) {
              _context.next = 7;
              break;
            }

            return _context.abrupt("return", response.status(404).send());

          case 7:
            tempTaskObj.groupid = request.body.groupid;
            tempTaskObj.isAssignedToGroup = true;

          case 9:
            task = new Task(tempTaskObj);
            _context.prev = 10;
            _context.next = 13;
            return task.save();

          case 13:
            response.status(201).send(task);
            _context.next = 19;
            break;

          case 16:
            _context.prev = 16;
            _context.t0 = _context["catch"](10);
            response.status(400).send(_context.t0);

          case 19:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[10, 16]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}()); // GET /tasks?complete=true
// GET /tasks?limit=10&skip=10
// GET /tasks?sortBy=createdAt:asc
// GET /tasks?from=1256894578 from stamp to search.
// GET /tasks?to=1256894578 until stamp to search.

router.get('/tasks', authentication, /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(request, response) {
    var match, sortOptions, parts;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            match = {};
            sortOptions = {};

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

            if (request.query.sortBy) {
              parts = request.query.sortBy.split(":");
              sortOptions[parts[0].trim()] = parts[1].trim() === 'desc' ? -1 : 1;
            }

            _context2.prev = 6;
            _context2.next = 9;
            return request.user.populate({
              path: 'tasks',
              match: match,
              options: {
                limit: parseInt(request.query.limit),
                skip: parseInt(request.query.skip),
                sort: sortOptions
              }
            }).execPopulate();

          case 9:
            response.send(request.user.tasks);
            _context2.next = 15;
            break;

          case 12:
            _context2.prev = 12;
            _context2.t0 = _context2["catch"](6);
            response.status(500).send(_context2.t0);

          case 15:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[6, 12]]);
  }));

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}());
router.get('/tasks/:id', authentication, /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(request, response) {
    var task;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return Task.findOne({
              _id: request.params.id,
              userid: request.user._id
            });

          case 3:
            task = _context3.sent;

            if (task) {
              _context3.next = 6;
              break;
            }

            return _context3.abrupt("return", response.status(404).send());

          case 6:
            response.send(task);
            _context3.next = 12;
            break;

          case 9:
            _context3.prev = 9;
            _context3.t0 = _context3["catch"](0);
            response.status(500).send(_context3.t0);

          case 12:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 9]]);
  }));

  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}());
router.patch('/tasks/:id', authentication, /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(request, response) {
    var updates, allowedUpdates, isValidUpdate, task;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            updates = Object.keys(request.body);
            allowedUpdates = ['complete', 'description'];
            isValidUpdate = updates.every(function (update) {
              return allowedUpdates.includes(update);
            });

            if (isValidUpdate) {
              _context4.next = 5;
              break;
            }

            return _context4.abrupt("return", response.status(400).send("Error occured! You are trying to update an invalid field!"));

          case 5:
            _context4.prev = 5;
            _context4.next = 8;
            return Task.findOne({
              _id: request.params.id,
              userid: request.user._id
            });

          case 8:
            task = _context4.sent;

            if (task) {
              _context4.next = 11;
              break;
            }

            return _context4.abrupt("return", response.status(404).send());

          case 11:
            updates.forEach(function (update) {
              return task[update] = request.body[update];
            });
            _context4.next = 14;
            return task.save();

          case 14:
            response.send(task);
            _context4.next = 20;
            break;

          case 17:
            _context4.prev = 17;
            _context4.t0 = _context4["catch"](5);
            response.status(400).send(_context4.t0);

          case 20:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[5, 17]]);
  }));

  return function (_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}());
router["delete"]('/tasks/:id', authentication, /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(request, response) {
    var task;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;
            _context5.next = 3;
            return Task.findOneAndDelete({
              _id: request.params.id,
              userid: request.user._id
            });

          case 3:
            task = _context5.sent;

            if (!task) {
              response.status(404).send();
            }

            response.send(task);
            _context5.next = 11;
            break;

          case 8:
            _context5.prev = 8;
            _context5.t0 = _context5["catch"](0);
            response.status(500).send();

          case 11:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[0, 8]]);
  }));

  return function (_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}());
module.exports = router;