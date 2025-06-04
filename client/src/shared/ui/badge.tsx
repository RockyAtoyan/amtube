import { FC } from "react";

import { AlertCircle, Info } from "lucide-react";

import { cn } from "../lib";

interface BadgeProps {
  variant?: "info" | "error" | "warning";
  className?: string;
  children: React.ReactNode;
}

const Badge: FC<BadgeProps> = ({ variant = "info", className, children }) => {
  const baseClasses =
    "w-max flex items-center gap-2 p-2 border rounded-md text-sm ";
  const variantClasses = {
    info: "bg-accent/10 border-accent/20 text-accent",
    error: "bg-red-500/10 border-red-500/20 text-red-500",
    warning: "bg-yellow-500/10 border-yellow-500/20 text-yellow-500",
  };
  const variantIcons = {
    info: <Info size={18} />,
    error: <AlertCircle size={18} />,
    warning: <AlertCircle size={18} />,
  };

  return (
    <div className={cn(baseClasses, variantClasses[variant], className)}>
      {variantIcons[variant]}
      <p>{children}</p>
    </div>
  );
};

export default Badge;
