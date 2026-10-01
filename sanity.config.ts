import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schema } from './src/sanity/schemaTypes';
import { projectId, dataset } from './src/sanity/env';
import { structure } from './src/sanity/structure';

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  schema: {
    ...schema,
    templates: (prev) => [
      ...prev,
      {
        id: 'member-by-chapter',
        title: 'Member by Chapter',
        schemaType: 'member',
        parameters: [
          { name: 'chapterId', title: 'Chapter ID', type: 'string' },
          { name: 'chapterTitle', title: 'Chapter Title', type: 'string' },
        ],
        value: (params: { chapterId?: string; chapterTitle?: string }) => ({
          chapterRef: params.chapterId ? { _type: 'reference', _ref: params.chapterId } : undefined,
          category: params.chapterTitle || '',
        }),
      },
    ],
  },
  plugins: [
    structureTool({ structure }),
  ],
});


