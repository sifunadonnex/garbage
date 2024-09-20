import { integer, varchar, pgTable, serial, text, timestamp, jsonb, boolean } from 'drizzle-orm/pg-core'

export const Users = pgTable('users', {
    id: serial('id').primaryKey(),
    email: varchar('email', { length: 255 }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const Reports = pgTable('reports', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => Users.id).notNull(),
    location: text('location').notNull(),
    wasteType: text('waste_type').notNull(),
    amount: varchar('amount', { length: 255 }).notNull(),
    imageUrl: text('image_url'),
    verificationResult: jsonb('verification_result'),
    status: varchar('status', { length: 255 }).default('pending'),
    collectorId: integer('collector_id').references(() => Users.id),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const Rewards = pgTable('rewards', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => Users.id).notNull(),
    points: integer('points').notNull().default(0),
    isAvailable: boolean('is_available').notNull().default(true),
    description: text('description'),
    name: varchar('name', { length: 255 }).notNull(),
    collectionInfo: text('collection_info').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const CollectedWastes = pgTable('collected_waste', {
    id: serial('id').primaryKey(),
    reportId: integer('report_id').references(() => Reports.id).notNull(),
    collectorId: integer('collector_id').references(() => Users.id).notNull(),
    collectionDate: timestamp('collection_date').notNull(),
    status: varchar('status', { length: 255 }).default('collected'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const Notifications = pgTable('notifications', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => Users.id).notNull(),
    type: varchar('type', { length: 255 }).notNull(),
    message: text('message').notNull(),
    isRead: boolean('is_read').notNull().default(false),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const Transactions = pgTable('transactions', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => Users.id).notNull(),
    amount: integer('amount').notNull(),
    type: varchar('type', { length: 255 }).notNull(),
    description: text('description'),
    date: timestamp('date').defaultNow(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});