// Motor do ácaro no microscópio. Desenha num ctx qualquer, no tamanho nativo da foto
// (686 x 596), e é usado por duas peças: a solta (/acaro-motion.html) e a do mockup
// (/acaro-mockup.html). Uma fonte só — se o movimento mudar, muda nas duas.
//
// A foto não é recortada nem redesenhada: o que dá vida é a CÂMERA e o MEIO em volta dela.
// Cinco camadas, todas com movimento periódico em p = quadro / total (sempre sin/cos de
// múltiplos INTEIROS de 2π), então o último quadro emenda no primeiro por construção.
//
//   1. fundo      a foto desfocada, deriva ampla, a profundidade de campo respirando
//   2. sujeito    a mesma foto nítida, mascarada numa elipse suave em volta do bicho,
//                 com deriva MENOR que a do fundo — é daí que vem o paralaxe — mais um
//                 warp em tiras de 3 px que faz as cerdas e as patas tremerem
//   3. poeira     bokeh quente à frente e atrás do sujeito, em órbitas lissajous
//   4. luz        bloom só de altas-luzes e flicker da lâmpada. Sem vinheta: a queda de
//                 luz do microscópio já está na foto, e somar outra por cima derrubava os
//                 cantos pra metade do brilho da arte original.
//   5. grão       12 tiles de ruído revezando por índice de quadro (180 % 12 = 0)
//
// A pegada é de vídeo generativo: nada começa nem termina, tudo está sempre no meio de um
// movimento lento. Por isso não existe "entrada" — o quadro 0 já está em deslocamento.

