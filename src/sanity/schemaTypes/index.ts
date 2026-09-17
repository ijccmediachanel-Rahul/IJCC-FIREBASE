import { type SchemaTypeDefinition } from 'sanity';
import { siteSettings } from './siteSettings';
import { membershipPricing } from './membershipPricing';
import { event } from './event';
import { eventsPage } from './eventsPage';
import { member } from './member';
import { associate } from './associate';
import { membersPage } from './membersPage';
import { galleryImage } from './galleryImage';
import { galleryPage } from './galleryPage';
import { resourcesPage } from './resourcesPage';
import { legalPage } from './legalPage';
import { homePage } from './homePage';
import { aboutPage } from './aboutPage';
import { contactPage } from './contactPage';
import { newsArticle } from './newsArticle';
import { newsPage } from './newsPage';
import { resourceItem } from './resourceItem';
import { serviceItem } from './serviceItem';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    siteSettings,
    homePage,
    aboutPage,
    contactPage,
    membersPage,
    membershipPricing,
    event,
    eventsPage,
    member,
    associate,
    galleryImage,
    galleryPage,
    resourceItem,
    resourcesPage,
    legalPage,
    newsArticle,
    newsPage,
    serviceItem,
  ],
};
