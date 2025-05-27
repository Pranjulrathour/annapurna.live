import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { calculateUserStats, UserStats } from '@/lib/shareUtils';
import ShareableCard from '@/components/ShareableCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Award, Share2, BarChart } from 'lucide-react';
// Import the Layout component directly
import Layout from '@/components/Layout';
import { useLocation } from 'wouter';

export default function ShareStats() {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadUserStats = async () => {
      if (!user || !profile?.role) {
        setLoading(false);
        return;
      }
      
      try {
        const userStats = await calculateUserStats(user.id, profile.role as any);
        setStats(userStats);
      } catch (error) {
        console.error('Error loading stats:', error);
        toast({
          title: 'Error loading your statistics',
          description: 'We encountered an issue while calculating your impact. Please try again later.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadUserStats();
  }, [user, profile]);
  
  if (!user || !profile) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <Card className="mx-auto max-w-md">
          <CardHeader>
            <CardTitle>Please Sign In</CardTitle>
            <CardDescription>
              You need to be signed in to view your impact statistics.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setLocation('/')}>Go to Login</Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const userName = profile.first_name && profile.last_name
    ? `${profile.first_name} ${profile.last_name}`
    : profile.organization_name || 'Annapurna User';
  
  const getStatsDisplay = () => {
    if (!stats) return null;
    
    switch (profile.role) {
      case 'donor':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StatCard 
              title="Food Items Donated"
              value={stats.donationsCount}
              icon={<Award className="h-5 w-5 text-primary" />}
            />
            <StatCard 
              title="Estimated Meals Provided"
              value={stats.mealsDonated}
              icon={<Award className="h-5 w-5 text-primary" />}
            />
          </div>
        );
      case 'volunteer':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StatCard 
              title="Pickups Completed"
              value={stats.pickupsCompleted}
              icon={<Award className="h-5 w-5 text-primary" />}
            />
            <StatCard 
              title="People Helped"
              value={stats.peopleHelped}
              icon={<Award className="h-5 w-5 text-primary" />}
            />
          </div>
        );
      case 'ngo':
        return (
          <div className="grid grid-cols-1 gap-4">
            <StatCard 
              title="People Helped"
              value={stats.peopleHelped}
              icon={<Award className="h-5 w-5 text-primary" />}
            />
          </div>
        );
      default:
        return (
          <div className="text-center py-4">
            No statistics available for this user type.
          </div>
        );
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="py-8">
        <h1 className="text-3xl font-bold mb-2 text-center">Your Impact</h1>
        <p className="text-neutral-500 text-center mb-8">
          See the difference you're making in the fight against food waste and hunger
        </p>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Calculating your impact...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Stats Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart className="h-5 w-5 mr-2" />
                  Your Statistics
                </CardTitle>
                <CardDescription>
                  Your contributions to reducing food waste
                </CardDescription>
              </CardHeader>
              <CardContent>
                {getStatsDisplay()}
              </CardContent>
            </Card>
            
            {/* Shareable Card */}
            <div>
              <div className="mb-4">
                <h3 className="text-xl font-semibold flex items-center">
                  <Share2 className="h-5 w-5 mr-2" />
                  Share Your Impact
                </h3>
                <p className="text-sm text-neutral-500">
                  Inspire others by sharing your contribution on social media
                </p>
              </div>
              
              <ShareableCard 
                name={userName} 
                role={profile.role} 
                stats={stats || {}}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Stat card component for displaying individual metrics
interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
}

function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <div className="bg-neutral-50 border rounded-lg p-4 flex items-center">
      <div className="bg-white p-2 rounded-full mr-3 shadow-sm">
        {icon}
      </div>
      <div>
        <p className="text-sm text-neutral-600">{title}</p>
        <p className="text-2xl font-bold">{value?.toLocaleString() || 0}</p>
      </div>
    </div>
  );
}
