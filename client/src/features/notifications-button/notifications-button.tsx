import { Button } from "@/shared/ui/button";

import { Bell } from "lucide-react";

const NotificationsButton = () => {
  return (
    <Button variant="link" size="icon">
      <Bell />
    </Button>
  );
};

export default NotificationsButton;
