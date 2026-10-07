#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/f09b3a203ecdd38cc9a0b25a41802d6a320a5d01081e38438860eb8632b5cc34/contract';
import startContract from '../../snapshots/f09b3a203ecdd38cc9a0b25a41802d6a320a5d01081e38438860eb8632b5cc34/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/fda4300bbb1ed583347cf82a396e766437fe71ec568356f983431a24dacef546/contract';
import endContract from '../../snapshots/fda4300bbb1ed583347cf82a396e766437fe71ec568356f983431a24dacef546/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, lit, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'PlannerState',
        columns: [
          col('schemaVersion', 'int4', {
            notNull: true,
            default: lit(1),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('state', 'json', { notNull: true, codecRef: { codecId: 'pg/json@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('userId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('year', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['userId', 'year'])],
      }),
      this.createIndex({
        schema: 'public',
        table: 'PlannerState',
        index: 'PlannerState_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'PlannerState',
        foreignKey: {
          name: 'PlannerState_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
