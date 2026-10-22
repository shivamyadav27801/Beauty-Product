import { cookies } from "next/headers";
import { verifyToken, TokenPayload } from "./jwt";

export const AUTH_COOKIE_NAME = "velvetique_token";

export async function getServerSession(): Promise<TokenPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function requireAdminSession(): Promise<TokenPayload | null> {
  const session = await getServerSession();
  if (!session) return null;
  if (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN") return null;
  return session;
}
