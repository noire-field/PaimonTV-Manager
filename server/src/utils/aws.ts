
import AWS from 'aws-sdk';

const credentials = new AWS.Credentials({ accessKeyId: process.env.AWS_AK_ID!, secretAccessKey: process.env.AWS_AK_SECRET! })

export const s3 = new AWS.S3({ 
    credentials: credentials,
    region: 'ap-southeast-1',
})

export const S3_BUCKET = process.env.AWS_S3_BUCKET; 