export interface Notification {
  id: string;
  text: string;
  link?: string;
  isSeen: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  userId: string;
}
