CREATE TABLE "images" (
	"id" serial PRIMARY KEY,
	"name" text NOT NULL,
	"blob_key" text NOT NULL UNIQUE,
	"content_type" text NOT NULL,
	"size" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "images_created_at_idx" ON "images" ("created_at");