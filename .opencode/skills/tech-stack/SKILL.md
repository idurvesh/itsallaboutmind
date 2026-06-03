---
name: tech-stack
description: Use when working with Astro, TinaCMS, MDX, or any framework-specific code in this project. Covers conventions, commands, and structure.
---

# Tech Stack

This is an **Astro** site with **TinaCMS** for content management and **MDX** for content authoring.

## Commands

| Command | Action |
|---------|--------|
| `npm run dev` | Start Astro dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npx tinacms dev` | Start TinaCMS admin (alongside Astro) |
| `npx tinacms build` | Build TinaCMS schema |
| `npx astro check` | Run Astro type checking |

## Project Structure

```
src/
  components/   -- Astro/React components
  content/      -- Content collections (MDX)
  layouts/      -- Page layouts
  pages/        -- Route pages
  styles/       -- Global styles
public/         -- Static assets
tina/           -- TinaCMS config & collections
functions/      -- Serverless functions
```

## Conventions

- Use `.astro` for components unless interactivity is needed (then use `.tsx`)
- Content lives in `src/content/` as MDX files managed through TinaCMS
- TinaCMS collections are defined in `tina/` directory
- Site URL: `https://itsallaboutmind.com`
