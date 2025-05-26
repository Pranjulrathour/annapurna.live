import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Users } from "lucide-react";
import type { DonationWithDetails } from "@/lib/types";

interface DonationCardProps {
  donation: DonationWithDetails;
  showActions?: boolean;
  onClaim?: () => void;
  claimLoading?: boolean;
  isVolunteer?: boolean;
}

export default function DonationCard({ 
  donation, 
  showActions = false, 
  onClaim, 
  claimLoading = false,
  isVolunteer = false
}: DonationCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted": return "bg-blue-500 text-white";
      case "claimed": return "bg-yellow-500 text-white";
      case "picked_up": return "bg-orange-500 text-white";
      case "delivered": return "bg-green-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const getExpiryUrgency = (hours: number) => {
    if (hours <= 2) return "bg-red-500 text-white";
    if (hours <= 6) return "bg-yellow-500 text-white";
    return "bg-green-500 text-white";
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

  return (
    <div className="border border-gray-200 rounded-lg p-4 card-hover bg-white">
      <div className="flex items-start space-x-4">
        {donation.imageUrl ? (
          <img 
            src={donation.imageUrl} 
            alt={donation.foodType}
            className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">🍽️</span>
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-semibold text-neutral truncate pr-2">{donation.foodType}</h4>
            <div className="flex flex-col gap-1">
              <Badge className={`text-xs ${getStatusColor(donation.status)}`}>
                {donation.status.replace('_', ' ')}
              </Badge>
              <Badge className={`text-xs ${getExpiryUrgency(donation.expiryHours)}`}>
                {donation.expiryHours}h left
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>Serves {donation.quantity}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{formatTimeAgo(donation.createdAt)}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
            <MapPin className="h-4 w-4" />
            <span className="truncate">{donation.location}</span>
          </div>
          
          {showActions && (
            <div className="flex justify-end">
              {isClaimable(donation.status) ? (
                <Button 
                  size="sm"
                  onClick={onClaim}
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
          )}
        </div>
      </div>
    </div>
  );
}
