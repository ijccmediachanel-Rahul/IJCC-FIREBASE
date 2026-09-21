import type { StructureResolver } from 'sanity/structure';

type S = Parameters<StructureResolver>[0];

const singleton = (S: S, title: string, schemaType: string, documentId: string) =>
  S.listItem()
    .title(title)
    .child(S.document().schemaType(schemaType).documentId(documentId).title(title));

const group = (S: S, title: string, items: ReturnType<S['listItem']>[]) =>
  S.listItem()
    .title(title)
    .child(S.list().title(title).items(items));

// Sidebar mirrors the website: one folder per page, page texts first,
// then the content lists that appear on that page.
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Website Content')
    .items([
      singleton(S, '🏠 Home Page', 'homePage', 'homePage'),

      group(S, 'About Us Page', [
        singleton(S, 'Page Texts', 'aboutPage', 'aboutPage'),
        S.documentTypeListItem('member').title('Team & Members'),
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
