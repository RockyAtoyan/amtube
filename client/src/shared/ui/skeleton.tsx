"use client";

import { cn } from "@/shared/lib";

import React from "react";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("animate-pulse bg-gray-300 rounded", className)}
        {...props}
      />
    );
  },
);

Skeleton.displayName = "Skeleton";

export { Skeleton };
