import { defineConfig } from "drizzle-kit";

// Tells drizzle-kit where the schema is and where to write SQL migrations.
// Netlify applies the migrations in netlify/database/migrations on every deploy.
export default defineConfig({
  dialect: "postgresql",
  schema: "./db/schema.ts",
  out: "netlify/database/migrations",
});
