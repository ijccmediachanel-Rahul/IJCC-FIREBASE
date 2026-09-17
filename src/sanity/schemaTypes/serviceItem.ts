import { defineField, defineType } from 'sanity';

export const serviceItem = defineType({
  name: 'serviceItem',
  title: 'Service',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Service Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'Used for the URL (e.g., /services/digital-services)',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'iconName',
      title: 'Icon Name',
      type: 'string',
      description: 'Name of the lucide-react icon to use (e.g., Globe, Building, Handshake)',
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
      description: 'A brief description shown on the services listing page.',
    }),
    defineField({
      name: 'sections',
      title: 'Detail Sections (accordion)',
      type: 'array',
      description: 'Content blocks shown on the individual service page. Shown in order.',
      of: [
        {
          type: 'object',
          preview: { select: { title: 'title' } },
          fields: [
            { name: 'title', title: 'Section Title', type: 'string' },
            {
              name: 'items',
              title: 'Bullet Points',
              type: 'array',
              of: [
                {
                  type: 'object',
                  preview: { select: { title: 'text' } },
                  fields: [
                    { name: 'text', title: 'Point', type: 'text' },
                    { name: 'subItems', title: 'Sub Points', type: 'array', of: [{ type: 'string' }] },
                  ],
                },
              ],
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Order in which this service should appear (e.g., 1, 2, 3)',
    }),
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'shortDescription',
    },
  },
});
