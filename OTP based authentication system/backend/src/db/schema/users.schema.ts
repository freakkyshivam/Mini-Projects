import {pgTable, uuid, varchar, text, timestamp} from 'drizzle-orm/pg-core'

export const Users = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 250 }).notNull(),
  email: varchar({ length: 255 }).unique().notNull(),
  password: text().notNull(),

  createdAt: timestamp({withTimezone:true}).defaultNow().notNull(),
  updatedAt: timestamp({withTimezone:true})
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});


export default Users