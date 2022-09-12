import { dotenvConfig } from '../deps.ts';
dotenvConfig({ export: true, path: '.env' });

const config: {
  serverPort: number;
  dbUri: string;
  dbName: string;
} = {
  serverPort: parseInt(Deno.env.get('SERVER_PORT') as unknown as string),
  dbUri: Deno.env.get('MONGODB_URI') as unknown as string,
  dbName: Deno.env.get('MONGO_INITDB_DATABASE') as unknown as string,
};

export default config;
