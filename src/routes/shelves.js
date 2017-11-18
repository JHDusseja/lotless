import express from 'express'
import {performQuery} from "../database";

export let shelvesrouter = express.Router();

function createShelfHelper(req, res, sql, item) {
    performQuery(sql, item).then(function (results) {
        res.json({"id" : results.insertId});
    }).catch(function (err) {
        console.log(err);
        res.status(500).send("Internal error");
    });
}

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
            res.status(500).send("Internal error");
        });
    } else {
        let item = {shelfname: req.body.shelfname, itemid: itemid, totalweight: totalweight, numberofitems: numberofitems};
        createShelfHelper(req, res, sql, item);
    }
});

shelvesrouter.post('/addtoshelf', function (req, res) {
    let sql = "Select * from ?? where ?? = ?";
    let inserts = [ 'itemdetails', 'itemid', req.body.itemid ];
    let noOfItems;

    performQuery(sql, inserts).then(function (results) {
        noOfItems = req.body.totalweight / results[0].itemweight;
        sql = "Update ?? Set ? where ?? = ?";
        return performQuery(sql, ['shelfdetails', { itemid: req.body.itemid }, 'shelfid', req.body.shelfid]);
    }).then(function (results) {
        return performQuery(sql, ['shelfdetails', { totalweight: req.body.totalweight, numberofitems: noOfItems }, 'shelfid', req.body.shelfid]);
    }).then(function (results) {
        res.send("Ok");
    }).catch(function (err) {
        console.log(err);
        res.status(500).send("Internal Error");
    });

});