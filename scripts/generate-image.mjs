#!/usr/bin/env node
/**
 * Generic TopView text-to-image helper. Submits a task, polls until done,
 * verifies the downloaded file is a real image (not empty/corrupt/truncated),
 * and retries once with a fresh generation if verification fails.
 *
 * Usage:
 *   node generate-image.mjs "<prompt>" <outPath> \
 *     [--model "GPT Image 2"] [--aspect 16:9] [--resolution 1K] [--count 1] [--retries 1]
 *
 * Env (or a local .env in the cwd):
 *   TOPVIEW_API_KEY   required
 *   TOPVIEW_UID       required (the Topview-Uid header)
 *   TOPVIEW_API_BASE  optional, default https://api.topview.ai
 *   TOPVIEW_MODEL     optional default model (overridden by --model)
 *
 * Exit codes: 0 = verified image written, 2 = missing credentials, 1 = error after retries.
 */
import { writeFileSync, readFileSync, statSync } from 'node:fs';

// Load a local .env if present (no dependency)
try {
  for (const line of readFileSync('.env', 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
  }
} catch { /* no .env */ }

const API_KEY = process.env.TOPVIEW_API_KEY;
const UID = process.env.TOPVIEW_UID;
const BASE = (process.env.TOPVIEW_API_BASE || 'https://api.topview.ai').replace(/\/$/, '');

// arg parsing
const args = process.argv.slice(2);
const flags = {};
const positional = [];
for (let i = 0; i < args.length; i++) {
  if (args[i].startsWith('--')) flags[args[i].slice(2)] = args[++i];
  else positional.push(args[i]);
}
const [prompt, outPath] = positional;
const model = flags.model || process.env.TOPVIEW_MODEL || 'GPT Image 2';
const aspectRatio = flags.aspect || '16:9';
const resolution = flags.resolution || '1K';
const generateCount = Number(flags.count || 1);
const maxRetries = Number(flags.retries ?? 1);
const MIN_BYTES = 20_000; // a real photo/illustration at 1K+ is always well above this

if (!prompt || !outPath) {
  console.error('Usage: node generate-image.mjs "<prompt>" <outPath> [--model X] [--aspect 16:9] [--resolution 1K] [--count 1] [--retries 1]');
  process.exit(1);
}
if (!API_KEY || !UID) {
  console.error('SKIP: TOPVIEW_API_KEY / TOPVIEW_UID not set.');
  process.exit(2);
}

const headers = {
  Authorization: `Bearer ${API_KEY}`,
  'Topview-Uid': UID,
  'Content-Type': 'application/json',
};
const ok = (j) => j && (j.code === '200' || j.code === 200);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function submit() {
  const res = await fetch(`${BASE}/v1/common_task/text2image/task/submit`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ model, prompt, aspectRatio, resolution, generateCount }),
  });
  const json = await res.json();
  if (!ok(json) || !json.result?.taskId) throw new Error(`submit failed: ${JSON.stringify(json)}`);
  return json.result.taskId;
}

async function poll(taskId) {
  const deadline = Date.now() + 5 * 60 * 1000;
  while (Date.now() < deadline) {
    const res = await fetch(`${BASE}/v1/common_task/text2image/task/query?taskId=${encodeURIComponent(taskId)}`, { headers });
    const r = (await res.json()).result || {};
    if (String(r.status).toLowerCase() === 'success') {
      const img = (r.images || []).find((i) => String(i.status).toLowerCase() === 'success' && i.filePath);
      if (img) return img;
      throw new Error(`success but no usable image: ${JSON.stringify(r)}`);
    }
    if (String(r.status).toLowerCase() === 'fail') throw new Error(`task failed: ${r.errorMsg || JSON.stringify(r)}`);
    await sleep(4000);
  }
  throw new Error('timed out (5 min)');
}

// Basic verification: file exists, is above a sane minimum size, and has a
// valid image magic-byte header (PNG/JPEG). Catches truncated downloads,
// content-policy placeholder images, and zero-byte failures.
function verifyImage(path, expectedWidth, expectedHeight) {
  const stat = statSync(path);
  if (stat.size < MIN_BYTES) {
    return { ok: false, reason: `file too small (${stat.size} bytes, expected >= ${MIN_BYTES})` };
  }
  const buf = readFileSync(path, { flag: 'r' }).subarray(0, 8);
  const isPng = buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47;
  const isJpeg = buf[0] === 0xff && buf[1] === 0xd8;
  if (!isPng && !isJpeg) {
    return { ok: false, reason: 'not a valid PNG/JPEG header' };
  }
  if (expectedWidth && expectedHeight && (expectedWidth < 256 || expectedHeight < 256)) {
    return { ok: false, reason: `dimensions too small (${expectedWidth}x${expectedHeight})` };
  }
  return { ok: true };
}

async function generateOnce() {
  const taskId = await submit();
  console.error(`[topview] taskId=${taskId}, polling…`);
  const img = await poll(taskId);
  const buf = Buffer.from(await (await fetch(img.filePath)).arrayBuffer());
  writeFileSync(outPath, buf);
  const verdict = verifyImage(outPath, img.width, img.height);
  console.error(`[topview] saved ${outPath} (${buf.length} bytes, ${img.width}x${img.height}) - verify: ${verdict.ok ? 'PASS' : 'FAIL (' + verdict.reason + ')'}`);
  return verdict;
}

let attempt = 0;
let lastError = null;
while (attempt <= maxRetries) {
  attempt++;
  try {
    const verdict = await generateOnce();
    if (verdict.ok) {
      process.exit(0);
    }
    lastError = new Error(verdict.reason);
    console.error(`[topview] verification failed on attempt ${attempt}/${maxRetries + 1}, ${attempt <= maxRetries ? 'retrying...' : 'out of retries'}`);
  } catch (e) {
    lastError = e;
    console.error(`[topview] ERROR on attempt ${attempt}/${maxRetries + 1}:`, e.message);
  }
}

console.error('[topview] FAILED after all attempts:', lastError?.message);
process.exit(1);
