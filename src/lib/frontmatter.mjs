// Build and parse the frontmatter block for src/content/blog/*.md.
//
// WHY THIS IS FUSSIER THAN IT LOOKS: the collection is validated by a zod schema
// (src/content.config.ts). Astro fails the BUILD on a frontmatter that does not
// match, and a failed build blocks the next deploy of the WHOLE site, not just
// the new post. So this file has one job: never emit a block the schema will
// reject. That is also why the publish endpoint runs every gate before the
// commit, never after.
//
// The schema, at the time of writing:
//   required  title, description, pubDate
//   optional  category, readTime, featured, coverImage, coverImageAlt,
//             seoTitle, seoDescription, focusKeyword, ogImage, canonicalUrl,
//             author
// Anything not on that list is dropped rather than passed through: zod is
// configured strictly enough that a stray key is a build failure, and a silent
// drop is far better than a site-wide deploy block.

const KNOWN_STRING_KEYS = [
  "title",
  "description",
  "category",
  "readTime",
  "coverImage",
  "coverImageAlt",
  "seoTitle",
  "seoDescription",
  "focusKeyword",
  "ogImage",
  "canonicalUrl",
  "author",
];

/**
 * Quote a scalar for YAML.
 *
 * Always double-quote and escape, rather than trying to decide when a bare
 * scalar is safe. A title containing a colon-space, a leading %, @ or `, or a
 * trailing colon is valid prose and invalid bare YAML, and this site's titles
 * are full of colons ("The 369 Manifestation Method Explained Simply" is fine,
 * "Manifestation: A Guide" is not). Quoting unconditionally removes the whole
 * class of question.
 */
function yamlString(v) {
  return `"${String(v).replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\r?\n/g, " ")}"`;
}

/** YYYY-MM-DD. The schema coerces a date, and this is unambiguous in every parser. */
function yamlDate(v) {
  const d = v instanceof Date ? v : new Date(v);
  if (Number.isNaN(d.getTime())) throw new Error(`invalid pubDate: ${v}`);
  return d.toISOString().slice(0, 10);
}

/**
 * Minimal frontmatter reader: enough to find the fields an EDIT must preserve.
 *
 * Not a general YAML parser and does not need to be. It reads the top-level
 * `key: value` pairs of an existing post so a re-publish can keep the original
 * pubDate instead of stamping today's, which would reorder the archive and make
 * a corrected post look new to every feed reader.
 */
export function parseFrontmatter(raw) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(String(raw || ""));
  if (!m) return { data: {}, body: String(raw || "") };

  const data = {};
  for (const line of m[1].split(/\r?\n/)) {
    // Top-level keys only: an indented line belongs to a nested structure this
    // reader deliberately does not try to understand.
    const kv = /^([A-Za-z][A-Za-z0-9_]*):\s*(.*)$/.exec(line);
    if (!kv) continue;
    let v = kv[2].trim();
    if (v.startsWith('"') && v.endsWith('"') && v.length > 1) {
      // ONE pass, not sequential replaces. Unescaping \\" and then \\\\ in two
      // steps turns the literal text \\" into a stray quote; a single
      // left-to-right pass over \\(.) cannot double-process its own output.
      v = v.slice(1, -1).replace(/\\(.)/g, "$1");
    } else if (v.startsWith("'") && v.endsWith("'") && v.length > 1) {
      // Single-quoted YAML escapes a quote by doubling it, not with a backslash.
      // Nothing here EMITS single quotes; this only reads hand-written files.
      v = v.slice(1, -1).replace(/''/g, "'");
    }
    data[kv[1]] = v;
  }
  return { data, body: m[2] };
}

/**
 * Compose the full file.
 *
 * `previous` is the parsed frontmatter of the post being replaced, when there is
 * one. Two fields are inherited from it deliberately:
 *   pubDate  an edit must not re-date the post (see parseFrontmatter above)
 *   author   set once, and not something a generation run should churn
 * Everything else the caller supplies wins, because an edit exists to change it.
 */
export function buildMarkdown({ body, previous = {}, ...fields }) {
  const out = [];

  const title = fields.title ?? previous.title;
  const description = fields.description ?? previous.description;
  if (!title) throw new Error("title is required by the content schema");
  if (!description) throw new Error("description is required by the content schema");

  out.push(`title: ${yamlString(title)}`);
  out.push(`description: ${yamlString(description)}`);
  out.push(`pubDate: ${yamlDate(previous.pubDate || fields.pubDate || new Date())}`);

  for (const key of KNOWN_STRING_KEYS) {
    if (key === "title" || key === "description") continue;
    const v = fields[key] ?? previous[key];
    if (v !== undefined && v !== null && String(v).length > 0) {
      out.push(`${key}: ${yamlString(v)}`);
    }
  }

  // Booleans are not strings, so they are written outside the loop above.
  const featured = fields.featured ?? previous.featured;
  if (featured !== undefined) {
    out.push(`featured: ${String(featured) === "true" || featured === true}`);
  }

  return `---\n${out.join("\n")}\n---\n\n${String(body).trim()}\n`;
}
