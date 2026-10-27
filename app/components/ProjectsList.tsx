"use client";

import { useHref } from "../i18n/lang";
import Reveal from "./Reveal";

/**
 * Lista de projetos estilo editorial (referência: listagens tipo td-maxfolio) —
 * nome grande à esquerda, categoria centralizada, thumbnails à direita.
 * Só desktop por enquanto (ver grid mobile separado em page.tsx).
 */

const THUMB_HEIGHT = 60;

export default function ProjectsList({
  items,
}: {
  items: {
    title: string;
    category: string;
    href: string;
    thumb?: string;
    video?: string;
  }[];
}) {
  const href = useHref();

  return (
    <div>
      {items.map((p, i) => (
        <Reveal key={i} delay={i * 35} triggerMargin="0%">
          <a
            href={href(p.href)}
            className="group grid items-center"
            style={{
              gridTemplateColumns: "1fr 180px 72px",
              columnGap: 24,
              padding: "16px 0",
              borderBottom: i === items.length - 1 ? "none" : "1px solid #DEDEDE",
              textDecoration: "none",
              position: "relative",
            }}
            onMouseEnter={(e) => {
              const title = e.currentTarget.querySelector<HTMLElement>("[data-title]");
              if (title) title.style.color = "#8D8D8D";
            }}
            onMouseLeave={(e) => {
              const title = e.currentTarget.querySelector<HTMLElement>("[data-title]");
              if (title) title.style.color = "#222";
            }}
          >
            <span
              data-title
              style={{
                fontSize: 20,
                fontWeight: 400,
                // -0.45px aqui era -0.0225em: mais fechado que o título de 36px do About,
                // num corpo quase a metade. A escala tem que apertar conforme CRESCE.
                letterSpacing: "-0.012em",
                lineHeight: "29px",
                color: "#222",
                textAlign: "left",
                transition: "color 0.25s ease",
              }}
            >
              {p.title}
            </span>
            <span
              style={{
                fontSize: 14,
                fontWeight: 400,
                letterSpacing: "-0.1px",
                color: "#8D8D8D",
                textAlign: "center",
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
                whiteSpace: "nowrap",
              }}
            >
              {p.category}
            </span>
            <div className="flex items-center justify-end" style={{ gap: 8, gridColumn: 3 }}>
              {p.video ? (
                <div
                  className="overflow-hidden"
                  style={{
                    height: THUMB_HEIGHT,
                    width: THUMB_HEIGHT * 1.6,
                    borderRadius: 6,
                    flexShrink: 0,
                  }}
                >
                  <video
                    src={p.video}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
                  />
                </div>
              ) : p.thumb ? (
                <div
                  className="overflow-hidden"
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
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
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
