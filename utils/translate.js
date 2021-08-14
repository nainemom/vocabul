const https = require('https');

module.exports = (word, from, to) => new Promise((resolve, reject) => {
  const req = https.request({
    method: 'GET',
    hostname: 'translate.googleapis.com',
    port: 443,
    path: `/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURI(word)}`,
  }, (res) => {
    let chunks = '';
    res.on('data', (data) => {
      chunks += data.toString();
    });
    res.on('error', (e) => {
      reject(e);
    });
    res.on('end', () => {
      resolve(JSON.parse(chunks)[0][0][0]);
    });
  });
  req.end();
});
