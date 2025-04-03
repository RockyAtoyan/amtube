import { User } from "@/entities/user/model/user";

import { Notification } from "./notification";

export interface NotificationWithRelations extends Notification {
  user: User;
}
