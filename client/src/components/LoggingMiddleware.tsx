import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';

/**
 * A utility component that logs important authentication and profile information.
 * This is for debugging purposes only and should be removed in production.
 */
export default function LoggingMiddleware() {
  const { user, profile } = useAuth();

  useEffect(() => {
    const logUserInfo = async () => {
      console.group('🔍 AUTH DEBUG INFO');
      console.log('Current timestamp:', new Date().toISOString());
      
      // Log user auth information
      console.log('User authenticated:', !!user);
      if (user) {
        console.log('Auth user ID:', user.id);
        console.log('Auth user email:', user.email);
        console.log('Auth user metadata:', user.user_metadata);
      }
      
      // Log profile information
      console.log('Profile loaded:', !!profile);
      if (profile) {
        console.log('Profile ID:', profile.id);
        console.log('Profile role:', profile.role);
        console.log('Full profile data:', profile);
      }
      
      // Check for role mismatch
      if (user && profile) {
        const authRole = user.user_metadata?.role;
        const profileRole = profile.role;
        
        if (authRole !== profileRole) {
          console.warn('⚠️ ROLE MISMATCH DETECTED!');
          console.log('Auth role:', authRole);
          console.log('Profile role:', profileRole);
        }
      }
      
      // Get the raw data directly from Supabase
      if (user) {
        try {
          const { data: authUser } = await supabase.auth.getUser();
          console.log('Raw auth data from Supabase:', authUser);
          
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
            
          console.log('Raw profile data from Supabase:', profileData);
        } catch (error) {
          console.error('Error fetching raw data:', error);
        }
      }
      
      console.groupEnd();
    };
    
    // Log on component mount
    logUserInfo();
    
    // Also log whenever user or profile changes
    const interval = setInterval(logUserInfo, 5000); // Log every 5 seconds
    
    return () => clearInterval(interval);
  }, [user, profile]);

  // This component doesn't render anything
  return null;
}
