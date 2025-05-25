import {
  findAllChannels,
  findChannelBySlug,
} from "@/entities/channel/api/actions";
import { ChannelWithRelations } from "@/entities/channel/model/channel-with-relations";
import PlaylistsSheet from "@/features/playlists-sheet/playlists-sheet";
import { PublicRoutes } from "@/shared/config/routes/public.routes";

import { redirect } from "next/navigation";

export const revalidate = 100;

export async function generateStaticParams() {
  //@ts-ignore
  const channels = (await findAllChannels(
    0,
    "",
    "popular",
    0,
    false,
  )) as ChannelWithRelations[];

  return channels?.map?.((channel) => ({
    slug: channel?.slug,
  }));
}

export default async function ChannelPlaylistsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const channel = await findChannelBySlug(slug);

  if (!channel) redirect(PublicRoutes.HOME);

  return (
    <div>
      {!!channel?.playlists?.length && (
        <PlaylistsSheet playlists={channel.playlists} isOnChannelPage />
      )}
      {!channel?.playlists?.length && (
        <p className="text-lg">There are no playlists!</p>
      )}
    </div>
  );
}
