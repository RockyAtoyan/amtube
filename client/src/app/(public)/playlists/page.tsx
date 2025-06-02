import UserPlaylists from "@/widgets/user-playlists/user-playlists";

import { ListVideo } from "lucide-react";

export default function PlaylistsPage() {
  return (
    <div>
      <h2 className="text-xl mb-8 flex items-center gap-3">
        <ListVideo className="text-accent" size={24} /> Your playlists
      </h2>
      <UserPlaylists isInStudio={false} />
    </div>
  );
}
