import {pgTable, uuid, varchar, text, timestamp} from 'drizzle-orm/pg-core'

export const Users = pgTable("users",{
    id : uuid().primaryKey(),
    email : varchar({length:255}).unique().notNull(),
    password : text().notNull(),
    createdAt : timestamp().defaultNow(),
    updatedAt : timestamp().defaultNow().$onUpdate(()=>new Date())
})