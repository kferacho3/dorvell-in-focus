import * as migration_20260811_234731_initial from './20260811_234731_initial'
import * as migration_20260812_000000_search_indexes from './20260812_000000_search_indexes'

export const migrations = [
  {
    up: migration_20260811_234731_initial.up,
    down: migration_20260811_234731_initial.down,
    name: '20260811_234731_initial',
  },
  {
    up: migration_20260812_000000_search_indexes.up,
    down: migration_20260812_000000_search_indexes.down,
    name: '20260812_000000_search_indexes',
  },
]
