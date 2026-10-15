"use client";

// Teste: o reel (~/Desktop/reel.mp4) num bloco largo, autoplay, mudo e em loop, como no site de referência.
export default function ReelTest() {
  return (
    <main style={{ minHeight: "100vh", background: "#F3F3F3", padding: "96px 40px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <video
          src="/reel/reel.mp4"
          autoPlay
          muted
          loop
          playsInline
          style={{ display: "block", width: "100%", height: "auto", borderRadius: 16, background: "#E8E8E8" }}
        />
      </div>
    </main>
  );
}
