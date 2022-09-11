import { dotenvConfig } from '../deps.ts';
dotenvConfig({ export: true, path: './src/.env' });

const config: {
  port: number;
  dbUri: string;
} = {
  port: 8000,
  dbUri: Deno.env.get('MONGODB_URI') as unknown as string,
};

export default config;
