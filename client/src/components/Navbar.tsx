import React, { useState } from 'react';
import { Link } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { NotificationCenter } from '@/components/NotificationCenter';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Home, LogOut, User, Plus, Heart, Users, SwitchCamera, Check, Loader2, Share2 } from 'lucide-react';
import { updateUserRole, type UserRole } from '@/utils/roleUtils';
import { supabase } from '@/lib/supabase';

const Navbar: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const [switchingRole, setSwitchingRole] = useState(false);

  const getInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
    }
    return user?.email ? user.email[0].toUpperCase() : 'U';
  };
  
  // Get role-specific badge color
  const getRoleBadgeColor = () => {
    if (!profile?.role) return "bg-gray-400";
    
    switch (profile.role) {
      case 'donor':
        return "bg-green-500"; // Green for donors
      case 'ngo':
        return "bg-yellow-500"; // Yellow for NGOs
      case 'volunteer':
        return "bg-blue-500"; // Blue for volunteers
      case 'admin':
        return "bg-purple-500"; // Purple for admins
      default:
        return "bg-gray-400";
    }
  };
  
  // Get formatted role name for display
  const getRoleName = () => {
    if (!profile?.role) return "User";
    
    switch (profile.role) {
      case 'donor':
        return "Donor";
      case 'ngo':
        return "NGO Partner";
      case 'volunteer':
        return "Volunteer";
      case 'admin':
        return "Admin";
      default:
        return "User";
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  // Function to switch user role
  const switchRole = async (newRole: UserRole) => {
    if (!user || !profile || switchingRole) return;
    
    setSwitchingRole(true);
    
    try {
      // Save role to localStorage as backup
      localStorage.setItem('annapurna_role', newRole);
      localStorage.setItem('annapurna_role_timestamp', Date.now().toString());
      
      // Update role in database
      const { success } = await updateUserRole(user.id, newRole, 'navbar-dropdown');
      
      if (success) {
        // Use URL parameter approach for immediate effect
        window.location.href = `/?role=${newRole}&ts=${Date.now()}`;
      } else {
        throw new Error('Failed to update role');
      }
    } catch (error) {
      console.error(`Error switching to ${newRole} role:`, error);
      setSwitchingRole(false);
    }
  };

  const renderRoleSpecificLinks = () => {
    if (!profile) return null;

    switch (profile.role) {
      case 'donor':
        return (
          <Button asChild variant="ghost">
            <Link href="/donor" className="flex items-center gap-2">
              <Plus size={16} />
              <span>Donate Food</span>
            </Link>
          </Button>
        );
      case 'ngo':
        return (
          <Button asChild variant="ghost">
            <Link href="/ngo" className="flex items-center gap-2">
              <Heart size={16} />
              <span>Available Donations</span>
            </Link>
          </Button>
        );
      case 'volunteer':
        return (
          <Button asChild variant="ghost">
            <Link href="/volunteer" className="flex items-center gap-2">
              <Users size={16} />
              <span>Volunteer Opportunities</span>
            </Link>
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <header className="w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="text-xl font-bold text-primary">Annapurna</div>
        </Link>
        <nav className="hidden md:flex items-center gap-5">
          <Button asChild variant="ghost">
            <Link href="/" className="flex items-center gap-2">
              <Home size={16} />
              <span>Home</span>
            </Link>
          </Button>
          {renderRoleSpecificLinks()}
        </nav>
        <div className="flex items-center space-x-4">
          {/* Only show the notification center for authenticated users */}
          {user && <NotificationCenter />}
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className={`h-10 w-10 ring-2 ring-offset-2 ${getRoleBadgeColor().replace('bg-', 'ring-')}`}>
                    <AvatarImage src={profile?.profile_image_url} alt={profile?.first_name || ''} />
                    <AvatarFallback>{getInitials()}</AvatarFallback>
                  </Avatar>
                  {/* Role indicator badge */}
                  <span className={`absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white ${getRoleBadgeColor()}`}>
                    {profile?.role ? profile.role[0].toUpperCase() : '?'}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {profile?.first_name} {profile?.last_name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    <Badge className={`mt-2 ${getRoleBadgeColor()} text-white`}>
                      {getRoleName()}
                    </Badge>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/" className="w-full cursor-pointer">
                    <Home className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="w-full cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/share" className="w-full cursor-pointer">
                    <Share2 className="mr-2 h-4 w-4" />
                    <span>Share Your Impact</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {/* Role Switcher Sub-Menu */}
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="w-full">
                    <SwitchCamera className="mr-2 h-4 w-4" />
                    <span>Switch Role</span>
                    {switchingRole && <Loader2 className="ml-auto h-3 w-3 animate-spin" />}
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent className="w-48">
                      <DropdownMenuItem
                        onClick={() => switchRole('donor')}
                        disabled={switchingRole || profile?.role === 'donor'}
                        className="cursor-pointer"
                      >
                        <span className="mr-2">🍽️</span>
                        <span>Food Donor</span>
                        {profile?.role === 'donor' && <Check className="ml-auto h-4 w-4" />}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => switchRole('ngo')}
                        disabled={switchingRole || profile?.role === 'ngo'}
                        className="cursor-pointer"
                      >
                        <span className="mr-2">🏢</span>
                        <span>NGO Partner</span>
                        {profile?.role === 'ngo' && <Check className="ml-auto h-4 w-4" />}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => switchRole('volunteer')}
                        disabled={switchingRole || profile?.role === 'volunteer'}
                        className="cursor-pointer"
                      >
                        <span className="mr-2">🚀</span>
                        <span>Volunteer</span>
                        {profile?.role === 'volunteer' && <Check className="ml-auto h-4 w-4" />}
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="default">Sign In</Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
