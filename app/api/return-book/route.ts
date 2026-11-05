import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getTokenFromServer } from "@/lib/getTokenFromServer";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/login");
  }

  const formData = await req.formData();
  const borrowId = String(formData.get("borrowId") || "");
  if (!borrowId) {
    return NextResponse.json({ error: "Missing borrowId" }, { status: 400 });
  }

  const token = await getTokenFromServer();
  const res = await fetch(`${API_URL}/borrows/${borrowId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: "Return failed" }));
    return NextResponse.json(errorData, { status: res.status });
  }

  redirect("/my-borrows?returned=1");
}