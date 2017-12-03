import express from 'express';
import {performQuery} from "../database";

export let itemsrouter = express.Router();

itemsrouter.post('/', function (req, res) {
    let sql = 'Insert into itemdetails Set ?';
    let newItem = {"itemname" : req.body.itemname, "itemweight" : req.body.itemweight, "itemprice" : req.body.itemprice};

    performQuery(sql, newItem).then(function (results) {
        res.json({"id" : results.insertId});
    }).catch(function (err) {
        console.log(err);
        res.status(500).json({"msg" : "Internal Error"});
    });
});