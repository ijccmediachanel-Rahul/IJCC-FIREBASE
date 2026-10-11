import { defineField, defineType } from 'sanity';

export const jesdcCentre = defineType({
  name: 'jesdcCentre',
  title: 'JESDC Centres Directory',
  type: 'document',
  initialValue: (props: any) => {
    const id = (props?.documentId || '').toLowerCase();
    if (id.includes('delhi')) {
      return {
        name: 'JESDC Delhi NCR (Central Training Hub)',
        cityName: 'New Delhi',
        stateName: 'Delhi NCR',
        address: 'IJCC Secretariat, Core 4B, India Habitat Centre / Barakhamba Road, New Delhi, PIN - 110001',
        coordinatorName: 'Shri Rajesh Sharma (Senior Skilling Director)',
        phone: '+91-92679 19281',
        email: 'delhi@jesdc.ijcc.in',
        timings: 'Mon–Sat, 09:00 AM – 06:30 PM',
        googleMapUrl: 'https://maps.google.com/?q=New+Delhi',
        programsAvailable: [
          'SSW / TITP Japanese (Blue-Collar)',
          'Japanese for University Students',
          'Japanese for Professionals (IT / Non-IT)',
          'Japanese for Further Studies',
          'University Admission Assistance',
        ],
        facilities: [
          'Japanese Library',
          'Audio-Visual Classroom',
          'Online / Hybrid Classes',
          'Placement Guidance Cell',
        ],
        upcomingBatchDate: '1st November 2026',
        availableSeats: '12 Seats Open',
        order: 10,
        hidden: false,
      };
    }
    if (id.includes('kolkata')) {
      return {
        name: 'JESDC Kolkata Regional Centre',
        cityName: 'Kolkata',
        stateName: 'West Bengal',
        address: 'Salt Lake Sector V, Near IT Corridor, Kolkata, West Bengal, PIN - 700091',
        coordinatorName: 'Shri Palash Sen (Regional Skilling Lead)',
        phone: '+91-92679 19281',
        email: 'kolkata@jesdc.ijcc.in',
        timings: 'Mon–Sat, 09:30 AM – 06:00 PM',
        googleMapUrl: 'https://maps.google.com/?q=Salt+Lake+Sector+V+Kolkata',
        programsAvailable: [
          'SSW / TITP Japanese (Blue-Collar)',
          'Japanese for University Students',
          'Japanese for Professionals (IT / Non-IT)',
          'Japanese for Further Studies',
          'University Admission Assistance',
        ],
        facilities: [
          'Japanese Library',
          'Audio-Visual Classroom',
          'Online / Hybrid Classes',
          'Placement Guidance Cell',
        ],
        upcomingBatchDate: '15th November 2026',
        availableSeats: '18 Seats Open',
        order: 20,
        hidden: false,
      };
    }
    if (id.includes('patna') || id.includes('bihar')) {
      return {
        name: 'JESDC Bihar Centre (Patna)',
        cityName: 'Patna',
        stateName: 'Bihar',
        address: 'Exhibition Road / Fraser Road Institutional Zone, Patna, Bihar, PIN - 800001',
        coordinatorName: 'Dr. Vinod K. Yadavendu (State Coordinator)',
        phone: '+91-92679 19281',
        email: 'bihar@jesdc.ijcc.in',
        timings: 'Mon–Sat, 09:00 AM – 05:30 PM',
        googleMapUrl: 'https://maps.google.com/?q=Patna+Exhibition+Road',
        programsAvailable: [
          'SSW / TITP Japanese (Blue-Collar)',
          'Japanese for University Students',
          'Japanese for Professionals (IT / Non-IT)',
          'Japanese for Further Studies',
          'University Admission Assistance',
        ],
        facilities: [
          'Japanese Library',
          'Audio-Visual Classroom',
          'Online / Hybrid Classes',
          'Placement Guidance Cell',
        ],
        upcomingBatchDate: '10th November 2026',
        availableSeats: '20 Seats Open',
        order: 30,
        hidden: false,
      };
    }
    return {
      order: 40,
      hidden: false,
    };
  },
  orderings: [
    {
      title: 'Display Order, Ascending',
      name: 'orderAsc',
      by: [
        { field: 'order', direction: 'asc' },
        { field: 'name', direction: 'asc' },
      ],
    },
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Centre Name / Institute',
      type: 'string',
      description: 'e.g. "JESDC Delhi NCR (Central Training Hub)", "JESDC Kolkata Centre"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'cityName',
      title: 'City',
      type: 'string',
      description: 'e.g. "New Delhi", "Kolkata", "Patna", "Bangalore"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'stateName',
      title: 'State',
      type: 'string',
      description: 'e.g. "Delhi NCR", "West Bengal", "Bihar", "Karnataka"',
    }),
    defineField({
      name: 'address',
      title: 'Full Address with PIN Code',
      type: 'text',
      description: 'Street address, landmark, city and postal PIN code',
    }),
    defineField({
      name: 'coordinatorName',
      title: 'Centre Head / Coordinator Name',
      type: 'string',
      description: 'e.g. "Dr. R. K. Sharma" or "Regional Skilling Director"',
    }),
    defineField({
      name: 'phone',
      title: 'Phone / WhatsApp Number',
      type: 'string',
      description: 'e.g. "+91 98765 43210"',
    }),
    defineField({
      name: 'email',
      title: 'Centre Contact Email',
      type: 'string',
      description: 'e.g. "delhi@jesdc.ijcc.in"',
    }),
    defineField({
      name: 'timings',
      title: 'Operating Hours',
      type: 'string',
      initialValue: 'Mon–Sat, 09:00 AM – 06:00 PM',
    }),
    defineField({
      name: 'googleMapUrl',
      title: 'Google Maps Location Link',
      type: 'url',
      description: 'URL to Google Maps location',
    }),
    defineField({
      name: 'programsAvailable',
      title: 'Available Programs at this Centre',
      description: 'List of programs offered at this centre. Click "+ Add item" to add a new program.',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'facilities',
      title: 'Available Facilities',
      description: 'List of facilities available at this centre. Click "+ Add item" to add a new facility.',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'upcomingBatchDate',
      title: 'Upcoming Batch Date',
      type: 'string',
      description: 'e.g. "1st November 2026" or "Rolling Admissions"',
    }),
    defineField({
      name: 'availableSeats',
      title: 'Available Seats / Status',
      type: 'string',
      description: 'e.g. "15 Seats Available" or "Admissions Open"',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      initialValue: 10,
    }),
    defineField({
      name: 'hidden',
      title: 'Hide Centre from Website',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'cityName',
      hidden: 'hidden',
    },
    prepare({ title, subtitle, hidden }) {
      return {
        title: `${title || 'Untitled Centre'}${hidden ? ' 🚫 [HIDDEN]' : ''}`,
        subtitle: subtitle ? `📍 ${subtitle}` : 'Regional Centre',
      };
    },
  },
});
