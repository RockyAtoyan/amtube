import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  getTokens,
  isAccessTokenValid,
  refreshAccessToken,
} from "../jwt/token.utils";
import { redirectToLogin } from "./redirect.utils";

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

  return res;
}
