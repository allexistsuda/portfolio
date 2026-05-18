"use client";

import { useRef, useEffect, useState } from "react";

export default function HighlightText({ children, delay = 0.2 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTriggered(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <span
      ref={ref}
      style={{
        background: "linear-gradient(#FFE566, #FFE566) no-repeat left bottom",
        backgroundSize: triggered ? "100% 42%" : "0% 42%",
        transition: triggered
          ? "background-size 1.8s cubic-bezier(0.22, 0.61, 0.36, 1)"
          : "none",
        transitionDelay: triggered ? `${delay}s` : "0s",
        WebkitBoxDecorationBreak: "clone",
        boxDecorationBreak: "clone",
        paddingBottom: "1px",
      } as React.CSSProperties}
    >
      {children}
    </span>
  );
}
