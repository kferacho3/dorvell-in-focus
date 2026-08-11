import * as migration_20260811_234731_initial from './20260811_234731_initial';

export const migrations = [
  {
    up: migration_20260811_234731_initial.up,
    down: migration_20260811_234731_initial.down,
    name: '20260811_234731_initial'
  },
];
