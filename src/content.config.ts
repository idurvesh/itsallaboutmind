import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    category: z.string().optional().default('Mindset'),
    readTime: z.string().optional().default('5 min read'),
    featured: z.boolean().optional().default(false),
  }),
});

export const collections = { blog };
