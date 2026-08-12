import { sql } from '@payloadcms/db-postgres'

import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

/**
 * Search indexes (plan §6.8).
 *
 * Hand-written rather than generated, because Payload's schema layer has no
 * concept of a full-text index — this is the part of ADR-0005 that Postgres
 * provides and SQLite could not, and the reason the local database is real
 * Postgres.
 *
 * Two complementary indexes:
 *
 *   1. A GIN index over a weighted `tsvector`. Weights matter: a query word in
 *      a headline should outrank the same word buried in a transcript, and
 *      without weighting a long film transcript drowns out every short essay.
 *      A = title, B = kicker + dek, C = the flattened body and captions.
 *
 *   2. A trigram index on the title, so a misspelled or partial query still
 *      finds the piece. "unbraded" should reach Unbraided.
 *
 * The expression in index 1 must match `buildSearchVector()` in
 * lib/search/postgres.ts exactly, or Postgres will do a sequential scan and
 * silently lose the benefit.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE EXTENSION IF NOT EXISTS pg_trgm;
    CREATE EXTENSION IF NOT EXISTS unaccent;

    CREATE INDEX IF NOT EXISTS stories_search_vector_idx
      ON stories
      USING GIN ((
        setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(kicker, '')), 'B') ||
        setweight(to_tsvector('english', coalesce(dek, '')), 'B') ||
        setweight(to_tsvector('english', coalesce(search_document, '')), 'C')
      ));

    CREATE INDEX IF NOT EXISTS stories_title_trgm_idx
      ON stories
      USING GIN (title gin_trgm_ops);

    CREATE INDEX IF NOT EXISTS people_name_trgm_idx
      ON people
      USING GIN (name gin_trgm_ops);

    CREATE INDEX IF NOT EXISTS places_name_trgm_idx
      ON places
      USING GIN (name gin_trgm_ops);

    CREATE INDEX IF NOT EXISTS partners_name_trgm_idx
      ON partners
      USING GIN (name gin_trgm_ops);

    CREATE INDEX IF NOT EXISTS tags_label_trgm_idx
      ON tags
      USING GIN (label gin_trgm_ops);
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Extensions are left in place: other things may depend on them, and
  // dropping a shared extension during a rollback is a wider blast radius than
  // the migration ever had.
  await db.execute(sql`
    DROP INDEX IF EXISTS stories_search_vector_idx;
    DROP INDEX IF EXISTS stories_title_trgm_idx;
    DROP INDEX IF EXISTS people_name_trgm_idx;
    DROP INDEX IF EXISTS places_name_trgm_idx;
    DROP INDEX IF EXISTS partners_name_trgm_idx;
    DROP INDEX IF EXISTS tags_label_trgm_idx;
  `)
}
