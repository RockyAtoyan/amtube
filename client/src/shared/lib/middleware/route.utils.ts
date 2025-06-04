import { StudioRoutes } from "@/shared/config/routes/studio.routes";

export function isAuthRoute(pathname: string): boolean {
  return pathname.startsWith(StudioRoutes.STUDIO);
}
