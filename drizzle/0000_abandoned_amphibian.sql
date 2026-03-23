CREATE TYPE "public"."user_role" AS ENUM('user', 'psychologist', 'admin');--> statement-breakpoint
CREATE TYPE "public"."growth_stage" AS ENUM('seed', 'germoglio', 'crescita', 'fioritura', 'radici');--> statement-breakpoint
CREATE TYPE "public"."modality" AS ENUM('online', 'in_person', 'both');--> statement-breakpoint
CREATE TYPE "public"."candidacy_status" AS ENUM('pending', 'accepted', 'rejected', 'expired');--> statement-breakpoint
CREATE TYPE "public"."case_status" AS ENUM('pending', 'matching', 'matched', 'in_call', 'completed', 'expired', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."match_selection_status" AS ENUM('selected', 'call_scheduled', 'call_completed', 'continued', 'not_continued', 'disputed');--> statement-breakpoint
CREATE TYPE "public"."preferred_gender" AS ENUM('male', 'female', 'no_preference');--> statement-breakpoint
CREATE TYPE "public"."credit_status" AS ENUM('available', 'used', 'expired');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('pending', 'paid', 'failed', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."payment_type" AS ENUM('selection_fee', 'continuity_fee');--> statement-breakpoint
CREATE TYPE "public"."discrepancy_resolution" AS ENUM('pending', 'resolved_user', 'resolved_psychologist', 'penalty_applied', 'dismissed');--> statement-breakpoint
CREATE TYPE "public"."discrepancy_severity" AS ENUM('minor', 'major', 'critical');--> statement-breakpoint
CREATE TYPE "public"."discrepancy_type" AS ENUM('call_happened', 'continuity', 'other');--> statement-breakpoint
CREATE TYPE "public"."penalty_type" AS ENUM('visibility_reduction', 'lead_block', 'suspension', 'removal');--> statement-breakpoint
CREATE TYPE "public"."respondent_type" AS ENUM('user', 'psychologist');--> statement-breakpoint
CREATE TYPE "public"."badge_tier" AS ENUM('foundation', 'quality', 'network');--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"access_token_expires_at" timestamp with time zone,
	"refresh_token_expires_at" timestamp with time zone,
	"scope" text,
	"id_token" text,
	"password" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "verifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "psychologist_availabilities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"psychologist_profile_id" uuid NOT NULL,
	"day_of_week" integer NOT NULL,
	"start_time" time NOT NULL,
	"end_time" time NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "psychologist_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"albo_number" text NOT NULL,
	"albo_region" text NOT NULL,
	"treated_areas" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"therapeutic_approaches" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"target_patients" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"exclusions" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"modality" "modality" NOT NULL,
	"bio" text DEFAULT '' NOT NULL,
	"short_bio" text DEFAULT '' NOT NULL,
	"video_intro_url" text,
	"max_new_patients_per_week" integer DEFAULT 5 NOT NULL,
	"current_caseload" integer DEFAULT 0 NOT NULL,
	"languages" jsonb DEFAULT '["it"]'::jsonb NOT NULL,
	"is_verified" boolean DEFAULT false NOT NULL,
	"verified_at" timestamp with time zone,
	"ranking_score" real DEFAULT 50 NOT NULL,
	"continuity_rate" real DEFAULT 0 NOT NULL,
	"conversion_rate" real DEFAULT 0 NOT NULL,
	"average_response_time" real DEFAULT 0 NOT NULL,
	"growth_stage" "growth_stage" DEFAULT 'seed' NOT NULL,
	"profile_embedding" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "psychologist_profiles_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "candidacies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"case_id" uuid NOT NULL,
	"psychologist_profile_id" uuid NOT NULL,
	"compatibility_score" real NOT NULL,
	"score_breakdown" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"status" "candidacy_status" DEFAULT 'pending' NOT NULL,
	"responded_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cases" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"referral_psychologist_id" uuid,
	"status" "case_status" DEFAULT 'pending' NOT NULL,
	"questionnaire_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"primary_problem" text DEFAULT '' NOT NULL,
	"context" text DEFAULT '' NOT NULL,
	"intensity" integer DEFAULT 1 NOT NULL,
	"preferred_modality" "modality" NOT NULL,
	"preferred_gender" "preferred_gender" DEFAULT 'no_preference' NOT NULL,
	"preferred_approaches" jsonb,
	"case_embedding" text,
	"matched_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "match_selections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"case_id" uuid NOT NULL,
	"candidacy_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"psychologist_profile_id" uuid NOT NULL,
	"status" "match_selection_status" DEFAULT 'selected' NOT NULL,
	"call_scheduled_at" timestamp with time zone,
	"call_completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "credits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"psychologist_profile_id" uuid NOT NULL,
	"origin_case_id" uuid NOT NULL,
	"status" "credit_status" DEFAULT 'available' NOT NULL,
	"used_for_payment_id" uuid,
	"expires_at" timestamp with time zone NOT NULL,
	"used_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"match_selection_id" uuid NOT NULL,
	"psychologist_profile_id" uuid NOT NULL,
	"type" "payment_type" NOT NULL,
	"amount" integer NOT NULL,
	"currency" text DEFAULT 'EUR' NOT NULL,
	"status" "payment_status" DEFAULT 'pending' NOT NULL,
	"stripe_payment_intent_id" text,
	"due_at" timestamp with time zone NOT NULL,
	"paid_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "discrepancies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"match_selection_id" uuid NOT NULL,
	"type" "discrepancy_type" NOT NULL,
	"severity" "discrepancy_severity" NOT NULL,
	"user_response" jsonb NOT NULL,
	"psychologist_response" jsonb NOT NULL,
	"resolution" "discrepancy_resolution" DEFAULT 'pending' NOT NULL,
	"resolved_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "penalties" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"psychologist_profile_id" uuid NOT NULL,
	"type" "penalty_type" NOT NULL,
	"reason" text NOT NULL,
	"discrepancy_id" uuid,
	"starts_at" timestamp with time zone NOT NULL,
	"ends_at" timestamp with time zone,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "post_call_questionnaires" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"match_selection_id" uuid NOT NULL,
	"respondent_type" "respondent_type" NOT NULL,
	"respondent_id" uuid NOT NULL,
	"call_happened" boolean NOT NULL,
	"estimated_duration_minutes" integer,
	"will_continue" boolean NOT NULL,
	"satisfaction_rating" integer,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "badges" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"tier" "badge_tier" NOT NULL,
	"icon_name" text NOT NULL,
	"criteria" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "psychologist_badges" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"psychologist_profile_id" uuid NOT NULL,
	"badge_id" uuid NOT NULL,
	"awarded_at" timestamp with time zone NOT NULL,
	"revoked_at" timestamp with time zone,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ranking_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"psychologist_profile_id" uuid NOT NULL,
	"ranking_score" real NOT NULL,
	"continuity_rate" real NOT NULL,
	"conversion_rate" real NOT NULL,
	"payment_reliability" real NOT NULL,
	"discrepancy_score" real NOT NULL,
	"activity_score" real NOT NULL,
	"snapshot_date" date NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "psychologist_availabilities" ADD CONSTRAINT "psychologist_availabilities_psychologist_profile_id_psychologist_profiles_id_fk" FOREIGN KEY ("psychologist_profile_id") REFERENCES "public"."psychologist_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "psychologist_profiles" ADD CONSTRAINT "psychologist_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "candidacies" ADD CONSTRAINT "candidacies_case_id_cases_id_fk" FOREIGN KEY ("case_id") REFERENCES "public"."cases"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "candidacies" ADD CONSTRAINT "candidacies_psychologist_profile_id_psychologist_profiles_id_fk" FOREIGN KEY ("psychologist_profile_id") REFERENCES "public"."psychologist_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cases" ADD CONSTRAINT "cases_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cases" ADD CONSTRAINT "cases_referral_psychologist_id_psychologist_profiles_id_fk" FOREIGN KEY ("referral_psychologist_id") REFERENCES "public"."psychologist_profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "match_selections" ADD CONSTRAINT "match_selections_case_id_cases_id_fk" FOREIGN KEY ("case_id") REFERENCES "public"."cases"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "match_selections" ADD CONSTRAINT "match_selections_candidacy_id_candidacies_id_fk" FOREIGN KEY ("candidacy_id") REFERENCES "public"."candidacies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "match_selections" ADD CONSTRAINT "match_selections_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "match_selections" ADD CONSTRAINT "match_selections_psychologist_profile_id_psychologist_profiles_id_fk" FOREIGN KEY ("psychologist_profile_id") REFERENCES "public"."psychologist_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "credits" ADD CONSTRAINT "credits_psychologist_profile_id_psychologist_profiles_id_fk" FOREIGN KEY ("psychologist_profile_id") REFERENCES "public"."psychologist_profiles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "credits" ADD CONSTRAINT "credits_origin_case_id_cases_id_fk" FOREIGN KEY ("origin_case_id") REFERENCES "public"."cases"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "credits" ADD CONSTRAINT "credits_used_for_payment_id_payments_id_fk" FOREIGN KEY ("used_for_payment_id") REFERENCES "public"."payments"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_match_selection_id_match_selections_id_fk" FOREIGN KEY ("match_selection_id") REFERENCES "public"."match_selections"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_psychologist_profile_id_psychologist_profiles_id_fk" FOREIGN KEY ("psychologist_profile_id") REFERENCES "public"."psychologist_profiles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "discrepancies" ADD CONSTRAINT "discrepancies_match_selection_id_match_selections_id_fk" FOREIGN KEY ("match_selection_id") REFERENCES "public"."match_selections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "penalties" ADD CONSTRAINT "penalties_psychologist_profile_id_psychologist_profiles_id_fk" FOREIGN KEY ("psychologist_profile_id") REFERENCES "public"."psychologist_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "penalties" ADD CONSTRAINT "penalties_discrepancy_id_discrepancies_id_fk" FOREIGN KEY ("discrepancy_id") REFERENCES "public"."discrepancies"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_call_questionnaires" ADD CONSTRAINT "post_call_questionnaires_match_selection_id_match_selections_id_fk" FOREIGN KEY ("match_selection_id") REFERENCES "public"."match_selections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "psychologist_badges" ADD CONSTRAINT "psychologist_badges_psychologist_profile_id_psychologist_profiles_id_fk" FOREIGN KEY ("psychologist_profile_id") REFERENCES "public"."psychologist_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "psychologist_badges" ADD CONSTRAINT "psychologist_badges_badge_id_badges_id_fk" FOREIGN KEY ("badge_id") REFERENCES "public"."badges"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ranking_history" ADD CONSTRAINT "ranking_history_psychologist_profile_id_psychologist_profiles_id_fk" FOREIGN KEY ("psychologist_profile_id") REFERENCES "public"."psychologist_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "accounts_user_id_idx" ON "accounts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "accounts_provider_id_account_id_idx" ON "accounts" USING btree ("provider_id","account_id");--> statement-breakpoint
CREATE UNIQUE INDEX "sessions_token_unique" ON "sessions" USING btree ("token");--> statement-breakpoint
CREATE INDEX "sessions_user_id_idx" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "sessions_expires_at_idx" ON "sessions" USING btree ("expires_at");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_unique" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "users_role_idx" ON "users" USING btree ("role");--> statement-breakpoint
CREATE INDEX "users_deleted_at_idx" ON "users" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "verifications_identifier_idx" ON "verifications" USING btree ("identifier");--> statement-breakpoint
CREATE INDEX "verifications_expires_at_idx" ON "verifications" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "psychologist_availabilities_profile_id_idx" ON "psychologist_availabilities" USING btree ("psychologist_profile_id");--> statement-breakpoint
CREATE INDEX "psychologist_availabilities_day_of_week_idx" ON "psychologist_availabilities" USING btree ("day_of_week");--> statement-breakpoint
CREATE INDEX "psychologist_availabilities_is_active_idx" ON "psychologist_availabilities" USING btree ("is_active");--> statement-breakpoint
--> statement-breakpoint
CREATE INDEX "psychologist_profiles_is_verified_idx" ON "psychologist_profiles" USING btree ("is_verified");--> statement-breakpoint
CREATE INDEX "psychologist_profiles_ranking_score_idx" ON "psychologist_profiles" USING btree ("ranking_score");--> statement-breakpoint
CREATE INDEX "psychologist_profiles_growth_stage_idx" ON "psychologist_profiles" USING btree ("growth_stage");--> statement-breakpoint
CREATE INDEX "psychologist_profiles_modality_idx" ON "psychologist_profiles" USING btree ("modality");--> statement-breakpoint
CREATE INDEX "psychologist_profiles_deleted_at_idx" ON "psychologist_profiles" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "candidacies_case_id_idx" ON "candidacies" USING btree ("case_id");--> statement-breakpoint
CREATE INDEX "candidacies_psychologist_profile_id_idx" ON "candidacies" USING btree ("psychologist_profile_id");--> statement-breakpoint
CREATE INDEX "candidacies_status_idx" ON "candidacies" USING btree ("status");--> statement-breakpoint
CREATE INDEX "candidacies_compatibility_score_idx" ON "candidacies" USING btree ("compatibility_score");--> statement-breakpoint
CREATE INDEX "cases_user_id_idx" ON "cases" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "cases_status_idx" ON "cases" USING btree ("status");--> statement-breakpoint
CREATE INDEX "cases_referral_psychologist_id_idx" ON "cases" USING btree ("referral_psychologist_id");--> statement-breakpoint
CREATE INDEX "cases_created_at_idx" ON "cases" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "match_selections_case_id_idx" ON "match_selections" USING btree ("case_id");--> statement-breakpoint
CREATE INDEX "match_selections_candidacy_id_idx" ON "match_selections" USING btree ("candidacy_id");--> statement-breakpoint
CREATE INDEX "match_selections_user_id_idx" ON "match_selections" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "match_selections_psychologist_profile_id_idx" ON "match_selections" USING btree ("psychologist_profile_id");--> statement-breakpoint
CREATE INDEX "match_selections_status_idx" ON "match_selections" USING btree ("status");--> statement-breakpoint
CREATE INDEX "credits_psychologist_profile_id_idx" ON "credits" USING btree ("psychologist_profile_id");--> statement-breakpoint
CREATE INDEX "credits_origin_case_id_idx" ON "credits" USING btree ("origin_case_id");--> statement-breakpoint
CREATE INDEX "credits_status_idx" ON "credits" USING btree ("status");--> statement-breakpoint
CREATE INDEX "credits_expires_at_idx" ON "credits" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "credits_used_for_payment_id_idx" ON "credits" USING btree ("used_for_payment_id");--> statement-breakpoint
CREATE INDEX "payments_match_selection_id_idx" ON "payments" USING btree ("match_selection_id");--> statement-breakpoint
CREATE INDEX "payments_psychologist_profile_id_idx" ON "payments" USING btree ("psychologist_profile_id");--> statement-breakpoint
CREATE INDEX "payments_status_idx" ON "payments" USING btree ("status");--> statement-breakpoint
CREATE INDEX "payments_type_idx" ON "payments" USING btree ("type");--> statement-breakpoint
CREATE INDEX "payments_stripe_payment_intent_id_idx" ON "payments" USING btree ("stripe_payment_intent_id");--> statement-breakpoint
CREATE INDEX "payments_due_at_idx" ON "payments" USING btree ("due_at");--> statement-breakpoint
CREATE INDEX "discrepancies_match_selection_id_idx" ON "discrepancies" USING btree ("match_selection_id");--> statement-breakpoint
CREATE INDEX "discrepancies_type_idx" ON "discrepancies" USING btree ("type");--> statement-breakpoint
CREATE INDEX "discrepancies_severity_idx" ON "discrepancies" USING btree ("severity");--> statement-breakpoint
CREATE INDEX "discrepancies_resolution_idx" ON "discrepancies" USING btree ("resolution");--> statement-breakpoint
CREATE INDEX "penalties_psychologist_profile_id_idx" ON "penalties" USING btree ("psychologist_profile_id");--> statement-breakpoint
CREATE INDEX "penalties_type_idx" ON "penalties" USING btree ("type");--> statement-breakpoint
CREATE INDEX "penalties_is_active_idx" ON "penalties" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "penalties_discrepancy_id_idx" ON "penalties" USING btree ("discrepancy_id");--> statement-breakpoint
CREATE INDEX "penalties_starts_at_ends_at_idx" ON "penalties" USING btree ("starts_at","ends_at");--> statement-breakpoint
CREATE INDEX "post_call_questionnaires_match_selection_id_idx" ON "post_call_questionnaires" USING btree ("match_selection_id");--> statement-breakpoint
CREATE INDEX "post_call_questionnaires_respondent_id_idx" ON "post_call_questionnaires" USING btree ("respondent_id");--> statement-breakpoint
CREATE INDEX "post_call_questionnaires_respondent_type_idx" ON "post_call_questionnaires" USING btree ("respondent_type");--> statement-breakpoint
CREATE UNIQUE INDEX "badges_code_unique" ON "badges" USING btree ("code");--> statement-breakpoint
CREATE INDEX "badges_tier_idx" ON "badges" USING btree ("tier");--> statement-breakpoint
CREATE INDEX "psychologist_badges_psychologist_profile_id_idx" ON "psychologist_badges" USING btree ("psychologist_profile_id");--> statement-breakpoint
CREATE INDEX "psychologist_badges_badge_id_idx" ON "psychologist_badges" USING btree ("badge_id");--> statement-breakpoint
CREATE INDEX "psychologist_badges_is_active_idx" ON "psychologist_badges" USING btree ("is_active");--> statement-breakpoint
CREATE UNIQUE INDEX "psychologist_badges_profile_badge_unique" ON "psychologist_badges" USING btree ("psychologist_profile_id","badge_id");--> statement-breakpoint
CREATE INDEX "ranking_history_psychologist_profile_id_idx" ON "ranking_history" USING btree ("psychologist_profile_id");--> statement-breakpoint
CREATE INDEX "ranking_history_snapshot_date_idx" ON "ranking_history" USING btree ("snapshot_date");--> statement-breakpoint
CREATE UNIQUE INDEX "ranking_history_profile_date_unique" ON "ranking_history" USING btree ("psychologist_profile_id","snapshot_date");