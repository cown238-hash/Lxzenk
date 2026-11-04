// db/index.js
// Creates one database client we can import anywhere on the server.
// Netlify connects it automatically, so no connection string is needed.
import { drizzle } from "drizzle-orm/netlify-db";
import * as schema from "./schema";

export const db = drizzle({ schema });
