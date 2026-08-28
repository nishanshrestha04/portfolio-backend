import { pgTable, uuid, varchar, text, jsonb, boolean, integer, timestamp, date } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const profile = pgTable('profile', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull(),
  socials: jsonb('socials').$type<{ name: string; href: string }[]>(),
  currentlyExploring: jsonb('currently_exploring').$type<string[]>(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  category: varchar('category', { length: 255 }),
  overview: text('overview'),
  problem: text('problem'),
  approach: text('approach'),
  architecture: jsonb('architecture').$type<string[]>(),
  technologies: jsonb('technologies').$type<string[]>(),
  imageUrl: varchar('image_url', { length: 1024 }),
  liveUrl: varchar('live_url', { length: 1024 }),
  githubUrl: varchar('github_url', { length: 1024 }),
  isFeatured: boolean('is_featured').default(false),
  orderIndex: integer('order_index').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

export const experiences = pgTable('experiences', {
  id: uuid('id').primaryKey().defaultRandom(),
  role: varchar('role', { length: 255 }).notNull(),
  company: varchar('company', { length: 255 }).notNull(),
  period: varchar('period', { length: 255 }),
  description: jsonb('description').$type<string[]>(),
  logoUrl: varchar('logo_url', { length: 1024 }),
  orderIndex: integer('order_index').default(0),
});

export const articles = pgTable('articles', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  brief: text('brief'),
  contentUrl: varchar('content_url', { length: 1024 }),
  coverImageUrl: varchar('cover_image_url', { length: 1024 }),
  publishedDate: date('published_date'),
  readTime: integer('read_time'),
  tags: jsonb('tags').$type<string[]>(),
  orderIndex: integer('order_index').default(0),
});

export const toolkit = pgTable('toolkit', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  iconUrl: varchar('icon_url', { length: 1024 }),
  category: varchar('category', { length: 255 }),
  orderIndex: integer('order_index').default(0),
});

export const contacts = pgTable('contacts', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  message: text('message').notNull(),
  status: varchar('status', { length: 50 }).default('unread'),
  createdAt: timestamp('created_at').defaultNow(),
});
