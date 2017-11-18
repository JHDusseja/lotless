import express from 'express';
import {performQuery} from "../database";

export let imagesrouter = express.Router();

imagesrouter.post('/', function (req, res) {
    let sql = "Insert into ?? Set ?";
    let inserts = ['imagedetails', {imagepath : req.file.path}];
    performQuery(sql, inserts).then(function (result) {
        res.json({ id: result.insertId });
    }).catch(function (err) {
        console.log(err);
        res.status(500).send('Internal Error');
    });
});