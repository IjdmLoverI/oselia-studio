import * as migration_20261013_092139_initial from './20261013_092139_initial';
import * as migration_20261015_055953_storage_fields from './20261015_055953_storage_fields';
import * as migration_20261015_084730_assistant from './20261015_084730_assistant';
import * as migration_20261015_122146_conversation_pending_booking from './20261015_122146_conversation_pending_booking';

export const migrations = [
  {
    up: migration_20261013_092139_initial.up,
    down: migration_20261013_092139_initial.down,
    name: '20261013_092139_initial',
  },
  {
    up: migration_20261015_055953_storage_fields.up,
    down: migration_20261015_055953_storage_fields.down,
    name: '20261015_055953_storage_fields',
  },
  {
    up: migration_20261015_084730_assistant.up,
    down: migration_20261015_084730_assistant.down,
    name: '20261015_084730_assistant',
  },
  {
    up: migration_20261015_122146_conversation_pending_booking.up,
    down: migration_20261015_122146_conversation_pending_booking.down,
    name: '20261015_122146_conversation_pending_booking'
  },
];
