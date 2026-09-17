import { defineField, defineType } from 'sanity';
import { SlidePreview } from '../components/SlidePreview';

export const homePage = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  fields: [
    defineField({
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      description: 'The main heading shown on the home page banner.',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'text',
      description: 'The text shown below the main heading.',
    }),
    defineField({
      name: 'heroSlides',
      title: 'Hero Slides (images / videos)',
      type: 'array',
      description: 'Slides of the top banner carousel. If empty, the default slides are shown.',
      of: [
        {
          type: 'object',
          components: { preview: SlidePreview },
          preview: {
            select: { title: 'alt', subtitle: 'slideType', media: 'image', videoUrl: 'videoUrl' },
          },
          fields: [
            { name: 'slideType', title: 'Type', type: 'string', options: { list: ['image', 'video'], layout: 'radio' }, initialValue: 'image' },
            { name: 'image', title: 'Image (upload)', type: 'image', options: { hotspot: true } },
            { name: 'imageUrl', title: 'Image URL (fallback)', type: 'url', description: 'Used when no image is uploaded above.' },
            { name: 'videoUrl', title: 'Video embed URL', type: 'url', description: 'For video slides, e.g. a YouTube embed link with autoplay+mute.' },
            { name: 'alt', title: 'Alt text', type: 'string' },
          ],
        },
      ],
    }),
    defineField({
      name: 'heroPrimaryButtonLink',
      title: 'Hero Button 1 Link',
      type: 'string',
      description: 'e.g. /contact',
    }),
    defineField({
      name: 'heroSecondaryButtonLink',
      title: 'Hero Button 2 Link',
      type: 'string',
      description: 'e.g. /events',
    }),
    defineField({
      name: 'heroTertiaryButtonLink',
      title: 'Hero Button 3 Link',
      type: 'string',
      description: 'e.g. /gallery',
    }),
    defineField({
      name: 'aboutBadge',
      title: 'About Section Badge',
      type: 'string',
    }),
    defineField({
      name: 'aboutTitle',
      title: 'About Section Title',
      type: 'string',
    }),
    defineField({
      name: 'aboutDescription',
      title: 'About Section Description',
      type: 'text',
    }),
    defineField({
      name: 'aboutImage',
      title: 'About Section Image (upload)',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'aboutImageUrl',
      title: 'About Section Image URL (fallback)',
      type: 'url',
    }),
    defineField({
      name: 'aboutButtonLink',
      title: 'About Button Link',
      type: 'string',
      description: 'e.g. /about',
    }),
    defineField({
      name: 'featuresBadge',
      title: 'Features Badge',
      type: 'string',
    }),
    defineField({
      name: 'featuresTitle',
      title: 'Features Title (Why Join Us?)',
      type: 'string',
    }),
    defineField({
      name: 'featuresDescription',
      title: 'Features Description',
      type: 'text',
    }),
    defineField({
      name: 'featuresBackgroundImage',
      title: 'Features Section Background (upload)',
      type: 'image',
    }),
    defineField({
      name: 'featuresBackgroundImageUrl',
      title: 'Features Section Background URL (fallback)',
      type: 'url',
    }),
    defineField({
      name: 'featureCards',
      title: 'Feature Cards',
      type: 'array',
      description: 'If empty, the 4 default cards are shown. Icon follows position (1-4).',
      of: [
        {
          type: 'object',
          preview: {
            select: { title: 'title', subtitle: 'description' },
          },
          fields: [
            { name: 'title', title: 'Title', type: 'string' },
            { name: 'description', title: 'Description', type: 'text' },
            { name: 'link', title: 'Link (e.g. /events)', type: 'string' },
          ],
        },
      ],
    }),
    defineField({
      name: 'partnersTitle',
      title: 'Partners Title',
      type: 'string',
    }),
    defineField({
      name: 'partnersDescription',
      title: 'Partners Description',
      type: 'text',
    }),
    defineField({
      name: 'partners',
      title: 'Associate Partners',
      type: 'array',
      description: 'If empty, the default partner logos are shown.',
      of: [
        {
          type: 'object',
          preview: {
            select: { title: 'name', subtitle: 'website', media: 'logo' },
          },
          fields: [
            { name: 'name', title: 'Name', type: 'string' },
            { name: 'website', title: 'Website URL', type: 'url' },
            { name: 'logo', title: 'Logo (upload)', type: 'image' },
            { name: 'logoUrl', title: 'Logo URL (fallback)', type: 'url' },
          ],
        },
      ],
    }),
    defineField({
      name: 'ctaTitle',
      title: 'Bottom CTA Title',
      type: 'string',
    }),
    defineField({
      name: 'ctaDescription',
      title: 'Bottom CTA Description',
      type: 'text',
    }),
    defineField({
      name: 'ctaButtonLink',
      title: 'Bottom CTA Button Link',
      type: 'string',
      description: 'e.g. /contact',
    }),
  ],
});
