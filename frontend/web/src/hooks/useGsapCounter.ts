import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";

/**
 * Animates a DOM text node from 0 up to `target` using GSAP.
 * Returns a ref to attach to the element that should display the number.
 *
 * Usage:
 *   const ref = useGsapCounter(42, 0.4);
 *   return <span ref={ref as React.RefObject<HTMLSpanElement>}>0</span>;
 */
export function useGsapCounter(
  target: number,
  delay = 0,
  duration = 1.1,
  ease = "power2.out"
) {
  const nodeRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!nodeRef.current) return;
    const node = nodeRef.current;
    const obj = { val: 0 };

    const tween = gsap.to(obj, {
      val: target,
      duration,
      delay,
      ease,
      onUpdate() {
        node.textContent = Math.round(obj.val).toString();
      },
    });

    return () => {
      tween.kill();
    };
  }, [target, delay, duration, ease]);

  return nodeRef;
}