window.AcaroMotion = (() => {
  const W = 686, H = 596, FPS = 30, LOOP_S = 6;
  const TOTAL_FRAMES = Math.round(LOOP_S * FPS);   // 180
  const TAU = Math.PI * 2;

  // Centro do bicho na foto, medido a olho, e o raio da elipse que separa sujeito de fundo.
  // A máscara é bem difusa de propósito: borda dura entregaria o truque na hora.
  const MITE_X = 345, MITE_Y = 268, MITE_RX = 205, MITE_RY = 225;

  // Escala de repouso das duas camadas. Tem que sobrar margem pra deriva e pro blur não
  // chuparem transparência de fora da foto nas beiradas.
  const BASE_SCALE = 1.15;

  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  const pad = (w, h) => { const el = document.createElement("canvas"); el.width = w; el.height = h; return el; };

  // Poeira. `spd` é inteiro — se não fosse, a órbita não fecharia no fim do loop.
  const rnd = mulberry32(20251012);
  const DUST = Array.from({ length: 38 }, () => {
    const depth = rnd();                       // 0 = colado no fundo, 1 = quase na lente
    return {
      x: rnd() * W, y: rnd() * H,
      r: 1.4 + depth * depth * 9,              // perto da lente vira bokeh grande e difuso
      ax: 10 + rnd() * 38, ay: 8 + rnd() * 26,
      ph: rnd() * TAU, spd: rnd() < 0.72 ? 1 : 2,
      a: 0.06 + depth * 0.20,
      depth,
    };
  });

  // Grão: 12 tiles de 256 px revezando por quadro. Cinza 128 é neutro no 'overlay',
  // então o ruído só empurra pra cima e pra baixo em torno dele.
  const GRAIN_TILES = (() => {
    const g = mulberry32(7);
    return Array.from({ length: 12 }, () => {
      const t = pad(256, 256), tc = t.getContext("2d");
      const img = tc.createImageData(256, 256), d = img.data;
      for (let i = 0; i < d.length; i += 4) {
        const v = 128 + (g() - 0.5) * 96;
        d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255;
      }
      tc.putImageData(img, 0, 0);
      return tc.createPattern(t, "repeat");
    });
  })();
  const GRAIN_SHIFT = Array.from({ length: 12 }, (_, i) => {
    const g = mulberry32(100 + i);
    return [Math.floor(g() * 256), Math.floor(g() * 256)];
  });

  // Cada instância tem os seus auxiliares, pra duas peças poderem conviver na mesma página.
  function create(photo) {
    const layerA = pad(W, H);   // foto transformada, antes do warp
    const layerB = pad(W, H);   // sujeito já deformado e mascarado
    const glow   = pad(W, H);   // altas-luzes isoladas
    const glow2  = pad(W, H);   // as mesmas, borradas
    const ca = layerA.getContext("2d"), cb = layerB.getContext("2d");
    const cg = glow.getContext("2d"), cg2 = glow2.getContext("2d");

    // Põe a foto num canvas auxiliar já transformada. Tudo em torno do centro do quadro.
    function stamp({ scale, dx, dy, rot, blur }) {
      ca.setTransform(1, 0, 0, 1, 0, 0);
      ca.clearRect(0, 0, W, H);
      ca.filter = blur > 0.02 ? `blur(${blur.toFixed(2)}px)` : "none";
      ca.translate(W / 2 + dx, H / 2 + dy);
      ca.rotate(rot);
      ca.scale(scale, scale);
      ca.drawImage(photo, -W / 2, -H / 2, W, H);
      ca.filter = "none";
      ca.setTransform(1, 0, 0, 1, 0, 0);
    }

    function dust(c, p, front) {
      c.globalCompositeOperation = "lighter";
      for (const d of DUST) {
        if ((d.depth > 0.5) !== front) continue;
        const x = d.x + d.ax * Math.sin(TAU * d.spd * p + d.ph);
        const y = d.y + d.ay * Math.cos(TAU * d.spd * p + d.ph * 1.3);
        // Cintilação: cada grão pisca no seu tempo, de novo em harmônica inteira.
        const tw = 0.45 + 0.55 * Math.sin(TAU * (d.spd + 1) * p + d.ph * 2.1);
        const g = c.createRadialGradient(x, y, 0, x, y, d.r);
        g.addColorStop(0, `rgba(255,228,176,${(d.a * tw).toFixed(3)})`);
        g.addColorStop(0.45, `rgba(255,196,120,${(d.a * tw * 0.45).toFixed(3)})`);
        g.addColorStop(1, "rgba(255,180,90,0)");
        c.fillStyle = g;
        c.beginPath(); c.arc(x, y, d.r, 0, TAU); c.fill();
      }
      c.globalCompositeOperation = "source-over";
    }

    // Desenha o quadro `f` em `c`, que precisa ser um contexto de 686 x 596.
    function drawFrame(c, f) {
      const p = f / TOTAL_FRAMES;
      const s1 = Math.sin(TAU * p), c1 = Math.cos(TAU * p);

      c.setTransform(1, 0, 0, 1, 0, 0);
      c.globalAlpha = 1;
      c.globalCompositeOperation = "source-over";
      c.fillStyle = "#1a0e04";
      c.fillRect(0, 0, W, H);

      /* 1. fundo — deriva ampla, foco respirando */
      stamp({
        scale: BASE_SCALE + 0.038 * s1,
        dx: 19 * Math.sin(TAU * p + 0.4),
        dy: 14 * c1,
        rot: 0.009 * Math.sin(TAU * p + 1.9),
        blur: 2.8 + 3.4 * (0.5 + 0.5 * Math.sin(TAU * p - 0.6)),
      });
      c.drawImage(layerA, 0, 0);

      /* 2. poeira atrás do sujeito */
      dust(c, p, false);

      /* 3. sujeito — deriva menor (paralaxe), warp em tiras, máscara elíptica */
      stamp({
        scale: BASE_SCALE + 0.062 * Math.sin(TAU * p - 1.0),
        dx: 8.0 * Math.sin(TAU * p + 2.1),
        dy: 6.0 * Math.cos(TAU * p + 1.2),
        rot: 0.012 * Math.sin(TAU * p + 0.8),
        blur: 0.15 + 1.15 * (0.5 + 0.5 * Math.sin(TAU * 2 * p + 1.9)),
      });

      // Warp: tiras de 3 px deslizando no eixo x por uma onda que percorre o quadro de baixo
      // pra cima. Amplitude ~2,6 px — o bastante pra cerda fina tremer, pouco pra borracha.
      cb.setTransform(1, 0, 0, 1, 0, 0);
      cb.clearRect(0, 0, W, H);
      const STRIP = 3;
      for (let y = 0; y < H; y += STRIP) {
        const w1 = Math.sin(y * 0.046 - TAU * p + 0.5);
        const w2 = Math.sin(y * 0.017 + TAU * 2 * p + 2.3);
        const ox = 2.6 * w1 + 1.3 * w2;
        const oy = 0.9 * Math.sin(y * 0.03 + TAU * p);
        cb.drawImage(layerA, 0, y, W, STRIP + 1, ox, y + oy, W, STRIP + 1);
      }

      // Máscara: elipse bem difusa, respirando junto com o push-in.
      const mk = 1 + 0.06 * Math.sin(TAU * p - 1.0);
      cb.globalCompositeOperation = "destination-in";
      cb.setTransform(MITE_RX * mk, 0, 0, MITE_RY * mk, MITE_X, MITE_Y);
      const mg = cb.createRadialGradient(0, 0, 0, 0, 0, 1);
      mg.addColorStop(0, "rgba(0,0,0,1)");
      mg.addColorStop(0.42, "rgba(0,0,0,1)");
      mg.addColorStop(0.72, "rgba(0,0,0,0.55)");
      mg.addColorStop(1, "rgba(0,0,0,0)");
      cb.fillStyle = mg;
      cb.fillRect(-1, -1, 2, 2);
      cb.setTransform(1, 0, 0, 1, 0, 0);
      cb.globalCompositeOperation = "source-over";
      c.drawImage(layerB, 0, 0);

      /* 4. poeira na frente */
      dust(c, p, true);

      /* 5. bloom SÓ nas altas-luzes. Borrar o quadro inteiro e dar screen levanta o preto e
            lava o âmbar todo — a foto vira creme. Multiplicando a cópia por ela mesma duas
            vezes (x³) os médios caem e só o que já era claro sobra pra espalhar. */
      cg.setTransform(1, 0, 0, 1, 0, 0);
      cg.globalCompositeOperation = "copy";
      cg.drawImage(c.canvas, 0, 0);
      cg.globalCompositeOperation = "multiply";
      cg.drawImage(c.canvas, 0, 0);
      cg.drawImage(c.canvas, 0, 0);
      cg.globalCompositeOperation = "source-over";
      cg2.setTransform(1, 0, 0, 1, 0, 0);
      cg2.globalCompositeOperation = "copy";
      cg2.filter = "blur(18px)";
      cg2.drawImage(glow, 0, 0);
      cg2.filter = "none";
      cg2.globalCompositeOperation = "source-over";
      c.globalCompositeOperation = "screen";
      c.globalAlpha = 0.28 + 0.13 * Math.sin(TAU * 2 * p + 0.7);
      c.drawImage(glow2, 0, 0);
      c.globalAlpha = 1;
      c.globalCompositeOperation = "source-over";

      /* 6. lâmpada — três harmônicas inteiras, que juntas não parecem senoide */
      const flick = 0.55 * Math.sin(TAU * 3 * p) + 0.3 * Math.sin(TAU * 7 * p + 1.1) + 0.15 * Math.sin(TAU * 11 * p + 2.4);
      c.globalCompositeOperation = "multiply";
      c.fillStyle = `rgba(255,196,118,${(0.30 - 0.085 * flick).toFixed(3)})`;
      c.fillRect(0, 0, W, H);
      c.globalCompositeOperation = "source-over";

      /* 7. grão */
      const gi = f % GRAIN_TILES.length;
      c.globalCompositeOperation = "overlay";
      c.globalAlpha = 0.075;
      c.save();
      c.translate(-GRAIN_SHIFT[gi][0], -GRAIN_SHIFT[gi][1]);
      c.fillStyle = GRAIN_TILES[gi];
      c.fillRect(0, 0, W + 256, H + 256);
      c.restore();
      c.globalAlpha = 1;
      c.globalCompositeOperation = "source-over";
    }

    return { drawFrame };
  }

  // Carrega a foto uma vez e devolve o renderer pronto.
  // De propósito via onload, e não img.decode(): o Chrome adia a decodificação enquanto o
  // documento está oculto, e aí a promessa nunca resolve — a peça abre em preto num painel
  // em segundo plano e a gravação fica pendurada. onload dispara mesmo escondido.
  function load(src = "/acaro/acaro.webp") {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(create(img));
      img.onerror = () => reject(new Error("não carregou " + src));
      img.src = src;
    });
  }

  return { W, H, FPS, LOOP_S, TOTAL_FRAMES, create, load };
})();
