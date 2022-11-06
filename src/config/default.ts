import { dotenvConfig } from "../deps.ts";
dotenvConfig({ export: true, path: ".env" });

const config: {
  port: number;
  dbUri: string;
  dbName: string;
  accessTokenPrivateKey: string;
  accessTokenPublicKey: string;
  refreshTokenPrivateKey: string;
  refreshTokenPublicKey: string;
  accessTokenExpiresIn: number;
  refreshTokenExpiresIn: number;
} = {
  port: parseInt(Deno.env.get("SERVER_PORT") as unknown as string),
  dbUri: Deno.env.get("MONGODB_URI") as unknown as string,
  dbName: Deno.env.get("MONGO_INITDB_DATABASE") as unknown as string,
  accessTokenPrivateKey: Deno.env.get(
    "ACCESS_TOKEN_PRIVATE_KEY"
  ) as unknown as string,
  accessTokenPublicKey: Deno.env.get(
    "ACCESS_TOKEN_PUBLIC_KEY"
  ) as unknown as string,
  refreshTokenPrivateKey: Deno.env.get(
    "REFRESH_TOKEN_PRIVATE_KEY"
  ) as unknown as string,
  refreshTokenPublicKey: Deno.env.get(
    "REFRESH_TOKEN_PUBLIC_KEY"
  ) as unknown as string,
  accessTokenExpiresIn: 15,
  refreshTokenExpiresIn: 60,
};

export default config;
