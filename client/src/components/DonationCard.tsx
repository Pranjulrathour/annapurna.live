import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Users, ExternalLink } from "lucide-react";
import type { Donation } from "@/hooks/useDonations";
import { useLocation } from "wouter";

interface DonationCardProps {
  donation: Donation;
  showActions?: boolean;
  onClaim?: () => void;
  claimLoading?: boolean;
  isVolunteer?: boolean;
  onUpdate?: () => void;
  clickable?: boolean;
}

export default function DonationCard({ 
  donation, 
  showActions = false, 
  onClaim, 
  claimLoading = false,
  isVolunteer = false,
  clickable = true
}: DonationCardProps) {
  const [, setLocation] = useLocation();
  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted": return "bg-info text-info-foreground";
      case "claimed": return "bg-warning text-warning-foreground";
      case "picked_up": return "bg-secondary text-secondary-foreground";
      case "delivered": return "bg-success text-success-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getExpiryUrgency = (hours: number) => {
    if (hours <= 2) return "bg-destructive text-destructive-foreground";
    if (hours <= 6) return "bg-warning text-warning-foreground";
    return "bg-success text-success-foreground";
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const created = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours === 1) return "1 hour ago";
    return `${diffInHours} hours ago`;
  };

  const isClaimable = (status: string) => {
    if (isVolunteer) {
      return status === "submitted" || status === "claimed";
    }
    return status === "submitted";
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Only navigate if clicking on the card itself, not on buttons or interactive elements
    if (
      e.target instanceof Node && 
      !(e.target as Element).closest('button') &&
      clickable
    ) {
      setLocation(`/donation/${donation.id}`);
    }
  };

  return (
    <div 
      className={`border border-border rounded-lg p-4 bg-card text-card-foreground ${clickable ? 'cursor-pointer hover:shadow-md transition-shadow duration-200' : ''}`}
      onClick={handleCardClick}
    >
      <div className="flex items-start space-x-4">
        {donation.image_url ? (
          <img 
            src={donation.image_url} 
            alt={donation.food_type}
            className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">🍽️</span>
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-semibold text-neutral truncate pr-2">{donation.food_type}</h4>
            <div className="flex flex-col gap-1">
              <Badge className={`text-xs ${getStatusColor(donation.status)}`}>
                {donation.status.replace('_', ' ')}
              </Badge>
              <Badge className={`text-xs ${getExpiryUrgency(donation.expiry_hours)}`}>
                {donation.expiry_hours}h left
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>Serves {donation.quantity} {donation.unit || 'servings'}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{formatTimeAgo(donation.created_at)}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
            <MapPin className="h-4 w-4" />
            <span className="truncate">{donation.location}</span>
          </div>
          
          {showActions && (
            <div className="flex justify-between items-center mt-2">
              <Button
                variant="ghost" 
                size="sm" 
                className="text-primary hover:text-primary-dark"
                onClick={(e) => {
                  e.stopPropagation();
                  setLocation(`/donation/${donation.id}`);
                }}
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                View Details
              </Button>
              
              <div>
                {isClaimable(donation.status) ? (
                  <Button 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onClaim) onClaim();
                    }}
                    disabled={claimLoading}
                    className="bg-primary hover:bg-primary/90"
                  >
                    {claimLoading ? "Claiming..." : isVolunteer ? "Claim Pickup" : "Claim Donation"}
                  </Button>
                ) : (
                  <Badge variant="outline" className="capitalize">
                    {donation.status === "claimed" ? "Already claimed" : donation.status.replace('_', ' ')}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
