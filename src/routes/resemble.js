const resemble = require('node-resemble-js');
const fs = require("fs");

// const file1 = fs.readFileSync('src/public/images/img-1510246696589.jpg');
// const file2 = fs.readFileSync('src/public/images/img-1510246719728.jpg');

const file1 = 'src/public/images/image1.jpg';
const file2 = 'src/public/images/image2.jpg';

export function findDiff(file1, file2) {
    return new Promise((resolve, reject) => {
        resemble(file1).compareTo(file2).ignoreColors().onComplete(function(data){
            console.log(file1, file2);
            console.log("data.misMatchPercentage : " + data.misMatchPercentage);
            resolve(data.misMatchPercentage);
            /*
            {
              misMatchPercentage : 100, // %
              isSameDimensions: true, // or false
              dimensionDifference: { width: 0, height: -1 }, // defined if dimensions are not the same
              getImageDataUrl: function(){}
            }
            */
        });
    });
};