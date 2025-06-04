import VideoEditForm from "@/widgets/video-edit-form/video-edit-form";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function StudioVideoEditPage({ params }: Props) {
  const { id } = await params;

  return (
    <div>
      <VideoEditForm videoId={id} />
    </div>
  );
}
