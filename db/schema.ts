// db/schema.ts
// The shape of our database table, written with Drizzle ORM.
// Drizzle reads this file to generate the SQL migration in netlify/database/migrations/.
import { pgTable, serial, text, integer, timestamp, index } from "drizzle-orm/pg-core";

export const images = pgTable(
  "images",
  {
    id: serial().primaryKey(), // 1, 2, 3 ... created automatically
    name: text().notNull(), // the file name people see and search for
    blobKey: text("blob_key").notNull().unique(), // where the file lives in Netlify Blobs
    contentType: text("content_type").notNull(), // e.g. "image/png"
    size: integer().notNull(), // file size in bytes
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("images_created_at_idx").on(table.createdAt)]
);
