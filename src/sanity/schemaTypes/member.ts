import { defineField, defineType } from 'sanity';

import { ChapterCategoryInput } from '../components/ChapterCategoryInput';

export const member = defineType({
  name: 'member',
  title: 'Members / Team',
  type: 'document',
  orderings: [
    {
      title: 'Display Order, Ascending',
      name: 'orderAsc',
      by: [
        {field: 'order', direction: 'asc'},
        {field: 'name', direction: 'asc'}
      ]
    }
  ],
  fieldsets: [
    {
      name: 'japanese',
      title: '🇯🇵 Japanese Translations (Optional)',
      options: { collapsible: true, collapsed: true },
    },
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role / Designation',
      type: 'string',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Use this to control the order in which members appear (e.g., 1 for Chairman/President, 2 for Vice President). Lower numbers appear first.',
      initialValue: 99,
    }),
    defineField({
      name: 'category',
      title: 'Chapter / Team Category',
      type: 'string',
      description: 'Select which chapter or governing body this member belongs to. Includes all state chapters and any custom chapters created in CMS.',
      components: {
        input: ChapterCategoryInput,
      },
    }),
    defineField({
      name: 'chapterRef',
      title: 'Assigned Chapter / Region (Internal Reference)',
      type: 'reference',
      to: [{ type: 'chapter' }],
      hidden: true,
    }),
    defineField({
      name: 'image',
      title: 'Profile Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'imageUrl',
      title: 'Photo URL (fallback)',
      type: 'url',
      description: 'Used when no image file is uploaded above. Paste any direct https:// image link.',
    }),
    defineField({
      name: 'bio',
      title: 'Biography',
      type: 'text',
      description: 'Member introduction and career background. Appears in the full bio popup on the website.',
    }),
    defineField({
      name: 'hidden',
      title: 'Hide Member from Website',
      type: 'boolean',
      description: 'Turn ON to temporarily hide this member from the live website without deleting.',
      initialValue: false,
    }),
    defineField({
      name: 'name_ja',
      title: 'Name (Japanese)',
      type: 'string',
      fieldset: 'japanese',
    }),
    defineField({
      name: 'role_ja',
      title: 'Role / Designation (Japanese)',
      type: 'string',
      fieldset: 'japanese',
    }),
    defineField({
      name: 'bio_ja',
      title: 'Biography (Japanese)',
      type: 'text',
      fieldset: 'japanese',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'role',
      chapter: 'chapterRef.title',
      category: 'category',
      media: 'image',
      hidden: 'hidden',
    },
    prepare({ title, subtitle, chapter, category, media, hidden }) {
      const tag = chapter || category || '';
      const prefix = hidden ? '🚫 [HIDDEN] ' : '';
      return {
        title: `${prefix}${title || 'Untitled Member'}`,
        subtitle: tag ? `[${tag}] ${subtitle || ''}` : subtitle || '',
        media,
      };
    },
  },
});
