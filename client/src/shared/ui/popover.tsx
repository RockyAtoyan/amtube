// components/ui/popover.tsx
import {
  ReactElement,
  ReactNode,
  cloneElement,
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

type PopoverContextType = {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
};

const PopoverContext = createContext<PopoverContextType | null>(null);

export function Popover({
  children,
  open: propsOpen = false,
  onOpenChange,
}: {
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (value: boolean) => void;
}) {
  const [open, setOpen] = useState(propsOpen);
  const triggerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onOpenChange?.(open);
  }, [open]);

  // Клик вне — закрыть
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        contentRef.current &&
        !contentRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    function setOpenFalse() {
      setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document
      .getElementById("appScrollContainer")
      ?.addEventListener("scroll", setOpenFalse);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document
        .getElementById("appScrollContainer")
        ?.removeEventListener("scroll", setOpenFalse);
    };
  }, []);

  return (
    <PopoverContext.Provider value={{ open, setOpen, triggerRef, contentRef }}>
      <div className="relative inline-block">{children}</div>
    </PopoverContext.Provider>
  );
}

export function PopoverTrigger({ children }: { children: ReactElement }) {
  const context = useContext(PopoverContext);
  if (!context) throw new Error("PopoverTrigger must be inside Popover");

  const { setOpen, triggerRef } = context;

  return cloneElement(children as any, {
    ref: triggerRef,
    onClick: (e: any) => {
      //@ts-ignore
      children.props?.onClick?.(e);
      //@ts-ignore
      setOpen((prev) => !prev);
    },
  });
}

export function PopoverContent({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const context = useContext(PopoverContext);
  if (!context) throw new Error("PopoverContent must be inside Popover");

  const { open, contentRef, triggerRef } = context;
  const [styles, setStyles] = useState({});

  const updatePosition = () => {
    if (!triggerRef.current || !contentRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const content = contentRef.current;
    const spacing = 8;

    const screenW = window.innerWidth;
    const screenH = window.innerHeight;

    const contentW = content.offsetWidth;
    const contentH = content.offsetHeight;

    // Попробуем снизу
    let top = triggerRect.bottom + spacing;
    let left = triggerRect.left + triggerRect.width / 2 - contentW / 2;

    let placeAbove = false;

    if (top + contentH > screenH) {
      top = triggerRect.top - contentH - spacing;
      placeAbove = true;
    }

    if (top < 0) {
      top = triggerRect.bottom + spacing;
      placeAbove = false;
    }

    if (left < 8) left = 8;
    if (left + contentW > screenW - 8) left = screenW - contentW - 8;

    setStyles({
      position: "fixed",
      top: `${top}px`,
      left: `${left}px`,
    });
  };

  // Вызываем при открытии и при ресайзе
  useLayoutEffect(() => {
    if (open) {
      updatePosition();
    }

    const handleResize = () => {
      if (open) {
        updatePosition();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [open]);

  return (
    <div
      ref={contentRef}
      style={styles}
      className={`z-50 w-64 fixed rounded-xl bg-background shadow-xl border border-border p-4 transition-all duration-200 ${
        open
          ? "opacity-100 scale-100"
          : "pointer-events-none opacity-0 scale-95"
      } ${className}`}
    >
      {children}
    </div>
  );
}
