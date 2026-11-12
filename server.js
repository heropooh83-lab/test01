/* 빨간 벽 허물기 수업 서버
 * 외부 패키지 없이 Node.js(18 이상)만으로 동작합니다.
 * 실행: node server.js   (포트 바꾸기: PORT=8080 node server.js)
 * 학생들이 쌓은 벽돌·이모티콘 작품·다짐은 data.json 파일에 저장됩니다. */
"use strict";
const http = require("http");
const fs = require("fs");
const path = require("path");
const os = require("os");

const PORT = Number(process.env.PORT) || 3000;
const DATA_FILE = process.env.DATA_FILE || path.join(__dirname, "data.json");
const PUBLIC = path.join(__dirname, "public");
const ADMIN_PIN = process.env.ADMIN_PIN || "";      /* 설정하면 "결과 지우기"(삭제)에 교사 PIN이 필요해요 */
const MAX_DOCS = 20000;                              /* 저장할 수 있는 문서 수 상한 */
const RATE_PER_MIN = 240;                            /* 한 주소에서 1분에 보낼 수 있는 쓰기 요청 수 */
const hits = new Map();
function limited(req) {
  const ip = String(req.headers["x-forwarded-for"] || req.socket.remoteAddress || "").split(",")[0].trim();
  const now = Date.now(); let h = hits.get(ip);
  if (!h || now - h.t > 60000) { h = { t: now, n: 0 }; hits.set(ip, h); }
  h.n++;
  if (hits.size > 5000) for (const [k, v] of hits) if (now - v.t > 60000) hits.delete(k);
  return h.n > RATE_PER_MIN;
}

/* 문서 저장소: 경로(예: classes/5-1/bricks/b123) -> JSON 객체 */
let store = {};
try { store = JSON.parse(fs.readFileSync(DATA_FILE, "utf8")); } catch (e) { store = {}; }
let saveTimer = null;
function persist() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    const tmp = DATA_FILE + ".tmp";
    try { fs.writeFileSync(tmp, JSON.stringify(store)); fs.renameSync(tmp, DATA_FILE); }
    catch (e) { console.error("저장 실패:", e.message); }
  }, 300);
}

const SEG = /^[A-Za-z0-9_\-.~:@+]{1,200}$/;
function goodPath(p, wantDoc) {
  if (typeof p !== "string" || p.length > 1000) return false;
  const parts = p.split("/");
  if (parts.length > 16 || parts.some(s => s === "." || s === ".." || !SEG.test(s))) return false;
  return wantDoc ? parts.length % 2 === 0 : parts.length % 2 === 1;
}
function listDocs(col) {
  const prefix = col + "/", depth = col.split("/").length + 1, out = [];
  for (const k of Object.keys(store)) {
    if (k.startsWith(prefix) && k.split("/").length === depth) out.push({ id: k.slice(prefix.length), data: store[k] });
  }
  return out;
}

function send(res, code, body, type) {
  const buf = Buffer.isBuffer(body) ? body : Buffer.from(typeof body === "string" ? body : JSON.stringify(body));
  res.writeHead(code, { "Content-Type": type || "application/json; charset=utf-8", "Content-Length": buf.length, "Cache-Control": "no-store" });
  res.end(buf);
}
function readBody(req) {
  return new Promise((resolve, reject) => {
    let n = 0; const chunks = [];
    req.on("data", c => { n += c.length; if (n > 1024 * 1024) { reject(new Error("too_large")); req.destroy(); } else chunks.push(c); });
    req.on("end", () => { try { resolve(JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}")); } catch (e) { reject(new Error("bad_json")); } });
    req.on("error", reject);
  });
}
const bad = (res, msg) => send(res, 400, { code: "invalid_argument", error: msg });

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://x");
  try {
    if (url.pathname === "/api/health") return send(res, 200, { ok: true, docs: Object.keys(store).length });
    if (url.pathname === "/api/list" && req.method === "GET") {
      const p = url.searchParams.get("path");
      if (!goodPath(p, false)) return bad(res, "path");
      return send(res, 200, { docs: listDocs(p) });
    }
    if (url.pathname === "/api/doc" && req.method === "GET") {
      const p = url.searchParams.get("path");
      if (!goodPath(p, true)) return bad(res, "path");
      return send(res, 200, { exists: p in store, data: store[p] || null });
    }
    if (url.pathname === "/api/config") return send(res, 200, { pin: !!ADMIN_PIN });
    if (url.pathname.startsWith("/api/") && req.method === "POST") {
      if (limited(req)) return send(res, 429, { code: "resource_exhausted", error: "too_many_requests" });
      const b = await readBody(req);
      const op = url.pathname.slice(5);
      if (!goodPath(b.path, true)) return bad(res, "path");
      if (op === "set" || op === "update") {
        if (!b.data || typeof b.data !== "object" || Array.isArray(b.data)) return bad(res, "data");
        if (JSON.stringify(b.data).length > 256 * 1024) return bad(res, "too_large");
        if (!(b.path in store) && Object.keys(store).length >= MAX_DOCS) return send(res, 507, { code: "quota_exceeded", error: "full" });
        if (op === "update") {
          if (!(b.path in store)) return bad(res, "not_found");
          store[b.path] = Object.assign({}, store[b.path], b.data);
        } else store[b.path] = b.data;
      } else if (op === "delete") {
        if (ADMIN_PIN && b.pin !== ADMIN_PIN) return send(res, 403, { code: "forbidden", error: "pin" });
        delete store[b.path];
      }
      else return send(res, 404, { error: "unknown" });
      persist();
      return send(res, 200, { ok: true });
    }
    if (req.method === "GET" && (url.pathname === "/" || url.pathname === "/index.html")) {
      return send(res, 200, fs.readFileSync(path.join(PUBLIC, "index.html")), "text/html; charset=utf-8");
    }
    send(res, 404, { error: "not_found" });
  } catch (e) {
    send(res, 500, { code: "unavailable", error: String(e.message || e) });
  }
});
server.listen(PORT, "0.0.0.0", () => {
  console.log("\n빨간 벽 허물기 수업 서버가 켜졌어요.\n");
  console.log("  이 컴퓨터에서:  http://localhost:" + PORT);
  const nets = os.networkInterfaces();
  for (const n of Object.keys(nets)) for (const a of nets[n]) if (a.family === "IPv4" && !a.internal) console.log("  학생 기기에서:  http://" + a.address + ":" + PORT + "   (" + n + ")");
  console.log("\n끄려면 Ctrl+C 를 누르세요. 저장 파일: " + DATA_FILE + "\n");
});
process.on("SIGINT", () => { try { fs.writeFileSync(DATA_FILE, JSON.stringify(store)); } catch (e) {} process.exit(0); });
