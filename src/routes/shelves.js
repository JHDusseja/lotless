import express from 'express'
import {performQuery} from "../database";

export let shelvesrouter = express.Router();

function createShelfHelper(req, res, sql, item) {
    performQuery(sql, item).then(function (results) {
        res.json({"id" : results.insertId});
    }).catch(function (err) {
        console.log(err);
        res.status(500).json({"msg" : "Internal error"});
    });
}

shelvesrouter.get('/:id', function (req, res) {
    let sql = "Select * from ?? where ?? = ?";
    let inserts = ['shelfdetails', 'shelfid', req.params.id];

    console.dir(req.params);

    performQuery(sql, inserts).then(function (results) {
        res.json({shelfdetails : results[0]});
    }).catch(function (err) {
        console.log(err);
        res.status(500).json({"msg" : "Internal Error"});
    });

});

shelvesrouter.post('/', function (req, res) {
    let sql = "Insert into shelfdetails Set ?";
    let itemid = req.body.itemid || null;
    let totalweight = req.body.totalweight || null;
    let numberofitems = null;
    if(totalweight !== null) {
        let newsql = "Select * from ?? where ?? = ?";
        let inserts = ['itemdetails', 'itemid', itemid];
        performQuery(newsql, inserts).then(function (results) {
            let itemweight = results[0].itemweight;
            numberofitems = totalweight / itemweight;
            let item = {shelfname: req.body.shelfname, itemid: itemid, totalweight: totalweight, numberofitems: numberofitems};
            createShelfHelper(req, res, sql, item);
        }).catch(function (err) {
            console.log(err);
            res.status(500).json({"msg" : "Internal Error"});
        });
    } else {
        let item = {shelfname: req.body.shelfname, itemid: itemid, totalweight: totalweight, numberofitems: numberofitems};
        createShelfHelper(req, res, sql, item);
    }
});

shelvesrouter.post('/addtoshelf', function (req, res) {
    console.log(req.body);
    let sql = "Select * from ?? where ?? = ?";
    let inserts = [ 'itemdetails', 'itemid', req.body.itemid ];
    let noOfItems;

    console.dir(req.body);

    performQuery(sql, inserts).then(function (results) {
        noOfItems = req.body.totalweight / results[0].itemweight;
        sql = "Update ?? Set ? where ?? = ?";
        return performQuery(sql, ['shelfdetails', { itemid: req.body.itemid }, 'shelfid', req.body.shelfid]);
    }).then(function (results) {
        return performQuery(sql, ['shelfdetails', { totalweight: req.body.totalweight, numberofitems: noOfItems }, 'shelfid', req.body.shelfid]);
    }).then(function (results) {
        res.json({"msg": "Ok"});
    }).catch(function (err) {
        console.log(err);
        res.status(500).json({"msg" : "Internal Error"});
    });

});