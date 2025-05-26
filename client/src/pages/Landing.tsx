import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sprout, Heart, HandHeart, Users, MapPin, TrendingUp } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Sprout className="text-white h-5 w-5" />
              </div>
              <span className="ml-2 text-xl font-semibold text-neutral">Annapurna</span>
            </div>
            <Button onClick={handleLogin} className="bg-primary hover:bg-primary/90">
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="gradient-bg py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Turning Food Waste into
                <span className="text-yellow-300"> Hope</span>
              </h1>
              <p className="text-xl mb-8 text-teal-100">
                Connect donors with NGOs and volunteers to reduce food wastage and feed those in need. Every meal matters.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={handleLogin}
                  className="bg-secondary hover:bg-secondary/90 text-white"
                  size="lg"
                >
                  <Heart className="mr-2 h-4 w-4" />
                  Start Donating
                </Button>
                <Button 
                  onClick={handleLogin}
                  variant="outline" 
                  className="bg-white text-primary hover:bg-gray-100 border-white"
                  size="lg"
                >
                  <HandHeart className="mr-2 h-4 w-4" />
                  Join as Volunteer
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 text-center">
                <div className="text-6xl mb-4">🌾</div>
                <h3 className="text-xl font-semibold text-white mb-2">Real-time Impact</h3>
                <p className="text-teal-100">Join thousands making a difference</p>
                <div className="mt-6 flex items-center justify-center space-x-3">
                  <div className="w-3 h-3 bg-yellow-300 rounded-full status-pulse"></div>
                  <span className="text-sm text-white">Live donations happening now</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">12,847</div>
              <div className="text-gray-600">Meals Donated</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary mb-2">892</div>
              <div className="text-gray-600">Active Volunteers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-success mb-2">156</div>
              <div className="text-gray-600">Partner NGOs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-warning mb-2">23</div>
              <div className="text-gray-600">Cities Covered</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral mb-4">How Annapurna Works</h2>
            <p className="text-xl text-gray-600">Simple steps to make a big impact</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="card-hover">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-neutral mb-2">Donate Food</h3>
                <p className="text-gray-600">List your surplus food with photos and pickup details. Help reduce waste while feeding the hungry.</p>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold text-neutral mb-2">Find & Claim</h3>
                <p className="text-gray-600">NGOs and volunteers discover nearby donations on our interactive map and claim pickups.</p>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-success" />
                </div>
                <h3 className="text-xl font-semibold text-neutral mb-2">Track Impact</h3>
                <p className="text-gray-600">Monitor your contributions with real-time updates and see the lives you're changing.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-neutral text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join our community of changemakers and help us build a hunger-free world.
          </p>
          <Button 
            onClick={handleLogin}
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-white"
          >
            <Users className="mr-2 h-4 w-4" />
            Join Annapurna Today
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Sprout className="text-white h-5 w-5" />
              </div>
              <span className="ml-2 text-xl font-semibold">Annapurna</span>
            </div>
            <p className="text-gray-300">© 2024 Annapurna. Made with ❤️ for fighting hunger.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
