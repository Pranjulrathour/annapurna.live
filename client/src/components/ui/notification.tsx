import React from 'react';
import { 
  Bell, 
  Info, 
  AlertCircle, 
  Check, 
  X 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const notificationVariants = cva(
  "relative w-full flex items-center gap-3 rounded-md border p-4",
  {
    variants: {
      variant: {
        default: "bg-background border-border",
        info: "dark:bg-info/10 dark:border-info/20 dark:text-info-foreground bg-blue-50 border-blue-200 text-blue-800",
        success: "dark:bg-success/10 dark:border-success/20 dark:text-success-foreground bg-green-50 border-green-200 text-green-800",
        warning: "dark:bg-warning/10 dark:border-warning/20 dark:text-warning-foreground bg-yellow-50 border-yellow-200 text-yellow-800",
        error: "dark:bg-destructive/10 dark:border-destructive/20 dark:text-destructive-foreground bg-red-50 border-red-200 text-red-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface NotificationProps extends React.HTMLAttributes<HTMLDivElement>, 
  VariantProps<typeof notificationVariants> {
  title: string;
  description?: string;
  timestamp?: string;
  unread?: boolean;
  onClose?: () => void;
  onClick?: () => void;
  icon?: React.ReactNode;
}

export function Notification({
  title,
  description,
  timestamp,
  variant,
  unread = true,
  onClose,
  onClick,
  icon,
  className,
  ...props
}: NotificationProps) {
  const getIcon = () => {
    if (icon) return icon;
    
    switch(variant) {
      case "info": return <Info className="h-5 w-5 text-blue-500" />;
      case "success": return <Check className="h-5 w-5 text-green-500" />;
      case "warning": return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case "error": return <AlertCircle className="h-5 w-5 text-red-500" />;
      default: return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div 
      className={cn(
        notificationVariants({ variant }),
        onClick ? "cursor-pointer hover:bg-opacity-80" : "",
        className
      )}
      onClick={onClick}
      {...props}
    >
      {unread && (
        <div className="absolute top-0 left-0 w-2 h-2 bg-primary rounded-full transform -translate-x-1/2 -translate-y-1/2" />
      )}
      <div className="flex-shrink-0">
        {getIcon()}
      </div>
      <div className="flex-grow min-w-0">
        <div className="font-medium">{title}</div>
        {description && <div className="text-sm opacity-80">{description}</div>}
        {timestamp && <div className="text-xs mt-1 opacity-60">{timestamp}</div>}
      </div>
      {onClose && (
        <button 
          className="flex-shrink-0 p-1 rounded-full hover:bg-gray-200 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
