export interface Comment {
  id: string;
  text: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  userId: string;
  videoId: string;
}
