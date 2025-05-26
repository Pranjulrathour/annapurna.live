import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Database, Key, Check, AlertCircle } from 'lucide-react'

interface SupabaseConfigProps {
  onSave: (url: string, anonKey: string) => void
}

export default function SupabaseConfig({ onSave }: SupabaseConfigProps) {
  const [url, setUrl] = useState('')
  const [anonKey, setAnonKey] = useState('')
  const [isValid, setIsValid] = useState({ url: false, key: false })

  const validateUrl = (value: string) => {
    const urlPattern = /^https:\/\/[a-zA-Z0-9-]+\.supabase\.co$/
    return urlPattern.test(value)
  }

  const validateKey = (value: string) => {
    return value.length > 100 && value.startsWith('eyJ')
  }

  const handleUrlChange = (value: string) => {
    setUrl(value)
    setIsValid(prev => ({ ...prev, url: validateUrl(value) }))
  }

  const handleKeyChange = (value: string) => {
    setAnonKey(value)
    setIsValid(prev => ({ ...prev, key: validateKey(value) }))
  }

  const handleSave = () => {
    if (isValid.url && isValid.key) {
      onSave(url, anonKey)
    }
  }

  const canSave = isValid.url && isValid.key

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Database className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold text-white mb-2">
            Configure Supabase
          </CardTitle>
          <p className="text-gray-300">
            Enter your Supabase project credentials to enable authentication and database functionality
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="text-white font-medium">Supabase Project URL</Label>
            <div className="relative">
              <Input
                type="url"
                placeholder="https://your-project.supabase.co"
                value={url}
                onChange={(e) => handleUrlChange(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 pr-10"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {url && (isValid.url ? 
                  <Check className="h-5 w-5 text-green-400" /> : 
                  <AlertCircle className="h-5 w-5 text-red-400" />
                )}
              </div>
            </div>
            <p className="text-xs text-gray-400">
              Found in: Supabase Dashboard → Settings → API → Project URL
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-white font-medium">Supabase Anonymous Key</Label>
            <div className="relative">
              <Input
                type="password"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={anonKey}
                onChange={(e) => handleKeyChange(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 pr-10"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {anonKey && (isValid.key ? 
                  <Check className="h-5 w-5 text-green-400" /> : 
                  <AlertCircle className="h-5 w-5 text-red-400" />
                )}
              </div>
            </div>
            <p className="text-xs text-gray-400">
              Found in: Supabase Dashboard → Settings → API → Project API Keys → anon public
            </p>
          </div>

          <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Key className="h-5 w-5 text-blue-400 mt-0.5" />
              <div>
                <h4 className="text-blue-300 font-medium">How to get your credentials:</h4>
                <ol className="text-sm text-blue-200 mt-2 space-y-1 list-decimal list-inside">
                  <li>Go to your <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">Supabase Dashboard</a></li>
                  <li>Select your project</li>
                  <li>Navigate to Settings → API</li>
                  <li>Copy the Project URL and anon public key</li>
                </ol>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleSave}
            disabled={!canSave}
            className="w-full bg-primary hover:bg-primary/90 text-white py-6 text-lg font-semibold"
          >
            <Database className="mr-2 h-5 w-5" />
            Connect to Supabase
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}