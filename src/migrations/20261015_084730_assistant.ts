import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_bookings_renovation_type" AS ENUM('cosmetic', 'capital', 'designer');
  CREATE TYPE "public"."enum_bookings_status" AS ENUM('new', 'confirmed', 'done', 'cancelled');
  CREATE TYPE "public"."enum_bookings_source" AS ENUM('admin', 'web', 'telegram');
  CREATE TYPE "public"."enum_conversations_messages_role" AS ENUM('user', 'assistant');
  CREATE TYPE "public"."enum_conversations_channel" AS ENUM('web', 'telegram');
  CREATE TYPE "public"."enum_assistant_settings_schedule_work_days" AS ENUM('mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun');
  CREATE TABLE "bookings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"visit_at" timestamp(3) with time zone NOT NULL,
  	"address" varchar NOT NULL,
  	"renovation_type" "enum_bookings_renovation_type",
  	"area" numeric,
  	"notes" varchar,
  	"status" "enum_bookings_status" DEFAULT 'new' NOT NULL,
  	"source" "enum_bookings_source" DEFAULT 'admin' NOT NULL,
  	"locale" varchar,
  	"conversation_id" integer,
  	"slot" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "conversations_messages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"role" "enum_conversations_messages_role" NOT NULL,
  	"at" timestamp(3) with time zone NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "conversations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"channel" "enum_conversations_channel" NOT NULL,
  	"external_id" varchar NOT NULL,
  	"locale" varchar,
  	"booking_id" integer,
  	"last_message_at" timestamp(3) with time zone,
  	"tokens" numeric DEFAULT 0,
  	"ip_hash" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "assistant_settings_schedule_work_days" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_assistant_settings_schedule_work_days",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "assistant_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"schedule_day_start" numeric DEFAULT 10 NOT NULL,
  	"schedule_day_end" numeric DEFAULT 18 NOT NULL,
  	"schedule_slot_minutes" numeric DEFAULT 120 NOT NULL,
  	"schedule_days_ahead" numeric DEFAULT 14 NOT NULL,
  	"schedule_min_notice_hours" numeric DEFAULT 12 NOT NULL,
  	"limits_per_client" numeric DEFAULT 20 NOT NULL,
  	"limits_per_day" numeric DEFAULT 300 NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "assistant_settings_locales" (
  	"greeting" varchar NOT NULL,
  	"visit_info" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "bookings_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "conversations_id" integer;
  ALTER TABLE "bookings" ADD CONSTRAINT "bookings_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "conversations_messages" ADD CONSTRAINT "conversations_messages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "conversations" ADD CONSTRAINT "conversations_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "assistant_settings_schedule_work_days" ADD CONSTRAINT "assistant_settings_schedule_work_days_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."assistant_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "assistant_settings_locales" ADD CONSTRAINT "assistant_settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."assistant_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "bookings_visit_at_idx" ON "bookings" USING btree ("visit_at");
  CREATE INDEX "bookings_conversation_idx" ON "bookings" USING btree ("conversation_id");
  CREATE UNIQUE INDEX "bookings_slot_idx" ON "bookings" USING btree ("slot");
  CREATE INDEX "bookings_updated_at_idx" ON "bookings" USING btree ("updated_at");
  CREATE INDEX "bookings_created_at_idx" ON "bookings" USING btree ("created_at");
  CREATE INDEX "conversations_messages_order_idx" ON "conversations_messages" USING btree ("_order");
  CREATE INDEX "conversations_messages_parent_id_idx" ON "conversations_messages" USING btree ("_parent_id");
  CREATE INDEX "conversations_booking_idx" ON "conversations" USING btree ("booking_id");
  CREATE INDEX "conversations_last_message_at_idx" ON "conversations" USING btree ("last_message_at");
  CREATE INDEX "conversations_ip_hash_idx" ON "conversations" USING btree ("ip_hash");
  CREATE INDEX "conversations_updated_at_idx" ON "conversations" USING btree ("updated_at");
  CREATE INDEX "conversations_created_at_idx" ON "conversations" USING btree ("created_at");
  CREATE UNIQUE INDEX "channel_externalId_idx" ON "conversations" USING btree ("channel","external_id");
  CREATE INDEX "assistant_settings_schedule_work_days_order_idx" ON "assistant_settings_schedule_work_days" USING btree ("order");
  CREATE INDEX "assistant_settings_schedule_work_days_parent_idx" ON "assistant_settings_schedule_work_days" USING btree ("parent_id");
  CREATE UNIQUE INDEX "assistant_settings_locales_locale_parent_id_unique" ON "assistant_settings_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_bookings_fk" FOREIGN KEY ("bookings_id") REFERENCES "public"."bookings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_conversations_fk" FOREIGN KEY ("conversations_id") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_bookings_id_idx" ON "payload_locked_documents_rels" USING btree ("bookings_id");
  CREATE INDEX "payload_locked_documents_rels_conversations_id_idx" ON "payload_locked_documents_rels" USING btree ("conversations_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "bookings" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "conversations_messages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "conversations" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "assistant_settings_schedule_work_days" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "assistant_settings" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "assistant_settings_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "bookings" CASCADE;
  DROP TABLE "conversations_messages" CASCADE;
  DROP TABLE "conversations" CASCADE;
  DROP TABLE "assistant_settings_schedule_work_days" CASCADE;
  DROP TABLE "assistant_settings" CASCADE;
  DROP TABLE "assistant_settings_locales" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_bookings_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_conversations_fk";
  
  DROP INDEX "payload_locked_documents_rels_bookings_id_idx";
  DROP INDEX "payload_locked_documents_rels_conversations_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "bookings_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "conversations_id";
  DROP TYPE "public"."enum_bookings_renovation_type";
  DROP TYPE "public"."enum_bookings_status";
  DROP TYPE "public"."enum_bookings_source";
  DROP TYPE "public"."enum_conversations_messages_role";
  DROP TYPE "public"."enum_conversations_channel";
  DROP TYPE "public"."enum_assistant_settings_schedule_work_days";`)
}
