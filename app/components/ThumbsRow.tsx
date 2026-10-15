"use client";

import { memo, useEffect, useRef, useState } from "react";
import { useHref } from "../i18n/lang";
import Reveal from "./Reveal";

/**
 * Fileira de thumbs com magnificação estilo Dock (mesmo comportamento
 * do geenie.framer.website):
 * - o layout nunca muda; cada card cresce via transform a partir do centro,
 *   então o crescimento é simétrico (sobe e desce um pouco, não só pra cima);
 * - escala = 1 + MAX_GROWTH × gaussiana(distância do mouse ao centro);
 * - os vizinhos são empurrados com translateX pra manter o gap;
 * - a fileira trava na borda do lado em que o mouse está (o lado oposto
 *   pode sair da tela — cortado pelo overflow-x: clip da página);
 * - a cada frame o valor atual avança uma fração fixa até o alvo.
 * Os estilos são aplicados direto no DOM (sem re-render do React).
 */

const GAP = 20; // espaço entre os cards (gap-5)
const MAX_GROWTH = 0.18; // escala máxima = 1.18 no card sob o mouse
const RADIUS_FACTOR = 1.7; // alcance = largura do card × 1.7 — mais apertado, pra área de resposta bater com o que visualmente cresce
const SIGMA_DIVISOR = 2.2; // desvio da gaussiana = alcance / 2.2 — queda mais rápida nas bordas
const SMOOTHING = 0.12; // fração do caminho percorrida por frame (menor = mais suave)
const MIN_VIEWPORT = 810; // abaixo disso o efeito fica desligado

const REVEAL_STAGGER = 100; // atraso entre a entrada de um card e o próximo

const VIDEO_START_DELAY = 900; // segura um pouco antes do vídeo começar a tocar

function ThumbMedia({
  p,
}: {
  p: { title: string; thumb?: string; video?: string; bg?: string };
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoVisible, setVideoVisible] = useState(false);

  // só conta o delay depois que o vídeo entra na tela — antes disso ele
  // já tinha começado a tocar enquanto o usuário ainda estava rolando pra chegar lá
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timer = setTimeout(() => {
            v.play().catch(() => {});
          }, VIDEO_START_DELAY);
          io.disconnect();
        }
      },
      { threshold: 0.7 }
    );
    io.observe(v);
    return () => {
      io.disconnect();
      if (timer) clearTimeout(timer);
    };
  }, []);

  return (
    <div className="h-full w-full" style={{ background: p.bg }}>
      {p.video ? (
        <video
          ref={videoRef}
          src={p.video}
          muted
          loop
          onPlaying={() => setVideoVisible(true)}
          style={{ opacity: videoVisible ? 1 : 0, transition: "opacity 0.3s ease" }}
          playsInline
          preload="auto"
          className="h-full w-full object-cover"
        />
      ) : p.thumb ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={p.thumb} alt={p.title} className="h-full w-full object-cover" />
      ) : (
        <div className="h-full w-full bg-[#DADADA]" />
      )}
    </div>
  );
}

