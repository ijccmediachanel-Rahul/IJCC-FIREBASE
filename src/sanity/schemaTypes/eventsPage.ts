import { defineField, defineType } from 'sanity';

export const eventsPage = defineType({
  name: 'eventsPage',
  title: 'Events Page',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Page Title', type: 'string' }),
    defineField({ name: 'description', title: 'Page Description', type: 'text' }),
    defineField({ name: 'calendarTitle', title: 'Calendar Title', type: 'string' }),
  ],
});
