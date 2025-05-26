import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, CheckCircle, Clock, TrendingUp, Shield } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { PlatformStats } from "@/lib/types";

export default function AdminDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: stats } = useQuery<PlatformStats>({
    queryKey: ["/api/admin/stats"],
  });

  const { data: pendingUsers = [] } = useQuery({
    queryKey: ["/api/admin/users", "ngo"],
  });

  const verifyUserMutation = useMutation({
    mutationFn: ({ userId, verified }: { userId: string; verified: boolean }) =>
      apiRequest("PATCH", `/api/admin/users/${userId}/verify`, { verified }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({
        title: "User verification updated",
        description: "User status has been updated successfully.",
      });
    },
  });

  const handleVerifyUser = (userId: string, verified: boolean) => {
    verifyUserMutation.mutate({ userId, verified });
  };

  return (
    <div className="space-y-8">
      {/* Admin Header */}
      <div className="gradient-bg rounded-2xl p-8 text-white">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-teal-100 text-lg">Platform oversight and user management</p>
          </div>
        </div>
      </div>

      {/* Platform Stats */}
      <div className="grid lg:grid-cols-4 gap-6">
        <Card className="bg-primary text-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-3xl font-bold">{stats?.totalUsers || 0}</div>
                <div className="text-teal-100">Total Users</div>
              </div>
              <Users className="h-8 w-8 text-teal-200" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-secondary text-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-3xl font-bold">{stats?.pendingVerifications || 0}</div>
                <div className="text-orange-100">Pending Verifications</div>
              </div>
              <Clock className="h-8 w-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-success text-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-3xl font-bold">{stats?.totalDonations || 0}</div>
                <div className="text-green-100">Total Donations</div>
              </div>
              <CheckCircle className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-warning text-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-3xl font-bold">{stats?.totalMeals || 0}</div>
                <div className="text-yellow-100">Meals Served</div>
              </div>
              <TrendingUp className="h-8 w-8 text-yellow-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Verifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-warning" />
            Pending User Verifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingUsers.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-xl font-semibold text-neutral mb-2">All caught up!</h3>
              <p className="text-gray-600">No pending verifications at the moment</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingUsers.map((user: any) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      {user.profileImageUrl ? (
                        <img 
                          src={user.profileImageUrl} 
                          alt={user.firstName} 
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-medium">
                          {user.firstName?.[0]}{user.lastName?.[0]}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <Badge variant="outline" className="mt-1 capitalize">
                        {user.role}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleVerifyUser(user.id, false)}
                      disabled={verifyUserMutation.isPending}
                    >
                      Reject
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => handleVerifyUser(user.id, true)}
                      disabled={verifyUserMutation.isPending}
                      className="bg-success hover:bg-success/90"
                    >
                      Verify
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Platform Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Recent Platform Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span className="text-sm">New NGO verification: "Hope Foundation"</span>
              </div>
              <span className="text-xs text-gray-500">2 mins ago</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm">Donation completed: 50 meals delivered</span>
              </div>
              <span className="text-xs text-gray-500">8 mins ago</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                <span className="text-sm">New volunteer registered: Amit Patel</span>
              </div>
              <span className="text-xs text-gray-500">15 mins ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
