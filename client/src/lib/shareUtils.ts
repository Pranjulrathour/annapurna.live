import { supabase } from './supabase';

export interface UserStats {
  donationsCount: number;
  mealsDonated: number;
  pickupsCompleted: number;
  peopleHelped: number;
}

export type UserRole = 'donor' | 'ngo' | 'volunteer' | 'admin';

/**
 * Calculates statistics for a user based on their role and activities
 * @param userId The ID of the user
 * @param role The role of the user
 * @returns Statistics object with metrics based on user's role
 */
export const calculateUserStats = async (userId: string, role: UserRole): Promise<UserStats> => {
  const stats: UserStats = {
    donationsCount: 0,
    mealsDonated: 0,
    pickupsCompleted: 0,
    peopleHelped: 0
  };
  
  try {
    // Calculate different stats based on user role
    if (role === 'donor') {
      // Count donations made by this user
      const { data: donations, error: donationError } = await supabase
        .from('donations')
        .select('quantity, unit')
        .eq('donor_id', userId);
        
      if (donationError) throw donationError;
      
      stats.donationsCount = donations?.length || 0;
      
      // Estimate meals donated (assuming average meal serves 1-2 people)
      let totalMeals = 0;
      donations?.forEach(donation => {
        // Convert different units to approximate meal counts
        const unit = donation.unit?.toLowerCase() || 'servings';
        if (unit === 'servings' || unit === 'meals') {
          totalMeals += donation.quantity;
        } else if (unit === 'kg' || unit === 'kilograms') {
          totalMeals += Math.floor(donation.quantity * 3); // ~3 meals per kg
        } else if (unit === 'lb' || unit === 'pounds') {
          totalMeals += Math.floor(donation.quantity * 1.5); // ~1.5 meals per pound
        } else {
          // Default conversion if unit not recognized
          totalMeals += donation.quantity;
        }
      });
      
      stats.mealsDonated = totalMeals;
    }
    
    else if (role === 'volunteer') {
      // Count pickups completed by volunteer
      const { data: claims, error: claimsError } = await supabase
        .from('claims')
        .select('id, status')
        .eq('volunteer_id', userId);
        
      if (claimsError) throw claimsError;
      
      // Count successful pickups
      stats.pickupsCompleted = claims?.filter(
        claim => claim.status === 'picked_up' || claim.status === 'delivered'
      )?.length || 0;
      
      // Estimate impact (assuming each pickup helps ~5 people on average)
      stats.peopleHelped = stats.pickupsCompleted * 5;
    }
    
    else if (role === 'ngo') {
      // Count donations claimed by this NGO
      const { data: claims, error: claimsError } = await supabase
        .from('claims')
        .select('donation_id, status')
        .eq('ngo_id', userId);
        
      if (claimsError) throw claimsError;
      
      // Count delivered donations
      const deliveredCount = claims?.filter(
        claim => claim.status === 'delivered'
      )?.length || 0;
      
      // Estimate people helped (assuming each donation helps ~10 people on average)
      stats.peopleHelped = deliveredCount * 10;
    }
    
    return stats;
  } catch (error) {
    console.error('Error calculating user stats:', error);
    return stats; // Return default stats object in case of error
  }
};

/**
 * Formats a statistic number for display with proper formatting
 * @param num The number to format
 * @returns Formatted string (e.g., "1,234")
 */
export const formatStatNumber = (num: number): string => {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k+`;
  }
  return num.toString();
};
