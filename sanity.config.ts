import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schema } from './src/sanity/schemaTypes';
import { projectId, dataset } from './src/sanity/env';
import { structure } from './src/sanity/structure';

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  schema: {
    ...schema,
    templates: (prev) => [
      ...prev,
      {
        id: 'member-by-chapter',
        title: 'Member by Chapter',
        schemaType: 'member',
        parameters: [
          { name: 'chapterId', title: 'Chapter ID', type: 'string' },
          { name: 'chapterTitle', title: 'Chapter Title', type: 'string' },
        ],
        value: (params: { chapterId?: string; chapterTitle?: string }) => ({
          chapterRef: params.chapterId ? { _type: 'reference', _ref: params.chapterId } : undefined,
          category: params.chapterTitle || '',
        }),
      },
      {
        id: 'jesdc-centre-template',
        title: 'JESDC Centre Template',
        schemaType: 'jesdcCentre',
        parameters: [
          { name: 'centreKey', title: 'Centre Key', type: 'string' },
        ],
        value: (params: { centreKey?: string }) => {
          const key = (params?.centreKey || '').toLowerCase();
          if (key === 'delhi') {
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
          if (key === 'kolkata') {
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
          if (key === 'patna' || key === 'bihar') {
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
      },
    ],
  },
  plugins: [
    structureTool({ structure }),
  ],
});


