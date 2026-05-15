"use client";

import { useState } from "react";

export default function VideoPlayer({ videoId, thumbnail }: { videoId: string; thumbnail: string }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div style={{ position: "relative", width: "100%", paddingTop: "56.25%", borderRadius: 16, overflow: "hidden", cursor: "pointer" }}>
      {playing ? (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title="Video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
        />
      ) : (
        <div
          onClick={() => setPlaying(true)}
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={thumbnail} alt="Video thumbnail" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.95)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "transform 0.2s ease",
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.1)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M6 4.75L19.25 12L6 19.25V4.75Z" fill="#222" />
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
