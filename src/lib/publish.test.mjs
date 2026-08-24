// Run: npm test   (node's built-in runner, no dependencies)
//
// What these pin is the part publish-kit CANNOT pin for us: the frontmatter this
// site emits has to satisfy src/content.config.ts, and Astro fails the BUILD on
// a block that does not. A failed build blocks the next deploy of the whole
// site, not just the bad post, so a broken emitter is a site-wide outage rather
// than one missing page. That is worth a test file of its own.

import { test } from "node:test";
import assert from "node:assert/strict";
import { buildMarkdown, parseFrontmatter } from "./frontmatter.mjs";
import { CATEGORIES, MIN_WORDS, RESERVED_SLUGS, slugify } from "./publish-gates.mjs";

const REQUIRED = ["title", "description", "pubDate"];

test("the emitted block carries every field the content schema requires", () => {
  const md = buildMarkdown({
    title: "A Post",
    description: "What it is about.",
    body: "Body text.",
  });
  const { data } = parseFrontmatter(md);
  for (const key of REQUIRED) {
    assert.ok(data[key], `${key} is required by src/content.config.ts and was missing`);
  }
});

test("a missing required field throws instead of committing a build-breaking file", () => {
  assert.throws(() => buildMarkdown({ description: "d", body: "b" }), /title is required/);
  assert.throws(() => buildMarkdown({ title: "t", body: "b" }), /description is required/);
});

// The trap this pins: this site's titles are full of colons, and `title: A: B`
// is invalid bare YAML. Astro would fail the build on it.
test("prose that is invalid bare YAML survives quoting", () => {
  for (const title of [
    "Manifestation: A Guide",
    'She said "yes" out loud',
    "100% Real, No Hype",
    "@morning ritual",
    "Ends with a colon:",
    "Back\\slash",
  ]) {
    const md = buildMarkdown({ title, description: "d", body: "b" });
    const { data } = parseFrontmatter(md);
    assert.equal(data.title, title, `${title} must round-trip through the frontmatter`);
  }
});

test("a newline inside a field cannot break out of the block", () => {
  const md = buildMarkdown({
    title: "Line one\nline two",
    description: "d",
    body: "b",
  });
  // Three delimiters would mean the value escaped its block and split the file.
  assert.equal(md.match(/^---$/gm).length, 2, "the frontmatter must stay one block");
  assert.equal(parseFrontmatter(md).data.title, "Line one line two");
});

test("pubDate is emitted as YYYY-MM-DD, which the schema coerces", () => {
  const md = buildMarkdown({ title: "t", description: "d", body: "b" });
  assert.match(parseFrontmatter(md).data.pubDate, /^\d{4}-\d{2}-\d{2}$/);
});

// The regression this prevents: an edit that re-dates the post reorders the
// archive and makes a correction look like a new article to every feed reader.
test("editing an existing post keeps its original pubDate", () => {
  const original = buildMarkdown({
    title: "Original",
    description: "d",
    body: "b",
    pubDate: "2026-01-15",
  });
  const previous = parseFrontmatter(original).data;
  assert.equal(previous.pubDate, "2026-01-15");

  const edited = buildMarkdown({
    previous,
    title: "Corrected Title",
    description: "d",
    body: "new body",
  });
  const after = parseFrontmatter(edited).data;
  assert.equal(after.pubDate, "2026-01-15", "an edit must not re-date the post");
  assert.equal(after.title, "Corrected Title", "but the edit itself must land");
});

test("an unknown field is dropped rather than committed as a build failure", () => {
  const md = buildMarkdown({
    title: "t",
    description: "d",
    body: "b",
    somethingTheSchemaHasNeverHeardOf: "boom",
  });
  assert.ok(!md.includes("somethingTheSchemaHasNeverHeardOf"));
});

test("optional fields are omitted when empty, not emitted as empty strings", () => {
  const md = buildMarkdown({ title: "t", description: "d", body: "b", coverImage: "" });
  assert.ok(!md.includes("coverImage:"), "an empty optional must not reach the file");
});

test("parseFrontmatter returns the body untouched for a file with no frontmatter", () => {
  const { data, body } = parseFrontmatter("just a body");
  assert.deepEqual(data, {});
  assert.equal(body, "just a body");
});

// Policy, measured. If someone lowers MIN_WORDS to the specced default these
// fail, which is the point: the number is measured against THIS corpus.
test("the thresholds match what was measured against this site", () => {
  assert.equal(MIN_WORDS, 600);
  assert.ok(MIN_WORDS < 1056, "must sit below the shortest live post (1056 words)");
  assert.ok(MIN_WORDS > 300, "the specced default could never fire on this corpus");
});

test("every category that exists on the site is publishable", () => {
  for (const c of ["Manifestation", "Mindset"]) {
    assert.ok(CATEGORIES.includes(c), `${c} is live on the site and must be allowed`);
  }
});

test("the blog index cannot be shadowed by a post", () => {
  // src/content/blog/index.md would fight src/pages/blog/index.astro for /blog/.
  assert.ok(RESERVED_SLUGS.includes("index"));
  assert.ok(RESERVED_SLUGS.includes("blog"));
});

test("a reserved slug is refused, and an ordinary one is not", () => {
  for (const s of RESERVED_SLUGS) {
    assert.equal(slugify(s), s, "a reserved slug must already be in slug form to ever match");
  }
  assert.equal(slugify("How To Manifest Love"), "how-to-manifest-love");
  assert.ok(!RESERVED_SLUGS.includes(slugify("How To Manifest Love")));
});
