import { defineField, defineType } from 'sanity';

export const jesdcPage = defineType({
  name: 'jesdcPage',
  title: 'JESDC Centres Page',
  type: 'document',
  fields: [
    defineField({
      name: 'bannerBadge',
      title: 'Banner Badge',
      type: 'string',
      initialValue: 'An Initiative of IJCC',
    }),
    defineField({
      name: 'bannerTitle',
      title: 'Banner Main Title',
      type: 'string',
      initialValue: 'JESDC Centres',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'bannerSubtitle',
      title: 'Banner Subtitle',
      type: 'string',
      initialValue: 'Japan Education & Skill Development Centre',
    }),
    defineField({
      name: 'bannerTagline',
      title: 'Banner Tagline',
      type: 'string',
      initialValue: 'Learn Japanese. Build Skills. Create Your Future in Japan.',
    }),
    defineField({
      name: 'bannerDescription',
      title: 'Banner Description',
      type: 'text',
      initialValue:
        "JESDC is IJCC's network of training and guidance centres. Each centre offers Japanese language training, career preparation and admission support for students and professionals who want to work or study in Japan.",
    }),
    defineField({
      name: 'objectivesTitle',
      title: 'Objectives Section Title',
      type: 'string',
      initialValue: 'Our Objectives & Programs',
    }),
    defineField({
      name: 'objectivesSubtitle',
      title: 'Objectives Section Subtitle',
      type: 'string',
      initialValue: 'Comprehensive Japanese language pathways tailored for careers, industry and higher studies in Japan.',
    }),
    defineField({
      name: 'objectives',
      title: 'Training Programs & Objectives',
      description: 'Add, edit, or reorder training programs offered across JESDC network. Click "+ Add item" to add a new program.',
      type: 'array',
      initialValue: [
        {
          number: '01',
          title: 'Japanese Language for SSW / TITP Candidates (Blue-Collar Jobs)',
          category: 'SSW / TITP Trades',
          description:
            'Practical Japanese training for ITI, diploma and skilled-trade candidates preparing for the Specified Skilled Worker (SSW) and Technical Intern Training Program (TITP) routes.',
          points: [
            'Basic to elementary Japanese (JLPT N5/N4 and JFT-Basic preparation)',
            'Workplace and safety vocabulary for manufacturing, construction, caregiving, hospitality, agriculture and more',
            'Japanese work culture, discipline and daily-life orientation',
          ],
        },
        {
          number: '02',
          title: 'Japanese Language for University Students (BCA, B.Tech, B.Sc and more)',
          category: 'Colleges & Higher Ed',
          description:
            'Structured Japanese language programs tailored to college semesters, opening high-value global recruitment pathways.',
          points: [
            'Structured courses from beginner level to JLPT N3',
            'Flexible timings alongside regular college schedules',
            'Preparation for placements with Japanese companies in India and Japan',
          ],
        },
        {
          number: '03',
          title: 'Japanese Language for Professionals (IT and Non-IT)',
          category: 'Working Professionals',
          description:
            'Specialized language, technical vocabulary, and cross-cultural communication for software engineers, testers, and corporate executives.',
          points: [
            'Business Japanese, email writing and meeting etiquette',
            'IT-specific communication for engineers, testers and project teams',
            'Weekend and evening batches for working professionals',
            'Preparation for JLPT N3, N2 and above',
          ],
        },
        {
          number: '04',
          title: 'Japanese Language for Students Planning Further Study',
          category: 'Study in Japan',
          description:
            'Rigorous academic Japanese language training preparing students for admissions into Japan’s top language schools and universities.',
          points: [
            'Preparation for JLPT and NAT-TEST examination certifications',
            'Academic Japanese: reading, writing, listening and spoken fluency',
            'Interview and essay preparation for Japanese language institutes and universities',
          ],
        },
        {
          number: '05',
          title: 'Admission Assistance for Japanese Universities',
          category: 'University Admissions',
          description:
            'Direct advisory and document translation support for Indian students aiming for direct entry into undergraduate or postgraduate courses in Japan.',
          points: [
            'Course and university selection counselling across Japanese institutions',
            'Application, documentation and statement-of-purpose (SOP) support',
            'Guidance on MEXT scholarships, JASSO grants and university-specific funding',
            'Orientation on living in Japan, accommodation and social culture',
          ],
        },
        {
          number: '06',
          title: 'Japanese Library and Audio-Visual Classroom',
          category: 'Immersive Infrastructure',
          description:
            'State-of-the-art learning infrastructure housed in every centre for deep interactive and cultural immersion.',
          points: [
            'Japanese library: textbooks, JLPT practice material, graded readers, dictionaries, manga and books on Japanese culture',
            'Audio-visual classroom: listening labs, films, video lessons and interactive tools for immersive learning',
          ],
        },
      ],
      of: [
        {
          type: 'object',
          preview: { select: { title: 'title', subtitle: 'category' } },
          fields: [
            { name: 'number', title: 'Program No. (e.g. 01)', type: 'string' },
            { name: 'title', title: 'Program Title', type: 'string' },
            { name: 'category', title: 'Target Group / Badge', type: 'string' },
            { name: 'description', title: 'Overview Description', type: 'text' },
            {
              name: 'points',
              title: 'Curriculum Highlights (Bullet points)',
              type: 'array',
              of: [{ type: 'string' }],
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'whyJesdcTitle',
      title: 'Why JESDC Section Title',
      type: 'string',
      initialValue: 'Why Choose JESDC?',
    }),
    defineField({
      name: 'whyJesdcSubtitle',
      title: 'Why JESDC Subtitle',
      type: 'string',
      initialValue: 'The definitive India-Japan skilling network with accredited corporate ties and visa guidance.',
    }),
    defineField({
      name: 'whyJesdcPoints',
      title: 'Why JESDC Value Propositions',
      type: 'array',
      initialValue: [
        {
          title: 'Backed by IJCC — Trusted Bilateral Platform',
          description:
            'Established under the aegis of Indo-Japan Chamber of Commerce, bridging students directly to accredited institutions, mentors, and corporate networks.',
        },
        {
          title: 'End-to-End Pathway in One Place',
          description:
            'From introductory Japanese language lessons to exam certifications, career placement, university admissions, and visa support under a single roof.',
        },
        {
          title: 'Training Built Around Real Jobs in Japan',
          description:
            'Curriculum tailored to genuine workplace standards, Specified Skilled Worker (SSW) mandates, and practical Japanese corporate etiquette.',
        },
        {
          title: 'Modern Libraries & Interactive AV Labs',
          description:
            'Every centre provides physical library access, graded JLPT materials, listening labs, and cultural workshops for immersive fluency.',
        },
      ],
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: 'Title', type: 'string' },
            { name: 'description', title: 'Description', type: 'text' },
          ],
        },
      ],
    }),
    defineField({
      name: 'openCentreTitle',
      title: 'Partner with Us Title',
      type: 'string',
      initialValue: 'Partner with Us — Open a JESDC Centre',
    }),
    defineField({
      name: 'openCentreDescription',
      title: 'Partner with Us Description',
      type: 'text',
      initialValue:
        'Colleges, technical institutes, and educational organizations across India can join the accredited JESDC Network to establish Japanese language training centres with curriculum and placement guidance backed by IJCC.',
    }),
    defineField({
      name: 'ctaTitle',
      title: 'Call to Action Title',
      type: 'string',
      initialValue: 'Find your nearest JESDC Centre and enrol today.',
    }),
    defineField({
      name: 'centralHelpline',
      title: 'Central Helpline Number',
      type: 'string',
      initialValue: '+91-92679 19281',
    }),
    defineField({
      name: 'centralEmail',
      title: 'Central Enquiry Email',
      type: 'string',
      initialValue: 'info@ijcc.in',
    }),
  ],
});
