import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// ✅ Next.js 16 expects "proxy" (named) OR default export.
export function proxy(req: NextRequest) {
  // If your old middleware had logic, paste it here
  // and return NextResponse.next() / redirect / rewrite accordingly.

  return NextResponse.next();
}

// If your old middleware had matcher config, keep it like this:
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
