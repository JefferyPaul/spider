const fs = require('fs');
const path = require('path');

const czce = require('./spiders/czce_spider');
const dce = require('./spiders/dce_spider');
const shfe = require('./spiders/shfe_spider');

const presistPathName = process.argv.length === 3?process.argv[2]:'result';
const presistPath = path.join(__dirname, presistPathName);
fs.stat(presistPath, function (err) {
    if (err != null)
        fs.mkdir(presistPath);
});

czce(presistPath);
dce(presistPath);
shfe(presistPath);