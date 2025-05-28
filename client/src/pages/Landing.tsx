import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Sprout, Heart, HandHeart, Users, MapPin, TrendingUp, ArrowRight, Star, Globe, Shield } from "lucide-react";
import AuthModal from "@/components/AuthModal";
import { Logo } from "../components/Logo";

export default function Landing() {
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleGetStarted = () => {
    setShowAuthModal(true);
  };

  // Floating food cards data
  const floatingFoods = [
    { id: 1, name: "Biryani", emoji: "🍚", serves: 12, time: "2h left" },
    { id: 2, name: "Pizza", emoji: "🍕", serves: 8, time: "4h left" },
    { id: 3, name: "Dal Rice", emoji: "🍛", serves: 15, time: "1h left" },
    { id: 4, name: "Sandwiches", emoji: "🥪", serves: 6, time: "3h left" },
    { id: 5, name: "Fruits", emoji: "🍎", serves: 10, time: "6h left" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 bg-background/60 backdrop-blur-md border-b border-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Logo size="md" />
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#discover" className="text-gray-300 hover:text-white transition-colors">Discover</a>
              <a href="#impact" className="text-gray-300 hover:text-white transition-colors">Impact</a>
              <a href="#community" className="text-gray-300 hover:text-white transition-colors">Community</a>
              <a href="#about" className="text-gray-300 hover:text-white transition-colors">About</a>
            </div>
            <Button onClick={handleGetStarted} className="bg-primary hover:bg-primary/90 text-white">
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-0 pb-80 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center justify-start relative mt-0"
            >
              <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold text-white mb-0 z-10 drop-shadow-lg mt-14 md:mt-16 lg:mt-20">Welcome to</h1>
              <div className="transform scale-800 md:scale-1000 lg:scale-1200 hover:scale-1210 transition-transform duration-300 -mt-20 md:-mt-28 lg:-mt-36">
                <Logo size="xl" />
              </div>
              <div className="mt-24 md:mt-28 lg:mt-32 z-10 flex flex-col items-center">
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-2xl md:text-4xl font-semibold text-gray-300 mb-4 drop-shadow-md"
                >
                  Your Food Sharing Community
                </motion.h2>
              </div>
            </motion.div>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto mt-6"
            >
              Unleash your generosity and create connections with AI at Annapurna. Share your surplus food with friends and the world in this simple online platform where every meal meets art.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            >
              <Button 
                onClick={handleGetStarted}
                size="lg"
                className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl"
              >
                Share Food
              </Button>
              <Button 
                onClick={handleGetStarted}
                variant="outline"
                size="lg"
                className="border-white/30 hover:bg-white/10 px-8 py-4 text-lg font-semibold rounded-xl text-[#ffffff] bg-[#ab9947]"
              >
                Find Food <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>

            {/* Floating Food Cards - Hidden on Mobile */}
            <div className="relative mt-16 hidden md:block">
              {floatingFoods.map((food, index) => (
                <motion.div
                  key={food.id}
                  initial={{ opacity: 0, scale: 0.8, y: 50 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ 
                    duration: 0.8, 
                    delay: 0.8 + index * 0.1,
                    ease: "easeOut"
                  }}
                  className={`absolute bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 ${
                    index === 0 ? 'left-4 top-0 md:left-20' :
                    index === 1 ? 'right-4 top-12 md:right-32' :
                    index === 2 ? 'left-1/2 transform -translate-x-1/2 top-24' :
                    index === 3 ? 'left-8 bottom-4 md:left-40' :
                    'right-8 bottom-16 md:right-20'
                  }`}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-2">{food.emoji}</div>
                    <h4 className="text-white font-semibold text-sm">{food.name}</h4>
                    <p className="text-gray-300 text-xs">Serves {food.serves}</p>
                    <div className="flex items-center justify-center mt-2">
                      <div className="w-2 h-2 bg-secondary rounded-full mr-2"></div>
                      <span className="text-xs text-gray-400">{food.time}</span>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2">
                    <Heart className="h-4 w-4 text-gray-400 hover:text-red-400 cursor-pointer" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Happy Children Section */}
      <section className="py-20 bg-gradient-to-b from-gray-100 to-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-4xl font-bold text-neutral mb-4">Every Meal Brings Smiles</h2>
            <p className="text-xl text-gray-600">See the joy you create with every donation</p>
          </motion.div>
        </div>
        
        {/* First Row - Moving Right */}
        <div className="relative mb-8">
          <motion.div 
            animate={{ x: [0, -1920] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="flex gap-6 w-max"
          >
            {[
              "https://images.unsplash.com/photo-1599059813005-11265ba4b4ce?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              "https://images.unsplash.com/photo-1562709902-31c9a3b1ad5c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGZvb2QlMjBkb25hdGlvbnxlbnwwfHwwfHx8MA%3D%3D",
              "https://images.unsplash.com/photo-1708417144747-b03e02a2459f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGZvb2QlMjBkb25hdGlvbnxlbnwwfHwwfHx8MA%3D%3D",
              "https://images.unsplash.com/photo-1619410717591-92da0262985c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHBvb3IlMjBjaGlsZHJlbiUyMHNtaWxpbmd8ZW58MHx8MHx8fDA%3D",
              "https://images.unsplash.com/photo-1706025233736-4f9bbc53306c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHBvb3IlMjBjaGlsZHJlbiUyMHNtaWxpbmd8ZW58MHx8MHx8fDA%3D",
              "https://images.unsplash.com/flagged/photo-1555251255-e9a095d6eb9d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              "https://images.unsplash.com/photo-1599059813005-11265ba4b4ce?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              "https://images.unsplash.com/photo-1562709902-31c9a3b1ad5c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGZvb2QlMjBkb25hdGlvbnxlbnwwfHwwfHx8MA%3D%3D",
              "https://images.unsplash.com/photo-1708417144747-b03e02a2459f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGZvb2QlMjBkb25hdGlvbnxlbnwwfHwwfHx8MA%3D%3D",
              "https://images.unsplash.com/photo-1619410717591-92da0262985c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHBvb3IlMjBjaGlsZHJlbiUyMHNtaWxpbmd8ZW58MHx8MHx8fDA%3D"
            ].map((image, index) => (
              <motion.div
                key={`row1-${index}`}
                whileHover={{ scale: 1.05 }}
                className="flex-shrink-0 w-64 h-48 rounded-2xl overflow-hidden shadow-lg"
              >
                <img
                  src={image}
                  alt={`Happy child enjoying meal ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Second Row - Moving Left */}
        <div className="relative">
          <motion.div 
            animate={{ x: [-1920, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="flex gap-6 w-max"
          >
            {[
              "https://images.unsplash.com/photo-1710092784814-4a6f158913b8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGZvb2QlMjBkb25hdGlvbnxlbnwwfHwwfHx8MA%3D%3D",
              "https://images.unsplash.com/flagged/photo-1555251255-e9a095d6eb9d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              "https://images.unsplash.com/photo-1706025233736-4f9bbc53306c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHBvb3IlMjBjaGlsZHJlbiUyMHNtaWxpbmd8ZW58MHx8MHx8fDA%3D",
              "https://images.unsplash.com/photo-1599059813005-11265ba4b4ce?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              "https://images.unsplash.com/photo-1562709902-31c9a3b1ad5c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGZvb2QlMjBkb25hdGlvbnxlbnwwfHwwfHx8MA%3D%3D",
              "https://images.unsplash.com/photo-1708417144747-b03e02a2459f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGZvb2QlMjBkb25hdGlvbnxlbnwwfHwwfHx8MA%3D%3D",
              "https://images.unsplash.com/photo-1710092784814-4a6f158913b8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGZvb2QlMjBkb25hdGlvbnxlbnwwfHwwfHx8MA%3D%3D",
              "https://images.unsplash.com/flagged/photo-1555251255-e9a095d6eb9d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              "https://images.unsplash.com/photo-1706025233736-4f9bbc53306c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHBvb3IlMjBjaGlsZHJlbiUyMHNtaWxpbmd8ZW58MHx8MHx8fDA%3D",
              "https://images.unsplash.com/photo-1599059813005-11265ba4b4ce?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            ].map((image, index) => (
              <motion.div
                key={`row2-${index}`}
                whileHover={{ scale: 1.05 }}
                className="flex-shrink-0 w-64 h-48 rounded-2xl overflow-hidden shadow-lg"
              >
                <img
                  src={image}
                  alt={`Children sharing meals ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Impact Stats Section */}
      <section id="impact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-neutral mb-4">Creating Real Impact</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Every meal shared creates a ripple effect of positive change in our communities</p>
          </motion.div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { number: "25,847", label: "Meals Shared", icon: "🍽️", color: "text-primary" },
              { number: "1,245", label: "Active Heroes", icon: "🦸‍♀️", color: "text-secondary" },
              { number: "89", label: "Partner NGOs", icon: "🏢", color: "text-accent" },
              { number: "12", label: "Cities", icon: "🌍", color: "text-warning" }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">{stat.icon}</div>
                <div className={`text-4xl font-bold ${stat.color} mb-2`}>{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-neutral mb-4">How Annapurna Works</h2>
            <p className="text-xl text-gray-600">Three simple steps to make a difference</p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                title: "Share Your Food",
                description: "Upload photos of your surplus food, add details about quantity and pickup time. Every share matters!",
                icon: "📸",
                color: "bg-primary"
              },
              {
                step: "02", 
                title: "Connect Instantly",
                description: "Our AI matches your donation with nearby NGOs and volunteers for quick pickup and distribution.",
                icon: "🤝",
                color: "bg-secondary"
              },
              {
                step: "03",
                title: "Track Your Impact",
                description: "Watch your contribution feed families and build communities. See the lives you're changing in real-time.",
                icon: "📊",
                color: "bg-accent"
              }
            ].map((step, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="relative"
              >
                <Card className="p-8 h-full hover:shadow-xl transition-shadow duration-300 border-0 bg-white/70 backdrop-blur-sm">
                  <CardContent className="p-0">
                    <div className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center mb-6 text-white font-bold text-xl`}>
                      {step.step}
                    </div>
                    <div className="text-4xl mb-4">{step.icon}</div>
                    <h3 className="text-xl font-bold text-neutral mb-4">{step.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{step.description}</p>
                  </CardContent>
                </Card>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-6 transform -translate-y-1/2">
                    <ArrowRight className="h-6 w-6 text-gray-400" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Testimonials */}
      <section id="community" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-neutral mb-4">Stories from Our Community</h2>
            <p className="text-xl text-gray-600">Real people, real impact, real change</p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Priya Sharma",
                role: "Food Donor",
                image: "👩‍🍳",
                quote: "I used to feel guilty throwing away leftover food from my restaurant. Now with Annapurna, every surplus meal finds a family in need. It's beautiful!",
                rating: 5
              },
              {
                name: "Helping Hands NGO",
                role: "Partner Organization", 
                image: "🏢",
                quote: "Annapurna has revolutionized how we source food for our shelter. The real-time notifications help us respond quickly to families in crisis.",
                rating: 5
              },
              {
                name: "Rahul Verma",
                role: "Volunteer",
                image: "🚀",
                quote: "Being a volunteer on Annapurna gives me purpose. Every pickup I make feeds 10-15 people. The impact tracking keeps me motivated!",
                rating: 5
              }
            ].map((testimonial, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <Card className="p-6 h-full hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-0">
                    <div className="flex items-center mb-4">
                      <div className="text-4xl mr-4">{testimonial.image}</div>
                      <div>
                        <h4 className="font-bold text-neutral">{testimonial.name}</h4>
                        <p className="text-sm text-gray-600">{testimonial.role}</p>
                      </div>
                    </div>
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-700 italic">"{testimonial.quote}"</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold mb-6">Ready to Change Lives?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of food heroes who are making a difference one meal at a time. Together, we can build a hunger-free world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handleGetStarted}
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg font-semibold rounded-xl"
              >
                <Users className="mr-2 h-5 w-5" />
                Join Annapurna Today
              </Button>
              <Button 
                onClick={handleGetStarted}
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold rounded-xl"
              >
                <Globe className="mr-2 h-5 w-5" />
                Explore Community
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">How Annapurna Works</h2>
            <p className="text-xl text-muted-foreground">Simple steps to make a big impact</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="card-hover">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Donate Food</h3>
                <p className="text-muted-foreground">List your surplus food with photos and pickup details. Help reduce waste while feeding the hungry.</p>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Find & Claim</h3>
                <p className="text-muted-foreground">NGOs and volunteers discover nearby donations on our interactive map and claim pickups.</p>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-success" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Track Impact</h3>
                <p className="text-muted-foreground">Monitor your contributions with real-time updates and see the lives you're changing.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-muted/50 text-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join our community of changemakers and help us build a hunger-free world.
          </p>
          <Button 
            onClick={handleGetStarted}
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-white"
          >
            <Users className="mr-2 h-4 w-4" />
            Join Annapurna Today
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/30 text-foreground py-8 border-t border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Logo size="md" className="transform scale-110" />
            </div>
            <p className="text-muted-foreground">© 2024 Annapurna. Made with ❤️ for fighting hunger.</p>
          </div>
        </div>
      </footer>

      {/* Authentication Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  );
}
