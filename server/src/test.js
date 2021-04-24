const request = require('request'), 
fs = require('fs'),
http = require('http');

/*
const download = (url, filename, callback) => {

    const file = fs.createWriteStream(filename);
    var totalBytes = 0;
    let receivedBytes = 0
    var progress = 0;

    const intv= setInterval(() => {
        console.log("Progress: "+progress+"%");
    }, 1000);

    // Send request to the given URL
    request.get(url, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
    })
    .on('response', (response) => {

        totalBytes = response.headers['content-length'];
        console.log(response.statusCode);
        if (response.statusCode !== 200) {
            return callback('Response status was ' + response.statusCode);
        }

    })
    .on('data', (chunk) => {
        receivedBytes += chunk.length;
        progress = Math.round(receivedBytes / totalBytes * 100);
    })
    .pipe(file)
    .on('error', (err) => {
        clearInterval(intv);
        fs.unlink(filename);
        console.log("ERROR DOWNLOAD");
        callback(err);
    });

    file.on('finish', () => {
        clearInterval(intv);
        file.close(callback);
    });

    file.on('error', (err) => {
        fs.unlink(filename);
        clearInterval(intv);
        return callback(err.message);
    });
}

*/


function download(url, callback){
    var request = http.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, function(response) {
       
        var len = parseInt(response.headers['content-length'], 10);
        var body = "";
        var cur = 0;
        var total = len / 1048576; //1048576 - bytes in  1Megabyte

        response.on("data", function(chunk) {
            body += chunk;
            cur += chunk.length;
            console.log("Downloading " + (100.0 * cur / len).toFixed(2) + "% " + (cur / 1048576).toFixed(2) + " mb / Total size: " + total.toFixed(2) + " mb");
        });

        response.on("end", function() {
            callback(body);
            console.log("Downloading complete");
        });

        request.on("error", function(e){
            console.log("Error: " + e.message);
        });

        request.on('abort', () => {
            console.log("Abort");
        })

        request.on('timeout', () => {
            console.log("Timeout");
        })
    });
};


download('http://ipv4.download.thinkbroadband.com/100MB.zip', (err) => {
    console.log(err);
})

download('http://ipv4.download.thinkbroadband.com/100MB.zip', (err) => {
    console.log(err);
})