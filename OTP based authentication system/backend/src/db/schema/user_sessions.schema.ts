import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  inet,
} from "drizzle-orm/pg-core";

import Users from "./users.schema";

export const UserSessions = pgTable("user_sessions", {
  id: text().primaryKey(),

  userId: uuid()
    .notNull()
    .references(() => Users.id, { onDelete: "cascade" }),

  refreshToken: text().notNull(),

  deviceName: text(),      
  deviceType: text(),      
  os: text(),              
  browser: text(),         
  ipAddress: inet(),      

  isActive: boolean().default(true),

  lastUsedAt: timestamp({ withTimezone: true })
    .defaultNow(),

  createdAt: timestamp({ withTimezone: true })
    .defaultNow()
    .notNull(),

  revokedAt: timestamp({ withTimezone: true }),
});

export default UserSessions