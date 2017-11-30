import mysql from 'mysql';

const pool  = mysql.createPool({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'lotless'
});

export function getConnection() {
    return new Promise(function (resolve, reject) {
        pool.getConnection(function (err, connection) {
            if(err) {
                console.log("Error inside getConnection");
                reject(err);
            }
            resolve(connection);
        })
    });
}

export function performQuery(sql, inserts) {
    return new Promise(function (resolve, reject) {
        getConnection().then(function (connection) {
            connection.query(sql, inserts, function (err, results, fields) {
                if(err) {
                    console.log("Error inside performQuery");
                    console.log(err);
                    reject(err);
                }
                resolve(results);
            });
            connection.release();
        }).catch(function (err) {
            reject(err);
        });
    });
}


