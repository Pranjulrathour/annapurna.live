import { supabase } from '@/lib/supabase';

/**
 * Valid user roles in the application
 */
export type UserRole = 'donor' | 'ngo' | 'volunteer' | 'admin';

/**
 * Result of a role operation
 */
export interface RoleOperationResult {
  success: boolean;
  data?: any;
  error?: any;
}

/**
 * Updates a user's role in both auth metadata and profile table
 * This ensures consistent role data across the application
 * 
 * @param userId - The user's ID
 * @param newRole - The new role to set
 * @param source - Optional source of the update (for logging)
 */
export async function updateUserRole(userId: string, newRole: UserRole, source = 'manual'): Promise<RoleOperationResult> {
  console.log(`[${source}] Updating role for user ${userId} to ${newRole}`);
  
  try {
    // First update the profile table as it's our source of truth
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId)
      .select()
      .single();
      
    if (profileError) {
      console.error('[Role Update] Error updating profile role:', profileError);
      throw profileError;
    }
    
    // Then update the auth metadata to match
    const { error: authError } = await supabase.auth.updateUser({
      data: { role: newRole }
    });
    
    if (authError) {
      console.error('[Role Update] Error updating auth metadata:', authError);
      throw authError;
    }
    
    console.log('[Role Update] Successfully updated role to:', newRole);
    
    return { 
      success: true, 
      data: profileData 
    };
  } catch (error) {
    console.error('[Role Update] Failed:', error);
    return { 
      success: false, 
      error 
    };
  }
}

/**
 * Ensures that a user's role is consistent between auth metadata and profile table
 * This is important for consistent role-based routing
 * 
 * @param userId - The user's ID
 */
export async function syncUserRole(userId: string): Promise<RoleOperationResult> {
  try {
    console.log('[Role Sync] Starting for user:', userId);
    
    // Get user from auth
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('[Role Sync] Error getting auth user:', userError);
      throw userError;
    }
    
    if (!userData?.user) {
      console.error('[Role Sync] User not found in auth');
      throw new Error('User not found in auth');
    }
    
    // Get auth role from metadata
    const authRole = userData.user.user_metadata?.role as UserRole | undefined;
    console.log('[Role Sync] Auth role:', authRole);
    
    // Get profile from database
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (profileError) {
      console.error('[Role Sync] Error getting profile:', profileError);
      throw profileError;
    }
    
    // Get role from profile
    const profileRole = profileData?.role as UserRole | undefined;
    console.log('[Role Sync] Profile role:', profileRole);
    
    // Determine which role to use and fix any discrepancies
    if (profileRole && !authRole) {
      // If profile has a role but auth doesn't, update auth to match profile
      console.log('[Role Sync] Updating auth to match profile role:', profileRole);
      const { error } = await supabase.auth.updateUser({
        data: { role: profileRole }
      });
      
      if (error) {
        console.error('[Role Sync] Error updating auth role:', error);
        throw error;
      }
      
      return { success: true, data: profileData };
    }
    else if (authRole && !profileRole) {
      // If auth has a role but profile doesn't, update profile to match auth
      console.log('[Role Sync] Updating profile to match auth role:', authRole);
      return updateUserRole(userId, authRole, 'sync');
    }
    else if (authRole && profileRole && authRole !== profileRole) {
      // If both have different roles, prioritize the profile role
      console.log('[Role Sync] Role mismatch - using profile role as source of truth');
      const { error } = await supabase.auth.updateUser({
        data: { role: profileRole }
      });
      
      if (error) {
        console.error('[Role Sync] Error updating auth role:', error);
        throw error;
      }
      
      return { success: true, data: profileData };
    }
    else if (!profileRole && !authRole) {
      // Neither has a role, set a default role of 'donor'
      console.log('[Role Sync] No role found in either place, setting default role: donor');
      return updateUserRole(userId, 'donor', 'sync-default');
    }
    
    // Roles are already in sync
    console.log('[Role Sync] Roles are already in sync:', profileRole);
    return { success: true, data: profileData };
  } catch (error) {
    console.error('[Role Sync] Error:', error);
    return { success: false, error };
  }
}

/**
 * Gets the current user role from the database
 * This is the most reliable way to get the current role
 * 
 * @param userId - The user's ID
 */
export async function getCurrentRole(userId: string): Promise<UserRole | null> {
  try {
    console.log('[Role Get] Retrieving current role for user:', userId);
    
    // Get profile from database
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();
      
    if (error) {
      console.error('[Role Get] Error retrieving role:', error);
      return null;
    }
    
    console.log('[Role Get] Current role:', data?.role);
    return data?.role as UserRole || null;
  } catch (error) {
    console.error('[Role Get] Error:', error);
    return null;
  }
}
