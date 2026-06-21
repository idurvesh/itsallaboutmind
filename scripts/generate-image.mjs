#!/usr/bin/env node
/**
 * Generic TopView text-to-image helper. Submits a task, polls until done,
 * and downloads the first generated image to <outPath>.
 *
 * Usage:
 *   node topview-text2image.mjs "<prompt>" <outPath> \
 *     [--model "Seedream 5.0"] [--aspect 16:9] [--resolution 2K] [--count 1]
 *
 * Env (or a local .env in the cwd):
 *   TOPVIEW_API_KEY   required
 *   TOPVIEW_UID       required (the Topview-Uid header)
 *   TOPVIEW_API_BASE  optional, default https://api.topview.ai
 *   TOPVIEW_MODEL     optional default model (overridden by --model)
 *
 * Exit codes: 0 = image written, 2 = missing credentials, 1 = error.
 */
import { writeFileSync, readFileSync } from 'node:fs';

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
const resolution = flags.resolution || '2K';
const generateCount = Number(flags.count || 1);

if (!prompt || !outPath) {
  console.error('Usage: node topview-text2image.mjs "<prompt>" <outPath> [--model X] [--aspect 16:9] [--resolution 2K] [--count 1]');
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
      if (img) return img.filePath;
      throw new Error(`success but no usable image: ${JSON.stringify(r)}`);
    }
    if (String(r.status).toLowerCase() === 'fail') throw new Error(`task failed: ${r.errorMsg || JSON.stringify(r)}`);
    await sleep(4000);
  }
  throw new Error('timed out (5 min)');
}

try {
  const taskId = await submit();
  console.error(`[topview] taskId=${taskId}, polling…`);
  const url = await poll(taskId);
  const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
  writeFileSync(outPath, buf);
  console.error(`[topview] saved ${outPath} (${buf.length} bytes) from ${url}`);
} catch (e) {
  console.error('[topview] ERROR:', e.message);
  process.exit(1);
}
