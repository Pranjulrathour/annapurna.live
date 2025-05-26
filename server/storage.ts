import {
  users,
  donations,
  claims,
  impact,
  type User,
  type UpsertUser,
  type InsertDonation,
  type Donation,
  type InsertClaim,
  type Claim,
  type InsertImpact,
  type Impact,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, or, desc, asc } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Donation operations
  createDonation(donation: InsertDonation): Promise<Donation>;
  getDonation(id: string): Promise<Donation | undefined>;
  getDonationsByDonor(donorId: string): Promise<Donation[]>;
  getNearbyDonations(role: string): Promise<Donation[]>;
  updateDonationStatus(id: string, status: string): Promise<Donation>;
  
  // Claim operations
  createClaim(claim: InsertClaim): Promise<Claim>;
  updateClaim(id: string, updates: Partial<Claim>): Promise<Claim>;
  getClaimsByUser(userId: string): Promise<Claim[]>;
  getClaimByDonation(donationId: string): Promise<Claim | undefined>;
  
  // Impact operations
  getOrCreateUserImpact(userId: string): Promise<Impact>;
  updateUserImpact(userId: string, updates: Partial<Impact>): Promise<Impact>;
  
  // Admin operations
  getUsersByRole(role: string): Promise<User[]>;
  updateUserVerification(userId: string, verified: boolean): Promise<User>;
  getPlatformStats(): Promise<{
    totalUsers: number;
    totalDonations: number;
    totalMeals: number;
    pendingVerifications: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations (IMPORTANT) these user operations are mandatory for Replit Auth.
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Donation operations
  async createDonation(donation: InsertDonation): Promise<Donation> {
    const [created] = await db
      .insert(donations)
      .values(donation)
      .returning();
    return created;
  }

  async getDonation(id: string): Promise<Donation | undefined> {
    const [donation] = await db
      .select()
      .from(donations)
      .where(eq(donations.id, id));
    return donation;
  }

  async getDonationsByDonor(donorId: string): Promise<Donation[]> {
    return await db
      .select()
      .from(donations)
      .where(eq(donations.donorId, donorId))
      .orderBy(desc(donations.createdAt));
  }

  async getNearbyDonations(role: string): Promise<Donation[]> {
    // For MVP, return all available donations
    const statusFilter = role === "volunteer" 
      ? or(eq(donations.status, "submitted"), eq(donations.status, "claimed"))
      : eq(donations.status, "submitted");

    return await db
      .select()
      .from(donations)
      .where(statusFilter)
      .orderBy(asc(donations.createdAt));
  }

  async updateDonationStatus(id: string, status: string): Promise<Donation> {
    const [updated] = await db
      .update(donations)
      .set({ status: status as any, updatedAt: new Date() })
      .where(eq(donations.id, id))
      .returning();
    return updated;
  }

  // Claim operations
  async createClaim(claim: InsertClaim): Promise<Claim> {
    const [created] = await db
      .insert(claims)
      .values(claim)
      .returning();
    return created;
  }

  async updateClaim(id: string, updates: Partial<Claim>): Promise<Claim> {
    const [updated] = await db
      .update(claims)
      .set(updates)
      .where(eq(claims.id, id))
      .returning();
    return updated;
  }

  async getClaimsByUser(userId: string): Promise<Claim[]> {
    return await db
      .select()
      .from(claims)
      .where(or(eq(claims.ngoId, userId), eq(claims.volunteerId, userId)))
      .orderBy(desc(claims.claimedAt));
  }

  async getClaimByDonation(donationId: string): Promise<Claim | undefined> {
    const [claim] = await db
      .select()
      .from(claims)
      .where(eq(claims.donationId, donationId));
    return claim;
  }

  // Impact operations
  async getOrCreateUserImpact(userId: string): Promise<Impact> {
    const [existing] = await db
      .select()
      .from(impact)
      .where(eq(impact.userId, userId));

    if (existing) {
      return existing;
    }

    const [created] = await db
      .insert(impact)
      .values({ userId })
      .returning();
    return created;
  }

  async updateUserImpact(userId: string, updates: Partial<Impact>): Promise<Impact> {
    const [updated] = await db
      .update(impact)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(impact.userId, userId))
      .returning();
    return updated;
  }

  // Admin operations
  async getUsersByRole(role: string): Promise<User[]> {
    return await db
      .select()
      .from(users)
      .where(eq(users.role, role as any))
      .orderBy(desc(users.createdAt));
  }

  async updateUserVerification(userId: string, verified: boolean): Promise<User> {
    const [updated] = await db
      .update(users)
      .set({ verified, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return updated;
  }

  async getPlatformStats() {
    const [totalUsersResult] = await db
      .select({ count: users.id })
      .from(users);
    
    const [totalDonationsResult] = await db
      .select({ count: donations.id })
      .from(donations);
    
    const [totalMealsResult] = await db
      .select({ sum: donations.quantity })
      .from(donations)
      .where(eq(donations.status, "delivered"));
    
    const [pendingVerificationsResult] = await db
      .select({ count: users.id })
      .from(users)
      .where(eq(users.verified, false));

    return {
      totalUsers: totalUsersResult?.count || 0,
      totalDonations: totalDonationsResult?.count || 0,
      totalMeals: totalMealsResult?.sum || 0,
      pendingVerifications: pendingVerificationsResult?.count || 0,
    };
  }
}

export const storage = new DatabaseStorage();
