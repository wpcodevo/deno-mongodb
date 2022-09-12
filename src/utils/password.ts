import { compare, genSalt, hash } from "../deps.ts";

export async function hashPassword(password: string): Promise<string> {
  const salt = await genSalt(12);
  return hash(password, salt);
}

export function comparePasswords(
  candidatePassword: string,
  hashedPassword: string,
): Promise<boolean> {
  return compare(candidatePassword, hashedPassword);
}
