import { UserWithRelations } from "@/entities/user/model/user-with-relations";
import { cn, getChannelLogoLetters } from "@/shared/lib";

import { FC } from "react";

import Image from "next/image";

interface Props {
  user: UserWithRelations;
}

const ProfileButton: FC<Props> = ({ user }) => {
  return (
    <button
      className={cn(
        "cursor-pointer block w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center",
        !user.avatarUrl && "bg-primary",
      )}
    >
      {user.avatarUrl && (
        <Image
          src={user.avatarUrl}
          alt={user.name}
          width={48}
          height={48}
          className="w-full h-full object-fit object-cover"
        />
      )}
      {!user.avatarUrl && (
        <span className="font-semibold text-lg text-background">
          {getChannelLogoLetters(user.name)}
        </span>
      )}
    </button>
  );
};

export default ProfileButton;
