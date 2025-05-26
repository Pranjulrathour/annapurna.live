export interface DonationWithDetails {
  id: string;
  donorId: string;
  foodType: string;
  quantity: number;
  expiryHours: number;
  location: string;
  latitude: string | null;
  longitude: string | null;
  imageUrl: string | null;
  status: 'submitted' | 'claimed' | 'picked_up' | 'delivered';
  createdAt: string;
  updatedAt: string;
}

export interface ClaimWithDetails {
  id: string;
  donationId: string;
  ngoId: string | null;
  volunteerId: string | null;
  status: 'claimed' | 'picked_up' | 'delivered';
  claimedAt: string;
  pickedUpAt: string | null;
  deliveredAt: string | null;
  notes: string | null;
}

export interface UserImpact {
  id: string;
  userId: string;
  mealsDonated: number | null;
  mealsDistributed: number | null;
  deliveriesCompleted: number | null;
  points: number | null;
  updatedAt: string;
}

export interface PlatformStats {
  totalUsers: number;
  totalDonations: number;
  totalMeals: number;
  pendingVerifications: number;
}
