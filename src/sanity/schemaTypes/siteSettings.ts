import { defineField, defineType } from 'sanity';

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
      initialValue: 'info@ijcc.in',
      placeholder: 'info@ijcc.in',
    }),
    defineField({
      name: 'phoneNumber',
      title: 'Primary Phone Number (India)',
      type: 'string',
      initialValue: '+91-92679 19281',
      placeholder: '+91-92679 19281',
    }),
    defineField({
      name: 'address',
      title: 'Office Address (Default)',
      type: 'text',
      initialValue: 'New Delhi, India',
      placeholder: 'New Delhi, India',
    }),
    defineField({
      name: 'instagramUrl',
      title: 'Instagram URL',
      type: 'url',
      placeholder: 'https://www.instagram.com/...',
    }),
    defineField({
      name: 'linkedinUrl',
      title: 'LinkedIn URL',
      type: 'url',
      placeholder: 'https://www.linkedin.com/...',
    }),
    defineField({
      name: 'facebookUrl',
      title: 'Facebook URL',
      type: 'url',
      placeholder: 'https://www.facebook.com/...',
    }),
    defineField({
      name: 'youtubeUrl',
      title: 'YouTube URL',
      type: 'url',
      placeholder: 'https://www.youtube.com/...',
    }),
  ],
});

