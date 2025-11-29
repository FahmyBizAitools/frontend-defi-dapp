import { pgTable, text, serial, integer, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const campaigns = pgTable("campaigns", {
  id: serial("id").primaryKey(),
  brandName: text("brand_name").notNull(),
  niche: text("niche").notNull(),
  targetMarket: text("target_market").notNull(),
  affiliateLink: text("affiliate_link").notNull(),
  imageStyle: text("image_style").notNull(),
  postingFrequency: text("posting_frequency").notNull(),
  productInfo: jsonb("product_info"),
  status: text("status").notNull().default("draft"), // draft, generating, completed, scheduled
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const contentIdeas = pgTable("content_ideas", {
  id: serial("id").primaryKey(),
  campaignId: integer("campaign_id").notNull().references(() => campaigns.id, { onDelete: "cascade" }),
  day: integer("day").notNull(),
  judul: text("judul").notNull(),
  tema: text("tema").notNull(),
  visual: text("visual").notNull(),
  trigger: text("trigger").notNull(),
  keywords: jsonb("keywords").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const pinCopywriting = pgTable("pin_copywriting", {
  id: serial("id").primaryKey(),
  campaignId: integer("campaign_id").notNull().references(() => campaigns.id, { onDelete: "cascade" }),
  contentIdeaId: integer("content_idea_id").notNull().references(() => contentIdeas.id, { onDelete: "cascade" }),
  day: integer("day").notNull(),
  titleMain: text("title_main").notNull(),
  titleA: text("title_a").notNull(),
  titleB: text("title_b").notNull(),
  description: text("description").notNull(),
  hashtags: jsonb("hashtags").notNull(),
  keywords: jsonb("keywords").notNull(),
  selectedTitle: text("selected_title"), // For A/B testing tracking
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const pinterestBoards = pgTable("pinterest_boards", {
  id: serial("id").primaryKey(),
  campaignId: integer("campaign_id").notNull().references(() => campaigns.id, { onDelete: "cascade" }),
  namaBoard: text("nama_board").notNull(),
  deskripsi: text("deskripsi").notNull(),
  targetAudience: text("target_audience").notNull(),
  kontenCocok: jsonb("konten_cocok").notNull(),
  hookUnik: text("hook_unik").notNull(),
  isCreated: boolean("is_created").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const generatedImages = pgTable("generated_images", {
  id: serial("id").primaryKey(),
  campaignId: integer("campaign_id").notNull().references(() => campaigns.id, { onDelete: "cascade" }),
  contentIdeaId: integer("content_idea_id").notNull().references(() => contentIdeas.id, { onDelete: "cascade" }),
  day: integer("day").notNull(),
  prompt: text("prompt").notNull(),
  imageUrl: text("image_url").notNull(),
  status: text("status").notNull().default("generated"), // generated, downloaded, uploaded
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const scheduledPosts = pgTable("scheduled_posts", {
  id: serial("id").primaryKey(),
  campaignId: integer("campaign_id").notNull().references(() => campaigns.id, { onDelete: "cascade" }),
  pinCopywritingId: integer("pin_copywriting_id").notNull().references(() => pinCopywriting.id, { onDelete: "cascade" }),
  generatedImageId: integer("generated_image_id").notNull().references(() => generatedImages.id, { onDelete: "cascade" }),
  boardId: integer("board_id").references(() => pinterestBoards.id),
  scheduledDate: timestamp("scheduled_date").notNull(),
  status: text("status").notNull().default("pending"), // pending, published, failed
  externalPostId: text("external_post_id"), // ID from Publer/Buffer
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Zod schemas for validation
export const insertCampaignSchema = createInsertSchema(campaigns);
export const selectCampaignSchema = createSelectSchema(campaigns);

export const insertContentIdeaSchema = createInsertSchema(contentIdeas);
export const selectContentIdeaSchema = createSelectSchema(contentIdeas);

export const insertPinCopywritingSchema = createInsertSchema(pinCopywriting);
export const selectPinCopywritingSchema = createSelectSchema(pinCopywriting);

export const insertPinterestBoardSchema = createInsertSchema(pinterestBoards);
export const selectPinterestBoardSchema = createSelectSchema(pinterestBoards);

export const insertGeneratedImageSchema = createInsertSchema(generatedImages);
export const selectGeneratedImageSchema = createSelectSchema(generatedImages);

export const insertScheduledPostSchema = createInsertSchema(scheduledPosts);
export const selectScheduledPostSchema = createSelectSchema(scheduledPosts);

// Types
export type Campaign = typeof campaigns.$inferSelect;
export type InsertCampaign = typeof campaigns.$inferInsert;

export type ContentIdea = typeof contentIdeas.$inferSelect;
export type InsertContentIdea = typeof contentIdeas.$inferInsert;

export type PinCopywriting = typeof pinCopywriting.$inferSelect;
export type InsertPinCopywriting = typeof pinCopywriting.$inferInsert;

export type PinterestBoard = typeof pinterestBoards.$inferSelect;
export type InsertPinterestBoard = typeof pinterestBoards.$inferInsert;

export type GeneratedImage = typeof generatedImages.$inferSelect;
export type InsertGeneratedImage = typeof generatedImages.$inferInsert;

export type ScheduledPost = typeof scheduledPosts.$inferSelect;
export type InsertScheduledPost = typeof scheduledPosts.$inferInsert;
