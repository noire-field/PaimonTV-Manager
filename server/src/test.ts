require('dotenv').config();

import fs from 'fs';
import { storage } from './utils/gcloud';

/*
import http from 'http';
import https from 'https'
import fs from 'fs';

const converter = require("node-m3u8-to-mp4");

converter("https://web.lotuscdn.vn/2020/8/5/1596608264196-k53qdse8v7.mp4/720.m3u8?v=ec957b70&e=1619694105&s=bYKLuy8geCnzPQBXTDCu4_oWCaA=","path.mp4",(status: any, index: any, total: any)=>{
  switch(status) {
        case "generating":
        console.log("extracting...");
        break;
    case "downloading":
        console.log(
        "downloading process:" + ((index / total) * 100).toFixed(2) + "%"
        );
        break;
    case "combining":
        console.log(
        "combining mp4 process:" + ((index / total) * 100).toFixed(2) + "%"
        );
        break;
    }
}).then(() => {
  console.log("finished");
});*/


async function UploadFile() {

	const fileUpload = storage.bucket('paimontv').file('users/ABC/file.mp3');

	const uploadStream = fileUpload.createWriteStream();

	const file = fs.createReadStream('src/file.mp3');

	var total = 0;

	file.on('data', (chunk) => {
		total += chunk.length;
		console.log(`Uploaded: `+ (total / 1048576));
	});


	file.pipe(uploadStream);
	file.close();

	uploadStream.on('error', (e) => {
		console.log(e);
	})

	uploadStream.on('finish', (e: any) => {
		console.log('Finish')
		
	})

	/*
	try {
		const data = await storage.bucket('paimontv').upload('src/app.ts', {
			destination: `users/ABC/app.ts`,
			public: true
		}, (err, file) => {
			console.log("Response");
			console.log(file);
		});

		console.log(data);
	} catch(e) {
		console.log('ERROR=====');
		console.log(e);
	}*/
    
}

UploadFile();
