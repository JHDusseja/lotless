import express from 'express';
import moment from 'moment';
import { performQuery } from "../database";

export let activitiesrouter = express.Router();

activitiesrouter.post('/', function (req,res) {
    let shelfId = req.body.shelfid;
    let newWeight = req.body.totalweight;
    let imageId = req.body.imageid;
    let sql = "Select * from ?? where ?? = ?";
    let inserts = ['shelfdetails', 'shelfid', shelfId];
    let previousWeight, itemId, itemWeight, weightDecreased, noOfItemsPicked;

    performQuery(sql, inserts).then(function (results) {
        previousWeight = results[0].totalweight;
        itemId = results[0].itemid;
        sql = "Select * from ?? where ?? = ?";
        inserts = ['itemdetails', 'itemid', itemId];
        return performQuery(sql, inserts);
    }).then(function (results) {
        itemWeight = results[0].itemweight;
        weightDecreased = previousWeight - newWeight;
        noOfItemsPicked = weightDecreased / itemWeight;
        sql = "Insert into ?? Set ?";
        inserts = ['activitydetails', {shelfid: shelfId, itemid: itemId, weightdecreased: weightDecreased, numberofitemspicked: noOfItemsPicked, imageid: imageId, time: moment().format('YYYY-MM-DD hh:mm:ss')}];
        return performQuery(sql, inserts);
    }).then(function (results) {
        res.json({ id: results.insertId });
    }).catch(function (err) {
        console.log(err);
        res.status(500).send("Internal Error");
    });
});