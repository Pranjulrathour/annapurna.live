import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { X, User, Mail, Lock, UserCheck } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'
// We'll dynamically import syncUserRole from roleUtils when needed

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'donor' as 'donor' | 'ngo' | 'volunteer'
  })

  const { signIn, signUp } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isSignUp) {
        // Validate password
        if (formData.password.length < 6) {
          throw new Error('Password must be at least 6 characters long')
        }
        
        // Validate that a role is selected
        if (!formData.role) {
          throw new Error('Please select a role to continue')
        }

        console.log('[AuthModal] Signing up with role:', formData.role)
        
        // Import utilities needed for better registration
        const { updateUserRole } = await import('@/utils/roleUtils')
        
        // Register the user
        const { error, data } = await signUp(formData.email, formData.password, {
          first_name: formData.firstName,
          last_name: formData.lastName,
          role: formData.role,
          verified: false
        })

        if (error) throw error
        
        // Ensure role is set correctly for the new user
        if (data?.user) {
          // Save role to localStorage as a backup mechanism
          localStorage.setItem('annapurna_role', formData.role)
          localStorage.setItem('annapurna_role_timestamp', Date.now().toString())
          
          // Double-check role is set correctly in both auth and profile
          const result = await updateUserRole(data.user.id, formData.role, 'auth-modal-signup')
          
          if (!result.success) {
            console.warn('[AuthModal] Warning: Role might not be set correctly:', result.error)
          }
        }

        toast({
          title: "Welcome to Annapurna!",
          description: "Your account has been created successfully. Please check your email to verify your account.",
        })
        
        // Auto-switch to sign in mode after successful registration
        setIsSignUp(false)
        // Remember the selected role for login
        const selectedRole = formData.role
        setFormData(prev => ({
          ...prev,
          firstName: '',
          lastName: '',
          role: selectedRole, // Keep the selected role for sign in
          // Keep the email for convenience
          // Clear password for security
          password: ''
        }))
        
        // Don't close modal, let user sign in
        return
      } else {
        // Sign in flow (keeping this part unchanged as it's working properly)
        console.log('[AuthModal] Signing in with role preference:', formData.role)
        
        // 1. First authenticate the user
        const { error, data } = await signIn(formData.email, formData.password)
        if (error) throw error
        
        // 2. After successful login, forcefully set the selected role if one is specified
        if (data?.user && formData.role) {
          try {
            // Import utilities needed for role management
            const { updateUserRole } = await import('@/utils/roleUtils')
            
            // Save the role to localStorage as a backup mechanism
            localStorage.setItem('annapurna_role', formData.role)
            localStorage.setItem('annapurna_role_timestamp', Date.now().toString())
            
            // Force update the role to match what was selected in the form
            console.log('[AuthModal] Explicitly setting user role to:', formData.role)
            const result = await updateUserRole(data.user.id, formData.role, 'auth-modal-login')
            
            if (!result.success) {
              console.error('[AuthModal] Failed to set role:', result.error)
            } else {
              console.log('[AuthModal] Role successfully set to:', formData.role)
            }
            
            // Redirect with role parameter to ensure correct dashboard loads
            // This is more reliable than just reloading the page
            window.location.href = `/?role=${formData.role}&forcedRole=true`
            return
          } catch (roleError) {
            console.error('[AuthModal] Error setting role during login:', roleError)
          }
        }

        toast({
          title: "Welcome back!",
          description: "You've successfully signed in to Annapurna.",
        })
        
        // Close modal only on successful sign in
        onClose()
      }
    } catch (error: any) {
      console.error('Auth error:', error)
      
      // Provide more user-friendly error messages
      let errorMessage = "Something went wrong. Please try again."
      
      if (error.message) {
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = "Invalid email or password. Please try again."
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = "Please verify your email before signing in."
        } else if (error.message.includes('already exists')) {
          errorMessage = error.message
          // Switch to sign in mode if user already exists
          setIsSignUp(false)
        } else {
          errorMessage = error.message
        }
      }
      
      toast({
        title: "Authentication Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/40 backdrop-blur-md p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-md bg-card text-card-foreground rounded-xl shadow-lg border border-border overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="border-none shadow-none bg-transparent">
              <CardHeader className="border-b border-border/40 text-center pb-6">
                <button
                  onClick={onClose}
                  className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
                <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <User className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-neutral">
                  {isSignUp ? 'Join Annapurna' : 'Welcome Back'}
                </CardTitle>
                <p className="text-gray-600">
                  {isSignUp 
                    ? 'Create your account to start making a difference' 
                    : 'Sign in to continue your impact journey'
                  }
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {isSignUp && (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          type="text"
                          placeholder="John"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          required={isSignUp}
                          className="pl-10 bg-card border-border focus:border-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          type="text"
                          placeholder="Doe"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          required={isSignUp}
                          className="pl-10 bg-card border-border focus:border-primary"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                        className="pl-10 bg-card border-border focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        required
                        className="pl-10 bg-card border-border focus:border-primary"
                      />
                    </div>
                  </div>

                  {/* Always show role selection for both signup and login */}
                  <div className="space-y-2">
                    <Label htmlFor="role">{isSignUp ? 'I want to join as' : 'Login as'}</Label>
                    <Select value={formData.role} onValueChange={(value: any) => handleInputChange('role', value)}>
                      <SelectTrigger className="border-border focus:border-primary">
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="donor">
                          <div className="flex items-center space-x-2">
                            <span>🍽️</span>
                            <span>Food Donor</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="ngo">
                          <div className="flex items-center space-x-2">
                            <span>🏢</span>
                            <span>NGO Partner</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="volunteer">
                          <div className="flex items-center space-x-2">
                            <span>🚀</span>
                            <span>Volunteer</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-white py-6 text-lg font-semibold"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>{isSignUp ? 'Creating Account...' : 'Signing In...'}</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <UserCheck className="h-5 w-5" />
                        <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                      </div>
                    )}
                  </Button>
                </form>

                <div className="text-center pt-4">
                  <p className="text-sm text-muted-foreground">
                    {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                    <button
                      onClick={() => setIsSignUp(!isSignUp)}
                      className="text-primary hover:text-primary/80 font-semibold transition-colors"
                    >
                      {isSignUp ? 'Sign In' : 'Sign Up'}
                    </button>
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}