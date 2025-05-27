import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { useLocation } from "@/hooks/useLocation";
import DonorDashboard from "./DonorDashboard";
import NGODashboard from "./NGODashboard";
import VolunteerDashboard from "./VolunteerDashboard";
import AdminDashboard from "./AdminDashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, MapPin, AlertCircle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from "@/lib/supabase";
import { syncUserRole, updateUserRole, getCurrentRole, type UserRole } from "@/utils/roleUtils";

export default function Dashboard() {
  const { profile, user, loading } = useAuth();
  const { location, loading: locationLoading, error: locationError, detectLocation } = useLocation();
  const [showDebugger, setShowDebugger] = useState(false);
  const [forceRefresh, setForceRefresh] = useState(0);
  const [isFixingRole, setIsFixingRole] = useState(false);
  const { toast } = useToast();
  
  // Get current role directly from database to ensure it's the most up-to-date
  const [dbRole, setDbRole] = useState<UserRole | null>(null);
  const [isRoleLoading, setIsRoleLoading] = useState(true);
  const [shouldRefreshRole, setShouldRefreshRole] = useState(true); // Flag to control role refresh
  
  // Sync and fetch role from database when user logs in or refresh is needed
  useEffect(() => {
    const syncAndFetchRole = async () => {
      if (!user) return;
      
      try {
        setIsRoleLoading(true);
        console.log('[Dashboard] Syncing and fetching user role...');
        
        // First sync the user role to ensure consistency
        const { success, data: syncedProfile } = await syncUserRole(user.id);
        
        if (success && syncedProfile) {
          console.log('[Dashboard] Role synced successfully:', syncedProfile.role);
          setDbRole(syncedProfile.role);
        } else {
          // If sync failed, try direct database query as fallback
          console.log('[Dashboard] Role sync issues, querying database directly');
          const dbRole = await getCurrentRole(user.id);
          setDbRole(dbRole);
        }
      } catch (err) {
        console.error('[Dashboard] Error syncing/fetching role:', err);
      } finally {
        setIsRoleLoading(false);
        setShouldRefreshRole(false); // Reset the refresh flag
      }
    };
    
    if (user && shouldRefreshRole) {
      syncAndFetchRole();
    }
  }, [user, forceRefresh, shouldRefreshRole]);
  
  // Debug logging for role discrepancies and auto-fix issues
  useEffect(() => {
    if (!user || !profile) return;
    
    const checkAndFixRoleMismatch = async () => {
      if (dbRole && profile.role && dbRole !== profile.role) {
        console.warn('[Dashboard] ⚠️ Role mismatch detected!');
        console.log('[Dashboard] Role in profile state:', profile.role);
        console.log('[Dashboard] Role in database:', dbRole);
        
        // Auto-fix the mismatch by syncing roles
        console.log('[Dashboard] Auto-fixing role mismatch...');
        await syncUserRole(user.id);
        setShouldRefreshRole(true); // Trigger a refresh after fixing
      }
    };
    
    checkAndFixRoleMismatch();
  }, [profile, dbRole, user]);
  
  // Try to detect location when component mounts
  useEffect(() => {
    if (!location && !locationLoading && !locationError) {
      detectLocation();
    }
  }, [location, locationLoading, locationError, detectLocation]);

  // Function to fix user role using the updated utility
  const fixRole = async (role: UserRole) => {
    if (!user) return;
    
    setIsFixingRole(true);
    
    try {
      console.log(`[Dashboard] Setting role to ${role} for user ${user.id}`);
      
      // Use the improved updateUserRole utility
      const { success, error } = await updateUserRole(user.id, role, 'dashboard-selection');
      
      if (!success) throw error;
      
      // Update local state and trigger a refresh
      setDbRole(role);
      setShouldRefreshRole(true); // This will trigger the useEffect to refetch the role
      
      // Display success message
      const roleDisplayNames = {
        donor: 'Food Donor',
        ngo: 'NGO Partner',
        volunteer: 'Volunteer',
        admin: 'Administrator'
      };
      
      toast({
        title: "Role updated",
        description: `Your role has been set to ${roleDisplayNames[role] || role}.`,
      });
      
    } catch (error) {
      console.error('[Dashboard] Error fixing role:', error);
      toast({
        title: "Error updating role",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsFixingRole(false);
    }
  };
  
  // Keyboard shortcut to toggle debugger
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        setShowDebugger(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // If loading, show loading indicator
  if (loading || isRoleLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Loading your dashboard...</h2>
          <p className="text-gray-500">Please wait while we prepare your experience</p>
        </div>
      </div>
    );
  }
  
  // If no user is authenticated, show login prompt
  if (!user) {
    return (
      <div className="container max-w-md py-8">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Please sign in to access your dashboard.</p>
            <Button onClick={() => window.location.href = '/'}>
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // If profile doesn't exist, show error
  if (!profile) {
    return (
      <div className="container max-w-md py-8">
        <Card>
          <CardHeader>
            <CardTitle>Profile Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">We couldn't find your profile. This might be a temporary issue.</p>
            <Button 
              onClick={() => setForceRefresh(prev => prev + 1)}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Prepare location props for dashboard components
  const locationProps = location ? {
    latitude: location.latitude,
    longitude: location.longitude,
    address: location.address
  } : undefined;
  
  // Get role from URL params if available (for direct role override)
  const urlParams = new URLSearchParams(window.location.search);
  const urlRole = urlParams.get('role') as UserRole | null;
  
  // Force role from localStorage if set recently
  const storageRole = localStorage.getItem('annapurna_role') as UserRole | null;
  const storageRoleTimestamp = localStorage.getItem('annapurna_role_timestamp');
  const storageRoleIsRecent = storageRoleTimestamp && 
    (Date.now() - parseInt(storageRoleTimestamp)) < 10 * 60 * 1000; // 10 minutes
  
  // Database role is the source of truth, but have fallbacks in case of issues
  const authMetadataRole = user?.user_metadata?.role as UserRole | undefined;
  
  // Priority: URL > Recent localStorage > Database > Auth metadata > Profile state
  const effectiveRole = urlRole || 
    (storageRoleIsRecent ? storageRole : null) || 
    dbRole || 
    authMetadataRole || 
    profile?.role || 
    null;
  
  // Log role resolution process for debugging
  console.log('[Dashboard] Role resolution:')
  console.log('  - URL role param:', urlRole);
  console.log('  - localStorage role:', storageRole, storageRoleIsRecent ? '(recent)' : '(old)');
  console.log('  - Database role:', dbRole);
  console.log('  - Auth metadata role:', authMetadataRole);
  console.log('  - Profile state role:', profile?.role);
  console.log('[Dashboard] Final effective role:', effectiveRole);
  
  // Show role selection if no role is set or debug mode is active
  if (!effectiveRole || showDebugger) {
    return (
      <div className="container max-w-3xl py-8">
        {showDebugger && (
          <div className="mb-6 p-4 bg-slate-50 border rounded-md">
            <h3 className="font-semibold mb-2">Role Debug Information</h3>
            <pre className="text-xs bg-slate-100 p-2 rounded overflow-auto">
              {JSON.stringify({
                userId: user.id,
                email: profile.email,
                profileRole: profile.role,
                databaseRole: dbRole,
                effectiveRole,
                authMetadata: user.user_metadata
              }, null, 2)}
            </pre>
          </div>
        )}
        
        <Card>
          <CardHeader>
            <CardTitle>Role Selection Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Please select your role to continue:</p>
            <div className="grid gap-4">
              <Button
                variant="outline"
                className="h-20 p-6 text-left justify-start hover:bg-primary/5 hover:border-primary"
                onClick={() => fixRole('donor')}
                disabled={isFixingRole}
              >
                <div>
                  <div className="font-semibold text-lg">🍽️ Food Donor</div>
                  <div className="text-sm text-gray-600">Share surplus food from home or restaurant</div>
                </div>
              </Button>
              <Button
                variant="outline"
                className="h-20 p-6 text-left justify-start hover:bg-secondary/5 hover:border-secondary"
                onClick={() => fixRole('ngo')}
                disabled={isFixingRole}
              >
                <div>
                  <div className="font-semibold text-lg">🏢 NGO Partner</div>
                  <div className="text-sm text-gray-600">Distribute food to communities in need</div>
                </div>
              </Button>
              <Button
                variant="outline"
                className="h-20 p-6 text-left justify-start hover:bg-success/5 hover:border-success"
                onClick={() => fixRole('volunteer')}
                disabled={isFixingRole}
              >
                <div>
                  <div className="font-semibold text-lg">🚀 Volunteer</div>
                  <div className="text-sm text-gray-600">Help pickup and deliver food donations</div>
                </div>
              </Button>
            </div>
            
            {isFixingRole && (
              <div className="flex items-center justify-center mt-6">
                <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
                <p>Updating role...</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Render the appropriate dashboard based on role
  return (
    <div key={forceRefresh}>
      {/* Debug button in bottom right corner */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button 
          variant="outline" 
          size="sm" 
          className="opacity-50 hover:opacity-100 text-xs"
          onClick={() => setShowDebugger(prev => !prev)}
        >
          Debug
        </Button>
      </div>
      
      {/* Display dashboard based on role */}
      {effectiveRole === 'donor' && (
        <DonorDashboard initialLocation={locationProps} />
      )}
      
      {effectiveRole === 'ngo' && (
        <NGODashboard initialLocation={locationProps} />
      )}
      
      {effectiveRole === 'volunteer' && (
        <VolunteerDashboard initialLocation={locationProps} />
      )}
      
      {effectiveRole === 'admin' && (
        <AdminDashboard />
      )}
      
      {/* Fallback for unknown roles - show role selection instead of defaulting to Donor */}
      {!['donor', 'ngo', 'volunteer', 'admin'].includes(effectiveRole) && (
        <>
          <div className="container max-w-3xl py-8">
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Role Selection Required</AlertTitle>
              <AlertDescription>
                {effectiveRole ? 
                  `The role "${effectiveRole}" is not recognized.` : 
                  "No role has been set for your account."} Please select your role below.
              </AlertDescription>
            </Alert>
            
            <Card>
              <CardHeader>
                <CardTitle>Choose Your Role</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <Button
                    variant="outline"
                    className="h-20 p-6 text-left justify-start hover:bg-primary/5 hover:border-primary"
                    onClick={() => fixRole('donor')}
                    disabled={isFixingRole}
                  >
                    <div>
                      <div className="font-semibold text-lg">🍽️ Food Donor</div>
                      <div className="text-sm text-gray-600">Share surplus food from home or restaurant</div>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 p-6 text-left justify-start hover:bg-yellow-100 hover:border-yellow-400"
                    onClick={() => fixRole('ngo')}
                    disabled={isFixingRole}
                  >
                    <div>
                      <div className="font-semibold text-lg">🏢 NGO Partner</div>
                      <div className="text-sm text-gray-600">Distribute food to communities in need</div>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 p-6 text-left justify-start hover:bg-green-100 hover:border-green-400"
                    onClick={() => fixRole('volunteer')}
                    disabled={isFixingRole}
                  >
                    <div>
                      <div className="font-semibold text-lg">🚀 Volunteer</div>
                      <div className="text-sm text-gray-600">Help pickup and deliver food donations</div>
                    </div>
                  </Button>
                </div>
                
                {isFixingRole && (
                  <div className="flex items-center justify-center mt-6">
                    <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
                    <p>Setting your role...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
