import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('博主'),
    category: z.string(),
    tags: z.array(z.string()).default([]),
    readTime: z.string().optional(),
    featured: z.boolean().default(false),
  }),
});

export const collections = { posts };
