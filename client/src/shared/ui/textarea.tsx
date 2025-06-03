"use client";

import React, { useRef, useState } from "react";

import { cn } from "../lib";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  className?: string;
  containerClassName?: string;
  labelClassName?: string;
  ref?: any;
}

const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  className,
  containerClassName,
  labelClassName,
  placeholder,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(!!props.value || false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className={cn(`relative`, containerClassName)}>
      {label && (
        <label
          className={cn(
            "absolute left-3 transition-all duration-200 ease-in-out bg-background px-1",
            isFocused || textareaRef.current?.value
              ? "-top-2 text-xs text-primary/60 z-[1]"
              : "top-2 text-sm z-[0]",
            labelClassName,
          )}
        >
          {label}
        </label>
      )}
      <textarea
        className={cn(
          `relative block w-full px-3 py-2 border border-border rounded-md shadow-sm outline-none focus:border-accent-secondary placeholder-transparent`,
          (isFocused || textareaRef.current?.value) &&
            "border-accent-secondary",
          error && "border-red-500",
          className,
        )}
        placeholder={label}
        {...props}
        onFocus={(event) => {
          setIsFocused(true);
          props.onFocus?.(event);
        }}
        onBlur={(event) => {
          setIsFocused(false);
          props.onBlur?.(event);
        }}
        ref={(ref) => {
          textareaRef.current = ref;
          props.ref?.(ref);
          if (textareaRef.current?.value) {
            setIsFocused(true);
          }
        }}
      />
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Textarea;
