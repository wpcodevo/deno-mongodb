import { dotenvConfig, base64 } from '../deps.ts';
dotenvConfig({ export: true, path: './src/.env' });

const config: {
  port: number;
  dbUri: string;
  accessTokenPrivateKey: string;
  accessTokenPublicKey: string;
  refreshTokenPrivateKey: string;
  refreshTokenPublicKey: string;
  accessTokenExpiresIn: number;
  refreshTokenExpiresIn: number;
} = {
  port: 8000,
  dbUri: Deno.env.get('MONGODB_URI') as unknown as string,
  accessTokenPrivateKey: Deno.env.get(
    'ACCESS_TOKEN_PRIVATE_KEY'
  ) as unknown as string,
  accessTokenPublicKey: Deno.env.get(
    'ACCESS_TOKEN_PUBLIC_KEY'
  ) as unknown as string,
  refreshTokenPrivateKey: Deno.env.get(
    'REFRESH_TOKEN_PRIVATE_KEY'
  ) as unknown as string,
  refreshTokenPublicKey: Deno.env.get(
    'REFRESH_TOKEN_PUBLIC_KEY'
  ) as unknown as string,
  accessTokenExpiresIn: 15,
  refreshTokenExpiresIn: 60,
};

export default config;
