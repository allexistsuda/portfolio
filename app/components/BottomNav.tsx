"use client";

import Link from "next/link";
import { useHref } from "../i18n/lang";

function ArrowLeft() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="#222" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="#222" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const textStyle: React.CSSProperties = {
  fontSize: 26,
  fontWeight: 400,
  letterSpacing: "-0.13px",
  color: "#222",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

export default function BottomNav({
  prev,
  next,
}: {
  prev: { label: string; href: string };
  next: { label: string; href: string };
}) {
  const href = useHref();
  return (
    <div className="flex gap-4 mt-8 md:mt-[100px] pb-24">
      <Link
        href={href(prev.href)}
        className="flex items-center gap-2 md:gap-3 hover:opacity-60 transition-opacity duration-200 min-w-0 flex-1"
        style={{ textDecoration: "none", overflow: "hidden" }}
      >
        <ArrowLeft />
        <span style={textStyle}>{prev.label}</span>
      </Link>
      <Link
        href={href(next.href)}
        className="flex items-center justify-end gap-2 md:gap-3 hover:opacity-60 transition-opacity duration-200 min-w-0 flex-1"
        style={{ textDecoration: "none", overflow: "hidden" }}
      >
        <span style={{ ...textStyle, textAlign: "right" }}>{next.label}</span>
        <ArrowRight />
      </Link>
    </div>
  );
}
