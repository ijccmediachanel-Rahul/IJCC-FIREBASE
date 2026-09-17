import { defineCliConfig } from 'sanity/cli';

// CLI-only config (used by `sanity dataset import`, deploys, etc.).
// Project IDs are public identifiers, not secrets.
export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '4j8vl1ls',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  },
});
