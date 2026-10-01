import { defineField, defineType } from 'sanity';

export const thinkTankMember = defineType({
  name: 'thinkTankMember',
  title: 'IJCC Think Tank Member',
  type: 'document',
  orderings: [
    {
      title: 'Display Order, Ascending',
      name: 'orderAsc',
      by: [
        { field: 'order', direction: 'asc' },
        { field: 'name', direction: 'asc' },
      ],
    },
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
      title: 'Full Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Title / Designation / Area of Expertise',
      type: 'string',
      description: 'e.g. Senior Fellow – Bilateral Trade & Industrial Policy, Honorary Advisor',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Controls sequence on the website. Lower numbers appear first (1, 2, 3...).',
      initialValue: 10,
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
      description: 'Direct https:// image link if not uploading an image file.',
    }),
    defineField({
      name: 'bio',
      title: 'Biography / Background',
      type: 'text',
      description: 'Career background, research focus, or credentials. Appears in the full bio dialog on the website.',
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
      title: 'Title / Designation (Japanese)',
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
      media: 'image',
      hidden: 'hidden',
    },
    prepare({ title, subtitle, media, hidden }) {
      const prefix = hidden ? '🚫 [HIDDEN] ' : '';
      return {
        title: `${prefix}${title || 'Untitled Member'}`,
        subtitle: subtitle || 'Think Tank Fellow',
        media,
      };
    },
  },
});
