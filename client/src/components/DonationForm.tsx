import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const donationSchema = z.object({
  foodType: z.string().min(1, "Food type is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  expiryHours: z.number().min(1, "Expiry time must be at least 1 hour"),
  location: z.string().min(1, "Location is required"),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  imageUrl: z.string().optional(),
});

type DonationFormData = z.infer<typeof donationSchema>;

interface DonationFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function DonationForm({ onClose, onSuccess }: DonationFormProps) {
  const [imagePreview, setImagePreview] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<DonationFormData>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      quantity: 1,
      expiryHours: 6,
    },
  });

  const createDonationMutation = useMutation({
    mutationFn: (data: DonationFormData) => 
      apiRequest("POST", "/api/donations", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/donations"] });
      toast({
        title: "Donation created successfully!",
        description: "Your donation is now available for pickup.",
      });
      onSuccess();
    },
    onError: () => {
      toast({
        title: "Failed to create donation",
        description: "Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setValue("imageUrl", result);
      };
      reader.readAsDataURL(file);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setValue("latitude", position.coords.latitude.toString());
          setValue("longitude", position.coords.longitude.toString());
          toast({
            title: "Location captured",
            description: "Your current location has been added to the donation.",
          });
        },
        () => {
          toast({
            title: "Location access denied",
            description: "Please enter your address manually.",
            variant: "destructive",
          });
        }
      );
    }
  };

  const onSubmit = (data: DonationFormData) => {
    createDonationMutation.mutate(data);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-screen overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold text-neutral">Create New Donation</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="foodType">Food Type *</Label>
              <Input
                id="foodType"
                placeholder="e.g., Home-cooked Dal & Rice"
                {...register("foodType")}
              />
              {errors.foodType && (
                <p className="text-sm text-red-500 mt-1">{errors.foodType.message}</p>
              )}
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quantity">Quantity (Serves) *</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  {...register("quantity", { valueAsNumber: true })}
                />
                {errors.quantity && (
                  <p className="text-sm text-red-500 mt-1">{errors.quantity.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="expiryHours">Expires In (Hours) *</Label>
                <Input
                  id="expiryHours"
                  type="number"
                  min="1"
                  {...register("expiryHours", { valueAsNumber: true })}
                />
                {errors.expiryHours && (
                  <p className="text-sm text-red-500 mt-1">{errors.expiryHours.message}</p>
                )}
              </div>
            </div>
            
            <div>
              <Label htmlFor="location">Pickup Location *</Label>
              <div className="flex gap-2">
                <Input
                  id="location"
                  placeholder="Enter your address"
                  className="flex-1"
                  {...register("location")}
                />
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={getCurrentLocation}
                >
                  Use Current Location
                </Button>
              </div>
              {errors.location && (
                <p className="text-sm text-red-500 mt-1">{errors.location.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="image">Food Photos</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                {imagePreview ? (
                  <div className="space-y-4">
                    <img 
                      src={imagePreview} 
                      alt="Food preview" 
                      className="mx-auto h-32 w-32 object-cover rounded-lg"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setImagePreview("");
                        setValue("imageUrl", "");
                      }}
                    >
                      Remove Image
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                    <p className="text-gray-600">Click to upload or drag and drop</p>
                    <p className="text-sm text-gray-500">PNG, JPG up to 5MB</p>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="imageUpload"
                    />
                    <Label htmlFor="imageUpload" className="cursor-pointer">
                      <Button type="button" variant="outline" className="mt-2">
                        Choose File
                      </Button>
                    </Label>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex space-x-4">
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1 bg-primary hover:bg-primary/90"
                disabled={createDonationMutation.isPending}
              >
                {createDonationMutation.isPending ? "Creating..." : "Submit Donation"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
