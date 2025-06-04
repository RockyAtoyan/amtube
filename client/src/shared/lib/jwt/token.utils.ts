import { publicInstance } from "@/shared/api/axios";
import { ROUTES } from "@/shared/api/routes";
import {
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
} from "@/shared/config/auth/auth.confg";
import { verifyToken } from "@/shared/lib/jwt/jwt.utils";

import Cookies from "js-cookie";
import type { NextRequest } from "next/server";

export function getTokens(request: NextRequest) {
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE_NAME)?.value;
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE_NAME)?.value;
  return { accessToken, refreshToken };
}

export function getTokensFromCookies() {
  const accessToken = Cookies.get(ACCESS_TOKEN_COOKIE_NAME);
  const refreshToken = Cookies.get(REFRESH_TOKEN_COOKIE_NAME);
  return { accessToken, refreshToken };
}

export async function refreshAccessToken(
  request: NextRequest,
  refreshToken: string,
) {
  try {
    const response = await publicInstance.get<{ accessToken: string }>(
      ROUTES.auth.refreshAccessToken.path,
      {
        headers: {
          Cookie: `${REFRESH_TOKEN_COOKIE_NAME}=${refreshToken}`,
        },
      },
    );
    if (!response.data?.accessToken) {
      return null;
    }

    const newAccessToken = response.data.accessToken;
    if (!newAccessToken) {
      return null;
    }

    return newAccessToken;
  } catch (error) {
    return null;
  }
}

export async function isAccessTokenValid(
  accessToken: string,
): Promise<boolean> {
  if (!accessToken) return false;

  const payload = await verifyToken(accessToken);
  return !!payload;
}
