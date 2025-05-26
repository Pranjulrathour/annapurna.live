import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";

interface InteractiveMapProps {
  donations?: any[];
}

export default function InteractiveMap({ donations = [] }: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // For MVP, we'll show a placeholder map
    // In production, this would integrate with React Leaflet
    if (mapRef.current) {
      mapRef.current.innerHTML = `
        <div class="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
          <div class="text-center">
            <div class="text-6xl mb-4">🗺️</div>
            <h3 class="text-xl font-semibold text-gray-700 mb-2">Interactive Map</h3>
            <p class="text-gray-600">Real-time donation locations would appear here</p>
            <div class="mt-4 flex justify-center space-x-4">
              <div class="flex items-center space-x-2">
                <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span class="text-sm">Available</span>
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span class="text-sm">Claimed</span>
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                <span class="text-sm">Delivered</span>
              </div>
            </div>
          </div>
        </div>
      `;
    }
  }, [donations]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Live Donation Map
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div ref={mapRef} />
        <p className="text-sm text-gray-600 mt-4 text-center">
          📍 Map integration with React Leaflet would show real donation locations with clickable markers
        </p>
      </CardContent>
    </Card>
  );
}
