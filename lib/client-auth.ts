export async function getClientAuthHeaders(): Promise<HeadersInit> {
  let token = "";

  try {
    const res = await fetch("/api/session-token", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      token = data?.token || "";
    }
  } catch {
    // Non-fatal; fall back to reading non-httpOnly cookies below.
  }

  if (!token) {
    token =
      document.cookie
        .split("; ")
        .find((row) => row.startsWith("better-auth.session_token="))
        ?.slice("better-auth.session_token=".length) ?? "";
  }

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}
