import { defineField, defineType } from 'sanity';

export const associate = defineType({
  name: 'associate',
  title: 'Associate / Member Logo',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'website',
      title: 'Website URL',
      type: 'url',
    }),
    defineField({
      name: 'logo',
      title: 'Logo (upload)',
      type: 'image',
    }),
    defineField({
      name: 'logoUrl',
      title: 'Logo URL (fallback)',
      type: 'url',
      description: 'Used when no logo is uploaded above.',
    }),
    defineField({
      name: 'cardClass',
      title: 'Extra Card CSS Class (optional)',
      type: 'string',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      initialValue: 99,
    }),
  ],
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
  preview: {
    select: {
      title: 'name',
      subtitle: 'website',
      media: 'logo',
    },
  },
});
