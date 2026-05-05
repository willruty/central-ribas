import { useRef, useEffect, forwardRef } from "react";
import IMask from "imask";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface MaskedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  mask: string;
  onMaskedChange?: (raw: string, masked: string) => void;
}

const MaskedInput = forwardRef<HTMLInputElement, MaskedInputProps>(
  ({ mask, onMaskedChange, className, ...props }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      const el = inputRef.current;
      if (!el) return;

      const maskInstance = IMask(el, { mask });

      maskInstance.on("accept", () => {
        onMaskedChange?.(maskInstance.unmaskedValue, maskInstance.value);
      });

      return () => {
        maskInstance.destroy();
      };
    }, [mask, onMaskedChange]);

    return (
      <Input
        ref={(node) => {
          (inputRef as React.MutableRefObject<HTMLInputElement | null>).current = node;
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
          }
        }}
        className={cn(className)}
        {...props}
      />
    );
  }
);

MaskedInput.displayName = "MaskedInput";

export { MaskedInput };
export type { MaskedInputProps };
