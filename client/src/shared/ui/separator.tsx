import { FC } from "react";

import { cn } from "../lib";

interface Props {
  className?: string;
}

const Separator: FC<Props> = ({ className }) => {
  return <div className={cn("h-[2px] bg-border/40 rounded", className)} />;
};

export default Separator;
