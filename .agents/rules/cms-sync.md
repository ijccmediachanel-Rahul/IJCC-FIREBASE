# Rule: CMS and Website Synchronization

1. **Always Sync CMS with Website Changes**:
   - Whenever any section, page, navigation item, or feature is added, moved, or updated on the website, ALWAYS update the Sanity CMS schema (`src/sanity/schemaTypes/*`) and Sanity desk structure (`src/sanity/structure.ts`) accordingly.
   - The CMS structure must accurately mirror the website's organization so the website owner has full control over all content from `/studio`.

2. **Database Record / Document Creation**:
   - If a new content item or section is introduced, ensure corresponding documents are created or updated in the Sanity dataset so they appear immediately in Sanity Studio for the owner.

3. **Dynamic-First Code**:
   - All frontend components must fetch and prioritize CMS data dynamically (via GROQ queries).
   - Never hardcode content in a way that prevents CMS updates from reflecting on the live site.
   - Use fallback constants or translations only when CMS data is not yet provided, and make sure custom CMS entries smoothly override defaults.
