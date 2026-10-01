"use client";

import { useHref } from "../i18n/lang";
import Reveal from "./Reveal";

/**
 * Lista de projetos estilo editorial (referência: listagens tipo td-maxfolio) —
 * nome grande à esquerda, categoria centralizada, thumbnails à direita.
 * Só desktop por enquanto (ver grid mobile separado em page.tsx).
 */

const THUMB_HEIGHT = 36;

export default function ProjectsList({
  items,
}: {
  items: {
    title: string;
    category: string;
    href: string;
    thumb?: string;
  }[];
}) {
  const href = useHref();

  return (
    <div>
      {items.map((p, i) => (
        <Reveal key={i} delay={i * 80}>
          <a
            href={href(p.href)}
            className="group grid items-center"
            style={{
              gridTemplateColumns: "1fr 1fr auto",
              columnGap: 24,
              padding: "22px 12px",
              borderBottom: "1px solid #E6E6E6",
              textDecoration: "none",
              transition: "background-color 0.25s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#F0F0EF";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <span
              style={{
                fontSize: 20,
                fontWeight: 400,
                letterSpacing: "-0.3px",
                lineHeight: 1.1,
                color: "#222",
                textAlign: "left",
              }}
            >
              {p.title}
            </span>
            <span
              style={{
                fontSize: 13,
                fontWeight: 400,
                color: "#8D8D8D",
                textAlign: "center",
              }}
            >
              {p.category}
            </span>
            <div className="flex items-center justify-end" style={{ gap: 8 }}>
              {p.thumb ? (
                <div
                  className="overflow-hidden transition-transform duration-300 ease-out group-hover:scale-105"
                  style={{
                    height: THUMB_HEIGHT,
                    width: THUMB_HEIGHT * 1.6,
                    borderRadius: 6,
                    flexShrink: 0,
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.thumb}
                    alt={p.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div
                  style={{
                    height: THUMB_HEIGHT,
                    width: THUMB_HEIGHT * 1.6,
                    borderRadius: 6,
                    background: "#DADADA",
                    flexShrink: 0,
                  }}
                />
              )}
            </div>
          </a>
        </Reveal>
      ))}
    </div>
  );
}
