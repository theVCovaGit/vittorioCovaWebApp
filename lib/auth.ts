import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { sql, ensureTableExists } from "@/lib/db";

/** Server-only: the two accounts that can see deactivated/paused sections. */

export const SESSION_COOKIE = "vcs_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

/** Passwords can be moved to .env.local at any time – these are the defaults. */
const SEED_USERS = [
  { username: "vittorio", password: process.env.VITTORIO_PASSWORD || "Onn233Mz75Vk7lm65" },
  { username: "jaime", password: process.env.JAIME_PASSWORD || "8vMMk990adhhvnsj(2" },
];

const sessionSecret = () =>
  process.env.SESSION_SECRET || process.env.DATABASE_URL || "vittoriocova-session";

const hashPassword = (password: string, salt: string) =>
  scryptSync(password, salt, 64).toString("hex");

interface UserRow {
  username: string;
  salt: string;
  password_hash: string;
}

/** Creates the table if needed and inserts any missing account (never overwrites). */
export async function ensureUsersSeeded() {
  await ensureTableExists("site_users");

  for (const user of SEED_USERS) {
    const salt = randomBytes(16).toString("hex");
    await sql`
      INSERT INTO site_users (username, salt, password_hash)
      VALUES (${user.username}, ${salt}, ${hashPassword(user.password, salt)})
      ON CONFLICT (username) DO NOTHING
    `;
  }
}

/** Returns the canonical username on success, null otherwise. */
export async function verifyCredentials(
  username: string,
  password: string
): Promise<string | null> {
  await ensureUsersSeeded();

  const normalized = username.trim().toLowerCase();
  const [row] = await sql`
    SELECT username, salt, password_hash FROM site_users WHERE username = ${normalized}
  `;

  if (!row) return null;

  const user = row as UserRow;
  const attempt = Buffer.from(hashPassword(password, user.salt), "hex");
  const stored = Buffer.from(user.password_hash, "hex");

  if (attempt.length !== stored.length || !timingSafeEqual(attempt, stored)) {
    return null;
  }

  return user.username;
}

const sign = (payload: string) =>
  createHmac("sha256", sessionSecret()).update(payload).digest("hex");

export function createSessionToken(username: string): string {
  const expiresAt = Date.now() + SESSION_MAX_AGE * 1000;
  const payload = `${username}.${expiresAt}`;
  return `${payload}.${sign(payload)}`;
}

/** Returns the username of a valid, unexpired token, or null. */
export function readSessionToken(token: string | undefined): string | null {
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [username, expiresAt, signature] = parts;
  const expected = sign(`${username}.${expiresAt}`);

  const given = Buffer.from(signature, "hex");
  const valid = Buffer.from(expected, "hex");
  if (given.length !== valid.length || !timingSafeEqual(given, valid)) return null;

  if (!Number(expiresAt) || Number(expiresAt) < Date.now()) return null;

  return username;
}
