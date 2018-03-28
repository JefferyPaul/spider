const fs = require('fs');
const iconv = require('iconv-lite');

function getDateObject() {
    return new Date();
}

function getYear() {
    return `${getDateObject().getFullYear()}`;
}

function getDate() {
    let dateString = `${getDateObject().getDate()}`;
    return dateString.length === 2?dateString:`0${dateString}`;
}

function getMouth() {
    let mouthString = `${getDateObject().getMonth() + 1}`;
    return mouthString.length === 2?mouthString:`0${mouthString}`;
}

function getOriginMouth () {
    let mouthString = `${getDateObject().getMonth()}`;
    return mouthString.length === 2?mouthString:`0${mouthString}`;
}

function getFullDate() {
    return getYear() + getMouth() + getDate();
}

function presist(filePath, result) {
    let outString = '';
    result.map((line) => {
        outString += line;
    });
    fs.writeFile(filePath, iconv.encode(outString, 'GB2312'), (err) => {
        if(err)
            console.log(`${filePath} presist failed!`);
        else
            console.log(`${filePath} presist success!`);
    });
}

module.exports = {
    getYear,
    getOriginMouth,
    getDate,
    getFullDate,
    presist
}