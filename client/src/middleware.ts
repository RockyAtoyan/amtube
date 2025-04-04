import { handleAuthRoute } from "@/shared/lib/middleware/auth.utils";
import { isAuthRoute } from "@/shared/lib/middleware/route.utils";

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isAuthRoute(pathname)) {
    return handleAuthRoute(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
