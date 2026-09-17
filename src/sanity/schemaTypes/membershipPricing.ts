import { defineField, defineType } from 'sanity';

export const membershipPricing = defineType({
  name: 'membershipPricing',
  title: 'Membership Pricing',
  type: 'document',
  fields: [
    defineField({
      name: 'tierId',
      title: 'Tier ID (do not change)',
      type: 'string',
      description: 'Stable key linking this price to the website card: student, individual, startup, sme-standard, sme-plus, corporate-standard, corporate-premium, patron, strategic-platinum.',
    }),
    defineField({
      name: 'tierName',
      title: 'Tier Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'eligibility',
      title: 'Eligibility / Subtitle',
      type: 'text',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      initialValue: 99,
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'currency',
      title: 'Currency',
      type: 'string',
      options: {
        list: ['INR', 'JPY', 'USD'],
      },
      initialValue: 'INR',
    }),
    defineField({
      name: 'benefits',
      title: 'Benefits',
      type: 'array',
      of: [{ type: 'string' }],
    }),
  ],
  preview: {
    select: {
      title: 'tierName',
      subtitle: 'price',
    },
    prepare(selection) {
      const { title, subtitle } = selection;
      return {
        title: title,
        subtitle: subtitle ? `Price: ${subtitle}` : '',
      };
    },
  },
});
