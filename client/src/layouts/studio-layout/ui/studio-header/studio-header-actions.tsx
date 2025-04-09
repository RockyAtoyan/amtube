"use client";

import NotificationsButton from "@/features/notifications-button/notifications-button";
import ToggleThemeButton from "@/features/toggle-theme/toggle-theme";
import { useAuthStore } from "@/shared/store/auth.store";
import { Skeleton } from "@/shared/ui/skeleton";

const StudioHeaderActions = () => {
  const { user, isPending } = useAuthStore();

  return (
    <div className="flex items-center gap-1">
      {user ? (
        <>
          <NotificationsButton />
        </>
      ) : (
        isPending && (
          <>
            <Skeleton className="w-10 h-10 rounded-md" />
          </>
        )
      )}
      <ToggleThemeButton />
    </div>
  );
};

export default StudioHeaderActions;
