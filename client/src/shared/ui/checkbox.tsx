"use client";

import React, { useState } from "react";

import { Check } from "lucide-react";

import { cn } from "../lib";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  ref?: any;
}

const Checkbox: React.FC<CheckboxProps> = ({ className, ...props }) => {
  const [checked, setChecked] = useState(props.checked);

  return (
    <label className="inline-flex items-center cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only peer"
          {...props}
          onChange={(event) => {
            setChecked(event.target.checked);
            props.onChange?.(event);
          }}
        />
        <div
          className={cn(
            "h-5 w-5 border rounded border-border bg-background",
            "peer-checked:bg-accent-secondary peer-checked:border-accent-secondary",
            "peer-focus:ring-2 peer-focus:ring-accent-secondary/50",
            "transition-colors duration-200",
            "flex items-center justify-center",
            className,
          )}
        >
          <Check
            className={cn(
              "h-3 w-3 text-white transition-opacity",
              checked ? "opacity-100" : "opacity-0",
            )}
          />
        </div>
      </div>
    </label>
  );
};

export default Checkbox;
