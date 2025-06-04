import { Channel } from "@/entities/channel/model/channel";

export interface ISidebarSubscriptionItem extends Channel {}

export interface SidebarSubscriptionsProps {
  items: ISidebarSubscriptionItem[];
}
