import { defineConfig } from 'tinacms';

export default defineConfig({
  branch: process.env.GITHUB_BRANCH || 'main',
  clientId: process.env.TINA_CLIENT_ID || '',
  token: process.env.TINA_TOKEN || '',

  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },

  media: {
    tina: {
      mediaRoot: 'images',
      publicFolder: 'public',
    },
  },

  schema: {
    collections: [
      {
        name: 'blog',
        label: 'Blog Posts',
        path: 'src/content/blog',
        format: 'md',
        fields: [
          { type: 'string', name: 'title', label: 'Title', isTitle: true, required: true },
          { type: 'string', name: 'description', label: 'Description', ui: { component: 'textarea' }, required: true },
          { type: 'datetime', name: 'pubDate', label: 'Publish Date', required: true },
          {
            type: 'string', name: 'category', label: 'Category',
            options: ['Mindset', 'Meditation', 'Law of Attraction', 'Philosophy', 'Stoicism', 'Manifestation'],
          },
          { type: 'string', name: 'readTime', label: 'Read Time' },
          { type: 'string', name: 'author', label: 'Author' },
          { type: 'boolean', name: 'featured', label: 'Featured' },
          { type: 'rich-text', name: 'body', label: 'Body', isBody: true },
          { type: 'string', name: 'seoTitle', label: 'SEO Title', },
          { type: 'string', name: 'seoDescription', label: 'Meta Description', ui: { component: 'textarea' } },
          { type: 'string', name: 'focusKeyword', label: 'Focus Keyword' },
          { type: 'image', name: 'ogImage', label: 'OG / Social Image' },
          { type: 'string', name: 'canonicalUrl', label: 'Canonical URL' },
        ],
      },
    ],
  },
});
