import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { X, MapPin, Upload, Clock, Utensils, Heart } from 'lucide-react'
import { motion } from 'framer-motion'
import { useDonations } from '@/hooks/useDonations'
import { useToast } from '@/hooks/use-toast'

interface DonationFormProps {
  isOpen?: boolean
  onClose: () => void
  onSuccess?: () => void
}

export default function DonationForm({ isOpen = true, onClose, onSuccess }: DonationFormProps) {
  const [formData, setFormData] = useState({
    food_type: '',
    quantity: '',
    unit: 'servings',
    expiry_hours: '',
    location: '',
    description: '',
    pickup_instructions: '',
    contact_phone: '',
    dietary_info: [] as string[]
  })
  const [loading, setLoading] = useState(false)
  const [locationLoading, setLocationLoading] = useState(false)
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null)

  const { createDonation } = useDonations()
  const { toast } = useToast()

  // Get user's current location
  const getCurrentLocation = async () => {
    setLocationLoading(true)
    try {
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by this browser')
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        })
      })

      const { latitude, longitude } = position.coords
      setCoordinates({ lat: latitude, lng: longitude })

      // Use coordinates as location (simple format)
      setFormData(prev => ({
        ...prev,
        location: `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`
      }))

      toast({
        title: "Location detected!",
        description: "Your current location has been added to the donation.",
      })
    } catch (error: any) {
      toast({
        title: "Location Error",
        description: "Please enter your location manually.",
        variant: "destructive"
      })
    } finally {
      setLocationLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await createDonation({
        food_type: formData.food_type,
        quantity: parseInt(formData.quantity),
        unit: formData.unit,
        expiry_hours: parseInt(formData.expiry_hours),
        location: formData.location,
        latitude: coordinates?.lat,
        longitude: coordinates?.lng,
        description: formData.description,
        pickup_instructions: formData.pickup_instructions,
        contact_phone: formData.contact_phone,
        dietary_info: formData.dietary_info
      })

      // Reset form
      setFormData({
        food_type: '',
        quantity: '',
        unit: 'servings',
        expiry_hours: '',
        location: '',
        description: '',
        pickup_instructions: '',
        contact_phone: '',
        dietary_info: []
      })
      setCoordinates(null)
      
      // Call onSuccess if provided
      if (onSuccess) {
        onSuccess()
      } else {
        onClose()
      }
    } catch (error) {
      // Error is handled in the hook
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const toggleDietaryInfo = (info: string) => {
    setFormData(prev => ({
      ...prev,
      dietary_info: prev.dietary_info.includes(info)
        ? prev.dietary_info.filter(item => item !== info)
        : [...prev.dietary_info, info]
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <Card className="bg-white border-0 shadow-2xl">
          <CardHeader className="relative text-center pb-4">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Utensils className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-neutral">
              Share Your Food
            </CardTitle>
            <p className="text-gray-600">
              Help reduce food waste and feed those in need
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="food_type">Food Type</Label>
                  <Input
                    id="food_type"
                    placeholder="e.g., Biryani, Sandwiches, Fruits"
                    value={formData.food_type}
                    onChange={(e) => handleInputChange('food_type', e.target.value)}
                    required
                    className="border-gray-200 focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="quantity"
                      type="number"
                      placeholder="10"
                      value={formData.quantity}
                      onChange={(e) => handleInputChange('quantity', e.target.value)}
                      required
                      className="border-gray-200 focus:border-primary"
                    />
                    <Select value={formData.unit} onValueChange={(value) => handleInputChange('unit', value)}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="servings">Servings</SelectItem>
                        <SelectItem value="kg">Kg</SelectItem>
                        <SelectItem value="pieces">Pieces</SelectItem>
                        <SelectItem value="plates">Plates</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiry_hours">Available for pickup (hours)</Label>
                <Select value={formData.expiry_hours} onValueChange={(value) => handleInputChange('expiry_hours', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="How long is this food good for?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 hours</SelectItem>
                    <SelectItem value="4">4 hours</SelectItem>
                    <SelectItem value="6">6 hours</SelectItem>
                    <SelectItem value="12">12 hours</SelectItem>
                    <SelectItem value="24">24 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Pickup Location</Label>
                <div className="flex space-x-2">
                  <Input
                    id="location"
                    placeholder="Enter your address or use current location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    required
                    className="border-gray-200 focus:border-primary"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={getCurrentLocation}
                    disabled={locationLoading}
                    className="px-3"
                  >
                    {locationLoading ? (
                      <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                    ) : (
                      <MapPin className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Additional details about the food..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="border-gray-200 focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label>Dietary Information</Label>
                <div className="flex flex-wrap gap-2">
                  {['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Halal', 'Kosher'].map((diet) => (
                    <button
                      key={diet}
                      type="button"
                      onClick={() => toggleDietaryInfo(diet.toLowerCase().replace('-', '_'))}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        formData.dietary_info.includes(diet.toLowerCase().replace('-', '_'))
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {diet}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pickup_instructions">Pickup Instructions</Label>
                <Textarea
                  id="pickup_instructions"
                  placeholder="Gate number, contact person, specific timings..."
                  value={formData.pickup_instructions}
                  onChange={(e) => handleInputChange('pickup_instructions', e.target.value)}
                  className="border-gray-200 focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_phone">Contact Phone (Optional)</Label>
                <Input
                  id="contact_phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={formData.contact_phone}
                  onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                  className="border-gray-200 focus:border-primary"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-white py-6 text-lg font-semibold"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Creating Donation...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Heart className="h-5 w-5" />
                    <span>Share Food</span>
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}