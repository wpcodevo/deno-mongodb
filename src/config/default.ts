import { dotenvConfig } from '../deps.ts';
dotenvConfig({ export: true, path: './src/.env' });

const config: {
  port: number;
  dbUri: string;
  jwtSecret: string;
  jwtExpiresIn: number;
} = {
  port: 8000,
  dbUri: Deno.env.get('MONGODB_URI') as unknown as string,
  jwtSecret: Deno.env.get('JWT_SECRET') as unknown as string,
  jwtExpiresIn: 1,
};

export default config;
