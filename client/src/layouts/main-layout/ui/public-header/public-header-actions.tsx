"use client";

import NotificationsButton from "@/features/notifications-button/notifications-button";
import ToggleThemeButton from "@/features/toggle-theme/toggle-theme";
import { StudioRoutes } from "@/shared/config/routes/studio.routes";
import { useAuthStore } from "@/shared/store/auth.store";
import { Button } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";

import { Grid2X2, SquarePlusIcon } from "lucide-react";
import Link from "next/link";

const PublicHeaderActions = () => {
  const { user, isPending } = useAuthStore();

  return (
    <div className="flex items-center gap-1">
      {user ? (
        <>
          <Button variant="link" size="icon" asChild>
            <Link href={StudioRoutes.VIDEO_UPLOAD}>
              <SquarePlusIcon />
            </Link>
          </Button>
          <Button variant="link" size="icon" asChild>
            <Link href={StudioRoutes.STUDIO_HOME}>
              <Grid2X2 />
            </Link>
          </Button>
          <NotificationsButton />
        </>
      ) : (
        isPending && (
          <>
            <Skeleton className="w-10 h-10 rounded-md" />
            <Skeleton className="w-10 h-10 rounded-md" />
            <Skeleton className="w-10 h-10 rounded-md" />
          </>
        )
      )}
      <ToggleThemeButton />
    </div>
  );
};

export default PublicHeaderActions;
