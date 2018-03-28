const common = require('./common');
const request = require('superagent');
const path = require('path');

const header = '合约,交易手续费,交易手续费额,买投机交易保证金率,买套保交易保证金率\n';

function getUrl() {
    let baseUrl = 'http://www.shfe.com.cn/data/dailydata/js/jsyyyyMMdd.dat';
    let dateString = common.getFullDate();

    return baseUrl.replace('yyyyMMdd', dateString);
}

function run(outPath) {
    const url = getUrl();

    request
        .get(url)
        .end(function (err, res) {
            if(res.ok) {
                const results = [];
                results.push(header);
                const json = JSON.parse(res.text);
                json['o_cursor'].map((data) => {
                    let line = '';
                    line += data['INSTRUMENTID'].replace(/(^\s*)|(\s*$)/g,"");
                    line += `,${data['TRADEFEERATIO']}`;
                    line += `,${data['TRADEFEEUNIT']}`;
                    line += `,${data['SPECLONGMARGINRATIO']}`;
                    line += `,${data['HEDGLONGMARGINRATIO']}`;
                    line += '\n';
                    results.push(line);
                })

                let filePath = path.join(outPath, `shfe-${common.getFullDate()}.csv`);
                common.presist(filePath, results);
            }
            else
                console.log('request shfe settle failed!');
        })
}

module.exports = run;