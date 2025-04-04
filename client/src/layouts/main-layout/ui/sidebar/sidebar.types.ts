import { Channel } from "@/entities/channel/model/channel";

import { LucideIcon } from "lucide-react";

export interface INavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface MenuProps {
  items: INavItem[];
  title?: string;
}

export interface ISidebarSubscriptionItem extends Channel {}

export interface SidebarSubscriptionsProps {
  items: ISidebarSubscriptionItem[];
}
