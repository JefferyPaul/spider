const common = require('./common');
const request = require('superagent');
const path = require('path');

const header = '合约,开仓手续费,平仓手续费,短线开仓手续费,短线平仓手续费,手续费方式,投机买保证金率,投机卖保证金率,套保买保证金率,套保卖保证金率\n';

function getUrl() {
    let baseUrl = 'http://www.dce.com.cn/publicweb/businessguidelines/queryFutAndOptSettle.html?variety=all&trade_type=0&year=yyyy&month=MM&day=dd';

    let yearString = common.getYear();
    let mouthString = common.getOriginMouth();
    let dateString = common.getDate();

    return baseUrl.replace('yyyy', yearString).replace('MM', mouthString).replace('dd', dateString);
}

function getSubMessage(htmlContent) {
    return htmlContent.match(/<tr>([\s\S]+?)<\/tr>/g);
}

function run(outPath) {
    const url = getUrl();

    request
        .get(url)
        .end(function (err, res) {
            if(res.ok) {
                const indexs = [1, 3, 4 ,5, 6, 7, 8, 9, 10, 11];
                const results = [];
                results.push(header);

                const messages = getSubMessage(res.text);
                messages.map((message) => {
                    const subs = message.match(/<td>([\s\S]+?)<\/td>/g);
                    if (subs == null) return;

                    let values = [];
                    subs.map((sub, index) => {
                        if(indexs.includes(index))
                            values.push(sub.replace(/<[^>]+>/g, '').match(/(\S+)/g)[0]);
                    });

                    results.push(values.join(',')+'\n');
                });

                let filePath = path.join(outPath, `dce-${common.getFullDate()}.csv`);
                common.presist(filePath, results);
            }
            else
                console.log('request dce settle failed!');
        })
}

module.exports = run;