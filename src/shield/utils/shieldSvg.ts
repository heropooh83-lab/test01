import type { ShieldShape } from '../types';
import { shapeFor } from './shape';

const W = 440;
const H = 528;

const escapeXml = (s: string): string =>
  String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c] as string);

/**
 * 글자를 사람이 보는 한 덩어리 단위로 센다.
 *
 * JS의 `String.length`와 `slice`는 UTF-16 단위라서 이모지 한 글자를 반으로 쪼갠다.
 * 자를 위치가 하필 그 사이에 떨어지면 저장한 PNG에 깨진 글자가 남는다.
 * `Intl.Segmenter`가 있으면 자소 덩어리(🧑‍🤝‍🧑 같은 결합 이모지도 한 글자)로,
 * 없으면 코드포인트 단위로 물러선다. (원본도 코드포인트 단위로 셌다.)
 */
const graphemes: (s: string) => string[] =
  typeof Intl !== 'undefined' && 'Segmenter' in Intl
    ? ((seg) => (s: string) => [...seg.segment(s)].map((g) => g.segment))(
        new Intl.Segmenter(undefined, { granularity: 'grapheme' }),
      )
    : (s: string) => [...s];

/**
 * SVG에는 자동 줄바꿈이 없어 직접 자른다.
 * 한 줄 최대 `max`글자를 넘지 않게 하되, 공백이 있으면 낱말 경계에서 끊는다.
 * (원본은 낱말을 무시하고 세어 영어 단어 한가운데를 잘랐다.)
 */
function wrapText(text: string, max: number): string[] {
  const lines: string[] = [];
  let line: string[] = [];

  const flush = () => {
    if (line.length) lines.push(line.join(''));
    line = [];
  };

  for (const word of text.split(/\s+/).filter(Boolean)) {
    let w = graphemes(word);
    // 공백 없이 max를 넘는 긴 덩어리는 글자 경계에서 잘라 넣는다.
    while (w.length > max) {
      flush();
      lines.push(w.slice(0, max).join(''));
      w = w.slice(max);
    }
    const candidate = line.length ? [...line, ' ', ...w] : w;
    if (candidate.length > max) {
      flush();
      line = w;
    } else {
      line = candidate;
    }
  }
  flush();
  return lines.length ? lines : [''];
}

/** 모둠 이름이 파일 이름에 그대로 들어가므로 경로·금지 문자만 걷어낸다. */
function safeFilePart(name: string): string {
  const cleaned = name.replace(/[\\/:*?"<>|]/g, '').trim();
  return cleaned || '우리모둠';
}

/**
 * 방패를 SVG 문자열로 만든다. 화면용 DOM 방패와 같은 모양을 그리지만,
 * 이쪽은 PNG 저장처럼 DOM 밖으로 나가야 하는 용도에 쓴다.
 */
export function buildShieldSvg(name: string, rules: string[], shape?: ShieldShape): string {
  const shp = shape ?? shapeFor(name);
  const list = rules.slice(0, 5);

  /**
   * 글자 크기를 16px부터 한 단계씩 낮추며, 규칙 전체가 도형의 안전 영역
   * (safeRatio 아래는 방패가 좁아져 글자가 잘린다) 안에 들어오는 첫 크기를 고른다.
   * 크기를 줄이면 한 줄에 들어가는 글자 수가 늘어 줄 수도 함께 줄어든다.
   */
  const START_Y = 182;
  const safeBottom = H * shp.safeRatio;
  let fontSize = 16;
  let wrapped: string[][] = [];
  for (let size = 16; size >= 9; size -= 0.5) {
    fontSize = size;
    wrapped = list.map((rule) => wrapText(rule, Math.round((20 * 16) / size)));
    const lineCount = wrapped.reduce((n, lines) => n + lines.length, 0);
    const needed = lineCount * size * 1.25 + Math.max(0, wrapped.length - 1) * size * 0.5;
    if (START_Y + needed <= safeBottom) break;
  }

  const lineHeight = fontSize * 1.25;
  let y = START_Y;
  const ruleSvg = wrapped
    .map((lines) => {
      const block = lines
        .map(
          (ln, i) =>
            `<text x="${i === 0 ? 92 : 92 + fontSize * 0.75}" y="${y + i * lineHeight}" fill="#eaf0ff" font-size="${fontSize}" font-family="'Malgun Gothic',sans-serif">${i === 0 ? '◆ ' : ''}${escapeXml(ln)}</text>`,
        )
        .join('');
      y += lines.length * lineHeight + fontSize * 0.5;
      return block;
    })
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd873"/><stop offset=".55" stop-color="#e7b53f"/><stop offset="1" stop-color="#b6841f"/></linearGradient>
    <linearGradient id="navy" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a4d8f"/><stop offset=".46" stop-color="#243268"/><stop offset="1" stop-color="#161f45"/></linearGradient>
  </defs>
  <polygon points="${shp.outer}" fill="url(#gold)"/>
  <polygon points="${shp.inner}" fill="url(#navy)"/>
  <polygon points="${shp.frame}" fill="none" stroke="rgba(255,216,115,.5)" stroke-width="1.5"/>
  <text x="220" y="112" text-anchor="middle" font-size="40">${shp.crest}</text>
  <text x="220" y="150" text-anchor="middle" fill="#ffd873" font-size="22" font-weight="bold" font-family="'Malgun Gothic',sans-serif">${escapeXml(name)}</text>
  <line x1="70" y1="164" x2="370" y2="164" stroke="rgba(255,216,115,.35)" stroke-width="1"/>
  ${ruleSvg}
</svg>`;
}

/**
 * SVG를 2배 캔버스에 그려 PNG로 내려받는다.
 * 흐름: SVG 문자열 → Blob URL → Image → canvas(2x) → toBlob → <a download> 클릭.
 * 외부 리소스를 참조하지 않으므로 캔버스가 오염되지 않아 toBlob이 막히지 않는다.
 */
export function downloadShieldPng(name: string, rules: string[], shape?: ShieldShape): Promise<void> {
  return new Promise((resolve, reject) => {
    const svg = buildShieldSvg(name, rules, shape);
    const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }));
    const img = new Image();

    img.onload = () => {
      const scale = 2;
      const canvas = document.createElement('canvas');
      canvas.width = W * scale;
      canvas.height = H * scale;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error('canvas 2d context unavailable'));
        return;
      }
      ctx.scale(scale, scale);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, W, H);
      ctx.drawImage(img, 0, 0, W, H);
      URL.revokeObjectURL(url);

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('toBlob returned null'));
          return;
        }
        const href = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = href;
        a.download = `안전방패_${safeFilePart(name)}.png`;
        // 문서에 붙였다 떼야 파일 이름이 붙는 브라우저가 있다.
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(href), 1000);
        resolve();
      }, 'image/png');
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('SVG image failed to load'));
    };

    img.src = url;
  });
}
