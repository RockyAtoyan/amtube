import PlaylistEditForm from "@/widgets/playlist-edit-form/playlist-edit-form";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function StudioPlaylistEditPage({ params }: Props) {
  const { id } = await params;

  return (
    <div>
      <PlaylistEditForm playlistId={id} />
    </div>
  );
}
