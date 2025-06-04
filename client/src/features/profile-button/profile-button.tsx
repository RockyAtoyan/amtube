import { UserWithRelations } from "@/entities/user/model/user-with-relations";
import { StudioRoutes } from "@/shared/config/routes/studio.routes";
import { cn, getChannelLogoLetters } from "@/shared/lib";
import { Button } from "@/shared/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import Separator from "@/shared/ui/separator";

import { FC } from "react";

import Image from "next/image";
import Link from "next/link";

import LogoutButton from "../logout-button/logout-button";

interface Props {
  user: UserWithRelations;
}

const ProfileButton: FC<Props> = ({ user }) => {
  return (
    <Popover>
      <PopoverTrigger>
        <button
          className={cn(
            "cursor-pointer block w-10 h-10 rounded-[15%] overflow-hidden flex items-center justify-center",
            !user.avatarUrl && "bg-primary",
          )}
        >
          {user.avatarUrl && (
            <Image
              src={
                `${process.env.NEXT_PUBLIC_API_URL}/uploads` + user.avatarUrl
              }
              alt={user.name}
              width={48}
              height={48}
              className="w-full h-full object-center object-cover"
            />
          )}
          {!user.avatarUrl && (
            <span className="font-semibold text-lg text-background">
              {getChannelLogoLetters(user.name)}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="min-w-32">
        <div className="flex flex-col gap-3">
          <Button variant={"outline"} asChild>
            <Link href={StudioRoutes.CHANNEL}>Channel</Link>
          </Button>
          <Button variant={"outline"} asChild>
            <Link href={StudioRoutes.PROFILE}>Profile Settings</Link>
          </Button>
          <Separator />
          <LogoutButton />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ProfileButton;
