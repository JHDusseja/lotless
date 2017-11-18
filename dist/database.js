'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getConnection = getConnection;
exports.performQuery = performQuery;

var _mysql = require('mysql');

var _mysql2 = _interopRequireDefault(_mysql);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pool = _mysql2.default.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'lotlessss'
});

function getConnection() {
    return new Promise(function (resolve, reject) {
        pool.getConnection(function (err, connection) {
            if (err) {
                console.log("Error while getting connection from pool");
                reject(err);
            }
            resolve(connection);
        });
    });
}

function performQuery(sql, inserts) {
    return new Promise(function (resolve, reject) {
        getConnection().then(function (connection) {
            connection.query(sql, inserts, function (err, results, fields) {
                if (err) reject(err);
                resolve(results);
            });
        }).catch(function (err) {
            reject(err);
        });
    });
}
//# sourceMappingURL=database.js.map