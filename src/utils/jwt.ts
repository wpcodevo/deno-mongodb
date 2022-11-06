import customConfig from "../config/default.ts";
import { getNumericDate, create, verify } from "../deps.ts";
import type { Payload, Header } from "../deps.ts";
import { convertToCryptoKey } from "./convertCryptoKey.ts";

export const signJwt = async ({
  user_id,
  issuer,
  base64PrivateKeyPem,
  expiresIn,
}: {
  user_id: string;
  issuer: string;
  base64PrivateKeyPem: "accessTokenPrivateKey" | "refreshTokenPrivateKey";
  expiresIn: Date;
}) => {
  const header: Header = {
    alg: "RS256",
    typ: "JWT",
  };

  const nowInSeconds = Math.floor(Date.now() / 1000);

  const payload: Payload = {
    iss: issuer,
    iat: nowInSeconds,
    exp: getNumericDate(expiresIn),
    sub: user_id,
  };

  const crytoPrivateKey = await convertToCryptoKey({
    pemKey: atob(customConfig[base64PrivateKeyPem]),
    type: "PRIVATE",
  });

  return create(header, payload, crytoPrivateKey!);
};

export const verifyJwt = async <T>({
  token,
  base64PublicKeyPem,
}: {
  token: string;
  base64PublicKeyPem: "accessTokenPublicKey" | "refreshTokenPublicKey";
}): Promise<T | null> => {
  try {
    const crytoPublicKey = await convertToCryptoKey({
      pemKey: atob(customConfig[base64PublicKeyPem]),
      type: "PUBLIC",
    });

    return (await verify(token, crytoPublicKey!)) as T;
  } catch (error) {
    console.log(error);
    return null;
  }
};
