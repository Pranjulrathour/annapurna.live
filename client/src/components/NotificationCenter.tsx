import React, { useState } from 'react';
import { 
  Bell,
  Check,
  Trash2
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Notification } from '@/components/ui/notification';
import { Badge } from '@/components/ui/badge';
import { useNotifications } from '@/contexts/NotificationContext';
import { useLocation } from 'wouter';
import { formatDistanceToNow } from 'date-fns';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

export function NotificationCenter() {
  const { 
    notifications, 
    unreadCount, 
    loading,
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
  } = useNotifications();
  const [location, setLocation] = useLocation();
  const [open, setOpen] = useState(false);

  if (loading) {
    return (
      <Button variant="ghost" size="icon" className="relative">
        <Bell className="h-5 w-5" />
        <span className="sr-only">Loading notifications</span>
      </Button>
    );
  }
  
  const formatTime = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const handleNotificationClick = (notification: any) => {
    markAsRead(notification.id);
    
    // Navigate to the related entity if available
    if (notification.action_url) {
      setLocation(notification.action_url);
      setOpen(false);
    } else if (notification.related_entity_type && notification.related_entity_id) {
      // Navigate based on entity type
      switch (notification.related_entity_type) {
        case 'donation':
          setLocation(`/donation/${notification.related_entity_id}`);
          break;
        case 'profile':
          setLocation(`/profile/${notification.related_entity_id}`);
          break;
        default:
          break;
      }
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 min-w-[1.25rem] min-h-[1.25rem] flex items-center justify-center p-0 text-[0.6rem] font-bold"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
          <span className="sr-only">Open notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 md:w-96 p-0">
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <h3 className="font-semibold">Notifications</h3>
          {notifications.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs h-7 px-2"
              onClick={() => markAllAsRead()}
            >
              <Check className="h-3.5 w-3.5 mr-1" />
              Mark all as read
            </Button>
          )}
        </div>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread" className="relative">
              Unread
              {unreadCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 min-w-[1.25rem] min-h-[1.25rem] flex items-center justify-center p-0 text-[0.6rem] font-bold"
                >
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
          
          <ScrollArea className="h-[300px]">
            <TabsContent value="all" className="m-0">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                  <Bell className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No notifications yet</p>
                </div>
              ) : (
                <div className="grid gap-1 p-1">
                  {notifications.map(notification => (
                    <Notification
                      key={notification.id}
                      title={notification.title}
                      description={notification.description}
                      timestamp={formatTime(notification.timestamp)}
                      variant={notification.type as any}
                      unread={!notification.read}
                      onClick={() => handleNotificationClick(notification)}
                      onClose={() => deleteNotification(notification.id)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="unread" className="m-0">
              {unreadCount === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                  <Check className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No unread notifications</p>
                </div>
              ) : (
                <div className="grid gap-1 p-1">
                  {notifications
                    .filter(notification => !notification.read)
                    .map(notification => (
                      <Notification
                        key={notification.id}
                        title={notification.title}
                        description={notification.description}
                        timestamp={formatTime(notification.timestamp)}
                        variant={notification.type as any}
                        unread={true}
                        onClick={() => handleNotificationClick(notification)}
                        onClose={() => deleteNotification(notification.id)}
                      />
                    ))}
                </div>
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>
        
        {notifications.length > 0 && (
          <div className="border-t px-4 py-2 flex justify-end">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs h-7 px-2 text-destructive hover:text-destructive"
              onClick={() => {
                // This would typically show a confirmation dialog
                // For now, we'll just log a message
                console.log('Clear all notifications - add confirmation dialog');
              }}
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              Clear all
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
