import {
  findAllChannels,
  findChannelBySlug,
} from "@/entities/channel/api/actions";
import { ChannelWithRelations } from "@/entities/channel/model/channel-with-relations";
import { PublicRoutes } from "@/shared/config/routes/public.routes";
import ChannelHeader from "@/widgets/channel-header/channel-header";

import { ReactNode } from "react";

import { Metadata } from "next";
import { redirect } from "next/navigation";

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const channel = await findChannelBySlug(slug);

  const images = channel?.avatarUrl
    ? [`${process.env.NEXT_PUBLIC_API_URL}/uploads` + channel.avatarUrl]
    : [];

  return {
    title: channel?.title,
    openGraph: {
      images: [...images],
    },
  };
}

export default async function ChannelLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const channel = await findChannelBySlug(slug);

  if (!channel) redirect(PublicRoutes.HOME);

  return (
    <div>
      <ChannelHeader channel={channel} />
      <div>{children}</div>
    </div>
  );
}
