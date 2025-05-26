import { StudioRoutes } from "@/shared/config/routes/studio.routes";
import { Button } from "@/shared/ui/button";
import UserPlaylists from "@/widgets/user-playlists/user-playlists";

import Link from "next/link";

export default function StudioUserPlatlistsPage() {
  return (
    <div>
      <Button className="mb-5" asChild>
        <Link href={StudioRoutes.CREATE_PLAYLIST + "/user"}>
          Create playlist
        </Link>
      </Button>
      <UserPlaylists />
    </div>
  );
}
