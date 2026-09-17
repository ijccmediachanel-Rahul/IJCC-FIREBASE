import { defineField, defineType } from 'sanity';

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About Us Page',
  type: 'document',
  fields: [
    defineField({
      name: 'heroBadge',
      title: 'Hero Badge',
      type: 'string',
    }),
    defineField({
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
    }),
    defineField({
      name: 'heroTagline',
      title: 'Hero Tagline',
      type: 'string',
    }),
    defineField({
      name: 'pageTitle',
      title: 'Page Title',
      type: 'string',
      description: 'The main heading for the About Us page.',
    }),
    defineField({
      name: 'introduction',
      title: 'Introduction',
      type: 'text',
      description: 'Introductory text about the organization. Use a blank line between paragraphs.',
    }),
    defineField({
      name: 'mission',
      title: 'Mission & Vision',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Rich text area for Mission and Vision statements.',
    }),
    defineField({
      name: 'missionTitle',
      title: 'Mission Card Title',
      type: 'string',
    }),
    defineField({
      name: 'visionTitle',
      title: 'Vision Card Title',
      type: 'string',
    }),
    defineField({
      name: 'visionDescription',
      title: 'Vision Card Description',
      type: 'text',
    }),
    defineField({
      name: 'history',
      title: 'Company History',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Rich text area for the history of the organization.',
    }),
    defineField({
      name: 'factsTitle',
      title: 'Facts Block Title',
      type: 'string',
    }),
    defineField({
      name: 'facts',
      title: 'Key Facts (cards)',
      type: 'array',
      of: [
        {
          type: 'object',
          preview: { select: { title: 'label', subtitle: 'value' } },
          fields: [
            { name: 'label', title: 'Label', type: 'string' },
            { name: 'value', title: 'Value', type: 'string' },
          ],
        },
      ],
    }),
    defineField({ name: 'orgTypeLabel', title: 'Organisation Type Label', type: 'string' }),
    defineField({ name: 'orgTypeValue', title: 'Organisation Type Value', type: 'string' }),
    defineField({ name: 'hqLabel', title: 'HQ Label', type: 'string' }),
    defineField({ name: 'hqValue', title: 'HQ Value', type: 'string' }),
    defineField({ name: 'websiteLabel', title: 'Website Label', type: 'string' }),
    defineField({ name: 'websiteValue', title: 'Website Value', type: 'string' }),
    defineField({
      name: 'objectivesTitle',
      title: 'Objectives Title',
      type: 'string',
    }),
    defineField({
      name: 'objectivesSubtitle',
      title: 'Objectives Subtitle',
      type: 'string',
    }),
    defineField({
      name: 'objectives',
      title: 'Core Objectives (cards)',
      type: 'array',
      of: [
        {
          type: 'object',
          preview: { select: { title: 'title', subtitle: 'description' } },
          fields: [
            { name: 'title', title: 'Title', type: 'string' },
            { name: 'description', title: 'Description', type: 'text' },
          ],
        },
      ],
    }),
    defineField({
      name: 'verticalsTitle',
      title: 'Verticals Title',
      type: 'string',
    }),
    defineField({
      name: 'verticalsSubtitle',
      title: 'Verticals Subtitle',
      type: 'string',
    }),
    defineField({
      name: 'verticals',
      title: 'Organisation Verticals',
      type: 'array',
      description: 'Icon follows position (1-12).',
      of: [
        {
          type: 'object',
          preview: { select: { title: 'title', subtitle: 'description' } },
          fields: [
            { name: 'title', title: 'Title', type: 'string' },
            { name: 'description', title: 'Description', type: 'text' },
            { name: 'points', title: 'Bullet Points', type: 'array', of: [{ type: 'string' }] },
          ],
        },
      ],
    }),
    defineField({
      name: 'benefitsTitle',
      title: 'Benefits Title',
      type: 'string',
    }),
    defineField({
      name: 'benefitsSubtitle',
      title: 'Benefits Subtitle',
      type: 'string',
    }),
    defineField({
      name: 'benefits',
      title: 'Membership Benefits (cards)',
      type: 'array',
      of: [
        {
          type: 'object',
          preview: { select: { title: 'title' } },
          fields: [
            { name: 'title', title: 'Title', type: 'string' },
            { name: 'points', title: 'Bullet Points', type: 'array', of: [{ type: 'string' }] },
          ],
        },
      ],
    }),
    defineField({
      name: 'leadershipTitle',
      title: 'Leadership Section Title',
      type: 'string',
    }),
    defineField({
      name: 'leadershipSubtitle',
      title: 'Leadership Section Subtitle',
      type: 'string',
    }),
    defineField({
      name: 'advisoryTitle',
      title: 'Advisory Section Title',
      type: 'string',
    }),
    defineField({
      name: 'advisorySubtitle',
      title: 'Advisory Section Subtitle',
      type: 'string',
    }),
    defineField({
      name: 'mouTitle',
      title: 'MoU Partners Title',
      type: 'string',
    }),
    defineField({
      name: 'mouSubtitle',
      title: 'MoU Partners Subtitle',
      type: 'string',
    }),
    defineField({
      name: 'mouPartners',
      title: 'MoU Partners (cards)',
      type: 'array',
      of: [
        {
          type: 'object',
          preview: { select: { title: 'name', subtitle: 'description' } },
          fields: [
            { name: 'name', title: 'Name', type: 'string' },
            { name: 'description', title: 'Description', type: 'text' },
          ],
        },
      ],
    }),
    defineField({
      name: 'connectTitle',
      title: 'Connect Section Title',
      type: 'string',
    }),
    defineField({
      name: 'connectSubtitle',
      title: 'Connect Section Subtitle',
      type: 'string',
    }),
  ],
});
