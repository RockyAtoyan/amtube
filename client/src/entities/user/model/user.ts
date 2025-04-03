import { Role } from "@/shared/lib/types/role";

export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  avatarUrl?: string;
  isActivated: boolean;
  isBanned: boolean;
  role: Role;
}
