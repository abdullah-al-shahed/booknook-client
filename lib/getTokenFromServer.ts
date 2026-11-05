import { cookies } from "next/headers";

export async function getTokenFromServer() {
  const cookieStore = await cookies();

  const sessionToken =
    cookieStore.get("better-auth.session_token")?.value ||
    cookieStore.get("__Secure-better-auth.session_token")?.value ||
    "";

  return sessionToken || "";
}
