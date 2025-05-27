import React from 'react';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  User 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface DonationStatusProps {
  status: 'submitted' | 'claimed' | 'picked_up' | 'delivered' | 'cancelled';
  createdAt: string;
  claimedAt?: string;
  pickedUpAt?: string;
  deliveredAt?: string;
  claimedBy?: {
    name: string;
    role: 'ngo' | 'volunteer';
    organizationName?: string;
  };
  className?: string;
}

export function DonationStatus({
  status,
  createdAt,
  claimedAt,
  pickedUpAt,
  deliveredAt,
  claimedBy,
  className
}: DonationStatusProps) {
  const steps = [
    { 
      id: 'submitted', 
      name: 'Submitted', 
      icon: <Package className="h-6 w-6" />, 
      date: createdAt,
      description: 'Donation is available for pickup'
    },
    { 
      id: 'claimed', 
      name: 'Claimed', 
      icon: <User className="h-6 w-6" />, 
      date: claimedAt,
      description: claimedBy 
        ? `Claimed by ${claimedBy.role === 'ngo' ? claimedBy.organizationName || claimedBy.name : claimedBy.name}`
        : 'Donation has been claimed'
    },
    { 
      id: 'picked_up', 
      name: 'Picked Up', 
      icon: <Truck className="h-6 w-6" />, 
      date: pickedUpAt,
      description: 'Food is on the way'
    },
    { 
      id: 'delivered', 
      name: 'Delivered', 
      icon: <CheckCircle2 className="h-6 w-6" />, 
      date: deliveredAt,
      description: 'Successfully delivered'
    }
  ];

  // Find the current step index
  const currentStepIndex = steps.findIndex(step => step.id === status);
  const isComplete = status === 'delivered';
  const isCancelled = status === 'cancelled';
  
  const formatTime = (dateString?: string) => {
    if (!dateString) return '';
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return 'Invalid date';
    }
  };

  if (isCancelled) {
    return (
      <div className={cn("bg-red-50 border border-red-200 rounded-md p-4", className)}>
        <div className="flex items-center text-red-500 mb-2">
          <Clock className="h-5 w-5 mr-2" />
          <span className="font-medium">Donation Cancelled</span>
        </div>
        <p className="text-red-700 text-sm">This donation is no longer available.</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="relative">
        <div 
          className="absolute inset-0 flex items-center"
          aria-hidden="true"
        >
          <div className="h-0.5 w-full bg-gray-200">
            {/* Progress bar */}
            <div 
              className={cn(
                "h-0.5 bg-primary transition-all duration-500 ease-in-out",
                isComplete ? "w-full" : `w-${currentStepIndex * 33}%`
              )}
            ></div>
          </div>
        </div>
        
        {/* Timeline steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const isActive = index <= currentStepIndex;
            const isPending = index === currentStepIndex + 1;
            return (
              <div 
                key={step.id} 
                className={cn(
                  "flex flex-col items-center",
                  isActive ? "text-primary" : isPending ? "text-gray-500" : "text-gray-300"
                )}
              >
                <div 
                  className={cn(
                    "rounded-full p-2 transition-colors duration-200",
                    isActive ? "bg-primary text-white" : "bg-gray-100 text-gray-400"
                  )}
                >
                  {step.icon}
                </div>
                <div className="mt-2 text-sm font-medium">{step.name}</div>
                {step.date && isActive && (
                  <div className="mt-1 text-xs text-gray-500">{formatTime(step.date)}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Current step description */}
      {currentStepIndex >= 0 && (
        <div className="bg-gray-50 border border-gray-100 rounded-md p-4 mt-4">
          <p className="text-sm text-gray-600">
            {steps[currentStepIndex].description}
          </p>
          {claimedBy && currentStepIndex >= 1 && (
            <div className="mt-2 text-xs text-gray-500 flex items-center">
              <User className="h-3 w-3 mr-1" />
              <span>
                {claimedBy.role === 'ngo' 
                  ? `Claimed by ${claimedBy.organizationName || claimedBy.name} (NGO)`
                  : `Volunteer: ${claimedBy.name}`
                }
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
