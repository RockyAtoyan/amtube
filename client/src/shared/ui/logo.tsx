import { Youtube } from "lucide-react";
import Link from "next/link";

import { PublicRoutes } from "../config/routes/public.routes";

const Logo = () => {
  return (
    <Link
      href={PublicRoutes.HOME}
      className="flex items-center gap-1 text-base"
    >
      <Youtube className="text-accent" size={32} />
      <span>AmTube</span>
    </Link>
  );
};

export default Logo;