function ThumbsRow({
  items,
}: {
  items: { title: string; category: string; href: string; thumb?: string; video?: string; bg?: string }[];
}) {
  const href = useHref();
  const rowRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const chipRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;

    const n = items.length;
    let mouseX = -99999; // em coordenadas da fileira; longe = sem efeito
    let hovering = false;
    let raf: number | null = null;
    let ready = false; // só liga o hover depois que a fileira entra na tela
    const curScale = new Array(n).fill(1);
    const curX = new Array(n).fill(0);

    // offsetLeft/offsetWidth forçam reflow síncrono — ler isso a cada frame
    // (60x/s) prende a thread principal e engasga QUALQUER animação CSS
    // rodando ao mesmo tempo (ex: o motion do chip de categoria). Como o
    // layout não muda durante o hover (transform não afeta offsetLeft), só
    // precisamos recalcular isso 1x e de novo se a janela for redimensionada.
    let wrappers: HTMLElement[] = [];
    let base: { left: number; width: number }[] = [];
    let rowW = 0;
    const measure = () => {
      wrappers = Array.from(row.children) as HTMLElement[];
      base = wrappers.map((w) => ({ left: w.offsetLeft, width: w.offsetWidth }));
      rowW = row.clientWidth;
    };
    measure();
    window.addEventListener("resize", measure);

    // O bounce de entrada (translateY/opacity no wrapper do Reveal) e o zoom
    // do hover (translateX/scale num div interno) ficam em elementos
    // diferentes — não competem visualmente. Só precisa esperar a fileira
    // entrar na tela, não o bounce terminar (isso só deixava o hover
    // parecendo travado/lento logo que os cards aparecem).
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          ready = true;
          io.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    io.observe(row);

    const tick = () => {
      const cards = cardRefs.current;
      const active = window.innerWidth >= MIN_VIEWPORT;

      // a distância usa a posição VISUAL atual do card (base + o deslocamento
      // já aplicado no frame anterior), não a posição estática de layout —
      // senão, quando um vizinho empurra o card pro lado, a área de resposta
      // continua calculada como se ele não tivesse se movido, e o hover para
      // de bater com a imagem de verdade.
      const targetScale = base.map((b, i) => {
        if (!active) return 1;
        const radius = b.width * RADIUS_FACTOR;
        const sigma = radius / SIGMA_DIVISOR;
        const dist = Math.abs(mouseX - (b.left + curX[i] + b.width / 2));
        if (dist >= radius) return 1;
        return 1 + MAX_GROWTH * Math.exp(-(dist * dist) / (2 * sigma * sigma));
      });

      // crescimento horizontal de cada card e deslocamento pra manter o gap
      const grow = base.map((b, i) => b.width * (targetScale[i] - 1));
      const total = grow.reduce((a, g) => a + g, 0);
      let before = 0;
      const offset = grow.map((g) => {
        const after = total - before - g;
        const o = 0.5 * (before - after);
        before += g;
        return o;
      });

      // trava na borda do lado em que o mouse está
      let minLeft = Infinity;
      let maxRight = -Infinity;
      base.forEach((b, i) => {
        minLeft = Math.min(minLeft, b.left + offset[i] - grow[i] / 2);
        maxRight = Math.max(maxRight, b.left + b.width + offset[i] + grow[i] / 2);
      });
      let shift = 0;
      if (mouseX < rowW / 2) {
        if (minLeft < 0) shift = -minLeft;
      } else if (maxRight > rowW) {
        shift = rowW - maxRight;
      }

      // o card "ativo" pro chip é só o de MAIOR escala no momento — a
      // gaussiana do zoom faz vizinhos também passarem de 1 (efeito dock),
      // então um limite fixo por card sozinho deixa vários chips abertos
      // ao mesmo tempo. Precisa ser o único mais perto do cursor.
      let topIndex = -1;
      let topScale = 1.02;
      targetScale.forEach((s, i) => {
        if (s > topScale) {
          topScale = s;
          topIndex = i;
        }
      });

      let moving = false;
      cards.forEach((card, i) => {
        if (!card) return;
        const tx = offset[i] + shift;
        curScale[i] += (targetScale[i] - curScale[i]) * SMOOTHING;
        curX[i] += (tx - curX[i]) * SMOOTHING;
        if (Math.abs(curScale[i] - targetScale[i]) > 0.001 || Math.abs(curX[i] - tx) > 0.1) moving = true;
        card.style.transform = `translateX(${curX[i]}px) scale(${curScale[i]})`;
        if (wrappers[i]) wrappers[i].style.zIndex = curScale[i] > 1.02 ? "10" : "1";

        // o chip não pode depender do :hover do CSS: o próprio card se move
        // (translateX/scale) sob o cursor, então o mouse "sai e entra" do
        // elemento várias vezes durante o efeito, interrompendo a transição
        // no meio. Aqui usamos o mesmo sinal (curScale) que já sabemos ser
        // estável — controlado direto por JS, mas ainda anima suave porque
        // a transition CSS continua definida no elemento.
        const chip = chipRefs.current[i];
        if (chip) {
          const chipActive = active && i === topIndex;
          chip.style.opacity = chipActive ? "1" : "0";
          chip.style.filter = chipActive ? "blur(0px)" : "blur(5px)";
        }
      });

      raf = hovering || moving ? requestAnimationFrame(tick) : null;
    };

    const start = () => {
      if (raf === null) raf = requestAnimationFrame(tick);
    };

    // Protege contra "hover fantasma": quando a página rola com o mouse parado,
    // a fileira pode chegar embaixo do cursor sem o usuário ter mexido o mouse
    // de propósito. Por isso, a 1ª leitura só registra a posição de referência
    // (não reage); só passa a reagir depois de detectar um movimento de verdade
    // (acima de MOVE_THRESHOLD) a partir dali.
    const MOVE_THRESHOLD = 4;
    let armed = false;
    let armX = 0;
    let unlocked = false;
    let lastClientX = -99999;
    let lastClientY = -99999;

    const onMove = (e: MouseEvent) => {
      lastClientX = e.clientX;
      lastClientY = e.clientY;
      if (!ready) return; // bounce de entrada ainda rolando — ignora o hover
      const x = e.clientX - row.getBoundingClientRect().left;
      if (!armed) {
        armed = true;
        armX = x;
        return;
      }
      if (!unlocked) {
        if (Math.abs(x - armX) < MOVE_THRESHOLD) return;
        unlocked = true;
      }
      mouseX = x;
      hovering = true;
      start();
    };
    const onLeave = () => {
      armed = false;
      unlocked = false;
      hovering = false;
      mouseX = -99999;
      start();
    };

    // Se o usuário rolar a página e o mouse (parado) acabar em cima da fileira,
    // o efeito não deveria precisar de um "cutucão" extra pra ligar — assim que
    // o scroll para de verdade, se o cursor já está sobre a fileira, isso conta
    // como um hover válido (a rolagem em si já terminou, não é mais fantasma).
    let scrollEndTimer: ReturnType<typeof setTimeout> | null = null;
    const onScroll = () => {
      if (scrollEndTimer) clearTimeout(scrollEndTimer);
      scrollEndTimer = setTimeout(() => {
        if (!ready || unlocked) return;
        const rect = row.getBoundingClientRect();
        const inside =
          lastClientX >= rect.left &&
          lastClientX <= rect.right &&
          lastClientY >= rect.top &&
          lastClientY <= rect.bottom;
        if (inside) {
          armed = true;
          unlocked = true;
          mouseX = lastClientX - rect.left;
          hovering = true;
          start();
        }
      }, 120);
    };

    row.addEventListener("mousemove", onMove);
    row.addEventListener("mouseleave", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      row.removeEventListener("mousemove", onMove);
      row.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      if (scrollEndTimer) clearTimeout(scrollEndTimer);
      if (raf !== null) cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [items.length]);

  return (
    <div ref={rowRef} className="relative flex" style={{ gap: GAP, isolation: "isolate" }}>
      {items.map((p, i) => (
        <Reveal key={i} delay={i * REVEAL_STAGGER} triggerMargin="-45%" className="relative min-w-0 flex-1">
          <div
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            style={{ transformOrigin: "center", willChange: "transform" }}
          >
            <a
              href={href(p.href)}
              className="relative block overflow-hidden rounded-[12px] aspect-[3/4]"
              style={{ textDecoration: "none" }}
            >
              <ThumbMedia p={p} />
              {/* chip de categoria escondido por enquanto — repensando o design */}
            </a>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

// evita re-render (e o vídeo reiniciando) sempre que a página rola —
// ThumbsRow só depende de `items`, que nunca muda depois do primeiro render
export default memo(ThumbsRow);
