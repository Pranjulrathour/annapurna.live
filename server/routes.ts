import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertDonationSchema, insertClaimSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Update user role (for new users)
  app.patch('/api/auth/user/role', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { role } = req.body;
      
      if (!['donor', 'ngo', 'volunteer'].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }

      const updatedUser = await storage.upsertUser({
        id: userId,
        email: req.user.claims.email,
        firstName: req.user.claims.first_name,
        lastName: req.user.claims.last_name,
        profileImageUrl: req.user.claims.profile_image_url,
        role,
      });

      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user role:", error);
      res.status(500).json({ message: "Failed to update user role" });
    }
  });

  // Donation routes
  app.post('/api/donations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertDonationSchema.parse({
        ...req.body,
        donorId: userId,
      });

      const donation = await storage.createDonation(validatedData);
      
      // Update donor impact
      const impact = await storage.getOrCreateUserImpact(userId);
      await storage.updateUserImpact(userId, {
        mealsDonated: (impact.mealsDonated || 0) + donation.quantity,
        points: (impact.points || 0) + donation.quantity * 2,
      });

      res.json(donation);
    } catch (error) {
      console.error("Error creating donation:", error);
      res.status(500).json({ message: "Failed to create donation" });
    }
  });

  app.get('/api/donations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role === 'donor') {
        const donations = await storage.getDonationsByDonor(userId);
        res.json(donations);
      } else {
        const donations = await storage.getNearbyDonations(user?.role || 'volunteer');
        res.json(donations);
      }
    } catch (error) {
      console.error("Error fetching donations:", error);
      res.status(500).json({ message: "Failed to fetch donations" });
    }
  });

  app.get('/api/donations/:id', isAuthenticated, async (req: any, res) => {
    try {
      const donation = await storage.getDonation(req.params.id);
      if (!donation) {
        return res.status(404).json({ message: "Donation not found" });
      }
      res.json(donation);
    } catch (error) {
      console.error("Error fetching donation:", error);
      res.status(500).json({ message: "Failed to fetch donation" });
    }
  });

  // Claim routes
  app.post('/api/claims', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      const { donationId } = req.body;

      // Check if donation exists and is available
      const donation = await storage.getDonation(donationId);
      if (!donation || donation.status !== 'submitted') {
        return res.status(400).json({ message: "Donation not available for claiming" });
      }

      // Create claim based on user role
      const claimData: any = { donationId };
      if (user?.role === 'ngo') {
        claimData.ngoId = userId;
      } else if (user?.role === 'volunteer') {
        claimData.volunteerId = userId;
      } else {
        return res.status(400).json({ message: "Only NGOs and volunteers can claim donations" });
      }

      const claim = await storage.createClaim(claimData);
      await storage.updateDonationStatus(donationId, 'claimed');

      res.json(claim);
    } catch (error) {
      console.error("Error creating claim:", error);
      res.status(500).json({ message: "Failed to claim donation" });
    }
  });

  app.patch('/api/claims/:id/status', isAuthenticated, async (req: any, res) => {
    try {
      const { status } = req.body;
      const userId = req.user.claims.sub;
      
      const claim = await storage.updateClaim(req.params.id, { 
        status,
        ...(status === 'picked_up' && { pickedUpAt: new Date() }),
        ...(status === 'delivered' && { deliveredAt: new Date() }),
      });

      // Update donation status
      if (claim.donationId) {
        await storage.updateDonationStatus(claim.donationId, status);
      }

      // Update volunteer impact for deliveries
      if (status === 'delivered' && claim.volunteerId) {
        const impact = await storage.getOrCreateUserImpact(claim.volunteerId);
        await storage.updateUserImpact(claim.volunteerId, {
          deliveriesCompleted: (impact.deliveriesCompleted || 0) + 1,
          points: (impact.points || 0) + 10,
        });
      }

      res.json(claim);
    } catch (error) {
      console.error("Error updating claim status:", error);
      res.status(500).json({ message: "Failed to update claim status" });
    }
  });

  app.get('/api/claims', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const claims = await storage.getClaimsByUser(userId);
      res.json(claims);
    } catch (error) {
      console.error("Error fetching claims:", error);
      res.status(500).json({ message: "Failed to fetch claims" });
    }
  });

  // Impact routes
  app.get('/api/impact', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const impact = await storage.getOrCreateUserImpact(userId);
      res.json(impact);
    } catch (error) {
      console.error("Error fetching impact:", error);
      res.status(500).json({ message: "Failed to fetch impact" });
    }
  });

  // Admin routes
  app.get('/api/admin/users', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { role } = req.query;
      const users = role 
        ? await storage.getUsersByRole(role as string)
        : await storage.getUsersByRole('ngo'); // Default to NGOs for verification
      
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.patch('/api/admin/users/:id/verify', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { verified } = req.body;
      const updatedUser = await storage.updateUserVerification(req.params.id, verified);
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user verification:", error);
      res.status(500).json({ message: "Failed to update user verification" });
    }
  });

  app.get('/api/admin/stats', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const stats = await storage.getPlatformStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching platform stats:", error);
      res.status(500).json({ message: "Failed to fetch platform stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
