import * as migration_20261013_092139_initial from './20261013_092139_initial';
import * as migration_20261015_055953_storage_fields from './20261015_055953_storage_fields';

export const migrations = [
  {
    up: migration_20261013_092139_initial.up,
    down: migration_20261013_092139_initial.down,
    name: '20261013_092139_initial',
  },
  {
    up: migration_20261015_055953_storage_fields.up,
    down: migration_20261015_055953_storage_fields.down,
    name: '20261015_055953_storage_fields'
  },
];
