import type { CSSProperties } from "react";

export const W = 1920;
export const H = 1080;
export const EASE = "cubic-bezier(0.44, 0, 0.34, 0.98)";

// entrada padrão: sobe e aparece (keyframe "sl-in" definido na página)
export const appear = (delay: number, rise = 24): CSSProperties => ({
  opacity: 0,
  ["--rise" as string]: `${rise}px`,
  animation: `sl-in 0.9s ${EASE} ${delay}s both`,
});
