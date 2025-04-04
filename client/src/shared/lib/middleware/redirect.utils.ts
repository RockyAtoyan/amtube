import { PublicRoutes } from "@/shared/config/routes/public.routes";

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL(PublicRoutes.SIGN_IN, request.url);
  loginUrl.searchParams.set("from", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}
