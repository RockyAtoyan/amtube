export interface Channel {
  id: string;
  title: string;
  slug: string;
  description: string;
  avatarUrl?: string;
  bannerUrl?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  userId: string;
}
