import { NextResponse } from "next/server";
import { getTokenFromServer } from "@/lib/getTokenFromServer";

export async function GET() {
  const token = await getTokenFromServer();
  return NextResponse.json({ token });
}