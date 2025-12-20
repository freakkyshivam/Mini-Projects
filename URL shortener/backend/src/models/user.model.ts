import { InferModel } from "drizzle-orm"
import {pgTable,uuid,varchar,text,timestamp} from "drizzle-orm/pg-core"

export const userTable = pgTable('users',{
    id: uuid().primaryKey().defaultRandom().notNull(),

    firstName : varchar('first_name',{length:235}).notNull(),
    lastName : varchar('last_name',{length:235}),

    email : varchar().unique().notNull(),

    password : text().notNull(),
    
    createdAt : timestamp('created_at').defaultNow().notNull(),
    updatedAt : timestamp('updated_at').$onUpdate(()=> new Date()),
})

export type User = InferModel<typeof userTable>;
export type NewUser = InferModel<typeof userTable, "insert">