import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { User, Session } from '@supabase/supabase-js'
import type { Profile } from '@/lib/supabase'
import { syncUserRole, updateUserRole, getCurrentRole, type UserRole } from '@/utils/roleUtils';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setProfile(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId: string) => {
    try {
      console.log('[Auth] Fetching profile for user:', userId);
      
      // First ensure roles are synced between auth and profile
      const syncResult = await syncUserRole(userId);
      
      if (!syncResult.success) {
        console.error('[Auth] Error syncing role during profile fetch:', syncResult.error);
      }
      
      // Now fetch the updated profile
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('[Auth] Error fetching profile:', error);
        return;
      }
      
      if (data) {
        console.log('[Auth] Profile fetched successfully:', data);
        setProfile(data);
        
        if (!data.role) {
          console.error('[Auth] Profile missing role after sync - this should not happen');
          // Set a default role as fallback
          const { success } = await updateUserRole(userId, 'donor', 'auth-fallback');
          if (success) {
            // Refresh profile with the default role
            const { data: refreshedData } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', userId)
              .single();
              
            if (refreshedData) {
              setProfile(refreshedData);
            }
          }
        }
      } else {
        console.log('[Auth] No profile found for user:', userId);
      }
    } catch (error) {
      console.error('[Auth] Error in fetchProfile:', error);
    }
  }

  const signUp = async (email: string, password: string, userData: Partial<Profile>) => {
    try {
      console.log('[Auth] Signing up with role:', userData.role);
      
      // Ensure a role is specified, defaulting to donor if not provided
      const role = userData.role || 'donor';
      
      // First check if email already exists in profiles table
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', email)
        .maybeSingle();

      if (existingProfile) {
        return { 
          data: null, 
          error: new Error('An account with this email already exists. Please sign in instead.') 
        };
      }

      // Create auth user with role in metadata
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: userData.first_name,
            last_name: userData.last_name,
            role: role // Ensure role is set explicitly
          }
        }
      });

      if (error) throw error;
      console.log('[Auth] User created with metadata:', data.user?.user_metadata);

      if (data.user) {
        // Create profile with the same role
        const { error: profileError, data: profileData } = await supabase
          .from('profiles')
          .insert([{
              id: data.user.id,
              email: data.user.email,
              first_name: userData.first_name,
              last_name: userData.last_name,
              role: role, // Ensure role is set explicitly
              verified: false
            }])
          .select()
          .single();

        if (profileError) {
          console.error('[Auth] Profile creation error:', profileError);
          // Don't throw here, as the auth user was created successfully
        } else {
          console.log('[Auth] Profile created successfully with role:', profileData.role);
          // Set the profile in state
          setProfile(profileData);
        }
      }

      return { data, error: null };
    } catch (error) {
      console.error('[Auth] Sign up error:', error);
      return { data: null, error };
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      console.log('[Auth] Signing in user:', email);
      
      // First sign in with email/password
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (authError) throw authError;
      console.log('[Auth] User authenticated successfully:', authData.user?.id);
      
      if (!authData.user) {
        throw new Error('User authentication succeeded but no user data returned');
      }
      
      // Get the current user ID
      const userId = authData.user.id;
      
      // First check if a profile exists
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (profileError && profileError.code !== 'PGRST116') { // PGRST116 = not found
        console.error('[Auth] Error checking profile existence:', profileError);
      }
      
      // Handle missing profile case
      if (!profileData) {
        console.log('[Auth] Profile not found, creating one with auth metadata');
        
        // Get role from auth metadata or default to donor
        const authMetadata = authData.user.user_metadata || {};
        const roleToUse = authMetadata.role as UserRole || 'donor';
        
        // Create new profile
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([{
            id: userId,
            email: authData.user.email,
            first_name: authMetadata.first_name || '',
            last_name: authMetadata.last_name || '',
            role: roleToUse,
            verified: false
          }])
          .select()
          .single();
          
        if (createError) {
          console.error('[Auth] Error creating profile during sign in:', createError);
        } else if (newProfile) {
          console.log('[Auth] Profile created successfully with role:', newProfile.role);
          setProfile(newProfile);
        }
      } else {
        // Profile exists, ensure role is consistent
        console.log('[Auth] Profile found, syncing role...');
        
        // Sync roles between auth and profile to ensure consistency
        const { success, data: syncedProfile } = await syncUserRole(userId);
        
        if (success && syncedProfile) {
          console.log('[Auth] Role synced successfully, using role:', syncedProfile.role);
          setProfile(syncedProfile);
        } else {
          // Fallback: just use the profile we already have
          console.log('[Auth] Role sync had issues, using existing profile data');
          setProfile(profileData);
        }
      }

      return { data: authData, error: null };
    } catch (error) {
      console.error('[Auth] Sign in error:', error);
      return { data: null, error };
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setUser(null)
      setProfile(null)
      setSession(null)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      if (!user) throw new Error('No user logged in')

      console.log('Updating profile with:', updates);
      
      // Update the profile in Supabase
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single()

      if (error) throw error
      
      console.log('Profile updated successfully:', data);

      // Also update user_metadata in auth.users when updating role
      if (updates.role) {
        try {
          // We can't directly update auth metadata from client, but we can update it through custom claim
          // This will ensure role is consistent between auth and profiles tables
          const { error: authError } = await supabase.auth.updateUser({
            data: { role: updates.role }
          });
          
          if (authError) {
            console.error('Error updating auth metadata:', authError);
          } else {
            console.log('Auth metadata updated with role:', updates.role);
          }
        } catch (authUpdateError) {
          console.error('Error in auth update:', authUpdateError);
        }
      }

      // Update the local profile state
      setProfile({...data});
      
      return { data, error: null }
    } catch (error) {
      console.error('Error in updateProfile:', error);
      return { data: null, error }
    }
  }

  return {
    user,
    profile,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    isAuthenticated: !!user,
  }
}