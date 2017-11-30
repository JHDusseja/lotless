import express from 'express';
import moment from 'moment';
import { performQuery } from "../database";
import {findDiff} from "./resemble";

export let activitiesrouter = express.Router();

activitiesrouter.post('/', async function (req,res) {
    try {
        let shelfId = req.body.shelfid;
        let newWeight = req.body.totalweight;
        let imageId = req.body.imageid;
        let imagePath, activityId, cartId, results;
        let previousWeight, itemId, itemWeight, weightDecreased, noOfItemsPicked;

        let sql = "Select * from ?? where ?? = ?";
        let inserts = ['imagedetails', 'imageid', imageId];
        results = await performQuery(sql, inserts);
        imagePath = results[0].imagepath;

        sql = "Select * from shelfdetails Join itemdetails on shelfdetails.itemid = itemdetails .itemid where shelfdetails.shelfid = ?";
        inserts = [shelfId];
        results = await performQuery(sql, inserts);
        previousWeight = results[0].totalweight;
        itemId = results[0].itemid;
        itemWeight = results[0].itemweight;
        weightDecreased = previousWeight - newWeight;
        noOfItemsPicked = weightDecreased / itemWeight;

        sql = "Insert into ?? Set ?";
        inserts = ['activitydetails', {
            shelfid: shelfId,
            itemid: itemId,
            weightdecreased: weightDecreased,
            numberofitemspicked: noOfItemsPicked,
            imageid: imageId,
            time: moment().format('YYYY-MM-DD hh:mm:ss')
        }];
        results = await performQuery(sql, inserts);
        activityId = results.insertId;

        sql = "Update ?? Set ?? = ? where ?? = ?";
        inserts = ['shelfdetails', 'totalweight', newWeight, 'shelfid', shelfId];
        results = await performQuery(sql, inserts);

        sql = "Select * from ?? where ?? = ?";
        inserts = ['cartdetails', 'active', 'yes'];
        results = await performQuery(sql, inserts);

        if (results.length > 0) {
            let matchFlag = false;
            for (let i = 0; i < results.length; i++) {
                let item = results[i];
                let currImageId = item.imageid;
                let currCartId = item.cartid;

                sql = "Select * from ?? where ?? = ?";
                inserts = ['imagedetails', 'imageid', currImageId];
                let r = await performQuery(sql, inserts);
                let currImpPath = r[0].imagepath;
                let dffPercentage = await findDiff(imagePath, currImpPath);
                if (dffPercentage < 50) {
                    sql = "Insert into ?? Set ?";
                    inserts = ['cartmappings', {cartid: currCartId, activityid: activityId}];
                    let s = await performQuery(sql, inserts);
                    matchFlag = true;
                    return res.send("Internal OK");
                }
            }
            if (!matchFlag)
                insertNewMapping(req, res, imageId, activityId);
        } else {
            insertNewMapping(req, res, imageId, activityId);
        }
    }
    catch(e) {
        console.log(e);
        res.status(500).send("Internal Server Error!");
    }
});

function insertNewMapping(req, res, imageId, activityId) {
    let sql = "Insert into ?? Set ?";
    let inserts = ['cartdetails', {imageid: imageId, active: 'yes'}];
    performQuery(sql, inserts).then(function (results) {
        let cartId = results.insertId;
        sql = "Insert into ?? Set ?";
        inserts = ['cartmappings', {cartid: cartId, activityid: activityId}];
        performQuery(sql, inserts).then(function (results) {
            res.send("OK");
        });
    });
}