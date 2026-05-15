"use client";

import { useState, useEffect } from "react";

const words = ["AI-Assisted Workflow", "Product Discovery", "Data-Driven Design"];

const TYPING_SPEED = 80;   // ms per char (+ random jitter)
const TYPING_JITTER = 60;  // ms random added to typing
const ERASE_SPEED = 40;    // ms per char
const PAUSE_MS = 1500;     // pause when word is complete
const CURSOR_BLINK = 530;  // ms blink interval

export default function TypingHero() {
  const [wordIndex, setWordIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [phase, setPhase] = useState<"typing" | "paused" | "erasing">("typing");
  const [cursorOn, setCursorOn] = useState(true);

  // Cursor blinks only when not erasing
  useEffect(() => {
    if (phase === "erasing") return;
    const id = setInterval(() => setCursorOn((v) => !v), CURSOR_BLINK);
    return () => clearInterval(id);
  }, [phase]);

  // Main animation loop
  useEffect(() => {
    const word = words[wordIndex];

    if (phase === "typing") {
      if (displayed.length === word.length) {
        setPhase("paused");
        return;
      }
      const id = setTimeout(
        () => setDisplayed(word.slice(0, displayed.length + 1)),
        TYPING_SPEED + Math.random() * TYPING_JITTER
      );
      return () => clearTimeout(id);
    }

    if (phase === "paused") {
      const id = setTimeout(() => {
        setCursorOn(false);
        setPhase("erasing");
      }, PAUSE_MS);
      return () => clearTimeout(id);
    }

    if (phase === "erasing") {
      if (displayed.length === 0) {
        setWordIndex((i) => (i + 1) % words.length);
        setCursorOn(true);
        setPhase("typing");
        return;
      }
      const id = setTimeout(
        () => setDisplayed((d) => d.slice(0, -1)),
        ERASE_SPEED
      );
      return () => clearTimeout(id);
    }
  }, [phase, displayed, wordIndex]);

  const showCursor = phase !== "erasing" && cursorOn;

  return (
    <h1
      className="text-[32px] md:text-[49px]"
      style={{
        fontWeight: 500,
        letterSpacing: "-0.05em",
        lineHeight: 1.05,
        color: "#222",
        whiteSpace: "pre-line",
      }}
    >
      {"Product Designer\nDesign System\n"}
      {displayed}
      <span
        aria-hidden
        style={{
          display: "inline-block",
          width: "1px",
          height: "0.85em",
          background: "#222",
          verticalAlign: "middle",
          marginLeft: "2px",
          opacity: showCursor ? 1 : 0,
        }}
      />
    </h1>
  );
}
