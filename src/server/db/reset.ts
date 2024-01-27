'use server';

import { sql } from 'drizzle-orm';
import { db } from '.';

async function reset() {
  const tableSchem = db._.schema;
  if (!tableSchem) {
    throw new Error('No schema found');
  }

  console.log('Dropping tables');
  const queries = Object.values(tableSchem).map((table) => {
    console.log(`Preparing delete query for table: ${table.dbName}`);
    return sql.raw(`TRUNCATE TABLE ${table.dbName}`);
  });

  console.log('Sending delete queries');

  await db.transaction(async (tx) => {
    await Promise.all(
      queries.map(async (query) => {
        if (query) await tx.execute(query);
      }),
    );
  });

  console.log('Database emptied');
  return;
}

reset().catch((e) => console.error(e));
