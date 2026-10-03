#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/79fdcda95e3377e389edf470b613589cb8daf9c095390b2812b59fe599a60c6f/contract';
import endContract from '../../snapshots/79fdcda95e3377e389edf470b613589cb8daf9c095390b2812b59fe599a60c6f/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  fn,
  lit,
  primaryKey,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createTable({
        schema: 'public',
        table: 'AdminCourse',
        columns: [
          col('courseId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('userId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['userId', 'courseId'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'AdminCourseUnit',
        columns: [
          col('courseUnitId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('userId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['userId', 'courseUnitId'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Class',
        columns: [
          col('courseUnitId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('type', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('vacancies', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Course',
        columns: [
          col('acronym', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('facultyId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'CourseUnit',
        columns: [
          col('acronym', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('courseId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('id', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('semester', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('year', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Enrollment',
        columns: [
          col('classId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('userId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'EnrollmentRequest',
        columns: [
          col('adminState', 'text', {
            notNull: true,
            default: lit('UNTREATED'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('userId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'EnrollmentRequest_adminState_check_bf2f7403',
            "\"adminState\" IN ('UNTREATED', 'APPROVED', 'DENIED')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'EnrollmentRequestOption',
        columns: [
          col('courseUnitId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('enrolling', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('enrollmentRequestId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'ExchangeItem',
        columns: [
          col('courseUnitId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('exchangeRequestId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('fromClassId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('toClassId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'ExchangePeriod',
        columns: [
          col('courseId', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('courseUnitId', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('endDate', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('startDate', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'ExchangeRequest',
        columns: [
          col('adminState', 'text', {
            notNull: true,
            default: lit('UNTREATED'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('creatorId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('message', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('PENDING'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('targetUserId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('type', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'ExchangeRequest_adminState_check_bf2f7403',
            "\"adminState\" IN ('UNTREATED', 'APPROVED', 'DENIED')",
          ),
          checkExpression(
            'ExchangeRequest_status_check_fcf883e8',
            "\"status\" IN ('PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED', 'COMPLETED')",
          ),
          checkExpression(
            'ExchangeRequest_type_check_a5efca2d',
            "\"type\" IN ('DIRECT', 'MARKETPLACE', 'URGENT')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'Faculty',
        columns: [
          col('acronym', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('name', 'text', { codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['acronym'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'ScheduleSlot',
        columns: [
          col('classId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('dayOfWeek', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('duration', 'numeric', { notNull: true, codecRef: { codecId: 'pg/numeric@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('location', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('startTime', 'numeric', { notNull: true, codecRef: { codecId: 'pg/numeric@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'User',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('email', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('isAdmin', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'Class',
        constraint: 'Class_name_courseUnitId_key',
        columns: ['name', 'courseUnitId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'Enrollment',
        constraint: 'Enrollment_userId_classId_key',
        columns: ['userId', 'classId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'User',
        constraint: 'User_email_key',
        columns: ['email'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'AdminCourse',
        index: 'AdminCourse_courseId_idx_12f72d2a',
        columns: ['courseId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'AdminCourse',
        index: 'AdminCourse_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'AdminCourseUnit',
        index: 'AdminCourseUnit_courseUnitId_idx_fae358e6',
        columns: ['courseUnitId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'AdminCourseUnit',
        index: 'AdminCourseUnit_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Class',
        index: 'Class_courseUnitId_idx_fae358e6',
        columns: ['courseUnitId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Course',
        index: 'Course_facultyId_idx_ff3b8c32',
        columns: ['facultyId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'CourseUnit',
        index: 'CourseUnit_courseId_idx_12f72d2a',
        columns: ['courseId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Enrollment',
        index: 'Enrollment_classId_idx_0089e5e7',
        columns: ['classId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Enrollment',
        index: 'Enrollment_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'EnrollmentRequest',
        index: 'EnrollmentRequest_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'EnrollmentRequestOption',
        index: 'EnrollmentRequestOption_courseUnitId_idx_fae358e6',
        columns: ['courseUnitId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'EnrollmentRequestOption',
        index: 'EnrollmentRequestOption_enrollmentRequestId_idx_6fc8c6a4',
        columns: ['enrollmentRequestId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ExchangeItem',
        index: 'ExchangeItem_exchangeRequestId_idx_d1e39232',
        columns: ['exchangeRequestId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ExchangeItem',
        index: 'ExchangeItem_toClassId_fromClassId_idx_be4174c9',
        columns: ['toClassId', 'fromClassId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ExchangePeriod',
        index: 'ExchangePeriod_courseId_idx_12f72d2a',
        columns: ['courseId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ExchangePeriod',
        index: 'ExchangePeriod_courseUnitId_idx_fae358e6',
        columns: ['courseUnitId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ExchangeRequest',
        index: 'ExchangeRequest_creatorId_idx_3a77d800',
        columns: ['creatorId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ExchangeRequest',
        index: 'ExchangeRequest_status_type_idx_8a375436',
        columns: ['status', 'type'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ExchangeRequest',
        index: 'ExchangeRequest_targetUserId_idx_e0d638f0',
        columns: ['targetUserId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ScheduleSlot',
        index: 'ScheduleSlot_classId_idx_0089e5e7',
        columns: ['classId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'AdminCourse',
        foreignKey: {
          name: 'AdminCourse_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'AdminCourse',
        foreignKey: {
          name: 'AdminCourse_courseId_fkey',
          columns: ['courseId'],
          references: { schema: 'public', table: 'Course', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'AdminCourseUnit',
        foreignKey: {
          name: 'AdminCourseUnit_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'AdminCourseUnit',
        foreignKey: {
          name: 'AdminCourseUnit_courseUnitId_fkey',
          columns: ['courseUnitId'],
          references: { schema: 'public', table: 'CourseUnit', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Class',
        foreignKey: {
          name: 'Class_courseUnitId_fkey',
          columns: ['courseUnitId'],
          references: { schema: 'public', table: 'CourseUnit', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Course',
        foreignKey: {
          name: 'Course_facultyId_fkey',
          columns: ['facultyId'],
          references: { schema: 'public', table: 'Faculty', columns: ['acronym'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'CourseUnit',
        foreignKey: {
          name: 'CourseUnit_courseId_fkey',
          columns: ['courseId'],
          references: { schema: 'public', table: 'Course', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Enrollment',
        foreignKey: {
          name: 'Enrollment_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Enrollment',
        foreignKey: {
          name: 'Enrollment_classId_fkey',
          columns: ['classId'],
          references: { schema: 'public', table: 'Class', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'EnrollmentRequest',
        foreignKey: {
          name: 'EnrollmentRequest_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'EnrollmentRequestOption',
        foreignKey: {
          name: 'EnrollmentRequestOption_enrollmentRequestId_fkey',
          columns: ['enrollmentRequestId'],
          references: { schema: 'public', table: 'EnrollmentRequest', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'EnrollmentRequestOption',
        foreignKey: {
          name: 'EnrollmentRequestOption_courseUnitId_fkey',
          columns: ['courseUnitId'],
          references: { schema: 'public', table: 'CourseUnit', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'ExchangeItem',
        foreignKey: {
          name: 'ExchangeItem_exchangeRequestId_fkey',
          columns: ['exchangeRequestId'],
          references: { schema: 'public', table: 'ExchangeRequest', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'ExchangePeriod',
        foreignKey: {
          name: 'ExchangePeriod_courseId_fkey',
          columns: ['courseId'],
          references: { schema: 'public', table: 'Course', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'ExchangePeriod',
        foreignKey: {
          name: 'ExchangePeriod_courseUnitId_fkey',
          columns: ['courseUnitId'],
          references: { schema: 'public', table: 'CourseUnit', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'ExchangeRequest',
        foreignKey: {
          name: 'ExchangeRequest_creatorId_fkey',
          columns: ['creatorId'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'ExchangeRequest',
        foreignKey: {
          name: 'ExchangeRequest_targetUserId_fkey',
          columns: ['targetUserId'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'ScheduleSlot',
        foreignKey: {
          name: 'ScheduleSlot_classId_fkey',
          columns: ['classId'],
          references: { schema: 'public', table: 'Class', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
