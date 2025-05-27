import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Share, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ShareableCardProps {
  name: string;
  role: string;
  stats: {
    donationsCount?: number;
    mealsDonated?: number;
    pickupsCompleted?: number;
    peopleHelped?: number;
  };
}

export default function ShareableCard({ name, role, stats }: ShareableCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Function to get role-specific achievements
  const getRoleAchievement = () => {
    switch (role.toLowerCase()) {
      case 'donor':
        return `donated ${stats.donationsCount || 0} food items, providing meals for approximately ${stats.mealsDonated || 0} people`;
      case 'ngo':
        return `helped distribute food to ${stats.peopleHelped || 0} people in need`;
      case 'volunteer':
        return `completed ${stats.pickupsCompleted || 0} food pickups, helping meals reach those in need`;
      default:
        return 'made an impact in fighting food waste and hunger';
    }
  };
  
  // Function to get a motivational message based on user role
  const getMotivationalMessage = () => {
    switch (role.toLowerCase()) {
      case 'donor':
        return 'Every meal shared is a step toward ending hunger. Join me in fighting food waste!';
      case 'ngo':
        return 'Together, we can ensure no one goes hungry. Join our mission to redistribute surplus food!';
      case 'volunteer':
        return 'Be the bridge that connects surplus food to those who need it most. Volunteer today!';
      default:
        return 'Join Annapurna Nutrition to help reduce food waste and feed the hungry!';
    }
  };
  
  // Convert the card to image and share
  const generateAndShareImage = async () => {
    if (!cardRef.current) return;
    
    try {
      setIsGenerating(true);
      
      const canvas = await html2canvas(cardRef.current, {
        scale: 2, // Higher scale for better quality
        backgroundColor: null,
        logging: false,
        allowTaint: true,
        useCORS: true
      });
      
      // Convert the canvas to a data URL (png format)
      const dataUrl = canvas.toDataURL('image/png');
      
      // Try to use Web Share API if available
      if (navigator.share) {
        try {
          // Convert data URL to blob for sharing
          const blob = await (await fetch(dataUrl)).blob();
          const file = new File([blob], 'annapurna-contribution.png', { type: 'image/png' });
          
          await navigator.share({
            title: 'My Annapurna Nutrition Contribution',
            text: getMotivationalMessage(),
            files: [file]
          });
          
          toast({
            title: 'Shared successfully!',
            description: 'Thank you for spreading the word!'
          });
        } catch (error) {
          console.error('Error sharing:', error);
          // Fall back to download if sharing fails
          downloadImage(dataUrl);
        }
      } else {
        // Fall back to download if Web Share API is not available
        downloadImage(dataUrl);
      }
    } catch (error) {
      console.error('Error generating image:', error);
      toast({
        title: 'Error generating shareable image',
        description: 'Please try again later.',
        variant: 'destructive'
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Download the image (fallback method)
  const downloadImage = (dataUrl: string) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'annapurna-contribution.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: 'Image downloaded!',
      description: 'Share it on your favorite social platforms!'
    });
  };
  
  return (
    <div className="flex flex-col items-center gap-4">
      <div 
        ref={cardRef} 
        className="w-[350px] h-[500px] p-6 rounded-xl overflow-hidden relative bg-gradient-to-br from-primary to-accent text-white shadow-xl border border-accent/20"
      >
        {/* Card Header with Logo */}
        <div className="flex justify-center mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold">Annapurna Nutrition</div>
            <div className="text-sm opacity-80">Fighting Hunger, Reducing Waste</div>
          </div>
        </div>
        
        {/* Divider with Emoji */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="h-px bg-white/50 flex-1"></div>
          <div className="text-3xl">😊</div>
          <div className="h-px bg-white/50 flex-1"></div>
        </div>
        
        {/* User Info and Achievements */}
        <div className="text-center mb-8">
          <h3 className="text-xl font-bold mb-2">{name}</h3>
          <p className="text-md capitalize mb-4">{role}</p>
          <p className="text-sm mb-6">
            I've {getRoleAchievement()} through Annapurna Nutrition!
          </p>
        </div>
        
        {/* Motivational Message */}
        <div className="text-center italic">
          "{getMotivationalMessage()}"
        </div>
        
        {/* Footer with Website */}
        <div className="absolute bottom-6 w-full text-center left-0 text-sm opacity-80">
          www.annapurnanutrition.org
        </div>
        
        {/* Background Decorative Elements */}
        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-yellow-300/20"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-green-300/20"></div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button 
          className="gap-2" 
          onClick={generateAndShareImage} 
          disabled={isGenerating}
        >
          <Share className="h-4 w-4" />
          Share to Social Media
        </Button>
        <Button 
          variant="outline" 
          className="gap-2" 
          onClick={() => cardRef.current && generateAndShareImage()}
          disabled={isGenerating}
        >
          <Download className="h-4 w-4" />
          Download
        </Button>
      </div>
    </div>
  );
}
