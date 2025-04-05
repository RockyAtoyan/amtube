"use client";

import { cn } from "@/shared/lib";

import React from "react";

import { type VariantProps, cva } from "class-variance-authority";

const buttonVariants = cva(
  "cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-accent hover:bg-accent/90 text-background",
        // destructive:
        //   "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-accent-secondary hover:bg-accent-secondary hover:text-white",
        secondary: "bg-secondary hover:bg-secondary/80",
        ghost: "hover:bg-secondary ",
        link: "text-primary/70 hover:text-primary/100",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp: React.ElementType = asChild ? "span" : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
