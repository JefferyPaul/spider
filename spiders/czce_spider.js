const common = require('./common');
const request = require('superagent');
const path = require('path');

const header = '合约,买保证金率,卖保证金率,交易手续费,平今仓手续费\n';

function getUrl() {
    let baseUrl = 'http://www.czce.com.cn/portal/DFSStaticFiles/Future/yyyy/yyyyMMdd/FutureDataClearParams.htm';

    let yearString = common.getYear();
    let dateString = common.getFullDate();

    return baseUrl.replace('yyyyMMdd', dateString).replace('yyyy', yearString);
}

function getSubMessage(htmlContent) {
    const temp = htmlContent.match(/<tr.+?>([\s\S]+?)<\/table>/g)[0].replace('</table>', '<tr>').match(/([\s\S]+?)<tr>/g);
    temp.shift();
    return temp;
}

function run(outPath) {
    const url = getUrl();

    request
        .get(url)
        .end(function (err, res) {
            if(res.ok) {
                const indexs = [0, 4 ,5, 6, 8];
                const results = [];
                results.push(header);

                const messages = getSubMessage(res.text);
                messages.map((message) => {
                    const subs = message.match(/<td.*?>(.+?)<\/td>/g);
                    let values = [];

                    subs.map((sub, index) => {
                        if(indexs.includes(index))
                            values.push(sub.replace(/<[^>]+>/g, ''));
                    });
                    results.push(values.join(',') + '\n');
                });

                let filePath = path.join(outPath, `czce-${common.getFullDate()}.csv`);
                common.presist(filePath, results);
            }
            else
                console.log('request czce settle failed!');
        })
}

module.exports = run;