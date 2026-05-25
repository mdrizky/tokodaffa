import { NextResponse } from "next/server";

export function assertAdminRequest(req: Request) {
  const token = req.headers.get("x-admin-token");
  const expected = process.env.ADMIN_API_TOKEN || process.env.NEXT_PUBLIC_ADMIN_PIN;

  if (!expected || token !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
}
