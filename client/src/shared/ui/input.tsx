"use client";

import React, { useRef, useState } from "react";

import { cn } from "../lib";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  className?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  className,
  placeholder,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={`relative`}>
      {label && (
        <label
          className={cn(
            "absolute left-3 transition-all duration-200 ease-in-out bg-background px-1",
            isFocused || inputRef.current?.value
              ? "-top-2 text-xs text-primary/60 z-[1]"
              : "top-2 text-sm z-[0]",
          )}
        >
          {label}
        </label>
      )}
      <input
        ref={inputRef}
        className={cn(
          `relative block w-full px-3 py-2 border border-border rounded-md shadow-sm outline-none focus:border-accent-secondary sm:text-sm placeholder-transparent`,
          error && "border-red-500",
          inputRef.current?.value && "border-accent-secondary",
          className,
        )}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={label}
        {...props}
      />
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Input;
