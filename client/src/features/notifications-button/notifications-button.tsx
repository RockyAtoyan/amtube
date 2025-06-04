"use client";

import { useUpdateNotification } from "@/entities/notification/api/hooks";
import { cn } from "@/shared/lib";
import { useAuthStore } from "@/shared/store/auth.store";
import { Button } from "@/shared/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";

import { useEffect, useState } from "react";

import { Bell } from "lucide-react";
import Link from "next/link";

const NotificationsButton = () => {
  const { user } = useAuthStore();

  const { updateNotification, isPending } = useUpdateNotification();

  const [isOpen, setIsOpen] = useState(false);

  const isNotSeenNots = user?.notifications?.filter((not) => !not.isSeen);

  useEffect(() => {
    if (!isOpen) return;
    if (!user?.notifications || isPending) return;
    for (const not of user.notifications.filter((not) => !not.isSeen)) {
      updateNotification({
        id: not.id,
        dto: { userId: user.id, isSeen: true },
      });
    }
  }, [isOpen]);

  return (
    <Popover open={isOpen} onOpenChange={(value) => setIsOpen(value)}>
      <PopoverTrigger>
        <Button className="relative" variant="link" size="icon">
          <Bell />
          {!!isNotSeenNots?.length && (
            <span className="block top-0 right-0 -translate-y-1/3 translate-x-1/3 absolute w-6 h-6 flex items-center justify-center rounded-full bg-accent text-white text-xs">
              {isNotSeenNots.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-max max-w-[32rem] max-h-[28rem] overflow-auto px-0">
        <div className="flex flex-col">
          {user?.notifications?.map((not, index) => {
            return (
              <Link
              onClick={() => setIsOpen(false)}
                className={cn(
                  "p-3 border-b border-border transition-colors hover:bg-secondary",
                  index === user.notifications.length - 1 && "border-none",
                )}
                key={not.id}
                href={not.link || "/"}
              >
                {not.text}
              </Link>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsButton;
