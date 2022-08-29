import { MongoClient } from '../deps.ts';
import config from '../config/default.ts';

const dbUri = config.dbUri;
const dbName = Deno.env.get('MONGO_INITDB_DATABASE') as string;

const client: MongoClient = new MongoClient();
await client.connect(dbUri);
console.log('🚀 Connected to MongoDB Successfully');

export const db = client.database(dbName);
