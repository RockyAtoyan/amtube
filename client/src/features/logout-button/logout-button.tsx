import { useLogout } from "@/entities/user/api/hooks";
import { Button } from "@/shared/ui/button";

import { Loader2 } from "lucide-react";

const LogoutButton = () => {
  const { logout, isPending } = useLogout();

  const handleLogout = async () => {
    logout();
  };

  return (
    <Button
      variant="outline"
      onClick={handleLogout}
      disabled={isPending}
    >
      {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Logout"}
    </Button>
  );
};

export default LogoutButton;
