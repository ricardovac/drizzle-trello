import { type Config } from 'drizzle-kit';

import { env } from '~/env.mjs';

export default {
  out: './drizzle',
  schema: './src/server/db/schema.ts',
  driver: 'mysql2',
  breakpoints: true,
  dbCredentials: {
    connectionString: env.DATABASE_URL,
  },
  tablesFilter: ['trello-clone_*'],
} satisfies Config;
