import type { StructureResolver } from 'sanity/structure';

type S = Parameters<StructureResolver>[0];

const singleton = (S: S, title: string, schemaType: string, documentId: string) =>
  S.listItem()
    .title(title)
    .child(S.document().schemaType(schemaType).documentId(documentId).title(title));

const group = (S: S, title: string, items: (ReturnType<S['listItem']> | ReturnType<S['divider']>)[] | any[]) =>
  S.listItem()
    .title(title)
    .child(S.list().title(title).items(items));

// Sidebar mirrors the website: one folder per page, page texts first,
// then the content lists that appear on that page.
export const structure: StructureResolver = async (S, context) => {
  const client = context.getClient({ apiVersion: '2023-01-01' });
  let createdChapters: Array<{ _id: string; title: string; subtitle?: string; region?: string }> = [];

  try {
    createdChapters = await client.fetch(
      `*[_type == "chapter" && !(_id in path("drafts.**"))] | order(coalesce(order, 50) asc, title asc) { _id, title, subtitle, region }`
    );
  } catch (err) {
    console.error('Failed to load data for structure:', err);
  }

  // Dynamic helper for CMS-created chapters
  const buildDynamicChapterItem = (ch: { _id: string; title: string; subtitle?: string; region?: string }) => {
    const rawId = ch._id.replace(/^drafts\./, '');
    return S.listItem()
      .title(`📍 ${ch.title}`)
      .child(
        S.documentList()
          .title(`${ch.title} Members`)
          .schemaType('member')
          .filter(
            '_type == "member" && (chapterRef._ref == $chapterId || category == $chapterTitle || category match $chapterTitleWildcard)'
          )
          .params({
            chapterId: rawId,
            chapterTitle: ch.title,
            chapterTitleWildcard: `*${ch.title}*`,
          })
          .initialValueTemplates([
            S.initialValueTemplateItem('member-by-chapter', {
              chapterId: rawId,
              chapterTitle: ch.title,
            }),
          ])
      );
  };

  const indiaDynamicChapterItems = createdChapters
    .filter((ch) => ch.region !== 'japan' && ch.region !== 'japan-sub' && ch.region !== 'think-tank' && !ch.title.toLowerCase().includes('think tank'))
    .map(buildDynamicChapterItem);

  const japanDynamicChapterItems = createdChapters
    .filter((ch) => ch.region === 'japan' || ch.region === 'japan-sub')
    .map(buildDynamicChapterItem);

  return S.list()
    .title('Website Content')
    .items([
      singleton(S, '🏠 Home Page', 'homePage', 'homePage'),

      group(S, 'About Us Page', [
        singleton(S, 'Page Texts', 'aboutPage', 'aboutPage'),
        S.documentTypeListItem('chapter').title('🏛️ Chapters / Regions (Create & Edit Chapters)'),
        S.listItem()
          .title('👥 Team by Chapter')
          .child(
            S.list()
              .title('Team by Chapter')
              .items([
                // 1. INDIA CHAPTER (Contains Apex Council + State Chapters)
                S.listItem()
                  .title('🇮🇳 India Chapter')
                  .child(
                    S.list()
                      .title('India Chapter Teams')
                      .items([
                        S.listItem()
                          .title('🏛️ Apex Governing Council')
                          .child(
                            S.documentList()
                              .title('Apex Governing Council')
                              .schemaType('member')
                              .filter(
                                '_type == "member" && (category == "Board" || category match "*Apex*")'
                              )
                              .initialValueTemplates([
                                S.initialValueTemplateItem('member-by-chapter', {
                                  chapterId: '',
                                  chapterTitle: 'Board',
                                }),
                              ])
                          ),
                        S.divider(),
                        S.listItem()
                          .title('📍 UP Chapter Team')
                          .child(
                            S.documentList()
                              .title('UP Chapter Team')
                              .schemaType('member')
                              .filter(
                                '_type == "member" && (category == "UP Chapter Team" || category match "*UP*")'
                              )
                              .initialValueTemplates([
                                S.initialValueTemplateItem('member-by-chapter', {
                                  chapterId: '',
                                  chapterTitle: 'UP Chapter Team',
                                }),
                              ])
                          ),
                        S.listItem()
                          .title('📍 Bihar Chapter Team')
                          .child(
                            S.documentList()
                              .title('Bihar Chapter Team')
                              .schemaType('member')
                              .filter(
                                '_type == "member" && (category == "Bihar Chapter Team" || category match "*Bihar*")'
                              )
                              .initialValueTemplates([
                                S.initialValueTemplateItem('member-by-chapter', {
                                  chapterId: '',
                                  chapterTitle: 'Bihar Chapter Team',
                                }),
                              ])
                          ),
                        S.listItem()
                          .title('📍 Assam Chapter Team')
                          .child(
                            S.documentList()
                              .title('Assam Chapter Team')
                              .schemaType('member')
                              .filter(
                                '_type == "member" && (category == "Assam Chapter Team" || category match "*Assam*")'
                              )
                              .initialValueTemplates([
                                S.initialValueTemplateItem('member-by-chapter', {
                                  chapterId: '',
                                  chapterTitle: 'Assam Chapter Team',
                                }),
                              ])
                          ),
                        S.listItem()
                          .title('📍 Gujarat Chapter Team')
                          .child(
                            S.documentList()
                              .title('Gujarat Chapter Team')
                              .schemaType('member')
                              .filter(
                                '_type == "member" && (category == "Gujarat Chapter Team" || category match "*Gujarat*")'
                              )
                              .initialValueTemplates([
                                S.initialValueTemplateItem('member-by-chapter', {
                                  chapterId: '',
                                  chapterTitle: 'Gujarat Chapter Team',
                                }),
                              ])
                          ),
                        // DYNAMIC INDIA STATE CHAPTERS (e.g. Kolkata Chapter)
                        ...indiaDynamicChapterItems,
                      ])
                  ),

                // 2. JAPAN CHAPTER (Main Chapter)
                S.listItem()
                  .title('🇯🇵 Japan Chapter')
                  .child(
                    S.list()
                      .title('Japan Chapter Teams')
                      .items([
                        S.listItem()
                          .title('🇯🇵 Japan Chapter Team')
                          .child(
                            S.documentList()
                              .title('Japan Chapter Team')
                              .schemaType('member')
                              .filter(
                                '_type == "member" && (category == "Japan Chapter Team" || category match "*Japan*")'
                              )
                              .initialValueTemplates([
                                S.initialValueTemplateItem('member-by-chapter', {
                                  chapterId: '',
                                  chapterTitle: 'Japan Chapter Team',
                                }),
                              ])
                          ),
                        // DYNAMIC JAPAN SUB-CHAPTERS
                        ...japanDynamicChapterItems,
                      ])
                  ),

                // 3. ADVISORY BOARD
                S.listItem()
                  .title('🎓 Advisory Board')
                  .child(
                    S.documentList()
                      .title('Advisory Board')
                      .schemaType('member')
                      .filter(
                        '_type == "member" && (category == "Advisory" || category match "*Advisory*")'
                      )
                      .initialValueTemplates([
                        S.initialValueTemplateItem('member-by-chapter', {
                          chapterId: '',
                          chapterTitle: 'Advisory',
                        }),
                      ])
                  ),
              ])
          ),
        S.divider(),
        S.documentTypeListItem('thinkTankMember').title('💡 IJCC Think Tank'),
        S.documentTypeListItem('member').title('👥 All Chapter Members'),
      ]),

      group(S, 'Services', [
        S.documentTypeListItem('serviceItem').title('All Services'),
      ]),

      group(S, 'Members Page', [
        singleton(S, 'Page Texts & Bank Details', 'membersPage', 'membersPage'),
        S.documentTypeListItem('membershipPricing').title('Membership Prices'),
        S.documentTypeListItem('associate').title('Associates & Logos'),
      ]),

      group(S, 'Events Page', [
        singleton(S, 'Page Titles', 'eventsPage', 'eventsPage'),
        S.documentTypeListItem('event').title('All Events'),
      ]),

      group(S, 'Gallery Page', [
        singleton(S, 'Page Titles', 'galleryPage', 'galleryPage'),
        S.documentTypeListItem('galleryImage').title('All Photos'),
      ]),

      group(S, 'Resources Page', [
        singleton(S, 'Page Titles', 'resourcesPage', 'resourcesPage'),
        S.documentTypeListItem('resourceItem').title('All Resources'),
        singleton(S, 'Associates Page Titles', 'newsPage', 'newsPage'),
        S.documentTypeListItem('newsArticle').title('Associates Posts'),
      ]),

      singleton(S, 'Contact Page', 'contactPage', 'contactPage'),
      singleton(S, 'Privacy Policy', 'legalPage', 'privacyPolicy'),
      singleton(S, 'Terms of Service', 'legalPage', 'termsOfService'),

      S.divider(),

      singleton(S, '⚙️ Global Site Settings', 'siteSettings', 'siteSettings'),
    ]);
};
