import { sql } from '@payloadcms/db-postgres'
import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_stories_blocks_prose_width" AS ENUM('measure', 'wide');
  CREATE TYPE "public"."enum_stories_blocks_callout_tone" AS ENUM('note', 'technique', 'context');
  CREATE TYPE "public"."enum_stories_blocks_correction_kind" AS ENUM('update', 'correction');
  CREATE TYPE "public"."enum_stories_blocks_image_presentation" AS ENUM('contained', 'wide', 'fullBleed');
  CREATE TYPE "public"."enum_stories_blocks_image_pair_alignment" AS ENUM('top', 'baseline', 'match');
  CREATE TYPE "public"."enum_stories_blocks_video_presentation" AS ENUM('contained', 'wide', 'fullBleed');
  CREATE TYPE "public"."enum_stories_blocks_call_to_action_kind" AS ENUM('newsletter', 'portfolio', 'inquiry');
  CREATE TYPE "public"."enum_stories_channel" AS ENUM('photography', 'motion', 'stories', 'modeling', 'x');
  CREATE TYPE "public"."enum_stories_story_type" AS ENUM('article', 'photoEssay', 'film', 'videoEssay', 'modelingStory', 'collaboration', 'interview', 'fieldNote', 'eventDispatch', 'review');
  CREATE TYPE "public"."enum_stories_date_display_mode" AS ENUM('published', 'event', 'both', 'hidden');
  CREATE TYPE "public"."enum_stories_lead_variant" AS ENUM('standard', 'fullBleed', 'split', 'textOnly');
  CREATE TYPE "public"."enum_stories_table_of_contents_mode" AS ENUM('auto', 'always', 'never');
  CREATE TYPE "public"."enum_stories_approval_status" AS ENUM('draft', 'editorial-review', 'rights-review', 'ready');
  CREATE TYPE "public"."enum_stories_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__stories_v_blocks_prose_width" AS ENUM('measure', 'wide');
  CREATE TYPE "public"."enum__stories_v_blocks_callout_tone" AS ENUM('note', 'technique', 'context');
  CREATE TYPE "public"."enum__stories_v_blocks_correction_kind" AS ENUM('update', 'correction');
  CREATE TYPE "public"."enum__stories_v_blocks_image_presentation" AS ENUM('contained', 'wide', 'fullBleed');
  CREATE TYPE "public"."enum__stories_v_blocks_image_pair_alignment" AS ENUM('top', 'baseline', 'match');
  CREATE TYPE "public"."enum__stories_v_blocks_video_presentation" AS ENUM('contained', 'wide', 'fullBleed');
  CREATE TYPE "public"."enum__stories_v_blocks_call_to_action_kind" AS ENUM('newsletter', 'portfolio', 'inquiry');
  CREATE TYPE "public"."enum__stories_v_version_channel" AS ENUM('photography', 'motion', 'stories', 'modeling', 'x');
  CREATE TYPE "public"."enum__stories_v_version_story_type" AS ENUM('article', 'photoEssay', 'film', 'videoEssay', 'modelingStory', 'collaboration', 'interview', 'fieldNote', 'eventDispatch', 'review');
  CREATE TYPE "public"."enum__stories_v_version_date_display_mode" AS ENUM('published', 'event', 'both', 'hidden');
  CREATE TYPE "public"."enum__stories_v_version_lead_variant" AS ENUM('standard', 'fullBleed', 'split', 'textOnly');
  CREATE TYPE "public"."enum__stories_v_version_table_of_contents_mode" AS ENUM('auto', 'always', 'never');
  CREATE TYPE "public"."enum__stories_v_version_approval_status" AS ENUM('draft', 'editorial-review', 'rights-review', 'ready');
  CREATE TYPE "public"."enum__stories_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_media_kind" AS ENUM('image', 'video', 'audio', 'document');
  CREATE TYPE "public"."enum_media_processing_status" AS ENUM('none', 'processing', 'ready', 'failed');
  CREATE TYPE "public"."enum_media_rights_status" AS ENUM('needs-review', 'approved', 'restricted', 'blocked');
  CREATE TYPE "public"."enum_media_consent_status" AS ENUM('not-required', 'needs-review', 'obtained', 'refused');
  CREATE TYPE "public"."enum_issues_edition_status" AS ENUM('in-production', 'current', 'archived');
  CREATE TYPE "public"."enum_issues_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__issues_v_version_edition_status" AS ENUM('in-production', 'current', 'archived');
  CREATE TYPE "public"."enum__issues_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_series_channel" AS ENUM('photography', 'motion', 'stories', 'modeling', 'x');
  CREATE TYPE "public"."enum_series_status" AS ENUM('ongoing', 'complete', 'on-hold');
  CREATE TYPE "public"."enum_tags_channel_affinity" AS ENUM('photography', 'motion', 'stories', 'modeling', 'x');
  CREATE TYPE "public"."enum_tags_kind" AS ENUM('subject', 'format', 'technique', 'mood');
  CREATE TYPE "public"."enum_tags_status" AS ENUM('active', 'merged', 'deprecated');
  CREATE TYPE "public"."enum_people_kind" AS ENUM('subject', 'collaborator', 'interviewee', 'cast', 'crew', 'client');
  CREATE TYPE "public"."enum_places_kind" AS ENUM('venue', 'city', 'region', 'studio', 'outdoor');
  CREATE TYPE "public"."enum_partners_relationship_type" AS ENUM('sponsor', 'paid-partnership', 'client', 'ambassador', 'gifted', 'affiliate', 'collaborator', 'event-host', 'editorial-mention');
  CREATE TYPE "public"."enum_partners_verification_status" AS ENUM('unverified', 'verified', 'disputed');
  CREATE TYPE "public"."enum_partners_kind" AS ENUM('brand', 'publication', 'institution', 'team', 'agency', 'venue');
  CREATE TYPE "public"."enum_redirects_status_code" AS ENUM('301', '302');
  CREATE TYPE "public"."enum_redirects_reason" AS ENUM('slug-change', 'legacy', 'tag-merge', 'removed');
  CREATE TYPE "public"."enum_submissions_kind" AS ENUM('general', 'commission', 'casting', 'press', 'correction');
  CREATE TYPE "public"."enum_submissions_status" AS ENUM('new', 'replied', 'archived', 'spam');
  CREATE TYPE "public"."enum_users_roles" AS ENUM('admin', 'editor', 'author', 'mediaManager', 'partnerReviewer');
  CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "public"."enum_payload_jobs_log_state" AS ENUM('failed', 'succeeded');
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "public"."enum_channel_settings_channels_key" AS ENUM('photography', 'motion', 'stories', 'modeling', 'x');
  CREATE TYPE "public"."enum_navigation_footer_links_group" AS ENUM('read', 'legal');
  CREATE TYPE "public"."enum_home_page_sections_kind" AS ENUM('channelStrip', 'issueRail', 'latestGrid', 'fromArchive', 'fieldNote', 'newsletter', 'credits');
  CREATE TYPE "public"."enum_disclosure_settings_statements_relationship_type" AS ENUM('sponsor', 'paid-partnership', 'client', 'ambassador', 'gifted', 'affiliate', 'collaborator', 'event-host', 'editorial-mention');
  CREATE TABLE "stories_blocks_prose" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"content" jsonb,
  	"width" "enum_stories_blocks_prose_width" DEFAULT 'measure',
  	"block_name" varchar
  );
  
  CREATE TABLE "stories_blocks_pull_quote" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"attribution" varchar,
  	"person_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "stories_blocks_chapter_divider" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"anchor" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "stories_blocks_interview_exchanges" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" jsonb
  );
  
  CREATE TABLE "stories_blocks_interview" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"interviewee_name" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "stories_blocks_callout" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tone" "enum_stories_blocks_callout_tone" DEFAULT 'note',
  	"title" varchar,
  	"content" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "stories_blocks_source_notes_notes" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"url" varchar
  );
  
  CREATE TABLE "stories_blocks_source_notes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "stories_blocks_correction" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kind" "enum_stories_blocks_correction_kind" DEFAULT 'update',
  	"date" timestamp(3) with time zone,
  	"note" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "stories_blocks_timeline_entries" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"when" varchar,
  	"detail" varchar
  );
  
  CREATE TABLE "stories_blocks_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "stories_blocks_image" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"presentation" "enum_stories_blocks_image_presentation" DEFAULT 'contained',
  	"caption" varchar,
  	"credit_override" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "stories_blocks_image_pair" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"left_id" integer,
  	"right_id" integer,
  	"alignment" "enum_stories_blocks_image_pair_alignment" DEFAULT 'top',
  	"caption" varchar,
  	"credit_override" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "stories_blocks_triptych_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"caption" varchar
  );
  
  CREATE TABLE "stories_blocks_triptych" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "stories_blocks_contact_sheet_frames" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"caption" varchar,
  	"selected" boolean DEFAULT false
  );
  
  CREATE TABLE "stories_blocks_contact_sheet" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"show_frame_numbers" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "stories_blocks_before_after" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"before_id" integer,
  	"after_id" integer,
  	"before_label" varchar DEFAULT 'Before',
  	"after_label" varchar DEFAULT 'After',
  	"note" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "stories_blocks_annotated_image_annotations" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"x" numeric,
  	"y" numeric,
  	"label" varchar,
  	"detail" varchar
  );
  
  CREATE TABLE "stories_blocks_annotated_image" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "stories_blocks_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"presentation" "enum_stories_blocks_video_presentation" DEFAULT 'contained',
  	"caption" varchar,
  	"autoplay_loop" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "stories_blocks_vertical_video_pair" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"left_id" integer,
  	"right_id" integer,
  	"caption" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "stories_blocks_chapter_list_chapters" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"start_seconds" numeric,
  	"title" varchar,
  	"note" varchar
  );
  
  CREATE TABLE "stories_blocks_chapter_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "stories_blocks_poster_sequence_posters" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"label" varchar,
  	"story_id" integer
  );
  
  CREATE TABLE "stories_blocks_poster_sequence" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "stories_blocks_transcript_excerpt" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"source_id" integer,
  	"excerpt" varchar,
  	"start_seconds" numeric,
  	"block_name" varchar
  );
  
  CREATE TABLE "stories_blocks_credits_block_credits" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"role" varchar,
  	"name" varchar,
  	"person_id" integer,
  	"url" varchar
  );
  
  CREATE TABLE "stories_blocks_credits_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Credits',
  	"block_name" varchar
  );
  
  CREATE TABLE "stories_blocks_partner_disclosure" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"partner_id" integer,
  	"statement" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "stories_blocks_partner_profile_deliverables" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar
  );
  
  CREATE TABLE "stories_blocks_partner_profile" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"partner_id" integer,
  	"role" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "stories_blocks_product_credits_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar,
  	"brand" varchar,
  	"partner_id" integer,
  	"url" varchar,
  	"is_affiliate" boolean DEFAULT false
  );
  
  CREATE TABLE "stories_blocks_product_credits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "stories_blocks_related_stories" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Continue in focus',
  	"block_name" varchar
  );
  
  CREATE TABLE "stories_blocks_call_to_action" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kind" "enum_stories_blocks_call_to_action_kind" DEFAULT 'newsletter',
  	"heading" varchar,
  	"body" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "stories_credits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"role" varchar,
  	"name" varchar,
  	"person_id" integer,
  	"url" varchar
  );
  
  CREATE TABLE "stories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"kicker" varchar,
  	"dek" varchar,
  	"slug" varchar,
  	"channel" "enum_stories_channel",
  	"story_type" "enum_stories_story_type" DEFAULT 'article',
  	"published_at" timestamp(3) with time zone,
  	"event_date" timestamp(3) with time zone,
  	"date_display_mode" "enum_stories_date_display_mode" DEFAULT 'published',
  	"lead_media_id" integer,
  	"lead_variant" "enum_stories_lead_variant" DEFAULT 'standard',
  	"card_headline_override" varchar,
  	"featured_priority" numeric DEFAULT 0,
  	"content_warning" varchar,
  	"table_of_contents_mode" "enum_stories_table_of_contents_mode" DEFAULT 'auto',
  	"series_id" integer,
  	"issue_id" integer,
  	"related_portfolio_url" varchar,
  	"disclosure" varchar,
  	"usage_notes" varchar,
  	"embargo_until" timestamp(3) with time zone,
  	"approval_status" "enum_stories_approval_status" DEFAULT 'draft',
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"og_media_id" integer,
  	"canonical_url" varchar,
  	"no_index" boolean DEFAULT false,
  	"reading_minutes" numeric,
  	"watch_seconds" numeric,
  	"word_count" numeric,
  	"search_document" varchar,
  	"content_hash" varchar,
  	"legacy_source_id" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_stories_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "stories_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"authors_id" integer,
  	"stories_id" integer,
  	"tags_id" integer,
  	"people_id" integer,
  	"places_id" integer,
  	"partners_id" integer
  );
  
  CREATE TABLE "_stories_v_blocks_prose" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"content" jsonb,
  	"width" "enum__stories_v_blocks_prose_width" DEFAULT 'measure',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_stories_v_blocks_pull_quote" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"attribution" varchar,
  	"person_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_stories_v_blocks_chapter_divider" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"anchor" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_stories_v_blocks_interview_exchanges" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" jsonb,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_stories_v_blocks_interview" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"interviewee_name" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_stories_v_blocks_callout" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"tone" "enum__stories_v_blocks_callout_tone" DEFAULT 'note',
  	"title" varchar,
  	"content" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_stories_v_blocks_source_notes_notes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_stories_v_blocks_source_notes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_stories_v_blocks_correction" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kind" "enum__stories_v_blocks_correction_kind" DEFAULT 'update',
  	"date" timestamp(3) with time zone,
  	"note" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_stories_v_blocks_timeline_entries" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"when" varchar,
  	"detail" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_stories_v_blocks_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_stories_v_blocks_image" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"presentation" "enum__stories_v_blocks_image_presentation" DEFAULT 'contained',
  	"caption" varchar,
  	"credit_override" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_stories_v_blocks_image_pair" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"left_id" integer,
  	"right_id" integer,
  	"alignment" "enum__stories_v_blocks_image_pair_alignment" DEFAULT 'top',
  	"caption" varchar,
  	"credit_override" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_stories_v_blocks_triptych_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"caption" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_stories_v_blocks_triptych" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_stories_v_blocks_contact_sheet_frames" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"caption" varchar,
  	"selected" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_stories_v_blocks_contact_sheet" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"show_frame_numbers" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_stories_v_blocks_before_after" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"before_id" integer,
  	"after_id" integer,
  	"before_label" varchar DEFAULT 'Before',
  	"after_label" varchar DEFAULT 'After',
  	"note" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_stories_v_blocks_annotated_image_annotations" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"x" numeric,
  	"y" numeric,
  	"label" varchar,
  	"detail" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_stories_v_blocks_annotated_image" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_stories_v_blocks_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"presentation" "enum__stories_v_blocks_video_presentation" DEFAULT 'contained',
  	"caption" varchar,
  	"autoplay_loop" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_stories_v_blocks_vertical_video_pair" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"left_id" integer,
  	"right_id" integer,
  	"caption" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_stories_v_blocks_chapter_list_chapters" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"start_seconds" numeric,
  	"title" varchar,
  	"note" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_stories_v_blocks_chapter_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_stories_v_blocks_poster_sequence_posters" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"label" varchar,
  	"story_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_stories_v_blocks_poster_sequence" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_stories_v_blocks_transcript_excerpt" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"source_id" integer,
  	"excerpt" varchar,
  	"start_seconds" numeric,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_stories_v_blocks_credits_block_credits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"role" varchar,
  	"name" varchar,
  	"person_id" integer,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_stories_v_blocks_credits_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Credits',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_stories_v_blocks_partner_disclosure" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"partner_id" integer,
  	"statement" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_stories_v_blocks_partner_profile_deliverables" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"item" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_stories_v_blocks_partner_profile" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"partner_id" integer,
  	"role" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_stories_v_blocks_product_credits_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"item" varchar,
  	"brand" varchar,
  	"partner_id" integer,
  	"url" varchar,
  	"is_affiliate" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_stories_v_blocks_product_credits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_stories_v_blocks_related_stories" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Continue in focus',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_stories_v_blocks_call_to_action" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kind" "enum__stories_v_blocks_call_to_action_kind" DEFAULT 'newsletter',
  	"heading" varchar,
  	"body" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_stories_v_version_credits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"role" varchar,
  	"name" varchar,
  	"person_id" integer,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_stories_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_kicker" varchar,
  	"version_dek" varchar,
  	"version_slug" varchar,
  	"version_channel" "enum__stories_v_version_channel",
  	"version_story_type" "enum__stories_v_version_story_type" DEFAULT 'article',
  	"version_published_at" timestamp(3) with time zone,
  	"version_event_date" timestamp(3) with time zone,
  	"version_date_display_mode" "enum__stories_v_version_date_display_mode" DEFAULT 'published',
  	"version_lead_media_id" integer,
  	"version_lead_variant" "enum__stories_v_version_lead_variant" DEFAULT 'standard',
  	"version_card_headline_override" varchar,
  	"version_featured_priority" numeric DEFAULT 0,
  	"version_content_warning" varchar,
  	"version_table_of_contents_mode" "enum__stories_v_version_table_of_contents_mode" DEFAULT 'auto',
  	"version_series_id" integer,
  	"version_issue_id" integer,
  	"version_related_portfolio_url" varchar,
  	"version_disclosure" varchar,
  	"version_usage_notes" varchar,
  	"version_embargo_until" timestamp(3) with time zone,
  	"version_approval_status" "enum__stories_v_version_approval_status" DEFAULT 'draft',
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_og_media_id" integer,
  	"version_canonical_url" varchar,
  	"version_no_index" boolean DEFAULT false,
  	"version_reading_minutes" numeric,
  	"version_watch_seconds" numeric,
  	"version_word_count" numeric,
  	"version_search_document" varchar,
  	"version_content_hash" varchar,
  	"version_legacy_source_id" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__stories_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_stories_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"authors_id" integer,
  	"stories_id" integer,
  	"tags_id" integer,
  	"people_id" integer,
  	"places_id" integer,
  	"partners_id" integer
  );
  
  CREATE TABLE "media_credits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"role" varchar NOT NULL,
  	"name" varchar NOT NULL,
  	"person_id" integer,
  	"url" varchar
  );
  
  CREATE TABLE "media_captions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"src_lang" varchar DEFAULT 'en' NOT NULL,
  	"file_id" integer NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"kind" "enum_media_kind" DEFAULT 'image' NOT NULL,
  	"title" varchar NOT NULL,
  	"alt" varchar,
  	"decorative" boolean DEFAULT false,
  	"caption" varchar,
  	"credit" varchar,
  	"captured_at" timestamp(3) with time zone,
  	"place_id" integer,
  	"focal_point_x" numeric DEFAULT 50,
  	"focal_point_y" numeric DEFAULT 50,
  	"blur_data_u_r_l" varchar,
  	"dominant_color" varchar,
  	"duration_seconds" numeric,
  	"aspect_ratio" varchar,
  	"mux_playback_id" varchar,
  	"processing_status" "enum_media_processing_status" DEFAULT 'none',
  	"poster_id" integer,
  	"transcript" varchar,
  	"visual_description" varchar,
  	"checksum" varchar,
  	"perceptual_hash" varchar,
  	"source_url" varchar,
  	"legacy_source_id" varchar,
  	"rights_status" "enum_media_rights_status" DEFAULT 'needs-review' NOT NULL,
  	"consent_status" "enum_media_consent_status" DEFAULT 'needs-review' NOT NULL,
  	"rights_owner" varchar,
  	"license_reference" varchar,
  	"usage_scope" varchar,
  	"usage_expires_at" timestamp(3) with time zone,
  	"embargo_until" timestamp(3) with time zone,
  	"sensitive" boolean DEFAULT false,
  	"reviewed_by_id" integer,
  	"reviewed_at" timestamp(3) with time zone,
  	"review_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_wide_url" varchar,
  	"sizes_wide_width" numeric,
  	"sizes_wide_height" numeric,
  	"sizes_wide_mime_type" varchar,
  	"sizes_wide_filesize" numeric,
  	"sizes_wide_filename" varchar
  );
  
  CREATE TABLE "media_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"people_id" integer,
  	"tags_id" integer
  );
  
  CREATE TABLE "issues" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"number" numeric,
  	"title" varchar,
  	"slug" varchar,
  	"statement" varchar,
  	"edition_status" "enum_issues_edition_status" DEFAULT 'in-production',
  	"published_at" timestamp(3) with time zone,
  	"cover_media_id" integer,
  	"lead_story_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_issues_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "issues_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"stories_id" integer
  );
  
  CREATE TABLE "_issues_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_number" numeric,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_statement" varchar,
  	"version_edition_status" "enum__issues_v_version_edition_status" DEFAULT 'in-production',
  	"version_published_at" timestamp(3) with time zone,
  	"version_cover_media_id" integer,
  	"version_lead_story_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__issues_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_issues_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"stories_id" integer
  );
  
  CREATE TABLE "series" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"dek" varchar,
  	"channel" "enum_series_channel",
  	"status" "enum_series_status" DEFAULT 'ongoing',
  	"cover_media_id" integer,
  	"legacy_source_id" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "tags_aliases" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "tags_channel_affinity" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_tags_channel_affinity",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "tags" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"kind" "enum_tags_kind" DEFAULT 'subject' NOT NULL,
  	"status" "enum_tags_status" DEFAULT 'active' NOT NULL,
  	"merged_into_id" integer,
  	"parent_id" integer,
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "people_kind" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_people_kind",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "people_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "people" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"has_public_page" boolean DEFAULT false,
  	"role" varchar,
  	"bio" varchar,
  	"legacy_source_id" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "places" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"kind" "enum_places_kind" DEFAULT 'venue',
  	"locality" varchar,
  	"region" varchar,
  	"country" varchar DEFAULT 'United States',
  	"description" varchar,
  	"is_private" boolean DEFAULT false,
  	"legacy_source_id" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "partners" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"relationship_type" "enum_partners_relationship_type" DEFAULT 'editorial-mention' NOT NULL,
  	"verification_status" "enum_partners_verification_status" DEFAULT 'unverified' NOT NULL,
  	"kind" "enum_partners_kind" DEFAULT 'brand',
  	"website" varchar,
  	"summary" varchar,
  	"logo_id" integer,
  	"accent_color" varchar,
  	"legacy_source_id" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "authors_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "authors" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"role" varchar,
  	"bio" varchar,
  	"portrait_id" integer,
  	"user_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "redirects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"from" varchar NOT NULL,
  	"to" varchar NOT NULL,
  	"status_code" "enum_redirects_status_code" DEFAULT '301' NOT NULL,
  	"reason" "enum_redirects_reason" DEFAULT 'slug-change',
  	"note" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "submissions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"kind" "enum_submissions_kind" DEFAULT 'general' NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"subject" varchar,
  	"message" varchar NOT NULL,
  	"source_path" varchar,
  	"status" "enum_submissions_status" DEFAULT 'new',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "users_roles" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_users_roles",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"title" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_jobs_log" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"executed_at" timestamp(3) with time zone NOT NULL,
  	"completed_at" timestamp(3) with time zone NOT NULL,
  	"task_slug" "enum_payload_jobs_log_task_slug" NOT NULL,
  	"task_i_d" varchar NOT NULL,
  	"input" jsonb,
  	"output" jsonb,
  	"state" "enum_payload_jobs_log_state" NOT NULL,
  	"error" jsonb
  );
  
  CREATE TABLE "payload_jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"input" jsonb,
  	"completed_at" timestamp(3) with time zone,
  	"total_tried" numeric DEFAULT 0,
  	"has_error" boolean DEFAULT false,
  	"error" jsonb,
  	"task_slug" "enum_payload_jobs_task_slug",
  	"queue" varchar DEFAULT 'default',
  	"wait_until" timestamp(3) with time zone,
  	"processing" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"stories_id" integer,
  	"media_id" integer,
  	"issues_id" integer,
  	"series_id" integer,
  	"tags_id" integer,
  	"people_id" integer,
  	"places_id" integer,
  	"partners_id" integer,
  	"authors_id" integer,
  	"redirects_id" integer,
  	"submissions_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar DEFAULT 'FERG IN FOCUS' NOT NULL,
  	"tagline" varchar DEFAULT 'Life through a creative lens.' NOT NULL,
  	"statement" varchar,
  	"default_seo_description" varchar,
  	"default_share_image_id" integer,
  	"contact_email" varchar,
  	"portfolio_url" varchar DEFAULT 'https://www.dorvellferguson.com/',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "channel_settings_channels" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" "enum_channel_settings_channels_key" NOT NULL,
  	"label" varchar,
  	"tagline" varchar,
  	"description" varchar,
  	"featured_story_id" integer
  );
  
  CREATE TABLE "channel_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "navigation_footer_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL,
  	"group" "enum_navigation_footer_links_group" DEFAULT 'read'
  );
  
  CREATE TABLE "navigation" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"header_cta_label" varchar DEFAULT 'Newsletter',
  	"header_cta_href" varchar DEFAULT '/newsletter',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "home_page_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kind" "enum_home_page_sections_kind" NOT NULL,
  	"heading" varchar
  );
  
  CREATE TABLE "home_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"current_issue_id" integer,
  	"lead_story_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "home_page_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"stories_id" integer
  );
  
  CREATE TABLE "about_page_milestones" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"organisation" varchar,
  	"era" varchar,
  	"detail" varchar,
  	"verified" boolean DEFAULT false
  );
  
  CREATE TABLE "about_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"headline" varchar,
  	"lead" varchar,
  	"body" jsonb,
  	"portrait_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "disclosure_settings_statements" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"relationship_type" "enum_disclosure_settings_statements_relationship_type" NOT NULL,
  	"statement" varchar NOT NULL
  );
  
  CREATE TABLE "disclosure_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"policy_body" jsonb,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "newsletter_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar DEFAULT 'Keep It In Focus',
  	"promise" varchar,
  	"frequency" varchar DEFAULT 'Every two weeks',
  	"privacy_note" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "stories_blocks_prose" ADD CONSTRAINT "stories_blocks_prose_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stories_blocks_pull_quote" ADD CONSTRAINT "stories_blocks_pull_quote_person_id_people_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."people"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "stories_blocks_pull_quote" ADD CONSTRAINT "stories_blocks_pull_quote_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stories_blocks_chapter_divider" ADD CONSTRAINT "stories_blocks_chapter_divider_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stories_blocks_interview_exchanges" ADD CONSTRAINT "stories_blocks_interview_exchanges_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stories_blocks_interview"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stories_blocks_interview" ADD CONSTRAINT "stories_blocks_interview_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stories_blocks_callout" ADD CONSTRAINT "stories_blocks_callout_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stories_blocks_source_notes_notes" ADD CONSTRAINT "stories_blocks_source_notes_notes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stories_blocks_source_notes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stories_blocks_source_notes" ADD CONSTRAINT "stories_blocks_source_notes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stories_blocks_correction" ADD CONSTRAINT "stories_blocks_correction_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stories_blocks_timeline_entries" ADD CONSTRAINT "stories_blocks_timeline_entries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stories_blocks_timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stories_blocks_timeline" ADD CONSTRAINT "stories_blocks_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stories_blocks_image" ADD CONSTRAINT "stories_blocks_image_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "stories_blocks_image" ADD CONSTRAINT "stories_blocks_image_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stories_blocks_image_pair" ADD CONSTRAINT "stories_blocks_image_pair_left_id_media_id_fk" FOREIGN KEY ("left_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "stories_blocks_image_pair" ADD CONSTRAINT "stories_blocks_image_pair_right_id_media_id_fk" FOREIGN KEY ("right_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "stories_blocks_image_pair" ADD CONSTRAINT "stories_blocks_image_pair_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stories_blocks_triptych_images" ADD CONSTRAINT "stories_blocks_triptych_images_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "stories_blocks_triptych_images" ADD CONSTRAINT "stories_blocks_triptych_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stories_blocks_triptych"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stories_blocks_triptych" ADD CONSTRAINT "stories_blocks_triptych_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stories_blocks_contact_sheet_frames" ADD CONSTRAINT "stories_blocks_contact_sheet_frames_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "stories_blocks_contact_sheet_frames" ADD CONSTRAINT "stories_blocks_contact_sheet_frames_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stories_blocks_contact_sheet"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stories_blocks_contact_sheet" ADD CONSTRAINT "stories_blocks_contact_sheet_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stories_blocks_before_after" ADD CONSTRAINT "stories_blocks_before_after_before_id_media_id_fk" FOREIGN KEY ("before_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "stories_blocks_before_after" ADD CONSTRAINT "stories_blocks_before_after_after_id_media_id_fk" FOREIGN KEY ("after_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "stories_blocks_before_after" ADD CONSTRAINT "stories_blocks_before_after_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stories_blocks_annotated_image_annotations" ADD CONSTRAINT "stories_blocks_annotated_image_annotations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stories_blocks_annotated_image"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stories_blocks_annotated_image" ADD CONSTRAINT "stories_blocks_annotated_image_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "stories_blocks_annotated_image" ADD CONSTRAINT "stories_blocks_annotated_image_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stories_blocks_video" ADD CONSTRAINT "stories_blocks_video_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "stories_blocks_video" ADD CONSTRAINT "stories_blocks_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stories_blocks_vertical_video_pair" ADD CONSTRAINT "stories_blocks_vertical_video_pair_left_id_media_id_fk" FOREIGN KEY ("left_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "stories_blocks_vertical_video_pair" ADD CONSTRAINT "stories_blocks_vertical_video_pair_right_id_media_id_fk" FOREIGN KEY ("right_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "stories_blocks_vertical_video_pair" ADD CONSTRAINT "stories_blocks_vertical_video_pair_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stories_blocks_chapter_list_chapters" ADD CONSTRAINT "stories_blocks_chapter_list_chapters_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stories_blocks_chapter_list"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stories_blocks_chapter_list" ADD CONSTRAINT "stories_blocks_chapter_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stories_blocks_poster_sequence_posters" ADD CONSTRAINT "stories_blocks_poster_sequence_posters_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "stories_blocks_poster_sequence_posters" ADD CONSTRAINT "stories_blocks_poster_sequence_posters_story_id_stories_id_fk" FOREIGN KEY ("story_id") REFERENCES "public"."stories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "stories_blocks_poster_sequence_posters" ADD CONSTRAINT "stories_blocks_poster_sequence_posters_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stories_blocks_poster_sequence"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stories_blocks_poster_sequence" ADD CONSTRAINT "stories_blocks_poster_sequence_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stories_blocks_transcript_excerpt" ADD CONSTRAINT "stories_blocks_transcript_excerpt_source_id_media_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "stories_blocks_transcript_excerpt" ADD CONSTRAINT "stories_blocks_transcript_excerpt_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stories_blocks_credits_block_credits" ADD CONSTRAINT "stories_blocks_credits_block_credits_person_id_people_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."people"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "stories_blocks_credits_block_credits" ADD CONSTRAINT "stories_blocks_credits_block_credits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stories_blocks_credits_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stories_blocks_credits_block" ADD CONSTRAINT "stories_blocks_credits_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stories_blocks_partner_disclosure" ADD CONSTRAINT "stories_blocks_partner_disclosure_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."partners"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "stories_blocks_partner_disclosure" ADD CONSTRAINT "stories_blocks_partner_disclosure_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stories_blocks_partner_profile_deliverables" ADD CONSTRAINT "stories_blocks_partner_profile_deliverables_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stories_blocks_partner_profile"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stories_blocks_partner_profile" ADD CONSTRAINT "stories_blocks_partner_profile_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."partners"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "stories_blocks_partner_profile" ADD CONSTRAINT "stories_blocks_partner_profile_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stories_blocks_product_credits_items" ADD CONSTRAINT "stories_blocks_product_credits_items_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."partners"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "stories_blocks_product_credits_items" ADD CONSTRAINT "stories_blocks_product_credits_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stories_blocks_product_credits"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stories_blocks_product_credits" ADD CONSTRAINT "stories_blocks_product_credits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stories_blocks_related_stories" ADD CONSTRAINT "stories_blocks_related_stories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stories_blocks_call_to_action" ADD CONSTRAINT "stories_blocks_call_to_action_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stories_credits" ADD CONSTRAINT "stories_credits_person_id_people_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."people"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "stories_credits" ADD CONSTRAINT "stories_credits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stories" ADD CONSTRAINT "stories_lead_media_id_media_id_fk" FOREIGN KEY ("lead_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "stories" ADD CONSTRAINT "stories_series_id_series_id_fk" FOREIGN KEY ("series_id") REFERENCES "public"."series"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "stories" ADD CONSTRAINT "stories_issue_id_issues_id_fk" FOREIGN KEY ("issue_id") REFERENCES "public"."issues"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "stories" ADD CONSTRAINT "stories_og_media_id_media_id_fk" FOREIGN KEY ("og_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "stories_rels" ADD CONSTRAINT "stories_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."stories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stories_rels" ADD CONSTRAINT "stories_rels_authors_fk" FOREIGN KEY ("authors_id") REFERENCES "public"."authors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stories_rels" ADD CONSTRAINT "stories_rels_stories_fk" FOREIGN KEY ("stories_id") REFERENCES "public"."stories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stories_rels" ADD CONSTRAINT "stories_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stories_rels" ADD CONSTRAINT "stories_rels_people_fk" FOREIGN KEY ("people_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stories_rels" ADD CONSTRAINT "stories_rels_places_fk" FOREIGN KEY ("places_id") REFERENCES "public"."places"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stories_rels" ADD CONSTRAINT "stories_rels_partners_fk" FOREIGN KEY ("partners_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stories_v_blocks_prose" ADD CONSTRAINT "_stories_v_blocks_prose_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_stories_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stories_v_blocks_pull_quote" ADD CONSTRAINT "_stories_v_blocks_pull_quote_person_id_people_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."people"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_stories_v_blocks_pull_quote" ADD CONSTRAINT "_stories_v_blocks_pull_quote_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_stories_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stories_v_blocks_chapter_divider" ADD CONSTRAINT "_stories_v_blocks_chapter_divider_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_stories_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stories_v_blocks_interview_exchanges" ADD CONSTRAINT "_stories_v_blocks_interview_exchanges_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_stories_v_blocks_interview"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stories_v_blocks_interview" ADD CONSTRAINT "_stories_v_blocks_interview_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_stories_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stories_v_blocks_callout" ADD CONSTRAINT "_stories_v_blocks_callout_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_stories_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stories_v_blocks_source_notes_notes" ADD CONSTRAINT "_stories_v_blocks_source_notes_notes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_stories_v_blocks_source_notes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stories_v_blocks_source_notes" ADD CONSTRAINT "_stories_v_blocks_source_notes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_stories_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stories_v_blocks_correction" ADD CONSTRAINT "_stories_v_blocks_correction_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_stories_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stories_v_blocks_timeline_entries" ADD CONSTRAINT "_stories_v_blocks_timeline_entries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_stories_v_blocks_timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stories_v_blocks_timeline" ADD CONSTRAINT "_stories_v_blocks_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_stories_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stories_v_blocks_image" ADD CONSTRAINT "_stories_v_blocks_image_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_stories_v_blocks_image" ADD CONSTRAINT "_stories_v_blocks_image_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_stories_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stories_v_blocks_image_pair" ADD CONSTRAINT "_stories_v_blocks_image_pair_left_id_media_id_fk" FOREIGN KEY ("left_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_stories_v_blocks_image_pair" ADD CONSTRAINT "_stories_v_blocks_image_pair_right_id_media_id_fk" FOREIGN KEY ("right_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_stories_v_blocks_image_pair" ADD CONSTRAINT "_stories_v_blocks_image_pair_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_stories_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stories_v_blocks_triptych_images" ADD CONSTRAINT "_stories_v_blocks_triptych_images_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_stories_v_blocks_triptych_images" ADD CONSTRAINT "_stories_v_blocks_triptych_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_stories_v_blocks_triptych"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stories_v_blocks_triptych" ADD CONSTRAINT "_stories_v_blocks_triptych_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_stories_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stories_v_blocks_contact_sheet_frames" ADD CONSTRAINT "_stories_v_blocks_contact_sheet_frames_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_stories_v_blocks_contact_sheet_frames" ADD CONSTRAINT "_stories_v_blocks_contact_sheet_frames_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_stories_v_blocks_contact_sheet"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stories_v_blocks_contact_sheet" ADD CONSTRAINT "_stories_v_blocks_contact_sheet_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_stories_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stories_v_blocks_before_after" ADD CONSTRAINT "_stories_v_blocks_before_after_before_id_media_id_fk" FOREIGN KEY ("before_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_stories_v_blocks_before_after" ADD CONSTRAINT "_stories_v_blocks_before_after_after_id_media_id_fk" FOREIGN KEY ("after_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_stories_v_blocks_before_after" ADD CONSTRAINT "_stories_v_blocks_before_after_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_stories_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stories_v_blocks_annotated_image_annotations" ADD CONSTRAINT "_stories_v_blocks_annotated_image_annotations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_stories_v_blocks_annotated_image"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stories_v_blocks_annotated_image" ADD CONSTRAINT "_stories_v_blocks_annotated_image_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_stories_v_blocks_annotated_image" ADD CONSTRAINT "_stories_v_blocks_annotated_image_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_stories_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stories_v_blocks_video" ADD CONSTRAINT "_stories_v_blocks_video_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_stories_v_blocks_video" ADD CONSTRAINT "_stories_v_blocks_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_stories_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stories_v_blocks_vertical_video_pair" ADD CONSTRAINT "_stories_v_blocks_vertical_video_pair_left_id_media_id_fk" FOREIGN KEY ("left_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_stories_v_blocks_vertical_video_pair" ADD CONSTRAINT "_stories_v_blocks_vertical_video_pair_right_id_media_id_fk" FOREIGN KEY ("right_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_stories_v_blocks_vertical_video_pair" ADD CONSTRAINT "_stories_v_blocks_vertical_video_pair_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_stories_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stories_v_blocks_chapter_list_chapters" ADD CONSTRAINT "_stories_v_blocks_chapter_list_chapters_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_stories_v_blocks_chapter_list"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stories_v_blocks_chapter_list" ADD CONSTRAINT "_stories_v_blocks_chapter_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_stories_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stories_v_blocks_poster_sequence_posters" ADD CONSTRAINT "_stories_v_blocks_poster_sequence_posters_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_stories_v_blocks_poster_sequence_posters" ADD CONSTRAINT "_stories_v_blocks_poster_sequence_posters_story_id_stories_id_fk" FOREIGN KEY ("story_id") REFERENCES "public"."stories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_stories_v_blocks_poster_sequence_posters" ADD CONSTRAINT "_stories_v_blocks_poster_sequence_posters_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_stories_v_blocks_poster_sequence"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stories_v_blocks_poster_sequence" ADD CONSTRAINT "_stories_v_blocks_poster_sequence_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_stories_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stories_v_blocks_transcript_excerpt" ADD CONSTRAINT "_stories_v_blocks_transcript_excerpt_source_id_media_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_stories_v_blocks_transcript_excerpt" ADD CONSTRAINT "_stories_v_blocks_transcript_excerpt_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_stories_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stories_v_blocks_credits_block_credits" ADD CONSTRAINT "_stories_v_blocks_credits_block_credits_person_id_people_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."people"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_stories_v_blocks_credits_block_credits" ADD CONSTRAINT "_stories_v_blocks_credits_block_credits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_stories_v_blocks_credits_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stories_v_blocks_credits_block" ADD CONSTRAINT "_stories_v_blocks_credits_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_stories_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stories_v_blocks_partner_disclosure" ADD CONSTRAINT "_stories_v_blocks_partner_disclosure_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."partners"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_stories_v_blocks_partner_disclosure" ADD CONSTRAINT "_stories_v_blocks_partner_disclosure_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_stories_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stories_v_blocks_partner_profile_deliverables" ADD CONSTRAINT "_stories_v_blocks_partner_profile_deliverables_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_stories_v_blocks_partner_profile"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stories_v_blocks_partner_profile" ADD CONSTRAINT "_stories_v_blocks_partner_profile_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."partners"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_stories_v_blocks_partner_profile" ADD CONSTRAINT "_stories_v_blocks_partner_profile_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_stories_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stories_v_blocks_product_credits_items" ADD CONSTRAINT "_stories_v_blocks_product_credits_items_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."partners"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_stories_v_blocks_product_credits_items" ADD CONSTRAINT "_stories_v_blocks_product_credits_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_stories_v_blocks_product_credits"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stories_v_blocks_product_credits" ADD CONSTRAINT "_stories_v_blocks_product_credits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_stories_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stories_v_blocks_related_stories" ADD CONSTRAINT "_stories_v_blocks_related_stories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_stories_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stories_v_blocks_call_to_action" ADD CONSTRAINT "_stories_v_blocks_call_to_action_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_stories_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stories_v_version_credits" ADD CONSTRAINT "_stories_v_version_credits_person_id_people_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."people"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_stories_v_version_credits" ADD CONSTRAINT "_stories_v_version_credits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_stories_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stories_v" ADD CONSTRAINT "_stories_v_parent_id_stories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."stories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_stories_v" ADD CONSTRAINT "_stories_v_version_lead_media_id_media_id_fk" FOREIGN KEY ("version_lead_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_stories_v" ADD CONSTRAINT "_stories_v_version_series_id_series_id_fk" FOREIGN KEY ("version_series_id") REFERENCES "public"."series"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_stories_v" ADD CONSTRAINT "_stories_v_version_issue_id_issues_id_fk" FOREIGN KEY ("version_issue_id") REFERENCES "public"."issues"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_stories_v" ADD CONSTRAINT "_stories_v_version_og_media_id_media_id_fk" FOREIGN KEY ("version_og_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_stories_v_rels" ADD CONSTRAINT "_stories_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_stories_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stories_v_rels" ADD CONSTRAINT "_stories_v_rels_authors_fk" FOREIGN KEY ("authors_id") REFERENCES "public"."authors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stories_v_rels" ADD CONSTRAINT "_stories_v_rels_stories_fk" FOREIGN KEY ("stories_id") REFERENCES "public"."stories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stories_v_rels" ADD CONSTRAINT "_stories_v_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stories_v_rels" ADD CONSTRAINT "_stories_v_rels_people_fk" FOREIGN KEY ("people_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stories_v_rels" ADD CONSTRAINT "_stories_v_rels_places_fk" FOREIGN KEY ("places_id") REFERENCES "public"."places"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stories_v_rels" ADD CONSTRAINT "_stories_v_rels_partners_fk" FOREIGN KEY ("partners_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_credits" ADD CONSTRAINT "media_credits_person_id_people_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."people"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media_credits" ADD CONSTRAINT "media_credits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_captions" ADD CONSTRAINT "media_captions_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media_captions" ADD CONSTRAINT "media_captions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media" ADD CONSTRAINT "media_place_id_places_id_fk" FOREIGN KEY ("place_id") REFERENCES "public"."places"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media" ADD CONSTRAINT "media_poster_id_media_id_fk" FOREIGN KEY ("poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media" ADD CONSTRAINT "media_reviewed_by_id_users_id_fk" FOREIGN KEY ("reviewed_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media_rels" ADD CONSTRAINT "media_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_rels" ADD CONSTRAINT "media_rels_people_fk" FOREIGN KEY ("people_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_rels" ADD CONSTRAINT "media_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "issues" ADD CONSTRAINT "issues_cover_media_id_media_id_fk" FOREIGN KEY ("cover_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "issues" ADD CONSTRAINT "issues_lead_story_id_stories_id_fk" FOREIGN KEY ("lead_story_id") REFERENCES "public"."stories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "issues_rels" ADD CONSTRAINT "issues_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."issues"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "issues_rels" ADD CONSTRAINT "issues_rels_stories_fk" FOREIGN KEY ("stories_id") REFERENCES "public"."stories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_issues_v" ADD CONSTRAINT "_issues_v_parent_id_issues_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."issues"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_issues_v" ADD CONSTRAINT "_issues_v_version_cover_media_id_media_id_fk" FOREIGN KEY ("version_cover_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_issues_v" ADD CONSTRAINT "_issues_v_version_lead_story_id_stories_id_fk" FOREIGN KEY ("version_lead_story_id") REFERENCES "public"."stories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_issues_v_rels" ADD CONSTRAINT "_issues_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_issues_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_issues_v_rels" ADD CONSTRAINT "_issues_v_rels_stories_fk" FOREIGN KEY ("stories_id") REFERENCES "public"."stories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "series" ADD CONSTRAINT "series_cover_media_id_media_id_fk" FOREIGN KEY ("cover_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tags_aliases" ADD CONSTRAINT "tags_aliases_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tags_channel_affinity" ADD CONSTRAINT "tags_channel_affinity_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tags" ADD CONSTRAINT "tags_merged_into_id_tags_id_fk" FOREIGN KEY ("merged_into_id") REFERENCES "public"."tags"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tags" ADD CONSTRAINT "tags_parent_id_tags_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."tags"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "people_kind" ADD CONSTRAINT "people_kind_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "people_links" ADD CONSTRAINT "people_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners" ADD CONSTRAINT "partners_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "authors_links" ADD CONSTRAINT "authors_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."authors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "authors" ADD CONSTRAINT "authors_portrait_id_media_id_fk" FOREIGN KEY ("portrait_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "authors" ADD CONSTRAINT "authors_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_jobs_log" ADD CONSTRAINT "payload_jobs_log_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_stories_fk" FOREIGN KEY ("stories_id") REFERENCES "public"."stories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_issues_fk" FOREIGN KEY ("issues_id") REFERENCES "public"."issues"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_series_fk" FOREIGN KEY ("series_id") REFERENCES "public"."series"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_people_fk" FOREIGN KEY ("people_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_places_fk" FOREIGN KEY ("places_id") REFERENCES "public"."places"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_partners_fk" FOREIGN KEY ("partners_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_authors_fk" FOREIGN KEY ("authors_id") REFERENCES "public"."authors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_redirects_fk" FOREIGN KEY ("redirects_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_submissions_fk" FOREIGN KEY ("submissions_id") REFERENCES "public"."submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_default_share_image_id_media_id_fk" FOREIGN KEY ("default_share_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "channel_settings_channels" ADD CONSTRAINT "channel_settings_channels_featured_story_id_stories_id_fk" FOREIGN KEY ("featured_story_id") REFERENCES "public"."stories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "channel_settings_channels" ADD CONSTRAINT "channel_settings_channels_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."channel_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_footer_links" ADD CONSTRAINT "navigation_footer_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_sections" ADD CONSTRAINT "home_page_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_current_issue_id_issues_id_fk" FOREIGN KEY ("current_issue_id") REFERENCES "public"."issues"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_lead_story_id_stories_id_fk" FOREIGN KEY ("lead_story_id") REFERENCES "public"."stories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page_rels" ADD CONSTRAINT "home_page_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_rels" ADD CONSTRAINT "home_page_rels_stories_fk" FOREIGN KEY ("stories_id") REFERENCES "public"."stories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_milestones" ADD CONSTRAINT "about_page_milestones_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page" ADD CONSTRAINT "about_page_portrait_id_media_id_fk" FOREIGN KEY ("portrait_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "disclosure_settings_statements" ADD CONSTRAINT "disclosure_settings_statements_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."disclosure_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "stories_blocks_prose_order_idx" ON "stories_blocks_prose" USING btree ("_order");
  CREATE INDEX "stories_blocks_prose_parent_id_idx" ON "stories_blocks_prose" USING btree ("_parent_id");
  CREATE INDEX "stories_blocks_prose_path_idx" ON "stories_blocks_prose" USING btree ("_path");
  CREATE INDEX "stories_blocks_pull_quote_order_idx" ON "stories_blocks_pull_quote" USING btree ("_order");
  CREATE INDEX "stories_blocks_pull_quote_parent_id_idx" ON "stories_blocks_pull_quote" USING btree ("_parent_id");
  CREATE INDEX "stories_blocks_pull_quote_path_idx" ON "stories_blocks_pull_quote" USING btree ("_path");
  CREATE INDEX "stories_blocks_pull_quote_person_idx" ON "stories_blocks_pull_quote" USING btree ("person_id");
  CREATE INDEX "stories_blocks_chapter_divider_order_idx" ON "stories_blocks_chapter_divider" USING btree ("_order");
  CREATE INDEX "stories_blocks_chapter_divider_parent_id_idx" ON "stories_blocks_chapter_divider" USING btree ("_parent_id");
  CREATE INDEX "stories_blocks_chapter_divider_path_idx" ON "stories_blocks_chapter_divider" USING btree ("_path");
  CREATE INDEX "stories_blocks_interview_exchanges_order_idx" ON "stories_blocks_interview_exchanges" USING btree ("_order");
  CREATE INDEX "stories_blocks_interview_exchanges_parent_id_idx" ON "stories_blocks_interview_exchanges" USING btree ("_parent_id");
  CREATE INDEX "stories_blocks_interview_order_idx" ON "stories_blocks_interview" USING btree ("_order");
  CREATE INDEX "stories_blocks_interview_parent_id_idx" ON "stories_blocks_interview" USING btree ("_parent_id");
  CREATE INDEX "stories_blocks_interview_path_idx" ON "stories_blocks_interview" USING btree ("_path");
  CREATE INDEX "stories_blocks_callout_order_idx" ON "stories_blocks_callout" USING btree ("_order");
  CREATE INDEX "stories_blocks_callout_parent_id_idx" ON "stories_blocks_callout" USING btree ("_parent_id");
  CREATE INDEX "stories_blocks_callout_path_idx" ON "stories_blocks_callout" USING btree ("_path");
  CREATE INDEX "stories_blocks_source_notes_notes_order_idx" ON "stories_blocks_source_notes_notes" USING btree ("_order");
  CREATE INDEX "stories_blocks_source_notes_notes_parent_id_idx" ON "stories_blocks_source_notes_notes" USING btree ("_parent_id");
  CREATE INDEX "stories_blocks_source_notes_order_idx" ON "stories_blocks_source_notes" USING btree ("_order");
  CREATE INDEX "stories_blocks_source_notes_parent_id_idx" ON "stories_blocks_source_notes" USING btree ("_parent_id");
  CREATE INDEX "stories_blocks_source_notes_path_idx" ON "stories_blocks_source_notes" USING btree ("_path");
  CREATE INDEX "stories_blocks_correction_order_idx" ON "stories_blocks_correction" USING btree ("_order");
  CREATE INDEX "stories_blocks_correction_parent_id_idx" ON "stories_blocks_correction" USING btree ("_parent_id");
  CREATE INDEX "stories_blocks_correction_path_idx" ON "stories_blocks_correction" USING btree ("_path");
  CREATE INDEX "stories_blocks_timeline_entries_order_idx" ON "stories_blocks_timeline_entries" USING btree ("_order");
  CREATE INDEX "stories_blocks_timeline_entries_parent_id_idx" ON "stories_blocks_timeline_entries" USING btree ("_parent_id");
  CREATE INDEX "stories_blocks_timeline_order_idx" ON "stories_blocks_timeline" USING btree ("_order");
  CREATE INDEX "stories_blocks_timeline_parent_id_idx" ON "stories_blocks_timeline" USING btree ("_parent_id");
  CREATE INDEX "stories_blocks_timeline_path_idx" ON "stories_blocks_timeline" USING btree ("_path");
  CREATE INDEX "stories_blocks_image_order_idx" ON "stories_blocks_image" USING btree ("_order");
  CREATE INDEX "stories_blocks_image_parent_id_idx" ON "stories_blocks_image" USING btree ("_parent_id");
  CREATE INDEX "stories_blocks_image_path_idx" ON "stories_blocks_image" USING btree ("_path");
  CREATE INDEX "stories_blocks_image_media_idx" ON "stories_blocks_image" USING btree ("media_id");
  CREATE INDEX "stories_blocks_image_pair_order_idx" ON "stories_blocks_image_pair" USING btree ("_order");
  CREATE INDEX "stories_blocks_image_pair_parent_id_idx" ON "stories_blocks_image_pair" USING btree ("_parent_id");
  CREATE INDEX "stories_blocks_image_pair_path_idx" ON "stories_blocks_image_pair" USING btree ("_path");
  CREATE INDEX "stories_blocks_image_pair_left_idx" ON "stories_blocks_image_pair" USING btree ("left_id");
  CREATE INDEX "stories_blocks_image_pair_right_idx" ON "stories_blocks_image_pair" USING btree ("right_id");
  CREATE INDEX "stories_blocks_triptych_images_order_idx" ON "stories_blocks_triptych_images" USING btree ("_order");
  CREATE INDEX "stories_blocks_triptych_images_parent_id_idx" ON "stories_blocks_triptych_images" USING btree ("_parent_id");
  CREATE INDEX "stories_blocks_triptych_images_media_idx" ON "stories_blocks_triptych_images" USING btree ("media_id");
  CREATE INDEX "stories_blocks_triptych_order_idx" ON "stories_blocks_triptych" USING btree ("_order");
  CREATE INDEX "stories_blocks_triptych_parent_id_idx" ON "stories_blocks_triptych" USING btree ("_parent_id");
  CREATE INDEX "stories_blocks_triptych_path_idx" ON "stories_blocks_triptych" USING btree ("_path");
  CREATE INDEX "stories_blocks_contact_sheet_frames_order_idx" ON "stories_blocks_contact_sheet_frames" USING btree ("_order");
  CREATE INDEX "stories_blocks_contact_sheet_frames_parent_id_idx" ON "stories_blocks_contact_sheet_frames" USING btree ("_parent_id");
  CREATE INDEX "stories_blocks_contact_sheet_frames_media_idx" ON "stories_blocks_contact_sheet_frames" USING btree ("media_id");
  CREATE INDEX "stories_blocks_contact_sheet_order_idx" ON "stories_blocks_contact_sheet" USING btree ("_order");
  CREATE INDEX "stories_blocks_contact_sheet_parent_id_idx" ON "stories_blocks_contact_sheet" USING btree ("_parent_id");
  CREATE INDEX "stories_blocks_contact_sheet_path_idx" ON "stories_blocks_contact_sheet" USING btree ("_path");
  CREATE INDEX "stories_blocks_before_after_order_idx" ON "stories_blocks_before_after" USING btree ("_order");
  CREATE INDEX "stories_blocks_before_after_parent_id_idx" ON "stories_blocks_before_after" USING btree ("_parent_id");
  CREATE INDEX "stories_blocks_before_after_path_idx" ON "stories_blocks_before_after" USING btree ("_path");
  CREATE INDEX "stories_blocks_before_after_before_idx" ON "stories_blocks_before_after" USING btree ("before_id");
  CREATE INDEX "stories_blocks_before_after_after_idx" ON "stories_blocks_before_after" USING btree ("after_id");
  CREATE INDEX "stories_blocks_annotated_image_annotations_order_idx" ON "stories_blocks_annotated_image_annotations" USING btree ("_order");
  CREATE INDEX "stories_blocks_annotated_image_annotations_parent_id_idx" ON "stories_blocks_annotated_image_annotations" USING btree ("_parent_id");
  CREATE INDEX "stories_blocks_annotated_image_order_idx" ON "stories_blocks_annotated_image" USING btree ("_order");
  CREATE INDEX "stories_blocks_annotated_image_parent_id_idx" ON "stories_blocks_annotated_image" USING btree ("_parent_id");
  CREATE INDEX "stories_blocks_annotated_image_path_idx" ON "stories_blocks_annotated_image" USING btree ("_path");
  CREATE INDEX "stories_blocks_annotated_image_media_idx" ON "stories_blocks_annotated_image" USING btree ("media_id");
  CREATE INDEX "stories_blocks_video_order_idx" ON "stories_blocks_video" USING btree ("_order");
  CREATE INDEX "stories_blocks_video_parent_id_idx" ON "stories_blocks_video" USING btree ("_parent_id");
  CREATE INDEX "stories_blocks_video_path_idx" ON "stories_blocks_video" USING btree ("_path");
  CREATE INDEX "stories_blocks_video_media_idx" ON "stories_blocks_video" USING btree ("media_id");
  CREATE INDEX "stories_blocks_vertical_video_pair_order_idx" ON "stories_blocks_vertical_video_pair" USING btree ("_order");
  CREATE INDEX "stories_blocks_vertical_video_pair_parent_id_idx" ON "stories_blocks_vertical_video_pair" USING btree ("_parent_id");
  CREATE INDEX "stories_blocks_vertical_video_pair_path_idx" ON "stories_blocks_vertical_video_pair" USING btree ("_path");
  CREATE INDEX "stories_blocks_vertical_video_pair_left_idx" ON "stories_blocks_vertical_video_pair" USING btree ("left_id");
  CREATE INDEX "stories_blocks_vertical_video_pair_right_idx" ON "stories_blocks_vertical_video_pair" USING btree ("right_id");
  CREATE INDEX "stories_blocks_chapter_list_chapters_order_idx" ON "stories_blocks_chapter_list_chapters" USING btree ("_order");
  CREATE INDEX "stories_blocks_chapter_list_chapters_parent_id_idx" ON "stories_blocks_chapter_list_chapters" USING btree ("_parent_id");
  CREATE INDEX "stories_blocks_chapter_list_order_idx" ON "stories_blocks_chapter_list" USING btree ("_order");
  CREATE INDEX "stories_blocks_chapter_list_parent_id_idx" ON "stories_blocks_chapter_list" USING btree ("_parent_id");
  CREATE INDEX "stories_blocks_chapter_list_path_idx" ON "stories_blocks_chapter_list" USING btree ("_path");
  CREATE INDEX "stories_blocks_poster_sequence_posters_order_idx" ON "stories_blocks_poster_sequence_posters" USING btree ("_order");
  CREATE INDEX "stories_blocks_poster_sequence_posters_parent_id_idx" ON "stories_blocks_poster_sequence_posters" USING btree ("_parent_id");
  CREATE INDEX "stories_blocks_poster_sequence_posters_media_idx" ON "stories_blocks_poster_sequence_posters" USING btree ("media_id");
  CREATE INDEX "stories_blocks_poster_sequence_posters_story_idx" ON "stories_blocks_poster_sequence_posters" USING btree ("story_id");
  CREATE INDEX "stories_blocks_poster_sequence_order_idx" ON "stories_blocks_poster_sequence" USING btree ("_order");
  CREATE INDEX "stories_blocks_poster_sequence_parent_id_idx" ON "stories_blocks_poster_sequence" USING btree ("_parent_id");
  CREATE INDEX "stories_blocks_poster_sequence_path_idx" ON "stories_blocks_poster_sequence" USING btree ("_path");
  CREATE INDEX "stories_blocks_transcript_excerpt_order_idx" ON "stories_blocks_transcript_excerpt" USING btree ("_order");
  CREATE INDEX "stories_blocks_transcript_excerpt_parent_id_idx" ON "stories_blocks_transcript_excerpt" USING btree ("_parent_id");
  CREATE INDEX "stories_blocks_transcript_excerpt_path_idx" ON "stories_blocks_transcript_excerpt" USING btree ("_path");
  CREATE INDEX "stories_blocks_transcript_excerpt_source_idx" ON "stories_blocks_transcript_excerpt" USING btree ("source_id");
  CREATE INDEX "stories_blocks_credits_block_credits_order_idx" ON "stories_blocks_credits_block_credits" USING btree ("_order");
  CREATE INDEX "stories_blocks_credits_block_credits_parent_id_idx" ON "stories_blocks_credits_block_credits" USING btree ("_parent_id");
  CREATE INDEX "stories_blocks_credits_block_credits_person_idx" ON "stories_blocks_credits_block_credits" USING btree ("person_id");
  CREATE INDEX "stories_blocks_credits_block_order_idx" ON "stories_blocks_credits_block" USING btree ("_order");
  CREATE INDEX "stories_blocks_credits_block_parent_id_idx" ON "stories_blocks_credits_block" USING btree ("_parent_id");
  CREATE INDEX "stories_blocks_credits_block_path_idx" ON "stories_blocks_credits_block" USING btree ("_path");
  CREATE INDEX "stories_blocks_partner_disclosure_order_idx" ON "stories_blocks_partner_disclosure" USING btree ("_order");
  CREATE INDEX "stories_blocks_partner_disclosure_parent_id_idx" ON "stories_blocks_partner_disclosure" USING btree ("_parent_id");
  CREATE INDEX "stories_blocks_partner_disclosure_path_idx" ON "stories_blocks_partner_disclosure" USING btree ("_path");
  CREATE INDEX "stories_blocks_partner_disclosure_partner_idx" ON "stories_blocks_partner_disclosure" USING btree ("partner_id");
  CREATE INDEX "stories_blocks_partner_profile_deliverables_order_idx" ON "stories_blocks_partner_profile_deliverables" USING btree ("_order");
  CREATE INDEX "stories_blocks_partner_profile_deliverables_parent_id_idx" ON "stories_blocks_partner_profile_deliverables" USING btree ("_parent_id");
  CREATE INDEX "stories_blocks_partner_profile_order_idx" ON "stories_blocks_partner_profile" USING btree ("_order");
  CREATE INDEX "stories_blocks_partner_profile_parent_id_idx" ON "stories_blocks_partner_profile" USING btree ("_parent_id");
  CREATE INDEX "stories_blocks_partner_profile_path_idx" ON "stories_blocks_partner_profile" USING btree ("_path");
  CREATE INDEX "stories_blocks_partner_profile_partner_idx" ON "stories_blocks_partner_profile" USING btree ("partner_id");
  CREATE INDEX "stories_blocks_product_credits_items_order_idx" ON "stories_blocks_product_credits_items" USING btree ("_order");
  CREATE INDEX "stories_blocks_product_credits_items_parent_id_idx" ON "stories_blocks_product_credits_items" USING btree ("_parent_id");
  CREATE INDEX "stories_blocks_product_credits_items_partner_idx" ON "stories_blocks_product_credits_items" USING btree ("partner_id");
  CREATE INDEX "stories_blocks_product_credits_order_idx" ON "stories_blocks_product_credits" USING btree ("_order");
  CREATE INDEX "stories_blocks_product_credits_parent_id_idx" ON "stories_blocks_product_credits" USING btree ("_parent_id");
  CREATE INDEX "stories_blocks_product_credits_path_idx" ON "stories_blocks_product_credits" USING btree ("_path");
  CREATE INDEX "stories_blocks_related_stories_order_idx" ON "stories_blocks_related_stories" USING btree ("_order");
  CREATE INDEX "stories_blocks_related_stories_parent_id_idx" ON "stories_blocks_related_stories" USING btree ("_parent_id");
  CREATE INDEX "stories_blocks_related_stories_path_idx" ON "stories_blocks_related_stories" USING btree ("_path");
  CREATE INDEX "stories_blocks_call_to_action_order_idx" ON "stories_blocks_call_to_action" USING btree ("_order");
  CREATE INDEX "stories_blocks_call_to_action_parent_id_idx" ON "stories_blocks_call_to_action" USING btree ("_parent_id");
  CREATE INDEX "stories_blocks_call_to_action_path_idx" ON "stories_blocks_call_to_action" USING btree ("_path");
  CREATE INDEX "stories_credits_order_idx" ON "stories_credits" USING btree ("_order");
  CREATE INDEX "stories_credits_parent_id_idx" ON "stories_credits" USING btree ("_parent_id");
  CREATE INDEX "stories_credits_person_idx" ON "stories_credits" USING btree ("person_id");
  CREATE INDEX "stories_title_idx" ON "stories" USING btree ("title");
  CREATE UNIQUE INDEX "stories_slug_idx" ON "stories" USING btree ("slug");
  CREATE INDEX "stories_channel_idx" ON "stories" USING btree ("channel");
  CREATE INDEX "stories_published_at_idx" ON "stories" USING btree ("published_at");
  CREATE INDEX "stories_lead_media_idx" ON "stories" USING btree ("lead_media_id");
  CREATE INDEX "stories_series_idx" ON "stories" USING btree ("series_id");
  CREATE INDEX "stories_issue_idx" ON "stories" USING btree ("issue_id");
  CREATE INDEX "stories_og_media_idx" ON "stories" USING btree ("og_media_id");
  CREATE INDEX "stories_search_document_idx" ON "stories" USING btree ("search_document");
  CREATE UNIQUE INDEX "stories_legacy_source_id_idx" ON "stories" USING btree ("legacy_source_id");
  CREATE INDEX "stories_updated_at_idx" ON "stories" USING btree ("updated_at");
  CREATE INDEX "stories_created_at_idx" ON "stories" USING btree ("created_at");
  CREATE INDEX "stories__status_idx" ON "stories" USING btree ("_status");
  CREATE INDEX "stories_rels_order_idx" ON "stories_rels" USING btree ("order");
  CREATE INDEX "stories_rels_parent_idx" ON "stories_rels" USING btree ("parent_id");
  CREATE INDEX "stories_rels_path_idx" ON "stories_rels" USING btree ("path");
  CREATE INDEX "stories_rels_authors_id_idx" ON "stories_rels" USING btree ("authors_id");
  CREATE INDEX "stories_rels_stories_id_idx" ON "stories_rels" USING btree ("stories_id");
  CREATE INDEX "stories_rels_tags_id_idx" ON "stories_rels" USING btree ("tags_id");
  CREATE INDEX "stories_rels_people_id_idx" ON "stories_rels" USING btree ("people_id");
  CREATE INDEX "stories_rels_places_id_idx" ON "stories_rels" USING btree ("places_id");
  CREATE INDEX "stories_rels_partners_id_idx" ON "stories_rels" USING btree ("partners_id");
  CREATE INDEX "_stories_v_blocks_prose_order_idx" ON "_stories_v_blocks_prose" USING btree ("_order");
  CREATE INDEX "_stories_v_blocks_prose_parent_id_idx" ON "_stories_v_blocks_prose" USING btree ("_parent_id");
  CREATE INDEX "_stories_v_blocks_prose_path_idx" ON "_stories_v_blocks_prose" USING btree ("_path");
  CREATE INDEX "_stories_v_blocks_pull_quote_order_idx" ON "_stories_v_blocks_pull_quote" USING btree ("_order");
  CREATE INDEX "_stories_v_blocks_pull_quote_parent_id_idx" ON "_stories_v_blocks_pull_quote" USING btree ("_parent_id");
  CREATE INDEX "_stories_v_blocks_pull_quote_path_idx" ON "_stories_v_blocks_pull_quote" USING btree ("_path");
  CREATE INDEX "_stories_v_blocks_pull_quote_person_idx" ON "_stories_v_blocks_pull_quote" USING btree ("person_id");
  CREATE INDEX "_stories_v_blocks_chapter_divider_order_idx" ON "_stories_v_blocks_chapter_divider" USING btree ("_order");
  CREATE INDEX "_stories_v_blocks_chapter_divider_parent_id_idx" ON "_stories_v_blocks_chapter_divider" USING btree ("_parent_id");
  CREATE INDEX "_stories_v_blocks_chapter_divider_path_idx" ON "_stories_v_blocks_chapter_divider" USING btree ("_path");
  CREATE INDEX "_stories_v_blocks_interview_exchanges_order_idx" ON "_stories_v_blocks_interview_exchanges" USING btree ("_order");
  CREATE INDEX "_stories_v_blocks_interview_exchanges_parent_id_idx" ON "_stories_v_blocks_interview_exchanges" USING btree ("_parent_id");
  CREATE INDEX "_stories_v_blocks_interview_order_idx" ON "_stories_v_blocks_interview" USING btree ("_order");
  CREATE INDEX "_stories_v_blocks_interview_parent_id_idx" ON "_stories_v_blocks_interview" USING btree ("_parent_id");
  CREATE INDEX "_stories_v_blocks_interview_path_idx" ON "_stories_v_blocks_interview" USING btree ("_path");
  CREATE INDEX "_stories_v_blocks_callout_order_idx" ON "_stories_v_blocks_callout" USING btree ("_order");
  CREATE INDEX "_stories_v_blocks_callout_parent_id_idx" ON "_stories_v_blocks_callout" USING btree ("_parent_id");
  CREATE INDEX "_stories_v_blocks_callout_path_idx" ON "_stories_v_blocks_callout" USING btree ("_path");
  CREATE INDEX "_stories_v_blocks_source_notes_notes_order_idx" ON "_stories_v_blocks_source_notes_notes" USING btree ("_order");
  CREATE INDEX "_stories_v_blocks_source_notes_notes_parent_id_idx" ON "_stories_v_blocks_source_notes_notes" USING btree ("_parent_id");
  CREATE INDEX "_stories_v_blocks_source_notes_order_idx" ON "_stories_v_blocks_source_notes" USING btree ("_order");
  CREATE INDEX "_stories_v_blocks_source_notes_parent_id_idx" ON "_stories_v_blocks_source_notes" USING btree ("_parent_id");
  CREATE INDEX "_stories_v_blocks_source_notes_path_idx" ON "_stories_v_blocks_source_notes" USING btree ("_path");
  CREATE INDEX "_stories_v_blocks_correction_order_idx" ON "_stories_v_blocks_correction" USING btree ("_order");
  CREATE INDEX "_stories_v_blocks_correction_parent_id_idx" ON "_stories_v_blocks_correction" USING btree ("_parent_id");
  CREATE INDEX "_stories_v_blocks_correction_path_idx" ON "_stories_v_blocks_correction" USING btree ("_path");
  CREATE INDEX "_stories_v_blocks_timeline_entries_order_idx" ON "_stories_v_blocks_timeline_entries" USING btree ("_order");
  CREATE INDEX "_stories_v_blocks_timeline_entries_parent_id_idx" ON "_stories_v_blocks_timeline_entries" USING btree ("_parent_id");
  CREATE INDEX "_stories_v_blocks_timeline_order_idx" ON "_stories_v_blocks_timeline" USING btree ("_order");
  CREATE INDEX "_stories_v_blocks_timeline_parent_id_idx" ON "_stories_v_blocks_timeline" USING btree ("_parent_id");
  CREATE INDEX "_stories_v_blocks_timeline_path_idx" ON "_stories_v_blocks_timeline" USING btree ("_path");
  CREATE INDEX "_stories_v_blocks_image_order_idx" ON "_stories_v_blocks_image" USING btree ("_order");
  CREATE INDEX "_stories_v_blocks_image_parent_id_idx" ON "_stories_v_blocks_image" USING btree ("_parent_id");
  CREATE INDEX "_stories_v_blocks_image_path_idx" ON "_stories_v_blocks_image" USING btree ("_path");
  CREATE INDEX "_stories_v_blocks_image_media_idx" ON "_stories_v_blocks_image" USING btree ("media_id");
  CREATE INDEX "_stories_v_blocks_image_pair_order_idx" ON "_stories_v_blocks_image_pair" USING btree ("_order");
  CREATE INDEX "_stories_v_blocks_image_pair_parent_id_idx" ON "_stories_v_blocks_image_pair" USING btree ("_parent_id");
  CREATE INDEX "_stories_v_blocks_image_pair_path_idx" ON "_stories_v_blocks_image_pair" USING btree ("_path");
  CREATE INDEX "_stories_v_blocks_image_pair_left_idx" ON "_stories_v_blocks_image_pair" USING btree ("left_id");
  CREATE INDEX "_stories_v_blocks_image_pair_right_idx" ON "_stories_v_blocks_image_pair" USING btree ("right_id");
  CREATE INDEX "_stories_v_blocks_triptych_images_order_idx" ON "_stories_v_blocks_triptych_images" USING btree ("_order");
  CREATE INDEX "_stories_v_blocks_triptych_images_parent_id_idx" ON "_stories_v_blocks_triptych_images" USING btree ("_parent_id");
  CREATE INDEX "_stories_v_blocks_triptych_images_media_idx" ON "_stories_v_blocks_triptych_images" USING btree ("media_id");
  CREATE INDEX "_stories_v_blocks_triptych_order_idx" ON "_stories_v_blocks_triptych" USING btree ("_order");
  CREATE INDEX "_stories_v_blocks_triptych_parent_id_idx" ON "_stories_v_blocks_triptych" USING btree ("_parent_id");
  CREATE INDEX "_stories_v_blocks_triptych_path_idx" ON "_stories_v_blocks_triptych" USING btree ("_path");
  CREATE INDEX "_stories_v_blocks_contact_sheet_frames_order_idx" ON "_stories_v_blocks_contact_sheet_frames" USING btree ("_order");
  CREATE INDEX "_stories_v_blocks_contact_sheet_frames_parent_id_idx" ON "_stories_v_blocks_contact_sheet_frames" USING btree ("_parent_id");
  CREATE INDEX "_stories_v_blocks_contact_sheet_frames_media_idx" ON "_stories_v_blocks_contact_sheet_frames" USING btree ("media_id");
  CREATE INDEX "_stories_v_blocks_contact_sheet_order_idx" ON "_stories_v_blocks_contact_sheet" USING btree ("_order");
  CREATE INDEX "_stories_v_blocks_contact_sheet_parent_id_idx" ON "_stories_v_blocks_contact_sheet" USING btree ("_parent_id");
  CREATE INDEX "_stories_v_blocks_contact_sheet_path_idx" ON "_stories_v_blocks_contact_sheet" USING btree ("_path");
  CREATE INDEX "_stories_v_blocks_before_after_order_idx" ON "_stories_v_blocks_before_after" USING btree ("_order");
  CREATE INDEX "_stories_v_blocks_before_after_parent_id_idx" ON "_stories_v_blocks_before_after" USING btree ("_parent_id");
  CREATE INDEX "_stories_v_blocks_before_after_path_idx" ON "_stories_v_blocks_before_after" USING btree ("_path");
  CREATE INDEX "_stories_v_blocks_before_after_before_idx" ON "_stories_v_blocks_before_after" USING btree ("before_id");
  CREATE INDEX "_stories_v_blocks_before_after_after_idx" ON "_stories_v_blocks_before_after" USING btree ("after_id");
  CREATE INDEX "_stories_v_blocks_annotated_image_annotations_order_idx" ON "_stories_v_blocks_annotated_image_annotations" USING btree ("_order");
  CREATE INDEX "_stories_v_blocks_annotated_image_annotations_parent_id_idx" ON "_stories_v_blocks_annotated_image_annotations" USING btree ("_parent_id");
  CREATE INDEX "_stories_v_blocks_annotated_image_order_idx" ON "_stories_v_blocks_annotated_image" USING btree ("_order");
  CREATE INDEX "_stories_v_blocks_annotated_image_parent_id_idx" ON "_stories_v_blocks_annotated_image" USING btree ("_parent_id");
  CREATE INDEX "_stories_v_blocks_annotated_image_path_idx" ON "_stories_v_blocks_annotated_image" USING btree ("_path");
  CREATE INDEX "_stories_v_blocks_annotated_image_media_idx" ON "_stories_v_blocks_annotated_image" USING btree ("media_id");
  CREATE INDEX "_stories_v_blocks_video_order_idx" ON "_stories_v_blocks_video" USING btree ("_order");
  CREATE INDEX "_stories_v_blocks_video_parent_id_idx" ON "_stories_v_blocks_video" USING btree ("_parent_id");
  CREATE INDEX "_stories_v_blocks_video_path_idx" ON "_stories_v_blocks_video" USING btree ("_path");
  CREATE INDEX "_stories_v_blocks_video_media_idx" ON "_stories_v_blocks_video" USING btree ("media_id");
  CREATE INDEX "_stories_v_blocks_vertical_video_pair_order_idx" ON "_stories_v_blocks_vertical_video_pair" USING btree ("_order");
  CREATE INDEX "_stories_v_blocks_vertical_video_pair_parent_id_idx" ON "_stories_v_blocks_vertical_video_pair" USING btree ("_parent_id");
  CREATE INDEX "_stories_v_blocks_vertical_video_pair_path_idx" ON "_stories_v_blocks_vertical_video_pair" USING btree ("_path");
  CREATE INDEX "_stories_v_blocks_vertical_video_pair_left_idx" ON "_stories_v_blocks_vertical_video_pair" USING btree ("left_id");
  CREATE INDEX "_stories_v_blocks_vertical_video_pair_right_idx" ON "_stories_v_blocks_vertical_video_pair" USING btree ("right_id");
  CREATE INDEX "_stories_v_blocks_chapter_list_chapters_order_idx" ON "_stories_v_blocks_chapter_list_chapters" USING btree ("_order");
  CREATE INDEX "_stories_v_blocks_chapter_list_chapters_parent_id_idx" ON "_stories_v_blocks_chapter_list_chapters" USING btree ("_parent_id");
  CREATE INDEX "_stories_v_blocks_chapter_list_order_idx" ON "_stories_v_blocks_chapter_list" USING btree ("_order");
  CREATE INDEX "_stories_v_blocks_chapter_list_parent_id_idx" ON "_stories_v_blocks_chapter_list" USING btree ("_parent_id");
  CREATE INDEX "_stories_v_blocks_chapter_list_path_idx" ON "_stories_v_blocks_chapter_list" USING btree ("_path");
  CREATE INDEX "_stories_v_blocks_poster_sequence_posters_order_idx" ON "_stories_v_blocks_poster_sequence_posters" USING btree ("_order");
  CREATE INDEX "_stories_v_blocks_poster_sequence_posters_parent_id_idx" ON "_stories_v_blocks_poster_sequence_posters" USING btree ("_parent_id");
  CREATE INDEX "_stories_v_blocks_poster_sequence_posters_media_idx" ON "_stories_v_blocks_poster_sequence_posters" USING btree ("media_id");
  CREATE INDEX "_stories_v_blocks_poster_sequence_posters_story_idx" ON "_stories_v_blocks_poster_sequence_posters" USING btree ("story_id");
  CREATE INDEX "_stories_v_blocks_poster_sequence_order_idx" ON "_stories_v_blocks_poster_sequence" USING btree ("_order");
  CREATE INDEX "_stories_v_blocks_poster_sequence_parent_id_idx" ON "_stories_v_blocks_poster_sequence" USING btree ("_parent_id");
  CREATE INDEX "_stories_v_blocks_poster_sequence_path_idx" ON "_stories_v_blocks_poster_sequence" USING btree ("_path");
  CREATE INDEX "_stories_v_blocks_transcript_excerpt_order_idx" ON "_stories_v_blocks_transcript_excerpt" USING btree ("_order");
  CREATE INDEX "_stories_v_blocks_transcript_excerpt_parent_id_idx" ON "_stories_v_blocks_transcript_excerpt" USING btree ("_parent_id");
  CREATE INDEX "_stories_v_blocks_transcript_excerpt_path_idx" ON "_stories_v_blocks_transcript_excerpt" USING btree ("_path");
  CREATE INDEX "_stories_v_blocks_transcript_excerpt_source_idx" ON "_stories_v_blocks_transcript_excerpt" USING btree ("source_id");
  CREATE INDEX "_stories_v_blocks_credits_block_credits_order_idx" ON "_stories_v_blocks_credits_block_credits" USING btree ("_order");
  CREATE INDEX "_stories_v_blocks_credits_block_credits_parent_id_idx" ON "_stories_v_blocks_credits_block_credits" USING btree ("_parent_id");
  CREATE INDEX "_stories_v_blocks_credits_block_credits_person_idx" ON "_stories_v_blocks_credits_block_credits" USING btree ("person_id");
  CREATE INDEX "_stories_v_blocks_credits_block_order_idx" ON "_stories_v_blocks_credits_block" USING btree ("_order");
  CREATE INDEX "_stories_v_blocks_credits_block_parent_id_idx" ON "_stories_v_blocks_credits_block" USING btree ("_parent_id");
  CREATE INDEX "_stories_v_blocks_credits_block_path_idx" ON "_stories_v_blocks_credits_block" USING btree ("_path");
  CREATE INDEX "_stories_v_blocks_partner_disclosure_order_idx" ON "_stories_v_blocks_partner_disclosure" USING btree ("_order");
  CREATE INDEX "_stories_v_blocks_partner_disclosure_parent_id_idx" ON "_stories_v_blocks_partner_disclosure" USING btree ("_parent_id");
  CREATE INDEX "_stories_v_blocks_partner_disclosure_path_idx" ON "_stories_v_blocks_partner_disclosure" USING btree ("_path");
  CREATE INDEX "_stories_v_blocks_partner_disclosure_partner_idx" ON "_stories_v_blocks_partner_disclosure" USING btree ("partner_id");
  CREATE INDEX "_stories_v_blocks_partner_profile_deliverables_order_idx" ON "_stories_v_blocks_partner_profile_deliverables" USING btree ("_order");
  CREATE INDEX "_stories_v_blocks_partner_profile_deliverables_parent_id_idx" ON "_stories_v_blocks_partner_profile_deliverables" USING btree ("_parent_id");
  CREATE INDEX "_stories_v_blocks_partner_profile_order_idx" ON "_stories_v_blocks_partner_profile" USING btree ("_order");
  CREATE INDEX "_stories_v_blocks_partner_profile_parent_id_idx" ON "_stories_v_blocks_partner_profile" USING btree ("_parent_id");
  CREATE INDEX "_stories_v_blocks_partner_profile_path_idx" ON "_stories_v_blocks_partner_profile" USING btree ("_path");
  CREATE INDEX "_stories_v_blocks_partner_profile_partner_idx" ON "_stories_v_blocks_partner_profile" USING btree ("partner_id");
  CREATE INDEX "_stories_v_blocks_product_credits_items_order_idx" ON "_stories_v_blocks_product_credits_items" USING btree ("_order");
  CREATE INDEX "_stories_v_blocks_product_credits_items_parent_id_idx" ON "_stories_v_blocks_product_credits_items" USING btree ("_parent_id");
  CREATE INDEX "_stories_v_blocks_product_credits_items_partner_idx" ON "_stories_v_blocks_product_credits_items" USING btree ("partner_id");
  CREATE INDEX "_stories_v_blocks_product_credits_order_idx" ON "_stories_v_blocks_product_credits" USING btree ("_order");
  CREATE INDEX "_stories_v_blocks_product_credits_parent_id_idx" ON "_stories_v_blocks_product_credits" USING btree ("_parent_id");
  CREATE INDEX "_stories_v_blocks_product_credits_path_idx" ON "_stories_v_blocks_product_credits" USING btree ("_path");
  CREATE INDEX "_stories_v_blocks_related_stories_order_idx" ON "_stories_v_blocks_related_stories" USING btree ("_order");
  CREATE INDEX "_stories_v_blocks_related_stories_parent_id_idx" ON "_stories_v_blocks_related_stories" USING btree ("_parent_id");
  CREATE INDEX "_stories_v_blocks_related_stories_path_idx" ON "_stories_v_blocks_related_stories" USING btree ("_path");
  CREATE INDEX "_stories_v_blocks_call_to_action_order_idx" ON "_stories_v_blocks_call_to_action" USING btree ("_order");
  CREATE INDEX "_stories_v_blocks_call_to_action_parent_id_idx" ON "_stories_v_blocks_call_to_action" USING btree ("_parent_id");
  CREATE INDEX "_stories_v_blocks_call_to_action_path_idx" ON "_stories_v_blocks_call_to_action" USING btree ("_path");
  CREATE INDEX "_stories_v_version_credits_order_idx" ON "_stories_v_version_credits" USING btree ("_order");
  CREATE INDEX "_stories_v_version_credits_parent_id_idx" ON "_stories_v_version_credits" USING btree ("_parent_id");
  CREATE INDEX "_stories_v_version_credits_person_idx" ON "_stories_v_version_credits" USING btree ("person_id");
  CREATE INDEX "_stories_v_parent_idx" ON "_stories_v" USING btree ("parent_id");
  CREATE INDEX "_stories_v_version_version_title_idx" ON "_stories_v" USING btree ("version_title");
  CREATE INDEX "_stories_v_version_version_slug_idx" ON "_stories_v" USING btree ("version_slug");
  CREATE INDEX "_stories_v_version_version_channel_idx" ON "_stories_v" USING btree ("version_channel");
  CREATE INDEX "_stories_v_version_version_published_at_idx" ON "_stories_v" USING btree ("version_published_at");
  CREATE INDEX "_stories_v_version_version_lead_media_idx" ON "_stories_v" USING btree ("version_lead_media_id");
  CREATE INDEX "_stories_v_version_version_series_idx" ON "_stories_v" USING btree ("version_series_id");
  CREATE INDEX "_stories_v_version_version_issue_idx" ON "_stories_v" USING btree ("version_issue_id");
  CREATE INDEX "_stories_v_version_version_og_media_idx" ON "_stories_v" USING btree ("version_og_media_id");
  CREATE INDEX "_stories_v_version_version_search_document_idx" ON "_stories_v" USING btree ("version_search_document");
  CREATE INDEX "_stories_v_version_version_legacy_source_id_idx" ON "_stories_v" USING btree ("version_legacy_source_id");
  CREATE INDEX "_stories_v_version_version_updated_at_idx" ON "_stories_v" USING btree ("version_updated_at");
  CREATE INDEX "_stories_v_version_version_created_at_idx" ON "_stories_v" USING btree ("version_created_at");
  CREATE INDEX "_stories_v_version_version__status_idx" ON "_stories_v" USING btree ("version__status");
  CREATE INDEX "_stories_v_created_at_idx" ON "_stories_v" USING btree ("created_at");
  CREATE INDEX "_stories_v_updated_at_idx" ON "_stories_v" USING btree ("updated_at");
  CREATE INDEX "_stories_v_latest_idx" ON "_stories_v" USING btree ("latest");
  CREATE INDEX "_stories_v_autosave_idx" ON "_stories_v" USING btree ("autosave");
  CREATE INDEX "_stories_v_rels_order_idx" ON "_stories_v_rels" USING btree ("order");
  CREATE INDEX "_stories_v_rels_parent_idx" ON "_stories_v_rels" USING btree ("parent_id");
  CREATE INDEX "_stories_v_rels_path_idx" ON "_stories_v_rels" USING btree ("path");
  CREATE INDEX "_stories_v_rels_authors_id_idx" ON "_stories_v_rels" USING btree ("authors_id");
  CREATE INDEX "_stories_v_rels_stories_id_idx" ON "_stories_v_rels" USING btree ("stories_id");
  CREATE INDEX "_stories_v_rels_tags_id_idx" ON "_stories_v_rels" USING btree ("tags_id");
  CREATE INDEX "_stories_v_rels_people_id_idx" ON "_stories_v_rels" USING btree ("people_id");
  CREATE INDEX "_stories_v_rels_places_id_idx" ON "_stories_v_rels" USING btree ("places_id");
  CREATE INDEX "_stories_v_rels_partners_id_idx" ON "_stories_v_rels" USING btree ("partners_id");
  CREATE INDEX "media_credits_order_idx" ON "media_credits" USING btree ("_order");
  CREATE INDEX "media_credits_parent_id_idx" ON "media_credits" USING btree ("_parent_id");
  CREATE INDEX "media_credits_person_idx" ON "media_credits" USING btree ("person_id");
  CREATE INDEX "media_captions_order_idx" ON "media_captions" USING btree ("_order");
  CREATE INDEX "media_captions_parent_id_idx" ON "media_captions" USING btree ("_parent_id");
  CREATE INDEX "media_captions_file_idx" ON "media_captions" USING btree ("file_id");
  CREATE INDEX "media_place_idx" ON "media" USING btree ("place_id");
  CREATE INDEX "media_poster_idx" ON "media" USING btree ("poster_id");
  CREATE UNIQUE INDEX "media_legacy_source_id_idx" ON "media" USING btree ("legacy_source_id");
  CREATE INDEX "media_reviewed_by_idx" ON "media" USING btree ("reviewed_by_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_wide_sizes_wide_filename_idx" ON "media" USING btree ("sizes_wide_filename");
  CREATE INDEX "media_rels_order_idx" ON "media_rels" USING btree ("order");
  CREATE INDEX "media_rels_parent_idx" ON "media_rels" USING btree ("parent_id");
  CREATE INDEX "media_rels_path_idx" ON "media_rels" USING btree ("path");
  CREATE INDEX "media_rels_people_id_idx" ON "media_rels" USING btree ("people_id");
  CREATE INDEX "media_rels_tags_id_idx" ON "media_rels" USING btree ("tags_id");
  CREATE UNIQUE INDEX "issues_number_idx" ON "issues" USING btree ("number");
  CREATE UNIQUE INDEX "issues_slug_idx" ON "issues" USING btree ("slug");
  CREATE INDEX "issues_cover_media_idx" ON "issues" USING btree ("cover_media_id");
  CREATE INDEX "issues_lead_story_idx" ON "issues" USING btree ("lead_story_id");
  CREATE INDEX "issues_updated_at_idx" ON "issues" USING btree ("updated_at");
  CREATE INDEX "issues_created_at_idx" ON "issues" USING btree ("created_at");
  CREATE INDEX "issues__status_idx" ON "issues" USING btree ("_status");
  CREATE INDEX "issues_rels_order_idx" ON "issues_rels" USING btree ("order");
  CREATE INDEX "issues_rels_parent_idx" ON "issues_rels" USING btree ("parent_id");
  CREATE INDEX "issues_rels_path_idx" ON "issues_rels" USING btree ("path");
  CREATE INDEX "issues_rels_stories_id_idx" ON "issues_rels" USING btree ("stories_id");
  CREATE INDEX "_issues_v_parent_idx" ON "_issues_v" USING btree ("parent_id");
  CREATE INDEX "_issues_v_version_version_number_idx" ON "_issues_v" USING btree ("version_number");
  CREATE INDEX "_issues_v_version_version_slug_idx" ON "_issues_v" USING btree ("version_slug");
  CREATE INDEX "_issues_v_version_version_cover_media_idx" ON "_issues_v" USING btree ("version_cover_media_id");
  CREATE INDEX "_issues_v_version_version_lead_story_idx" ON "_issues_v" USING btree ("version_lead_story_id");
  CREATE INDEX "_issues_v_version_version_updated_at_idx" ON "_issues_v" USING btree ("version_updated_at");
  CREATE INDEX "_issues_v_version_version_created_at_idx" ON "_issues_v" USING btree ("version_created_at");
  CREATE INDEX "_issues_v_version_version__status_idx" ON "_issues_v" USING btree ("version__status");
  CREATE INDEX "_issues_v_created_at_idx" ON "_issues_v" USING btree ("created_at");
  CREATE INDEX "_issues_v_updated_at_idx" ON "_issues_v" USING btree ("updated_at");
  CREATE INDEX "_issues_v_latest_idx" ON "_issues_v" USING btree ("latest");
  CREATE INDEX "_issues_v_rels_order_idx" ON "_issues_v_rels" USING btree ("order");
  CREATE INDEX "_issues_v_rels_parent_idx" ON "_issues_v_rels" USING btree ("parent_id");
  CREATE INDEX "_issues_v_rels_path_idx" ON "_issues_v_rels" USING btree ("path");
  CREATE INDEX "_issues_v_rels_stories_id_idx" ON "_issues_v_rels" USING btree ("stories_id");
  CREATE UNIQUE INDEX "series_slug_idx" ON "series" USING btree ("slug");
  CREATE INDEX "series_cover_media_idx" ON "series" USING btree ("cover_media_id");
  CREATE UNIQUE INDEX "series_legacy_source_id_idx" ON "series" USING btree ("legacy_source_id");
  CREATE INDEX "series_updated_at_idx" ON "series" USING btree ("updated_at");
  CREATE INDEX "series_created_at_idx" ON "series" USING btree ("created_at");
  CREATE INDEX "tags_aliases_order_idx" ON "tags_aliases" USING btree ("_order");
  CREATE INDEX "tags_aliases_parent_id_idx" ON "tags_aliases" USING btree ("_parent_id");
  CREATE INDEX "tags_channel_affinity_order_idx" ON "tags_channel_affinity" USING btree ("order");
  CREATE INDEX "tags_channel_affinity_parent_idx" ON "tags_channel_affinity" USING btree ("parent_id");
  CREATE INDEX "tags_label_idx" ON "tags" USING btree ("label");
  CREATE UNIQUE INDEX "tags_slug_idx" ON "tags" USING btree ("slug");
  CREATE INDEX "tags_merged_into_idx" ON "tags" USING btree ("merged_into_id");
  CREATE INDEX "tags_parent_idx" ON "tags" USING btree ("parent_id");
  CREATE INDEX "tags_updated_at_idx" ON "tags" USING btree ("updated_at");
  CREATE INDEX "tags_created_at_idx" ON "tags" USING btree ("created_at");
  CREATE INDEX "people_kind_order_idx" ON "people_kind" USING btree ("order");
  CREATE INDEX "people_kind_parent_idx" ON "people_kind" USING btree ("parent_id");
  CREATE INDEX "people_links_order_idx" ON "people_links" USING btree ("_order");
  CREATE INDEX "people_links_parent_id_idx" ON "people_links" USING btree ("_parent_id");
  CREATE INDEX "people_name_idx" ON "people" USING btree ("name");
  CREATE UNIQUE INDEX "people_slug_idx" ON "people" USING btree ("slug");
  CREATE UNIQUE INDEX "people_legacy_source_id_idx" ON "people" USING btree ("legacy_source_id");
  CREATE INDEX "people_updated_at_idx" ON "people" USING btree ("updated_at");
  CREATE INDEX "people_created_at_idx" ON "people" USING btree ("created_at");
  CREATE INDEX "places_name_idx" ON "places" USING btree ("name");
  CREATE UNIQUE INDEX "places_slug_idx" ON "places" USING btree ("slug");
  CREATE UNIQUE INDEX "places_legacy_source_id_idx" ON "places" USING btree ("legacy_source_id");
  CREATE INDEX "places_updated_at_idx" ON "places" USING btree ("updated_at");
  CREATE INDEX "places_created_at_idx" ON "places" USING btree ("created_at");
  CREATE INDEX "partners_name_idx" ON "partners" USING btree ("name");
  CREATE UNIQUE INDEX "partners_slug_idx" ON "partners" USING btree ("slug");
  CREATE INDEX "partners_logo_idx" ON "partners" USING btree ("logo_id");
  CREATE UNIQUE INDEX "partners_legacy_source_id_idx" ON "partners" USING btree ("legacy_source_id");
  CREATE INDEX "partners_updated_at_idx" ON "partners" USING btree ("updated_at");
  CREATE INDEX "partners_created_at_idx" ON "partners" USING btree ("created_at");
  CREATE INDEX "authors_links_order_idx" ON "authors_links" USING btree ("_order");
  CREATE INDEX "authors_links_parent_id_idx" ON "authors_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "authors_slug_idx" ON "authors" USING btree ("slug");
  CREATE INDEX "authors_portrait_idx" ON "authors" USING btree ("portrait_id");
  CREATE INDEX "authors_user_idx" ON "authors" USING btree ("user_id");
  CREATE INDEX "authors_updated_at_idx" ON "authors" USING btree ("updated_at");
  CREATE INDEX "authors_created_at_idx" ON "authors" USING btree ("created_at");
  CREATE UNIQUE INDEX "redirects_from_idx" ON "redirects" USING btree ("from");
  CREATE INDEX "redirects_updated_at_idx" ON "redirects" USING btree ("updated_at");
  CREATE INDEX "redirects_created_at_idx" ON "redirects" USING btree ("created_at");
  CREATE INDEX "submissions_updated_at_idx" ON "submissions" USING btree ("updated_at");
  CREATE INDEX "submissions_created_at_idx" ON "submissions" USING btree ("created_at");
  CREATE INDEX "users_roles_order_idx" ON "users_roles" USING btree ("order");
  CREATE INDEX "users_roles_parent_idx" ON "users_roles" USING btree ("parent_id");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_jobs_log_order_idx" ON "payload_jobs_log" USING btree ("_order");
  CREATE INDEX "payload_jobs_log_parent_id_idx" ON "payload_jobs_log" USING btree ("_parent_id");
  CREATE INDEX "payload_jobs_completed_at_idx" ON "payload_jobs" USING btree ("completed_at");
  CREATE INDEX "payload_jobs_total_tried_idx" ON "payload_jobs" USING btree ("total_tried");
  CREATE INDEX "payload_jobs_has_error_idx" ON "payload_jobs" USING btree ("has_error");
  CREATE INDEX "payload_jobs_task_slug_idx" ON "payload_jobs" USING btree ("task_slug");
  CREATE INDEX "payload_jobs_queue_idx" ON "payload_jobs" USING btree ("queue");
  CREATE INDEX "payload_jobs_wait_until_idx" ON "payload_jobs" USING btree ("wait_until");
  CREATE INDEX "payload_jobs_processing_idx" ON "payload_jobs" USING btree ("processing");
  CREATE INDEX "payload_jobs_updated_at_idx" ON "payload_jobs" USING btree ("updated_at");
  CREATE INDEX "payload_jobs_created_at_idx" ON "payload_jobs" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_stories_id_idx" ON "payload_locked_documents_rels" USING btree ("stories_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_issues_id_idx" ON "payload_locked_documents_rels" USING btree ("issues_id");
  CREATE INDEX "payload_locked_documents_rels_series_id_idx" ON "payload_locked_documents_rels" USING btree ("series_id");
  CREATE INDEX "payload_locked_documents_rels_tags_id_idx" ON "payload_locked_documents_rels" USING btree ("tags_id");
  CREATE INDEX "payload_locked_documents_rels_people_id_idx" ON "payload_locked_documents_rels" USING btree ("people_id");
  CREATE INDEX "payload_locked_documents_rels_places_id_idx" ON "payload_locked_documents_rels" USING btree ("places_id");
  CREATE INDEX "payload_locked_documents_rels_partners_id_idx" ON "payload_locked_documents_rels" USING btree ("partners_id");
  CREATE INDEX "payload_locked_documents_rels_authors_id_idx" ON "payload_locked_documents_rels" USING btree ("authors_id");
  CREATE INDEX "payload_locked_documents_rels_redirects_id_idx" ON "payload_locked_documents_rels" USING btree ("redirects_id");
  CREATE INDEX "payload_locked_documents_rels_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("submissions_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_settings_default_share_image_idx" ON "site_settings" USING btree ("default_share_image_id");
  CREATE INDEX "channel_settings_channels_order_idx" ON "channel_settings_channels" USING btree ("_order");
  CREATE INDEX "channel_settings_channels_parent_id_idx" ON "channel_settings_channels" USING btree ("_parent_id");
  CREATE INDEX "channel_settings_channels_featured_story_idx" ON "channel_settings_channels" USING btree ("featured_story_id");
  CREATE INDEX "navigation_footer_links_order_idx" ON "navigation_footer_links" USING btree ("_order");
  CREATE INDEX "navigation_footer_links_parent_id_idx" ON "navigation_footer_links" USING btree ("_parent_id");
  CREATE INDEX "home_page_sections_order_idx" ON "home_page_sections" USING btree ("_order");
  CREATE INDEX "home_page_sections_parent_id_idx" ON "home_page_sections" USING btree ("_parent_id");
  CREATE INDEX "home_page_current_issue_idx" ON "home_page" USING btree ("current_issue_id");
  CREATE INDEX "home_page_lead_story_idx" ON "home_page" USING btree ("lead_story_id");
  CREATE INDEX "home_page_rels_order_idx" ON "home_page_rels" USING btree ("order");
  CREATE INDEX "home_page_rels_parent_idx" ON "home_page_rels" USING btree ("parent_id");
  CREATE INDEX "home_page_rels_path_idx" ON "home_page_rels" USING btree ("path");
  CREATE INDEX "home_page_rels_stories_id_idx" ON "home_page_rels" USING btree ("stories_id");
  CREATE INDEX "about_page_milestones_order_idx" ON "about_page_milestones" USING btree ("_order");
  CREATE INDEX "about_page_milestones_parent_id_idx" ON "about_page_milestones" USING btree ("_parent_id");
  CREATE INDEX "about_page_portrait_idx" ON "about_page" USING btree ("portrait_id");
  CREATE INDEX "disclosure_settings_statements_order_idx" ON "disclosure_settings_statements" USING btree ("_order");
  CREATE INDEX "disclosure_settings_statements_parent_id_idx" ON "disclosure_settings_statements" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "stories_blocks_prose" CASCADE;
  DROP TABLE "stories_blocks_pull_quote" CASCADE;
  DROP TABLE "stories_blocks_chapter_divider" CASCADE;
  DROP TABLE "stories_blocks_interview_exchanges" CASCADE;
  DROP TABLE "stories_blocks_interview" CASCADE;
  DROP TABLE "stories_blocks_callout" CASCADE;
  DROP TABLE "stories_blocks_source_notes_notes" CASCADE;
  DROP TABLE "stories_blocks_source_notes" CASCADE;
  DROP TABLE "stories_blocks_correction" CASCADE;
  DROP TABLE "stories_blocks_timeline_entries" CASCADE;
  DROP TABLE "stories_blocks_timeline" CASCADE;
  DROP TABLE "stories_blocks_image" CASCADE;
  DROP TABLE "stories_blocks_image_pair" CASCADE;
  DROP TABLE "stories_blocks_triptych_images" CASCADE;
  DROP TABLE "stories_blocks_triptych" CASCADE;
  DROP TABLE "stories_blocks_contact_sheet_frames" CASCADE;
  DROP TABLE "stories_blocks_contact_sheet" CASCADE;
  DROP TABLE "stories_blocks_before_after" CASCADE;
  DROP TABLE "stories_blocks_annotated_image_annotations" CASCADE;
  DROP TABLE "stories_blocks_annotated_image" CASCADE;
  DROP TABLE "stories_blocks_video" CASCADE;
  DROP TABLE "stories_blocks_vertical_video_pair" CASCADE;
  DROP TABLE "stories_blocks_chapter_list_chapters" CASCADE;
  DROP TABLE "stories_blocks_chapter_list" CASCADE;
  DROP TABLE "stories_blocks_poster_sequence_posters" CASCADE;
  DROP TABLE "stories_blocks_poster_sequence" CASCADE;
  DROP TABLE "stories_blocks_transcript_excerpt" CASCADE;
  DROP TABLE "stories_blocks_credits_block_credits" CASCADE;
  DROP TABLE "stories_blocks_credits_block" CASCADE;
  DROP TABLE "stories_blocks_partner_disclosure" CASCADE;
  DROP TABLE "stories_blocks_partner_profile_deliverables" CASCADE;
  DROP TABLE "stories_blocks_partner_profile" CASCADE;
  DROP TABLE "stories_blocks_product_credits_items" CASCADE;
  DROP TABLE "stories_blocks_product_credits" CASCADE;
  DROP TABLE "stories_blocks_related_stories" CASCADE;
  DROP TABLE "stories_blocks_call_to_action" CASCADE;
  DROP TABLE "stories_credits" CASCADE;
  DROP TABLE "stories" CASCADE;
  DROP TABLE "stories_rels" CASCADE;
  DROP TABLE "_stories_v_blocks_prose" CASCADE;
  DROP TABLE "_stories_v_blocks_pull_quote" CASCADE;
  DROP TABLE "_stories_v_blocks_chapter_divider" CASCADE;
  DROP TABLE "_stories_v_blocks_interview_exchanges" CASCADE;
  DROP TABLE "_stories_v_blocks_interview" CASCADE;
  DROP TABLE "_stories_v_blocks_callout" CASCADE;
  DROP TABLE "_stories_v_blocks_source_notes_notes" CASCADE;
  DROP TABLE "_stories_v_blocks_source_notes" CASCADE;
  DROP TABLE "_stories_v_blocks_correction" CASCADE;
  DROP TABLE "_stories_v_blocks_timeline_entries" CASCADE;
  DROP TABLE "_stories_v_blocks_timeline" CASCADE;
  DROP TABLE "_stories_v_blocks_image" CASCADE;
  DROP TABLE "_stories_v_blocks_image_pair" CASCADE;
  DROP TABLE "_stories_v_blocks_triptych_images" CASCADE;
  DROP TABLE "_stories_v_blocks_triptych" CASCADE;
  DROP TABLE "_stories_v_blocks_contact_sheet_frames" CASCADE;
  DROP TABLE "_stories_v_blocks_contact_sheet" CASCADE;
  DROP TABLE "_stories_v_blocks_before_after" CASCADE;
  DROP TABLE "_stories_v_blocks_annotated_image_annotations" CASCADE;
  DROP TABLE "_stories_v_blocks_annotated_image" CASCADE;
  DROP TABLE "_stories_v_blocks_video" CASCADE;
  DROP TABLE "_stories_v_blocks_vertical_video_pair" CASCADE;
  DROP TABLE "_stories_v_blocks_chapter_list_chapters" CASCADE;
  DROP TABLE "_stories_v_blocks_chapter_list" CASCADE;
  DROP TABLE "_stories_v_blocks_poster_sequence_posters" CASCADE;
  DROP TABLE "_stories_v_blocks_poster_sequence" CASCADE;
  DROP TABLE "_stories_v_blocks_transcript_excerpt" CASCADE;
  DROP TABLE "_stories_v_blocks_credits_block_credits" CASCADE;
  DROP TABLE "_stories_v_blocks_credits_block" CASCADE;
  DROP TABLE "_stories_v_blocks_partner_disclosure" CASCADE;
  DROP TABLE "_stories_v_blocks_partner_profile_deliverables" CASCADE;
  DROP TABLE "_stories_v_blocks_partner_profile" CASCADE;
  DROP TABLE "_stories_v_blocks_product_credits_items" CASCADE;
  DROP TABLE "_stories_v_blocks_product_credits" CASCADE;
  DROP TABLE "_stories_v_blocks_related_stories" CASCADE;
  DROP TABLE "_stories_v_blocks_call_to_action" CASCADE;
  DROP TABLE "_stories_v_version_credits" CASCADE;
  DROP TABLE "_stories_v" CASCADE;
  DROP TABLE "_stories_v_rels" CASCADE;
  DROP TABLE "media_credits" CASCADE;
  DROP TABLE "media_captions" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "media_rels" CASCADE;
  DROP TABLE "issues" CASCADE;
  DROP TABLE "issues_rels" CASCADE;
  DROP TABLE "_issues_v" CASCADE;
  DROP TABLE "_issues_v_rels" CASCADE;
  DROP TABLE "series" CASCADE;
  DROP TABLE "tags_aliases" CASCADE;
  DROP TABLE "tags_channel_affinity" CASCADE;
  DROP TABLE "tags" CASCADE;
  DROP TABLE "people_kind" CASCADE;
  DROP TABLE "people_links" CASCADE;
  DROP TABLE "people" CASCADE;
  DROP TABLE "places" CASCADE;
  DROP TABLE "partners" CASCADE;
  DROP TABLE "authors_links" CASCADE;
  DROP TABLE "authors" CASCADE;
  DROP TABLE "redirects" CASCADE;
  DROP TABLE "submissions" CASCADE;
  DROP TABLE "users_roles" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_jobs_log" CASCADE;
  DROP TABLE "payload_jobs" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "channel_settings_channels" CASCADE;
  DROP TABLE "channel_settings" CASCADE;
  DROP TABLE "navigation_footer_links" CASCADE;
  DROP TABLE "navigation" CASCADE;
  DROP TABLE "home_page_sections" CASCADE;
  DROP TABLE "home_page" CASCADE;
  DROP TABLE "home_page_rels" CASCADE;
  DROP TABLE "about_page_milestones" CASCADE;
  DROP TABLE "about_page" CASCADE;
  DROP TABLE "disclosure_settings_statements" CASCADE;
  DROP TABLE "disclosure_settings" CASCADE;
  DROP TABLE "newsletter_settings" CASCADE;
  DROP TYPE "public"."enum_stories_blocks_prose_width";
  DROP TYPE "public"."enum_stories_blocks_callout_tone";
  DROP TYPE "public"."enum_stories_blocks_correction_kind";
  DROP TYPE "public"."enum_stories_blocks_image_presentation";
  DROP TYPE "public"."enum_stories_blocks_image_pair_alignment";
  DROP TYPE "public"."enum_stories_blocks_video_presentation";
  DROP TYPE "public"."enum_stories_blocks_call_to_action_kind";
  DROP TYPE "public"."enum_stories_channel";
  DROP TYPE "public"."enum_stories_story_type";
  DROP TYPE "public"."enum_stories_date_display_mode";
  DROP TYPE "public"."enum_stories_lead_variant";
  DROP TYPE "public"."enum_stories_table_of_contents_mode";
  DROP TYPE "public"."enum_stories_approval_status";
  DROP TYPE "public"."enum_stories_status";
  DROP TYPE "public"."enum__stories_v_blocks_prose_width";
  DROP TYPE "public"."enum__stories_v_blocks_callout_tone";
  DROP TYPE "public"."enum__stories_v_blocks_correction_kind";
  DROP TYPE "public"."enum__stories_v_blocks_image_presentation";
  DROP TYPE "public"."enum__stories_v_blocks_image_pair_alignment";
  DROP TYPE "public"."enum__stories_v_blocks_video_presentation";
  DROP TYPE "public"."enum__stories_v_blocks_call_to_action_kind";
  DROP TYPE "public"."enum__stories_v_version_channel";
  DROP TYPE "public"."enum__stories_v_version_story_type";
  DROP TYPE "public"."enum__stories_v_version_date_display_mode";
  DROP TYPE "public"."enum__stories_v_version_lead_variant";
  DROP TYPE "public"."enum__stories_v_version_table_of_contents_mode";
  DROP TYPE "public"."enum__stories_v_version_approval_status";
  DROP TYPE "public"."enum__stories_v_version_status";
  DROP TYPE "public"."enum_media_kind";
  DROP TYPE "public"."enum_media_processing_status";
  DROP TYPE "public"."enum_media_rights_status";
  DROP TYPE "public"."enum_media_consent_status";
  DROP TYPE "public"."enum_issues_edition_status";
  DROP TYPE "public"."enum_issues_status";
  DROP TYPE "public"."enum__issues_v_version_edition_status";
  DROP TYPE "public"."enum__issues_v_version_status";
  DROP TYPE "public"."enum_series_channel";
  DROP TYPE "public"."enum_series_status";
  DROP TYPE "public"."enum_tags_channel_affinity";
  DROP TYPE "public"."enum_tags_kind";
  DROP TYPE "public"."enum_tags_status";
  DROP TYPE "public"."enum_people_kind";
  DROP TYPE "public"."enum_places_kind";
  DROP TYPE "public"."enum_partners_relationship_type";
  DROP TYPE "public"."enum_partners_verification_status";
  DROP TYPE "public"."enum_partners_kind";
  DROP TYPE "public"."enum_redirects_status_code";
  DROP TYPE "public"."enum_redirects_reason";
  DROP TYPE "public"."enum_submissions_kind";
  DROP TYPE "public"."enum_submissions_status";
  DROP TYPE "public"."enum_users_roles";
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  DROP TYPE "public"."enum_payload_jobs_log_state";
  DROP TYPE "public"."enum_payload_jobs_task_slug";
  DROP TYPE "public"."enum_channel_settings_channels_key";
  DROP TYPE "public"."enum_navigation_footer_links_group";
  DROP TYPE "public"."enum_home_page_sections_kind";
  DROP TYPE "public"."enum_disclosure_settings_statements_relationship_type";`)
}
