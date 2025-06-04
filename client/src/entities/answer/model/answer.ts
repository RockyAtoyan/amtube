export interface Answer {
  id: string;
  text: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  commentId: string;
  userId: string;
  toId: string;
}
