import * as migration_20261013_092139_initial from './20261013_092139_initial';

export const migrations = [
  {
    up: migration_20261013_092139_initial.up,
    down: migration_20261013_092139_initial.down,
    name: '20261013_092139_initial'
  },
];
