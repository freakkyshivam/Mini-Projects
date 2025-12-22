import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";

export const Users = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),

  name: varchar({ length: 250 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),

  password: text().notNull(),

  is2fa: boolean().default(false),
  isAccountVerified: boolean().default(false),

  lastLoginAt: timestamp({ withTimezone: true }),

  createdAt: timestamp({ withTimezone: true })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp({ withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),

  deletedAt: timestamp({ withTimezone: true }),
});

export default Users;
