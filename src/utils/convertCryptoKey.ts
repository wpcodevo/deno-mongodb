function removeLines(str: string) {
  return str.replace("\n", "");
}

function base64ToArrayBuffer(b64: string) {
  const byteString = atob(b64);
  const byteArray = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    byteArray[i] = byteString.charCodeAt(i);
  }
  return byteArray;
}

function pemToArrayBuffer(pemKey: string, type: "PUBLIC" | "PRIVATE") {
  const b64Lines = removeLines(pemKey);
  const b64Prefix = b64Lines.replace(`-----BEGIN ${type} KEY-----`, "");
  const b64Final = b64Prefix.replace(`-----END ${type} KEY-----`, "");

  return base64ToArrayBuffer(b64Final);
}
export function convertToCryptoKey({
  pemKey,
  type,
}: {
  pemKey: string;
  type: "PUBLIC" | "PRIVATE";
}) {
  if (type === "PRIVATE") {
    return crypto.subtle.importKey(
      "pkcs8",
      pemToArrayBuffer(pemKey, type),
      {
        name: "RSASSA-PKCS1-v1_5",
        hash: { name: "SHA-256" },
      },
      false,
      ["sign"]
    );
  } else if (type === "PUBLIC") {
    return crypto.subtle.importKey(
      "spki",
      pemToArrayBuffer(pemKey, type),
      {
        name: "RSASSA-PKCS1-v1_5",
        hash: { name: "SHA-256" },
      },
      false,
      ["verify"]
    );
  }
}
