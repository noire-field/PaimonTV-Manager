
import { Storage } from '@google-cloud/storage';

export const storage = new Storage({ keyFilename: __dirname+'/../../'+process.env.GC_STORAGE_KEY });
export const GCS_BUCKET = process.env.GC_STORAGE_BUCKET