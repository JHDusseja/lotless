import express from 'express';
import {performQuery} from "../database";
import {findDiff} from "./resemble";

export let checkoutrouter = express.Router();

checkoutrouter.post('/', async function (req, res) {
    try {
        let imagePath = req.file.path;
        let sql = "Select * from ?? where ?? = ?";
        let inserts = ['cartdetails', 'active', 'yes'];
        let results = await performQuery(sql, inserts);

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
                    matchFlag = true;
                    let cart = [];
                    let finalTotal = 0;
                    sql = "Select * from cartmappings c Join activitydetails a on c.activityid = a.activityid where c.cartid = ?";
                    inserts = [currCartId];
                    let activites = await performQuery(sql, inserts);
                    for (let j = 0; j < activites.length; j++) {
                        let currItemId = activites[j].itemid;
                        let numberOfItems = activites[j].numberofitemspicked;

                        sql = "Select * from ?? where ?? = ?";
                        inserts = ['itemdetails', 'itemid', currItemId];
                        let itemDetails = await performQuery(sql, inserts);

                        let currItemPrice = itemDetails[0].itemprice;
                        let currItemName = itemDetails[0].itemname;
                        let currTotal = numberOfItems * currItemPrice;

                        cart[j] = {
                            "itemname": currItemName,
                            "count": numberOfItems,
                            "itemprice": currItemPrice,
                            "total": currTotal
                        };
                        finalTotal += currTotal;
                    }

                    let finalResponse = {"cartId": currCartId, "cart": cart, "total": finalTotal};
                    res.json(finalResponse);

                    sql = "Update ?? Set ?? = ? where ?? = ?";
                    inserts = ['cartdetails', 'active', 'no', 'cartid', currCartId];
                    performQuery(sql, inserts);
                }
            }
            if (!matchFlag)
                res.status(500).json({"msg": "Image Not Recognised!"});
        } else {
            res.status(500).json({"msg": "No Active Cart!"});
        }
    }
    catch(e) {
        console.log(e);
        res.status(500).json({"msg" : "Internal Server Error"});
    }
});