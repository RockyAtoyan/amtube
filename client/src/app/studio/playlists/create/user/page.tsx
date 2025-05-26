import CreatePlaylistForm from "@/features/create-playlist-form/create-playlist-form"
import StudioPageHeading from "@/features/studio-page-heading/studio-page-heading"
import { StudioRoutes } from "@/shared/config/routes/studio.routes"
import { Button } from "@/shared/ui/button"

import { ChevronLeft } from "lucide-react"
import Link from "next/link"

export default function CreateUserPlaylistPage() {
  return (
    <div>
      <Button asChild variant="ghost" size={"sm"}>
        <Link
          href={StudioRoutes.PLAYLISTS + "/user"}
          className="flex items-center gap-1 mb-5 max-w-max"
        >
          <ChevronLeft />
          <span>Back</span>
        </Link>
      </Button>
      <StudioPageHeading>Create user playlist</StudioPageHeading>
      <div className="max-w-md">
        <CreatePlaylistForm />
      </div>
    </div>
  );
}
