"use client";

import React, { useEffect, useRef, useState } from "react";

import { Eye, EyeOff } from "lucide-react";

import { cn } from "../lib";
import { Button } from "./button";

interface FileInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onFileSelect: (file: File | null) => void;
  className?: string;
}

export const FileInput: React.FC<FileInputProps> = ({
  onFileSelect,
  className,
  ...props
}) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    onFileSelect(file);
  };

  return (
    <label className="cursor-pointer">
      <input hidden type="file" onChange={handleFileChange} {...props} />
      <Button
        size="lg"
        variant={"outline"}
        type="button"
        asChild
        className={cn(className)}
      >
        <span>{props.placeholder || "Input file"}</span>
      </Button>
    </label>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  className?: string;
  containerClassName?: string;
  labelClassName?: string;
  ref?: any;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  className,
  containerClassName,
  labelClassName,
  placeholder,
  type,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordType = type === "password";

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      setIsFocused(!!inputRef.current.value);
    }
  }, [props.value]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={cn(`relative`, containerClassName)}>
      {label && (
        <label
          className={cn(
            "absolute left-3 transition-all duration-200 ease-in-out bg-background px-1",
            isFocused || (inputRef.current && inputRef.current.value)
              ? "-top-2 text-xs text-primary/60 z-[1]"
              : "top-2 text-sm z-[0]",
            labelClassName,
          )}
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          className={cn(
            `relative block w-full px-3 py-2 border border-border rounded-md shadow-sm outline-none focus:border-accent-secondary placeholder-transparent`,
            inputRef.current?.value && "border-accent-secondary",
            error && "border-red-500",
            isPasswordType && "pr-10",
            className,
          )}
          type={isPasswordType && showPassword ? "text" : type}
          placeholder={label}
          {...props}
          onFocus={(event) => {
            setIsFocused(true);
            props.onFocus?.(event);
          }}
          onBlur={(event) => {
            // Only set isFocused to false if the input is empty
            if (!inputRef.current?.value) {
              setIsFocused(false);
            }
            props.onBlur?.(event);
          }}
          ref={(ref) => {
            inputRef.current = ref;
            props.ref?.(ref);
          }}
        />
        {isPasswordType && (
          <button
            type="button"
            className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-primary/60 hover:text-primary focus:outline-none"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Input;
