import { InferModel } from "drizzle-orm"
import {pgTable,uuid,varchar,text,timestamp} from "drizzle-orm/pg-core"
import { userTable } from "./user.model"
export const urlsTable = pgTable('urls',{
    id: uuid().primaryKey().defaultRandom().notNull(),

    shortCode: varchar('code', {length:130}).notNull().unique(),
    targetUrl : text('target_url').notNull(),

    userId : uuid('user_id').references(()=> userTable.id).notNull(),

    createdAt : timestamp('created_at').defaultNow().notNull(),
    updatedAt : timestamp('updated_at').$onUpdate(()=> new Date()),
})

 
export type Urls = InferModel<typeof urlsTable>;
export type NewUrls = InferModel<typeof urlsTable, "insert">