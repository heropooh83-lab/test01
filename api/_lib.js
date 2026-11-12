/* Vercel 서버리스 함수 공용 코드. 저장소는 Upstash Redis(REST)를 씁니다.
 * 환경변수: UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN (또는 KV_REST_API_URL / KV_REST_API_TOKEN)
 *           ADMIN_PIN (교사 PIN, 선택) */
"use strict";
const ADMIN_PIN = process.env.ADMIN_PIN || "";
const RURL = (process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || "").replace(/\/$/, "");
const RTOK = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || "";
const POLL_MS = Number(process.env.POLL_MS) || 4000;   /* 학생 기기가 새 소식을 확인하는 간격 */

const SEG = /^[A-Za-z0-9_\-.~:@+]{1,200}$/;
function goodPath(p, wantDoc) {
  if (typeof p !== "string" || p.length > 1000) return false;
  const parts = p.split("/");
  if (parts.length > 16 || parts.some(s => s === "." || s === ".." || !SEG.test(s))) return false;
  return wantDoc ? parts.length % 2 === 0 : parts.length % 2 === 1;
}
const dk = p => "rw:d:" + p;
const ik = col => "rw:i:" + col;
const split = p => { const i = p.lastIndexOf("/"); return { col: p.slice(0, i), id: p.slice(i + 1) }; };

async function redis(cmds) {
  if (!RURL || !RTOK) { const e = new Error("no_storage"); e.status = 503; e.code = "unavailable"; throw e; }
  const r = await fetch(RURL + "/pipeline", { method: "POST", headers: { Authorization: "Bearer " + RTOK, "Content-Type": "application/json" }, body: JSON.stringify(cmds) });
  const j = await r.json().catch(() => null);
  if (!r.ok || !Array.isArray(j)) { const e = new Error("storage_error"); e.status = 502; e.code = "unavailable"; throw e; }
  return j.map(x => { if (x && x.error) { const e = new Error(x.error); e.status = 502; e.code = "unavailable"; throw e; } return x.result; });
}
function parse(s) { try { return s ? JSON.parse(s) : null; } catch (e) { return null; } }

async function listMany(paths) {
  const members = await redis(paths.map(p => ["SMEMBERS", ik(p)]));
  const keys = [], owner = [];
  paths.forEach((p, i) => (members[i] || []).forEach(id => { keys.push(dk(p + "/" + id)); owner.push([p, id]); }));
  const lists = {}; paths.forEach(p => { lists[p] = []; });
  if (keys.length) {
    const vals = (await redis([["MGET", ...keys]]))[0] || [];
    vals.forEach((v, i) => { const d = parse(v); if (d) lists[owner[i][0]].push({ id: owner[i][1], data: d }); });
  }
  return lists;
}

function reply(res, code, body) { res.setHeader("Cache-Control", "no-store"); res.status(code).json(body); }
function fail(res, e) { reply(res, e.status || 500, { code: e.code || "unavailable", error: String(e.message || e) }); }
function query(req) { return new URL(req.url, "http://x").searchParams; }
function body(req) { let b = req.body; if (typeof b === "string") b = parse(b); return b && typeof b === "object" ? b : {}; }
const bad = (res, m) => reply(res, 400, { code: "invalid_argument", error: m });

const handlers = {
  config: (req, res) => reply(res, 200, { pin: !!ADMIN_PIN, storage: !!(RURL && RTOK), poll: POLL_MS }),
  health: (req, res) => reply(res, 200, { ok: true }),
  lists: async (req, res) => {
    try {
      const paths = String(query(req).get("paths") || "").split(",").filter(Boolean).slice(0, 10);
      for (const p of paths) if (!goodPath(p, false)) return bad(res, "path");
      reply(res, 200, { lists: await listMany(paths) });
    } catch (e) { fail(res, e); }
  },
  doc: async (req, res) => {
    try {
      const p = query(req).get("path");
      if (!goodPath(p, true)) return bad(res, "path");
      const d = parse((await redis([["GET", dk(p)]]))[0]);
      reply(res, 200, { exists: !!d, data: d });
    } catch (e) { fail(res, e); }
  },
  write: op => async (req, res) => {
    try {
      if (req.method !== "POST") return reply(res, 405, { error: "method" });
      const b = body(req);
      if (!goodPath(b.path, true)) return bad(res, "path");
      const { col, id } = split(b.path);
      if (op === "delete") {
        if (ADMIN_PIN && b.pin !== ADMIN_PIN) return reply(res, 403, { code: "forbidden", error: "pin" });
        await redis([["DEL", dk(b.path)], ["SREM", ik(col), id]]);
        return reply(res, 200, { ok: true });
      }
      if (!b.data || typeof b.data !== "object" || Array.isArray(b.data)) return bad(res, "data");
      let data = b.data;
      if (op === "update") {
        const cur = parse((await redis([["GET", dk(b.path)]]))[0]);
        if (!cur) return bad(res, "not_found");
        data = Object.assign({}, cur, b.data);
      }
      const s = JSON.stringify(data);
      if (s.length > 256 * 1024) return bad(res, "too_large");
      await redis([["SET", dk(b.path), s], ["SADD", ik(col), id]]);
      reply(res, 200, { ok: true });
    } catch (e) { fail(res, e); }
  }
};
module.exports = { handlers };
