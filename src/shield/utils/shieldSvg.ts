import type { ShieldShape } from '../types';
import { shapeFor } from './shape';

const W = 440;
const H = 528;

const escapeXml = (s: string): string =>
  String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c] as string);

/**
 * SVG에는 자동 줄바꿈이 없어 직접 자른다.
 * 한 줄 최대 `max`글자를 넘지 않게 하되, 공백이 있으면 낱말 경계에서 끊는다.
 * (원본은 글자 수만 세어 영어 단어 한가운데를 잘랐다.)
 */
function wrapText(text: string, max: number): string[] {
  const lines: string[] = [];
  let line = '';

  const flush = () => {
    if (line) lines.push(line);
    line = '';
  };

  for (const word of text.split(/\s+/).filter(Boolean)) {
    let w = word;
    // 공백 없이 max를 넘는 긴 덩어리는 그대로 잘라 넣는다.
    while (w.length > max) {
      flush();
      lines.push(w.slice(0, max));
      w = w.slice(max);
    }
    const candidate = line ? `${line} ${w}` : w;
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

  let y = 182;
  const ruleSvg = rules
    .slice(0, 5)
    .map((rule) => {
      const lines = wrapText(rule, 20);
      const block = lines
        .map(
          (ln, i) =>
            `<text x="${i === 0 ? 92 : 104}" y="${y + i * 20}" fill="#eaf0ff" font-size="16" font-family="'Malgun Gothic',sans-serif">${i === 0 ? '◆ ' : ''}${escapeXml(ln)}</text>`,
        )
        .join('');
      y += lines.length * 20 + 8;
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
