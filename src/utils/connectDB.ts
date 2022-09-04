import { MongoClient } from '../deps.ts';
import config from '../config/default.ts';

const {dbUri, dbName} = config

const client: MongoClient = new MongoClient();
await client.connect(dbUri);
console.log('🚀 Connected to MongoDB Successfully');

export const db = client.database(dbName);
