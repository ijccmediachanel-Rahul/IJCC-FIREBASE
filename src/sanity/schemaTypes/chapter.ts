import { defineField, defineType } from 'sanity';

export const chapter = defineType({
  name: 'chapter',
  title: 'Chapters & Regional Teams',
  type: 'document',
  orderings: [
    {
      title: 'Display Order, Ascending',
      name: 'orderAsc',
      by: [
        { field: 'order', direction: 'asc' },
        { field: 'title', direction: 'asc' },
      ],
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Chapter Name',
      type: 'string',
      description: 'e.g. "Kolkata Chapter Team", "Mumbai Chapter Team", "UP Chapter Team"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'hidden',
      title: '🚫 Hide / Remove Chapter from Website',
      type: 'boolean',
      description: 'Turn ON to remove this chapter from the website immediately. (To permanently delete this entire chapter document, click the "..." menu at the bottom-right or top-right and choose "Delete").',
      initialValue: false,
    }),
    defineField({
      name: 'subtitle',
      title: 'Chapter Subtitle / Tagline',
      type: 'string',
      description: 'e.g. "West Bengal Regional Leadership & Industrial Coordination"',
    }),
    defineField({
      name: 'chapterType',
      title: 'Chapter Level / Type',
      type: 'string',
      description: 'Choose whether this is a Main Chapter (like India or Japan) or a Sub-Chapter (like UP State Chapter, Bihar, etc.)',
      options: {
        list: [
          { title: '🏛️ Main Chapter (e.g. India Chapter, Japan Chapter)', value: 'main' },
          { title: '📍 Sub-Chapter / State Chapter (e.g. UP Chapter, Gujarat Chapter, Tokyo Chapter)', value: 'sub' },
        ],
        layout: 'radio',
      },
      initialValue: 'sub',
    }),
    defineField({
      name: 'parentChapter',
      title: 'Main / Parent Chapter',
      type: 'reference',
      to: [{ type: 'chapter' }],
      description: 'Select which Main Chapter this sub-chapter belongs to (e.g. India Chapter or Japan Chapter).',
      hidden: ({ parent }) => parent?.chapterType === 'main',
    }),
    defineField({
      name: 'region',
      title: 'Country / Jurisdiction',
      type: 'string',
      options: {
        list: [
          { title: '🇮🇳 India — State Chapter (Sub-chapter under India)', value: 'india-state' },
          { title: '🇮🇳 India — Main Chapter / Apex Board', value: 'india-apex' },
          { title: '🇯🇵 Japan — Main Chapter', value: 'japan' },
          { title: '🇯🇵 Japan — Sub Chapter (under Japan)', value: 'japan-sub' },
          { title: '🌐 International Chapter', value: 'international' },
        ],
      },
      initialValue: 'india-state',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Controls where this chapter appears on the page. Lower numbers appear first (e.g. 10 for UP, 15 for Kolkata, 20 for Bihar).',
      initialValue: 50,
    }),
    defineField({
      name: 'image',
      title: 'Chapter Logo / Banner Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'imageUrl',
      title: 'Image URL (fallback)',
      type: 'url',
      description: 'Used when no image file is uploaded above.',
    }),
    defineField({
      name: 'description',
      title: 'About This Chapter (Optional)',
      type: 'text',
      description: 'Brief overview of activities and goals of this regional chapter. (To add members to this chapter, go to "Team by Chapter" in the sidebar after publishing).',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'subtitle',
      region: 'region',
      media: 'image',
      hidden: 'hidden',
    },
    prepare({ title, subtitle, region, media, hidden }) {
      const regionIcons: Record<string, string> = {
        'india-state': '📍',
        'india-apex': '🏛️',
        japan: '🇯🇵',
        international: '🌐',
      };
      const icon = (region && regionIcons[region]) || '📍';
      const status = hidden ? ' 🚫 [HIDDEN]' : '';
      return {
        title: `${icon} ${title || 'Untitled Chapter'}${status}`,
        subtitle: subtitle || 'Regional Chapter',
        media,
      };
    },
  },
});
