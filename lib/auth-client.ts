import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient();

export async function getClientAuthHeaders(): Promise<HeadersInit> {
  let token = "";

  try {
    const res = await fetch("/api/session-token", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      token = data?.token || "";
    }
  } catch {}

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}