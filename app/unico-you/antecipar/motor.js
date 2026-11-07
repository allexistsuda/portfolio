// Gerado de public/antecipar-motion.html por scratchpad/gerar_componente.py — edite a peça lá.
// Monta a animação dentro de `root` e devolve quadro(t) e a duração de um ciclo.
/* eslint-disable */
export function montar(root) {
/* ---------- geometria (medida no Frame 5) ---------- */
const D = 0.8;                                  // escala de exibição do aparelho exportado a 0,5x
const AP = { w: 687, h: 1224 };                 // aparelho.png (com sombra)
const CORPO = { w: 1085.276 * 0.5, h: 2196 * 0.5 };
const TELA = { x: 29.939, y: 26.945, w: 482.761, h: 1044.110 }; // tela dentro do aparelho.png
const PT = TELA.w * D / 390;                    // px por ponto do iPhone 12
const APP = TELA.w * D / 375;                   // as telas são de 375: esticam pra 390

const $ = (id) => root.querySelector('#am-' + id);
const phone = $('phone'), screen = $('screen'), app = $('app'), status = $('status');
phone.style.left = (1920 - CORPO.w * D) / 2 + 'px';
phone.style.top = (1080 - CORPO.h * D) / 2 + 'px';
$('aparelho').style.width = AP.w * D + 'px';
Object.assign(screen.style, { left: TELA.x * D + 'px', top: TELA.y * D + 'px', width: TELA.w * D + 'px', height: TELA.h * D + 'px' });
app.style.transform = `scale(${APP})`;
status.style.width = TELA.w * D + 'px';

/* ---------- curvas ---------- */
function bezier(x1, y1, x2, y2) {
  const ax = 3 * x1 - 3 * x2 + 1, bx = 3 * x2 - 6 * x1, cx = 3 * x1;
  const ay = 3 * y1 - 3 * y2 + 1, by = 3 * y2 - 6 * y1, cy = 3 * y1;
  return (x) => {
    if (x <= 0) return 0; if (x >= 1) return 1;
    let u = x;
    for (let i = 0; i < 8; i++) { const f = ((ax * u + bx) * u + cx) * u - x; const d = (3 * ax * u + 2 * bx) * u + cx; if (Math.abs(d) < 1e-6) break; u -= f / d; }
    return ((ay * u + by) * u + cy) * u;
  };
}
const PUNCH = bezier(0.16, 1, 0.3, 1);    // arranca rápido e assenta, sem passar do ponto
const ENTRADA = bezier(0.2, 0.8, 0.2, 1);  // a subida da cascata: sai sem tranco e assenta longo
const FOLHA = bezier(0.45, 0, 0.25, 1);    // a folha arranca logo (sem ficar parada no começo) e sai
const SUAVE = bezier(0.65, 0, 0.35, 1);
const TECLADO_IOS = bezier(0.38, 0.7, 0.125, 1); // aproximação da curva 7 que o UIKit usa no teclado
const clamp = (v) => Math.max(0, Math.min(1, v));
const prog = (t, ini, dur) => clamp((t - ini) / dur);

/* ---------- roteiro ---------- */
// abertura: o vídeo nasce no degradê vazio e a Início se monta (a folha sobe, o topo entra em cascata) —
// é o mesmo estado em que o fim apaga, então o loop emenda sem corte
const MONTA = 0.25;
const TOQUE = 4.4;          // dedo encosta no Antecipar (a Início fica montada e parada uns 3 s, pra ser lida)
const T0 = TOQUE + 0.3;     // começa a transição logo depois que o botão volta
// padrão do vídeo inteiro: tudo que ENTRA sobe 16 pt com fade (ENTRADA, 0,65 s, cascata de 70 ms);
// tudo que SAI só apaga, no lugar, sem movimento (0,22 s). Folha e teclado são superfícies: deslizam.
const SAIDA = 0.22;
const SOBE = 16;
const apaga = (t, a) => 1 - ENTRADA(prog(t, a, SAIDA));
const FOLHA_DUR = 0.65;
const ENTRA = T0 + 0.2;     // a tela nova já começa a subir com a folha descendo (sem roxo vazio no meio)
const PASSO = 0.07;
const SUBIDA = 0.65;
// teclado: o campo já abre focado; o teclado sobe logo depois do título, pra não brigar com ele
const TECLADO_SOBE = ENTRA + 0.3;
const TECLADO_DUR = 0.4;    // o iOS usa ~0,25 s; mais longo pra ler no vídeo
// digitação: máscara de moeda, os dígitos entram pela direita (0,05 → 0,50 → 5,00 → 50,00 → 500,00)
const DIGITA = TECLADO_SOBE + TECLADO_DUR + 0.7;
// ritmo de dedo de verdade: o 1º intervalo é o mais longo (achando o 0), depois acelera
const TOQUES = [0, 0.3, 0.52, 0.74, 0.95];
const VALORES = ['R$ 0,00', 'R$ 0,05', 'R$ 0,50', 'R$ 5,00', 'R$ 50,00', 'R$ 500,00'];
const DIGITOS = ['5', '0', '0', '0', '0'];
const FIM_DIGITA = DIGITA + TOQUES[TOQUES.length - 1];
// depois do valor, o teclado desce e o resumo e o Confirmar entram: "agora confere"
const TECLADO_DESCE = FIM_DIGITA + 0.7;
const REVISA = TECLADO_DESCE + 0.12;   // com o teclado já uns 40% pra baixo
// confirmar: aperta, carrega um instante e vira sucesso
const CONFIRMA = REVISA + 2.5;          // ~1,7 s com o resumo parado, pra ler Conta/Prazo/Taxa
const CARREGA = CONFIRMA + 0.2;
const SUCESSO = CARREGA + 1.4;    // fecha (0,56 s) e os dois círculos giram uns 0,8 s antes do check
// voltar ao início: aperta, o sucesso apaga, a folha sobe de volta, a Início se remonta e o saldo desce
const VOLTAR = SUCESSO + 3.6;
const RETORNO = VOLTAR + 0.3;
const CONTA = RETORNO + 1.35;          // um respiro com a Início já montada antes do saldo descer
const CONTA_DUR = 1.1;
const RESET = CONTA + CONTA_DUR + 2.2; // segura o saldo novo e apaga tudo até o degradê vazio
const CICLO = RESET + 0.6;
const QUIQUE = bezier(0.34, 1.56, 0.64, 1);  // passa um pouco do tamanho e volta
const FECHA = bezier(0.65, 0, 0.25, 1);      // o botão fechando: segura um instante e recolhe
const SALDO = 2850, ANTECIPADO = 500;
const reais = (v) => 'R$ ' + Math.round(v).toLocaleString('pt-BR') + ',00';

// tudo que entra usa a mesma subida curta com fade, em cascata
const entradas = [
  ['val-nav', ENTRA, 16], ['val-pergunta', ENTRA + PASSO, 16], ['val-disponivel', ENTRA + 2 * PASSO, 16],
  ['val-valor', ENTRA + 3 * PASSO, 16],
  ['val-card', REVISA, SOBE], ['val-linhas', REVISA + 0.04, SOBE], ['val-botao', REVISA + 2 * PASSO, SOBE],
];
const saidas = ['ini-header', 'ini-saldo', 'ini-valor', 'ini-botao', 'ini-dias'];
// ordem na cascata, de cima pra baixo (o valor do saldo entra junto com o bloco dele)
const ORDEM_INI = { 'ini-header': 0, 'ini-saldo': 1, 'ini-valor': 1, 'ini-botao': 2, 'ini-dias': 3 };
const el = Object.fromEntries([...root.querySelectorAll('#am-app img, #am-val-valor, #am-ini-valor, #am-ini-dias')].map((n) => [n.id.slice(3), n]));
const valorTxt = $('valor-txt'), cursor = $('cursor'), teclado = $('teclado');

function quadro(tAbs) {
  const t = tAbs % CICLO;
  const volta = 1 - apaga(t, RETORNO);              // 0 → 1: o sucesso (e o que restou da tela de valor) apaga
  const reset = SUAVE(prog(t, RESET, 0.5));          // 0 → 1: tudo apaga até o degradê vazio do começo

  // fundo: o roxo já está atrás; só troca de um degradê pro outro na ida e na volta
  el['val-bg'].style.opacity = SUAVE(prog(t, T0, 0.9)) * (1 - SUAVE(prog(t, RETORNO, 0.7)));

  // toque no Antecipar: sem círculo, só o botão afundando e clareando um pouco, como o iOS faz
  const aperto = SUAVE(prog(t, TOQUE, 0.08)) * (1 - SUAVE(prog(t, TOQUE + 0.14, 0.18)));
  el['ini-botao'].style.transformOrigin = '187.5px 280px';

  // a Início se monta (na abertura e na volta) com a mesma subida em cascata do resto do vídeo, e na ida
  // só apaga, no lugar (subir contra a folha que desce rasgava a tela)
  const s = 1 - apaga(t, T0);
  saidas.forEach((id, i) => {
    const ordem = ORDEM_INI[id];
    const monta = t < RETORNO ? ENTRADA(prog(t, MONTA + 0.2 + ordem * PASSO, SUBIDA))
                              : ENTRADA(prog(t, RETORNO + 0.25 + ordem * PASSO, SUBIDA));
    const visivel = t < RETORNO ? monta * (1 - s) : monta;
    el[id].style.opacity = visivel * (1 - reset) * (id === 'ini-botao' ? 1 - 0.25 * aperto : 1);
    el[id].style.transform = `translateY(${SOBE * (1 - monta)}px)` + (id === 'ini-botao' ? ` scale(${1 - 0.04 * aperto})` : '');
  });
  // barra dos dias: enche de 0 até 16/22 logo depois de entrar (na abertura e na volta)
  const montaDias = (t < RETORNO ? MONTA + 0.2 : RETORNO + 0.25) + 3 * PASSO + 0.15;
  $('dias-barra').style.width = 238 * SUAVE(prog(t, montaDias, 1.3)) + 'px';
  // saldo: 2.850 até voltar; com a Início montada de novo, conta até 2.350 (de real em real, sem centavos rolando)
  $('ini-valor').textContent = reais(SALDO - ANTECIPADO * SUAVE(prog(t, CONTA, CONTA_DUR)));

  // folha e tab bar (uma camada só, pra o desfoque da tab bar sair certo): sobe na abertura, desce e sai
  // pela base na ida, e sobe de volta no retorno
  const f = t < T0 ? 1 - ENTRADA(prog(t, MONTA, FOLHA_DUR))
          : t < RETORNO ? FOLHA(prog(t, T0, FOLHA_DUR))
          : 1 - ENTRADA(prog(t, RETORNO + 0.05, FOLHA_DUR));
  for (const id of ['ini-folha-fundo', 'ini-tabbar']) {
    el[id].style.transform = `translateY(${480 * f}px)`;
    el[id].style.opacity = 1 - reset;
  }
  // conteúdo da folha: quando ela sobe, cada bloco chega um passo atrás (Em andamento, cards, Documentos)
  const sobeFolha = t < T0 ? MONTA : RETORNO + 0.05;
  ['ini-folha-a', 'ini-folha-b', 'ini-folha-c'].forEach((id, i) => {
    const p = t >= T0 && t < RETORNO ? 1 : ENTRADA(prog(t, sobeFolha + 0.22 + i * PASSO, SUBIDA));
    el[id].style.transform = `translateY(${480 * f + SOBE * (1 - p)}px)`;
    el[id].style.opacity = p * (1 - reset);
  });

  // tela de valor: cada bloco sobe e aparece, em cascata
  for (const [id, ini, dist] of entradas) {
    const p = ENTRADA(prog(t, ini, SUBIDA));
    el[id].style.opacity = p * (1 - volta);
    el[id].style.transform = `translateY(${dist * (1 - p)}px)`;
  }

  // teclado: desliza da base, sem fade, com a curva do teclado do iOS nos dois sentidos
  const sobe = TECLADO_IOS(prog(t, TECLADO_SOBE, TECLADO_DUR));
  const desce = TECLADO_IOS(prog(t, TECLADO_DESCE, TECLADO_DUR));
  teclado.style.transform = `translateY(${300 * (1 - sobe + desce)}px)`;
  teclado.style.opacity = 1 - volta;
  // tecla apertada: fica no cinza do fundo do teclado por um instante a cada dígito
  let apertada = null;
  DIGITOS.forEach((d, i) => { const a = DIGITA + TOQUES[i]; if (t >= a - 0.02 && t < a + 0.1) apertada = d; });
  $('tecla-5').style.opacity = apertada === '5' ? 1 : 0;
  $('tecla-0').style.opacity = apertada === '0' ? 1 : 0;

  // digitação: o campo abre em "R$ 0,00" e os dígitos entram pela direita
  const teclas = TOQUES.filter((d) => t >= DIGITA + d).length;
  valorTxt.textContent = VALORES[teclas];
  // cursor pisca parado, fica aceso enquanto digita e some quando o teclado recolhe
  const digitando = t >= DIGITA - 0.05 && t < FIM_DIGITA + 0.3;
  const focado = t < TECLADO_DESCE;
  cursor.style.opacity = focado && (digitando || Math.floor((t - ENTRA) / 0.5) % 2 === 0) ? 1 : 0;

  // a linha do valor se desenha da esquerda pra direita
  const l = ENTRADA(prog(t, ENTRA + 3.5 * PASSO, 0.8));
  el['val-linha'].style.opacity = (l > 0 ? 1 : 0) * (1 - volta);
  el['val-linha'].style.clipPath = `inset(0 ${(1 - l) * 100}% 0 0)`;

  sucesso(t, volta);
}

/* ---------- confirmar → sucesso ---------- */
const sucEl = Object.fromEntries(['btn-fundo', 'suc-circulo', 'suc-check', 'suc-brilho'].map((id) => [id, $(id)]));
// linhas dos cards em cascata, uma por vez: cada linha é a mesma imagem recortada na faixa dela
function fatiar(id, faixas) {
  const base = el[id];
  const partes = faixas.map(([a, b]) => {
    const c = base.cloneNode(); c.removeAttribute('id');
    c.style.clipPath = `inset(${a}px 0 ${812 - b}px 0)`; base.after(c); return c;
  });
  base.style.visibility = 'hidden';
  return partes;
}
const linhasResumo = fatiar('val-linhas', [[494, 557], [557, 617], [617, 682]]); // Conta, Prazo, Taxa
const linhasSucesso = fatiar('suc-lista', [[392, 448], [448, 504]]);              // conta, aviso
function sucesso(t, volta) {
  const vivo = 1 - volta;
  // aperto no Confirmar e, depois, no Voltar ao início (o mesmo do Antecipar)
  const apertoEm = (a) => SUAVE(prog(t, a, 0.08)) * (1 - SUAVE(prog(t, a + 0.14, 0.18)));
  const aperto = t < VOLTAR - 0.05 ? apertoEm(CONFIRMA) : apertoEm(VOLTAR);
  const escala = `scale(${1 - 0.04 * aperto})`;
  for (const n of [el['val-botao'], el['suc-botao']]) n.style.transformOrigin = '187.5px 730px';
  sucEl['btn-fundo'].style.transformOrigin = 'center';   // esse é do tamanho do botão, não da tela
  // o texto apaga e o botão fecha: a pílula encolhe até um círculo de 32 no centro
  const someTexto = prog(t, CARREGA, 0.12);
  el['val-botao'].style.opacity = Number(el['val-botao'].style.opacity) * (1 - someTexto);
  el['val-botao'].style.transform = escala;
  const fecha = FECHA(prog(t, CARREGA + 0.06, 0.5));
  const larg = 327 - (327 - 32) * fecha, alt = 48 - (48 - 32) * fecha;
  const fundo = sucEl['btn-fundo'];
  Object.assign(fundo.style, { left: 187.5 - larg / 2 + 'px', top: 730 - alt / 2 + 'px', width: larg + 'px', height: alt + 'px',
    borderRadius: alt / 2 + 'px' });
  // carregando: o círculo respira (encolhe 10% e volta, ~1,4 vez por segundo) e, quando o sucesso entra,
  // encolhe e some no lugar — o check estoura lá em cima
  const fim = SUAVE(prog(t, SUCESSO - 0.05, 0.3));
  const respira = t > CARREGA + 0.56 ? 0.05 * (1 - Math.cos((t - CARREGA - 0.56) * 9)) : 0;
  fundo.style.opacity = (t >= CONFIRMA ? 1 - fim : 0) * vivo;
  fundo.style.transform = t < CARREGA ? escala : `scale(${(1 - respira) * (1 - 0.7 * fim)})`;

  // a tela de valor sai: o topo, a linha do campo e o card de resumo apagam
  const sai = apaga(t, SUCESSO);
  for (const id of ['val-nav', 'val-pergunta', 'val-disponivel', 'val-linha', 'val-card'])
    el[id].style.opacity = Number(el[id].style.opacity) * sai;
  // linhas do resumo: entram uma a uma depois do card e saem junto com ele
  linhasResumo.forEach((n, i) => {
    const p = ENTRADA(prog(t, REVISA + (i + 1) * PASSO, SUBIDA));
    n.style.opacity = p * sai * vivo;
    n.style.transform = `translateY(${SOBE * (1 - p)}px)`;
  });
  // o valor fica parado: o sucesso se monta em volta dele

  // check: o círculo estoura com um quique e o traço se desenha logo depois do pico
  const pop = prog(t, SUCESSO + 0.2, 0.5);   // só depois que a pergunta já saiu do lugar dele
  sucEl['suc-circulo'].style.opacity = (pop > 0 ? 1 : 0) * vivo;
  sucEl['suc-circulo'].style.transform = `scale(${QUIQUE(pop)})`;
  // brilho atrás do check: acende com o estouro e assenta fraquinho
  const acende = SUAVE(prog(t, SUCESSO + 0.2, 0.3)), assenta = SUAVE(prog(t, SUCESSO + 0.5, 1.2));
  sucEl['suc-brilho'].style.opacity = acende * (1 - 0.6 * assenta) * vivo;
  sucEl['suc-brilho'].style.transform = `scale(${0.6 + 0.4 * QUIQUE(pop)})`;
  sucEl['suc-check'].setAttribute('stroke-dashoffset', String(1 - SUAVE(prog(t, SUCESSO + 0.55, 0.32))));

  // texto, card e botão entram em cascata, como o resto do vídeo
  // (as camadas foram exportadas com o valor em 296; o valor ficou em 312, então tudo desce 16)
  for (const [id, atraso, dist] of [['suc-titulo', 0.4, SOBE], ['suc-card', 0.54, SOBE]]) {
    const p = ENTRADA(prog(t, SUCESSO + atraso, SUBIDA));
    el[id].style.opacity = p * vivo;
    el[id].style.transform = `translateY(${16 + dist * (1 - p)}px)`;
  }
  linhasSucesso.forEach((n, i) => {
    const p = ENTRADA(prog(t, SUCESSO + 0.62 + i * 0.07, SUBIDA));
    n.style.opacity = p * vivo;
    n.style.transform = `translateY(${16 + SOBE * (1 - p)}px)`;
  });
  const pb = ENTRADA(prog(t, SUCESSO + 0.76, SUBIDA));
  el['suc-botao'].style.opacity = pb * vivo;
  el['suc-botao'].style.transform = `translateY(${SOBE * (1 - pb)}px) ` + escala;


  confete(t - (SUCESSO + 0.25), vivo);   // começa a cair junto com o estouro do check
}

/* ---------- confete: cai do alto, balança, gira e vira de face (como o da referência do Flo) ---------- */
const CORES = ['#FFFFFF', '#FAB8E0', '#C7B8FF', '#FFDB94', '#FC99A8', '#FFFFFF'];
let semente = 7;
const rnd = () => (semente = (semente * 16807) % 2147483647) / 2147483647;
const pedacos = Array.from({ length: 48 }, () => {
  const tipo = rnd();
  const p = {
    nasce: rnd() * 0.9,                 // não sai tudo junto
    x0: rnd() * 375, y0: -12 - rnd() * 70, // logo acima da borda: aparece junto com o estouro
    vy: 90 + rnd() * 110,               // queda lenta, de papel
    g: 18 + rnd() * 30,
    deriva: (rnd() - 0.5) * 40,
    balanco: 10 + rnd() * 18, freq: 2 + rnd() * 2.5, fase: rnd() * 6.3,
    giro: (rnd() - 0.5) * 540, rot0: rnd() * 360,
    vira: 3 + rnd() * 6, faseV: rnd() * 6.3,
    w: tipo < 0.6 ? 10 + rnd() * 7 : 7 + rnd() * 5, h: tipo < 0.6 ? 5 + rnd() * 4 : 7 + rnd() * 5,
    forma: tipo < 0.6 ? 'papel' : tipo < 0.85 ? 'triangulo' : 'ponto',
    cor: CORES[Math.floor(rnd() * CORES.length)],
  };
  const n = document.createElement('i');
  n.style.width = p.w + 'px'; n.style.height = (p.forma === 'ponto' ? p.w * 0.6 : p.h) + 'px';
  n.style.background = p.cor;
  if (p.forma === 'papel') n.style.borderRadius = '1.5px';
  if (p.forma === 'ponto') { n.style.borderRadius = '50%'; n.style.height = n.style.width = p.w * 0.6 + 'px'; }
  if (p.forma === 'triangulo') n.style.clipPath = 'polygon(50% 0, 100% 100%, 0 100%)';
  $('confete').appendChild(n);
  p.el = n;
  return p;
});
function confete(tc, vivo) {
  for (const p of pedacos) {
    const u = tc - p.nasce;
    if (u <= 0 || vivo <= 0) { p.el.style.opacity = 0; continue; }
    const x = p.x0 + p.deriva * u + p.balanco * Math.sin(p.freq * u + p.fase);
    const y = p.y0 + p.vy * u + p.g * u * u;
    const face = Math.cos(p.vira * u + p.faseV);           // a face virando: achata no eixo
    const somePerto = 1 - clamp((y - 700) / 120);
    p.el.style.opacity = Math.min(1, u * 6) * somePerto * vivo;
    p.el.style.transform = `translate(${x}px, ${y}px) rotate(${p.rot0 + p.giro * u}deg) scaleX(${0.15 + 0.85 * Math.abs(face)})`;
  }
}


  return { quadro, CICLO, SUCESSO, TOQUE };
}
