"use client";

import * as React from "react";

import { X } from "lucide-react";

import { cn } from "../lib";
import { Button, type ButtonProps } from "./button";

interface ModalProps {
  children: React.ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

interface ModalTriggerProps extends ButtonProps {
  asChild?: boolean;
  children: React.ReactNode;
}

interface ModalContentProps extends React.HTMLAttributes<HTMLDivElement> {}

interface ModalHeaderProps {
  title: string;
  description?: string;
}

interface ModalFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

//@ts-ignore
interface ModalCloseProps extends ButtonProps {
  asChild?: boolean;
  children?: React.ReactNode;
}

const ModalContext = React.createContext<{
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
} | null>(null);

const ModalRoot = ({
  children,
  isOpen: controlledIsOpen,
  onOpenChange,
  className,
}: ModalProps) => {
  const [isInternalOpen, setIsInternalOpen] = React.useState(false);
  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : isInternalOpen;
  const setIsOpen = isControlled
    ? onOpenChange || (() => {})
    : setIsInternalOpen;

  React.useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    const originalWidth = window.getComputedStyle(document.body).width;

    if (isOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = originalStyle;
      document.body.style.width = originalWidth;
    };
  }, [isOpen]);

  React.useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };
    document.addEventListener("keyup", listener);
    return () => {
      document.removeEventListener("keyup", listener);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <ModalContext.Provider value={{ isOpen, setIsOpen }}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          if (child.type === ModalTrigger) {
            return child;
          }
        }
        return null;
      })}
      <div
        className={cn(
          "opacity-0 invisible pointer-events-none fixed top-0 left-0 w-full h-full z-[-1] flex items-center justify-center transition-all",
          isOpen && "opacity-100 visible pointer-events-auto z-50",
        )}
      >
        <div
          className="fixed inset-0 bg-black/70"
          onClick={handleClose}
          aria-hidden="true"
        />
        <div
          className={cn(
            "relative w-full max-w-lg rounded-lg bg-background p-6 shadow-lg",
            className,
          )}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={handleClose}
            className="cursor-pointer absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              if (
                child.type === ModalContent ||
                child.type === ModalHeader ||
                child.type === ModalFooter
              ) {
                return child;
              }
            }
            return null;
          })}
        </div>
      </div>
    </ModalContext.Provider>
  );
};

const ModalTrigger = React.forwardRef<HTMLButtonElement, ModalTriggerProps>(
  ({ asChild, children, ...props }, ref) => {
    const context = React.useContext(ModalContext);
    if (!context) {
      throw new Error("ModalTrigger must be used within a Modal");
    }
    const { setIsOpen } = context;

    if (asChild) {
      return React.cloneElement(children as React.ReactElement<any>, {
        onClick: () => setIsOpen(true),
      });
    }

    return (
      <Button
        type="button"
        ref={ref}
        onClick={() => setIsOpen(true)}
        {...props}
      >
        {children}
      </Button>
    );
  },
);
ModalTrigger.displayName = "ModalTrigger";

const ModalContent = React.forwardRef<HTMLDivElement, ModalContentProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={className} {...props} />
  ),
);
ModalContent.displayName = "ModalContent";

const ModalHeader = ({ title, description }: ModalHeaderProps) => (
  <div className="mb-4">
    <h2 className="text-lg font-semibold">{title}</h2>
    {description && (
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    )}
  </div>
);

const ModalFooter = React.forwardRef<HTMLDivElement, ModalFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={`flex items-center justify-end gap-2 ${className}`}
      {...props}
    />
  ),
);
ModalFooter.displayName = "ModalFooter";

const ModalClose = React.forwardRef<HTMLButtonElement, ModalCloseProps>(
  ({ asChild, children, ...props }, ref) => {
    const context = React.useContext(ModalContext);
    if (!context) {
      throw new Error("ModalClose must be used within a Modal");
    }
    const { setIsOpen } = context;

    if (asChild) {
      return React.cloneElement(children as React.ReactElement<any>, {
        onClick: () => setIsOpen(false),
      });
    }

    return (
      <Button
        type="button"
        ref={ref}
        variant="outline"
        onClick={() => setIsOpen(false)}
        {...props}
      >
        {children || "Close"}
      </Button>
    );
  },
);
ModalClose.displayName = "ModalClose";

const Modal = Object.assign(ModalRoot, {
  Trigger: ModalTrigger,
  Content: ModalContent,
  Header: ModalHeader,
  Footer: ModalFooter,
  Close: ModalClose,
});

export { Modal };
