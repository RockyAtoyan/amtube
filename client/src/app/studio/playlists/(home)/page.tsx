import { StudioRoutes } from "@/shared/config/routes/studio.routes";
import { Button } from "@/shared/ui/button";
import ChannelPlaylists from "@/widgets/channel-playlists/channel-playlists";

import Link from "next/link";

export default function StudioPlaylistsPage() {
  return (
    <div>
      <Button className="mb-5" asChild>
        <Link href={StudioRoutes.CREATE_PLAYLIST + "/channel"}>
          Create playlist
        </Link>
      </Button>
      <ChannelPlaylists />
    </div>
  );
}
