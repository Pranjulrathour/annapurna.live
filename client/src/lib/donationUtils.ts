import { supabase } from './supabase';
import { useNotifications } from '@/contexts/NotificationContext';
import type { Donation } from '@/hooks/useDonations';
import type { Profile } from './supabase';

/**
 * Utility functions for donation-related operations
 */

/**
 * Sends a notification to a user when their donation status changes
 * @param donorId The ID of the donor
 * @param donationId The ID of the donation
 * @param status The new status of the donation
 * @param updatedBy The user who updated the status
 */
export const notifyDonationStatusChange = async (
  donorId: string,
  donationId: string,
  status: string,
  updatedBy?: {
    id: string;
    first_name?: string;
    last_name?: string;
    organization_name?: string;
    role?: string;
  }
) => {
  try {
    // Get donation details
    const { data: donation } = await supabase
      .from('donations')
      .select('food_type, quantity, unit')
      .eq('id', donationId)
      .single();
    
    if (!donation) return;
    
    const statusMessages = {
      claimed: {
        title: 'Your donation has been claimed',
        description: `Your donation of ${donation.quantity} ${donation.unit} of ${donation.food_type} has been claimed${updatedBy?.organization_name ? ` by ${updatedBy.organization_name}` : ''}${updatedBy?.role === 'volunteer' ? ' for pickup' : ''}`,
        type: 'info' as const
      },
      picked_up: {
        title: 'Your donation has been picked up',
        description: `Your donation of ${donation.quantity} ${donation.unit} of ${donation.food_type} has been picked up${updatedBy?.first_name ? ` by ${updatedBy.first_name}` : ''}`,
        type: 'info' as const
      },
      delivered: {
        title: 'Your donation has been delivered',
        description: `Your donation of ${donation.quantity} ${donation.unit} of ${donation.food_type} has been successfully delivered to those in need`,
        type: 'success' as const
      },
      cancelled: {
        title: 'Donation cancelled',
        description: `Your donation of ${donation.quantity} ${donation.unit} of ${donation.food_type} has been cancelled`,
        type: 'error' as const
      }
    };
    
    // Create notification in the database
    const message = statusMessages[status as keyof typeof statusMessages];
    if (!message) return;
    
    // Prepare notification data - only include fields that match the schema
    const notificationData = {
      user_id: donorId,
      title: message.title,
      description: message.description,
      type: message.type,
      read: false,
      // Note: timestamp field might be causing issues if it's automatically set
      // Let Supabase handle the timestamp with DEFAULT now()
      related_entity_id: donationId,
      related_entity_type: 'donation',
      action_url: `/donation/${donationId}`
    };
    
    console.log('Creating donation notification with data:', notificationData);
    
    const { data, error } = await supabase
      .from('notifications')
      .insert([notificationData]);
      
    if (error) {
      console.error('Detailed notification error:', error);
    } else {
      console.log('Notification created successfully:', data);
    }
    
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

/**
 * Notifies the NGO when a volunteer updates a donation status
 */
export const notifyNGOOfStatusChange = async (
  ngoId: string,
  donationId: string,
  status: string,
  updatedBy?: {
    id: string;
    first_name?: string;
    last_name?: string;
  }
) => {
  try {
    // Get donation details
    const { data: donation } = await supabase
      .from('donations')
      .select('food_type, quantity, unit')
      .eq('id', donationId)
      .single();
    
    if (!donation) return;
    
    const statusMessages = {
      picked_up: {
        title: 'Donation has been picked up',
        description: `${updatedBy?.first_name || 'A volunteer'} has picked up ${donation.quantity} ${donation.unit} of ${donation.food_type}`,
        type: 'info' as const
      },
      delivered: {
        title: 'Donation has been delivered',
        description: `${updatedBy?.first_name || 'A volunteer'} has successfully delivered the donation of ${donation.quantity} ${donation.unit} of ${donation.food_type}`,
        type: 'success' as const
      }
    };
    
    // Create notification in the database
    const message = statusMessages[status as keyof typeof statusMessages];
    if (!message) return;
    
    // Prepare notification data - only include fields that match the schema
    const notificationData = {
      user_id: ngoId,
      title: message.title,
      description: message.description,
      type: message.type,
      read: false,
      // Omit timestamp since it might be causing issues
      related_entity_id: donationId,
      related_entity_type: 'donation',
      action_url: `/donation/${donationId}`
    };
    
    console.log('Creating NGO notification with data:', notificationData);
    
    const { data, error } = await supabase
      .from('notifications')
      .insert([notificationData]);
      
    if (error) {
      console.error('Detailed NGO notification error:', error);
    } else {
      console.log('NGO notification created successfully:', data);
    }
    
  } catch (error) {
    console.error('Error sending notification to NGO:', error);
  }
};

/**
 * Gets distance between two coordinates using Haversine formula
 * @param lat1 Latitude of point 1
 * @param lon1 Longitude of point 1
 * @param lat2 Latitude of point 2
 * @param lon2 Longitude of point 2
 * @returns Distance in kilometers
 */
export const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  // Haversine formula for accurate Earth distance calculation
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in km
};

/**
 * Formats a donation's timeframe in a human-readable way
 * @param createdAt Creation date of the donation
 * @param expiryHours Hours until expiry
 */
export const formatTimeframe = (createdAt: string, expiryHours: number): string => {
  const created = new Date(createdAt);
  const expiry = new Date(created.getTime() + expiryHours * 60 * 60 * 1000);
  const now = new Date();
  
  // Calculate hours remaining
  const hoursRemaining = Math.max(0, Math.floor((expiry.getTime() - now.getTime()) / (60 * 60 * 1000)));
  
  if (hoursRemaining <= 0) {
    return 'Expired';
  }
  if (hoursRemaining < 1) {
    return 'Less than an hour left';
  }
  if (hoursRemaining === 1) {
    return '1 hour left';
  }
  return `${hoursRemaining} hours left`;
};
