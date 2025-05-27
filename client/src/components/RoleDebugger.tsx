import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function RoleDebugger() {
  const { user, profile } = useAuth();
  const [authMetadata, setAuthMetadata] = useState<any>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          // Get user data from auth
          const { data: userData, error: userError } = await supabase.auth.getUser();
          if (userError) {
            console.error("Error fetching user:", userError);
          } else {
            setAuthMetadata(userData.user.user_metadata);
          }

          // Get profile data directly
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

          if (profileError) {
            console.error("Error fetching profile:", profileError);
          } else {
            setProfileData(profileData);
          }
        } catch (error) {
          console.error("Error in data fetching:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return <div>Loading debug info...</div>;
  }

  return (
    <Card className="mb-6 border-dashed border-red-300 bg-red-50">
      <CardHeader className="pb-2">
        <CardTitle className="text-red-600 text-sm flex items-center">
          <span className="mr-2">🔍</span> Debug Info (Role Mismatch)
        </CardTitle>
      </CardHeader>
      <CardContent className="text-xs">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-bold mb-1">Auth Metadata</h3>
            <pre className="bg-white p-2 rounded text-xs overflow-auto max-h-40">
              {JSON.stringify(authMetadata, null, 2)}
            </pre>
            <div className="mt-2">
              <span className="font-semibold">Role from Auth: </span>
              <Badge variant="outline">{authMetadata?.role || "Not set"}</Badge>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold mb-1">Profile Data</h3>
            <pre className="bg-white p-2 rounded text-xs overflow-auto max-h-40">
              {JSON.stringify(profileData, null, 2)}
            </pre>
            <div className="mt-2">
              <span className="font-semibold">Role from Profile: </span>
              <Badge variant="outline">{profileData?.role || "Not set"}</Badge>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-2 border-t border-red-200">
          <h3 className="font-bold mb-1">Current Profile State</h3>
          <div>
            <span className="font-semibold">Role from useAuth hook: </span>
            <Badge variant="outline">{profile?.role || "Not set"}</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
