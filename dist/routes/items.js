'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.itemsrouter = undefined;

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _database = require('../database');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var itemsrouter = exports.itemsrouter = _express2.default.Router();

itemsrouter.post('/', function (req, res) {
    var sql = 'Insert into itemdetails Set ?';
    var newItem = { "itemname": req.body.itemname, "itemweight": req.body.itemweight };

    (0, _database.performQuery)(sql, newItem).then(function (results) {
        res.json({ "id": results.insertId });
    }).catch(function (err) {
        console.log("came inside post: " + err);
        // res.writeHead(500);
        res.status(500).send({ "msg": "Internal Error" });
    });
});
//# sourceMappingURL=items.js.map