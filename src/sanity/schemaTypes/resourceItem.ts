import { defineField, defineType } from 'sanity';

export const resourceItem = defineType({
  name: 'resourceItem',
  title: 'Resource',
  type: 'document',
  fields: [
    defineField({
      name: 'resourceId',
      title: 'Resource ID (do not change)',
      type: 'string',
      description: 'Stable key: associates, business-in-japan, jlpt-papers, magazines, self-study, learn-japanese, marugoto, cross-cultural, import-export.',
    }),
    defineField({
      name: 'title',
      title: 'Resource Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Associates', value: 'associates' },
          { title: 'Document', value: 'document' },
          { title: 'Link', value: 'link' },
          { title: 'Video', value: 'video' },
        ],
      },
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'file',
      title: 'File Upload',
      type: 'file',
      description: 'Upload a PDF or document (if applicable)',
    }),
    defineField({
      name: 'externalLink',
      title: 'External Link',
      type: 'url',
      description: 'URL to the resource (if not a file upload)',
    }),
    defineField({
      name: 'linkUrl',
      title: 'Card Link URL',
      type: 'string',
      description: 'Where the card button goes (page route like /resources/jlpt or full https link). Empty = demo download button.',
    }),
    defineField({
      name: 'isProtected',
      title: 'Members Only',
      type: 'boolean',
      description: 'ON = only logged-in members with a tier can open it.',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      initialValue: 99,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'category',
    },
  },
});
