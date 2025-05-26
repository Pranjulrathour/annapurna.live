import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  decimal,
  boolean,
  uuid,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role", { enum: ["donor", "ngo", "volunteer", "admin"] }).notNull().default("donor"),
  verified: boolean("verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const donations = pgTable("donations", {
  id: uuid("id").primaryKey().defaultRandom(),
  donorId: varchar("donor_id").references(() => users.id).notNull(),
  foodType: text("food_type").notNull(),
  quantity: integer("quantity").notNull(),
  expiryHours: integer("expiry_hours").notNull(),
  location: text("location").notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  imageUrl: text("image_url"),
  status: varchar("status", { enum: ["submitted", "claimed", "picked_up", "delivered"] }).default("submitted"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const claims = pgTable("claims", {
  id: uuid("id").primaryKey().defaultRandom(),
  donationId: uuid("donation_id").references(() => donations.id).notNull(),
  ngoId: varchar("ngo_id").references(() => users.id),
  volunteerId: varchar("volunteer_id").references(() => users.id),
  status: varchar("status", { enum: ["claimed", "picked_up", "delivered"] }).default("claimed"),
  claimedAt: timestamp("claimed_at").defaultNow(),
  pickedUpAt: timestamp("picked_up_at"),
  deliveredAt: timestamp("delivered_at"),
  notes: text("notes"),
});

export const impact = pgTable("impact", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  mealsDonated: integer("meals_donated").default(0),
  mealsDistributed: integer("meals_distributed").default(0),
  deliveriesCompleted: integer("deliveries_completed").default(0),
  points: integer("points").default(0),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  donations: many(donations),
  ngosClaims: many(claims, { relationName: "ngo_claims" }),
  volunteerClaims: many(claims, { relationName: "volunteer_claims" }),
  impact: one(impact),
}));

export const donationsRelations = relations(donations, ({ one }) => ({
  donor: one(users, {
    fields: [donations.donorId],
    references: [users.id],
  }),
  claim: one(claims),
}));

export const claimsRelations = relations(claims, ({ one }) => ({
  donation: one(donations, {
    fields: [claims.donationId],
    references: [donations.id],
  }),
  ngo: one(users, {
    fields: [claims.ngoId],
    references: [users.id],
    relationName: "ngo_claims",
  }),
  volunteer: one(users, {
    fields: [claims.volunteerId],
    references: [users.id],
    relationName: "volunteer_claims",
  }),
}));

export const impactRelations = relations(impact, ({ one }) => ({
  user: one(users, {
    fields: [impact.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertDonationSchema = createInsertSchema(donations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertClaimSchema = createInsertSchema(claims).omit({
  id: true,
  claimedAt: true,
});

export const insertImpactSchema = createInsertSchema(impact).omit({
  id: true,
  updatedAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertDonation = z.infer<typeof insertDonationSchema>;
export type Donation = typeof donations.$inferSelect;
export type InsertClaim = z.infer<typeof insertClaimSchema>;
export type Claim = typeof claims.$inferSelect;
export type InsertImpact = z.infer<typeof insertImpactSchema>;
export type Impact = typeof impact.$inferSelect;
