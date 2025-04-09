import { LucideIcon } from "lucide-react";

export interface INavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface MenuProps {
  items: INavItem[];
  title?: string;
  isLimited?: boolean;
}
