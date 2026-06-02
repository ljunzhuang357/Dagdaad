CREATE TABLE "good_deeds" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"deed_date" date DEFAULT now() NOT NULL,
	"description" text NOT NULL,
	"mood" text,
	"impact" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "idx_good_deeds_user" ON "good_deeds" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_good_deeds_user_date" ON "good_deeds" USING btree ("user_id","deed_date");