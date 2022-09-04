import { dotenvConfig } from '../deps.ts';
dotenvConfig({ export: true, path: './src/.env' });

const config: {
  port: number;
  dbUri: string;
  dbName: string;
} = {
  port: parseInt(Deno.env.get('PORT') as unknown as string),
  dbUri: Deno.env.get('MONGODB_URI') as unknown as string,
  dbName: Deno.env.get('MONGODB_DATABASE_NAME') as unknown as string,
};

export default config;
