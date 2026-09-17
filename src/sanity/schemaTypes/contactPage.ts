import { defineField, defineType } from 'sanity';

export const contactPage = defineType({
  name: 'contactPage',
  title: 'Contact Page',
  type: 'document',
  fields: [
    defineField({
      name: 'pageTitle',
      title: 'Page Title',
      type: 'string',
      description: 'The main heading for the Contact page.',
    }),
    defineField({
      name: 'introduction',
      title: 'Introduction Text',
      type: 'text',
      description: 'Text shown above the contact form or details.',
    }),
    defineField({
      name: 'corporateOfficeTitle',
      title: 'Corporate Office Title',
      type: 'string',
    }),
    defineField({
      name: 'corporateOfficeAddress',
      title: 'Corporate Office Address',
      type: 'text',
    }),
    defineField({
      name: 'branchOfficeTitle',
      title: 'Branch Office Title',
      type: 'string',
    }),
    defineField({
      name: 'branchOfficeAddress',
      title: 'Branch Office Address',
      type: 'text',
    }),
    defineField({
      name: 'japanOfficeTitle',
      title: 'Japan Office Title',
      type: 'string',
    }),
    defineField({
      name: 'japanOfficeAddress',
      title: 'Japan Office Address',
      type: 'text',
    }),
    defineField({
      name: 'phoneBranch',
      title: 'Branch Phone Number',
      type: 'string',
    }),
    defineField({
      name: 'phoneJapan',
      title: 'Japan Phone Number',
      type: 'string',
    }),
    defineField({
      name: 'faqTitle',
      title: 'FAQ Section Title',
      type: 'string',
    }),
    defineField({
      name: 'officesTitle',
      title: 'Offices Block Title',
      type: 'string',
    }),
    defineField({
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'question', type: 'string', title: 'Question' },
            { name: 'answer', type: 'text', title: 'Answer' },
          ],
        },
      ],
    }),
  ],
});
