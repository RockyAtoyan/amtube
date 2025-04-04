import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { redirectToLogin } from "./redirect.utils";
import {
  getTokens,
  isAccessTokenValid,
  refreshAccessToken,
} from "../jwt/token.utils";

export async function handleAuthRoute(request: NextRequest) {
  const { accessToken, refreshToken } = getTokens(request);

  if (!refreshToken) {
    return redirectToLogin(request);
  }

  if (accessToken) {
    const isValid = await isAccessTokenValid(accessToken);
    if (isValid) {
      return NextResponse.next();
    }
  }

  const newAccessToken = await refreshAccessToken(request, refreshToken);
  if (!newAccessToken) {
    return redirectToLogin(request);
  }

  const res = NextResponse.next();
  res.headers.set("set-cookie", newAccessToken);
  return res;
}
