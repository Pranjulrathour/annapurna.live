import React, { useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

/**
 * This component applies additional dark mode styles to elements that can't be 
 * easily targeted with Tailwind classes. It injects a style tag with CSS overrides.
 */
export function DarkModeStyles() {
  const { theme } = useTheme();
  
  useEffect(() => {
    // Create or update the style tag
    let styleTag = document.getElementById('dark-mode-styles');
    
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = 'dark-mode-styles';
      document.head.appendChild(styleTag);
    }
    
    // Custom styles that are difficult to apply with Tailwind
    styleTag.innerHTML = `
      /* Set html and body background to pure black */
      html.dark,
      .dark body {
        background-color: #000000 !important;
      }
      
      /* Enhanced Scrollbars for Dark Mode */
      .dark ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      
      .dark ::-webkit-scrollbar-track {
        background: #0a0a0a; 
      }
      
      .dark ::-webkit-scrollbar-thumb {
        background: #333333;
        border-radius: 4px;
      }
      
      .dark ::-webkit-scrollbar-thumb:hover {
        background: hsl(var(--primary));
      }
      
      /* Placeholder Text Color */
      .dark input::placeholder, 
      .dark textarea::placeholder {
        color: hsl(var(--muted-foreground)) !important;
        opacity: 0.7;
      }
      
      /* Map Controls in Dark Mode */
      .dark .mapboxgl-ctrl-bottom-left,
      .dark .mapboxgl-ctrl-bottom-right,
      .dark .mapboxgl-ctrl-top-left,
      .dark .mapboxgl-ctrl-top-right {
        filter: invert(0.85) hue-rotate(180deg);
      }
      
      /* Enhanced Focus Styles */
      .dark *:focus-visible {
        outline-color: hsl(var(--primary)) !important;
      }
      
      /* Date Input Fields */
      .dark input[type="date"] {
        color-scheme: dark;
      }
      
      /* Selection Color */
      .dark ::selection {
        background-color: hsl(var(--primary) / 0.25);
        color: hsl(var(--primary-foreground));
      }
      
      /* Card shadow enhancements */
      .dark .shadow-md {
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2);
      }
      
      .dark .shadow-lg {
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.1);
      }
      
      /* Improved Button Hover Effects */
      .dark .hover\\:bg-primary\\/90:hover {
        background-color: hsl(var(--primary) / 0.8) !important;
      }
      
      /* Toast Refinements */
      .dark [data-sonner-toast] {
        background-color: hsl(var(--background)) !important;
        color: hsl(var(--foreground)) !important;
        border: 1px solid hsl(var(--border)) !important;
      }
    `;
    
    return () => {
      // Cleanup on unmount
      if (styleTag) {
        document.head.removeChild(styleTag);
      }
    };
  }, [theme]);
  
  return null; // This component doesn't render anything visible
}
