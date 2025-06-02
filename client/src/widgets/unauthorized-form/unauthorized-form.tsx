import { PublicRoutes } from "@/shared/config/routes/public.routes";
import { Button } from "@/shared/ui/button";

import Link from "next/link";

const UnauthorizedForm = () => {
  return (
    <div className="flex flex-col items-center gap-3 h-full">
      <p className="text-2xl">Login to your account!</p>
      <Button asChild>
        <Link href={PublicRoutes.SIGN_IN}>Sign in</Link>
      </Button>
    </div>
  );
};

export default UnauthorizedForm;
