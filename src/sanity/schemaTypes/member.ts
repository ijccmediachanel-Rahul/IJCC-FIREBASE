import { defineField, defineType } from 'sanity';

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
      description: 'Use this to control the order in which members appear (e.g., 1 for President, 2 for Vice President). Lower numbers appear first.',
      initialValue: 99,
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: ['Board', 'Advisory', 'Staff', 'General Member'],
      },
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
      description: 'Used when no image is uploaded above. Paste any https:// image link.',
    }),
    defineField({
      name: 'bio',
      title: 'Biography',
      type: 'text',
    }),
    defineField({
      name: 'name_ja',
      title: 'Name (Japanese)',
      type: 'string',
    }),
    defineField({
      name: 'role_ja',
      title: 'Role / Designation (Japanese)',
      type: 'string',
    }),
    defineField({
      name: 'bio_ja',
      title: 'Biography (Japanese)',
      type: 'text',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'role',
      media: 'image',
    },
  },
});
