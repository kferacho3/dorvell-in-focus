import { Authors } from './Authors'
import { Issues } from './Issues'
import { Media } from './Media'
import { Partners } from './Partners'
import { People } from './People'
import { Places } from './Places'
import { Redirects } from './Redirects'
import { Series } from './Series'
import { Stories } from './Stories'
import { Submissions } from './Submissions'
import { Tags } from './Tags'
import { Users } from './Users'

import type { CollectionConfig } from 'payload'

export {
  Authors,
  Issues,
  Media,
  Partners,
  People,
  Places,
  Redirects,
  Series,
  Stories,
  Submissions,
  Tags,
  Users,
}

/** Ordered so the admin sidebar reads by frequency of use. */
export const COLLECTIONS: CollectionConfig[] = [
  Stories,
  Media,
  Issues,
  Series,
  Tags,
  People,
  Places,
  Partners,
  Authors,
  Redirects,
  Submissions,
  Users,
]
