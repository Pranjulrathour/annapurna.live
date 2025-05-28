import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion, useScroll, useTransform } from "framer-motion";
import { Heart, HandHeart, Users, MapPin, ArrowRight, Star, Globe, Clock, Leaf, Award, Coffee, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import AuthModal from "@/components/AuthModal";
import { Logo } from "../components/Logo";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


export default function Landing() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  
  // Refs for scroll animations
  const impactRef = useRef(null);
  const mainRef = useRef(null);
  
  // Scroll animations
  const { scrollYProgress } = useScroll({
    target: mainRef,
    offset: ["start start", "end end"]
  });
  
  const bgOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.7]);

  const handleGetStarted = () => {
    setShowAuthModal(true);
  };

  useEffect(() => {
    // Testimonial auto-rotation
    const interval = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Floating food cards data with enhanced details
  const floatingFoods = [
    { id: 1, name: "Biryani Feast", emoji: "🍚", serves: 12, time: "2h left", tags: ["Vegetarian", "Hot"] },
    { id: 2, name: "Pizza Party", emoji: "🍕", serves: 8, time: "4h left", tags: ["Italian", "Fresh"] },
    { id: 3, name: "Dal Tadka & Rice", emoji: "🍛", serves: 15, time: "1h left", tags: ["Vegan", "Spicy"] },
    { id: 4, name: "Gourmet Sandwiches", emoji: "🥪", serves: 6, time: "3h left", tags: ["Snack", "Quick"] },
    { id: 5, name: "Seasonal Fruits", emoji: "🍎", serves: 10, time: "6h left", tags: ["Healthy", "Sweet"] },
  ];

  return (
    <div ref={mainRef} className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Elements - Enhanced with motion */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ opacity: bgOpacity }}
      >
        {/* Abstract shapes */}
        <motion.div 
          className="absolute top-10 left-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px]"
          animate={{ x: [0, 20, 0], y: [0, 15, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[120px]"
          animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-indigo-500/10 rounded-full blur-[150px]"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Grain overlay for texture */}
        <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]"></div>
      </motion.div>

      {/* Navigation - Modern Glassmorphism */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <motion.div 
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Logo size="md" />
              <Badge className="ml-2 bg-primary/20 text-primary border-primary/30 font-bold">
                BETA
              </Badge>
            </motion.div>
            
            <div className="hidden md:flex items-center space-x-1">
              {['Discover', 'Impact', 'Community', 'About'].map((item, index) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="relative px-4 py-2 mx-1 text-gray-200 rounded-full hover:text-white hover:bg-white/10 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                >
                  {item}
                </motion.a>
              ))}
            </div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
            >
              <Button 
                onClick={handleGetStarted} 
                className="bg-primary hover:bg-primary/90 text-white rounded-full px-6 font-medium"
                size="lg"
              >
                Get Started
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section - Enhanced with parallax effects */}
      <section className="relative z-10 pt-0 pb-40 min-h-screen overflow-hidden bg-gradient-to-br from-black to-slate-950">
        {/* Floating particles in background */}
        <div className="absolute inset-0 z-0 opacity-60">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className={`absolute rounded-full bg-white/20 ${i % 2 === 0 ? 'h-2 w-2' : 'h-3 w-3'}`}
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -15, 0],
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{
                duration: 3 + Math.random() * 5,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2 }}
              className="flex flex-col items-center justify-start relative mt-0"
            >
              {/* Hero heading with glow effect */}
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-7xl md:text-8xl lg:text-9xl font-bold text-white mb-0 z-10 drop-shadow-lg mt-14 md:mt-16 lg:mt-20 tracking-tight"
                style={{ textShadow: '0 0 40px rgba(255,255,255,0.2)' }}
              >
                Welcome to
              </motion.h1>
              
              {/* Logo with floating animation */}
              <motion.div 
                className="transform scale-800 md:scale-1000 lg:scale-1200 hover:scale-1210 transition-transform duration-300 -mt-20 md:-mt-28 lg:-mt-36"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                whileHover={{ scale: 1.05 }}
              >
                <Logo size="xl" />
              </motion.div>
              
              {/* Subheading preserved with enhanced styling */}
              <div className="mt-0 md:mt-0 lg:mt-0 -mt-16 md:-mt-24 lg:-mt-32 z-10 flex flex-col items-center">
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-2xl md:text-4xl font-semibold text-gray-200 mb-4 drop-shadow-xl"
                  style={{ textShadow: '0 0 20px rgba(255,255,255,0.2)' }}
                >
                  Your Food Sharing Community
                </motion.h2>
              </div>
            </motion.div>
            
            {/* Description with highlight color for key phrases */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto mt-6 leading-relaxed"
            >
              Unleash your <span className="text-primary font-medium">generosity</span> and create <span className="text-secondary font-medium">connections</span> with AI at Annapurna. Share your surplus food with friends and the world in this simple online platform where every meal meets art.
            </motion.p>
            
            {/* Call to action buttons with enhanced styling */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-5 justify-center mb-16"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  onClick={handleGetStarted}
                  size="lg"
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg shadow-amber-700/20"
                >
                  <HandHeart className="mr-2 h-5 w-5" />
                  Share Food
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  onClick={handleGetStarted}
                  variant="outline"
                  size="lg"
                  className="border-white/30 hover:bg-white/10 px-8 py-6 text-lg font-semibold rounded-xl text-white bg-transparent backdrop-blur-sm shadow-lg shadow-white/5"
                >
                  Find Food <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </motion.div>

            {/* Floating Food Cards - Enhanced with interactive elements and improved positioning */}
            <div className="relative mt-16 hidden md:block h-[32rem] mx-auto max-w-6xl">
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
                  className={`absolute bg-black/20 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-xl shadow-black/5 w-64 ${
                    // Position cards in a pentagon-like formation with plenty of spacing
                    index === 0 ? 'left-10 top-10' :
                    index === 1 ? 'right-10 top-10' :
                    index === 2 ? 'left-[calc(50%-8rem)] top-[8rem]' :
                    index === 3 ? 'left-24 bottom-20' :
                    'right-24 bottom-20'
                  }`}
                  whileHover={{ scale: 1.05, y: -5, rotateZ: index % 2 === 0 ? 2 : -2 }}
                  drag
                  dragConstraints={{
                    top: -50,
                    left: -50,
                    right: 50,
                    bottom: 50,
                  }}
                  dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
                  dragElastic={0.5}
                >
                  <div className="text-center relative z-10">
                    {/* Food emoji with subtle animation */}
                    <motion.div 
                      className="text-5xl mb-3"
                      animate={{ rotateZ: [0, 10, 0, -10, 0] }}
                      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      {food.emoji}
                    </motion.div>
                    
                    {/* Food name with glow */}
                    <h4 className="text-white font-semibold text-base mb-1">{food.name}</h4>
                    
                    {/* Servings with icon */}
                    <div className="flex items-center justify-center space-x-1 mb-2">
                      <Users className="h-3 w-3 text-primary/80" />
                      <p className="text-gray-300 text-xs">Serves {food.serves}</p>
                    </div>
                    
                    {/* Time remaining with pulsing effect */}
                    <div className="flex items-center justify-center mt-2">
                      <motion.div 
                        className="w-2 h-2 bg-secondary rounded-full mr-2"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      />
                      <Clock className="h-3 w-3 mr-1 text-gray-400" />
                      <span className="text-xs text-gray-300 font-medium">{food.time}</span>
                    </div>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap justify-center gap-1 mt-2">
                      {food.tags.map((tag, i) => (
                        <span 
                          key={`${food.id}-tag-${i}`} 
                          className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-gray-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Interactive like button */}
                  <motion.div 
                    className="absolute top-3 right-3"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Heart className="h-5 w-5 text-gray-400 hover:text-red-400 hover:fill-red-400 cursor-pointer transition-colors duration-300" />
                  </motion.div>
                  
                  {/* Glass reflection effect */}
                  <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Impact Gallery Section - Redesigned with parallax effect */}
      <section className="py-24 bg-gradient-to-b from-slate-900 to-slate-800 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute right-0 bottom-0 w-full h-[70%] bg-gradient-to-t from-amber-500/10 to-transparent" />
          <div className="absolute left-0 top-0 w-96 h-96 bg-teal-500/10 rounded-full blur-[100px]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 relative z-10">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Badge className="mb-4 bg-amber-500/20 text-amber-300 py-1 px-4 border-amber-500/30">
              IMPACT STORIES
            </Badge>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-5xl font-bold text-white mb-4"
            >
              Every Meal Creates <span className="text-amber-400">Joy</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-xl text-gray-300 max-w-2xl mx-auto"
            >
              See the impact of your generosity through the smiles and stories of communities touched by Annapurna
            </motion.p>
          </motion.div>
        </div>
        
        {/* First Row - Moving Right with hover effects */}
        <div className="relative mb-10">
          <motion.div 
            animate={{ x: [0, -1920] }}
            transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
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
                whileHover={{ 
                  scale: 1.05, 
                  y: -10,
                  zIndex: 10,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)"
                }}
                className="flex-shrink-0 w-72 h-48 rounded-2xl overflow-hidden shadow-xl relative group"
              >
                <img
                  src={image}
                  alt={`Impact story ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <p className="text-white text-sm font-medium">Story #{index + 1}: Making a difference one meal at a time</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Second Row - Moving Left with different hover effect */}
        <div className="relative">
          <motion.div 
            animate={{ x: [-1920, 0] }}
            transition={{ duration: 75, repeat: Infinity, ease: "linear" }}
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
                whileHover={{ 
                  scale: 1.05, 
                  rotateY: 10,
                  zIndex: 10,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)"
                }}
                className="flex-shrink-0 w-72 h-48 rounded-2xl overflow-hidden shadow-xl relative group"
              >
                <img
                  src={image}
                  alt={`Community impact ${index + 1}`}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 filter group-hover:brightness-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <p className="text-white text-sm font-medium">Community #{index + 1}: Building connections through food sharing</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
        
        {/* Gradient overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-800 to-transparent z-10"></div>
      </section>

      {/* Impact Stats Section - Redesigned with 3D cards */}
      <section id="impact" ref={impactRef} className="py-24 bg-gradient-to-br from-black to-slate-950 relative">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute left-0 bottom-0 w-1/2 h-[60%] bg-primary/5 rounded-full blur-[100px]" />
          <div className="absolute right-0 top-0 w-1/2 h-[60%] bg-secondary/5 rounded-full blur-[100px]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <Badge className="mb-4 bg-white/10 text-white py-1 px-4 border-white/20">
              OUR IMPACT
            </Badge>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-5xl font-bold text-white mb-4"
            >
              <span className="text-primary">Numbers</span> That Matter
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-xl text-gray-300 max-w-2xl mx-auto"
            >
              Every meal shared creates a ripple effect of positive change in our communities
            </motion.p>
          </motion.div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { number: "25,847", label: "Meals Shared", icon: "🍽️", color: "from-amber-500 to-amber-600", shadow: "shadow-amber-500/20" },
              { number: "1,245", label: "Active Heroes", icon: "🦸‍♀️", color: "from-teal-500 to-teal-600", shadow: "shadow-teal-500/20" },
              { number: "89", label: "Partner NGOs", icon: "🏢", color: "from-indigo-500 to-indigo-600", shadow: "shadow-indigo-500/20" },
              { number: "12", label: "Cities", icon: "🌍", color: "from-purple-500 to-purple-600", shadow: "shadow-purple-500/20" }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.15 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.03 }}
                className="relative group"
              >
                <div className="bg-black/20 backdrop-blur-xl p-8 rounded-2xl border border-white/10 h-full flex flex-col items-center justify-center group-hover:border-white/20 transition-all duration-300 shadow-xl">
                  <div className={`text-6xl mb-6 group-hover:scale-110 transition-transform duration-300 drop-shadow-md`}>{stat.icon}</div>
                  <div className={`text-5xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-3`}>{stat.number}</div>
                  <div className="text-gray-300 text-lg font-medium">{stat.label}</div>
                </div>
                
                {/* 3D Card Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section - Redesigned with 3D steps */}
      <section className="py-24 bg-gradient-to-br from-slate-900 to-black relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute right-0 top-0 w-1/3 h-1/3 bg-amber-500/10 rounded-full blur-[80px]" />
          <div className="absolute left-0 bottom-0 w-1/3 h-1/3 bg-emerald-500/10 rounded-full blur-[80px]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <Badge className="mb-4 bg-amber-500/20 text-amber-300 py-1 px-4 border-amber-500/30">
              HOW IT WORKS
            </Badge>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-5xl font-bold text-white mb-4"
            >
              Simple Steps to <span className="text-amber-400">Make a Difference</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-xl text-gray-300 max-w-2xl mx-auto"
            >
              Join thousands of others and start your journey to fight hunger today
            </motion.p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                title: "Share Your Food",
                description: "Upload photos of your surplus food, add details about quantity and pickup time. Every share matters!",
                icon: "📸",
                color: "from-amber-500 to-amber-600",
                iconBg: "bg-amber-500/20",
                component: HandHeart
              },
              {
                step: "02", 
                title: "Connect Instantly",
                description: "Our AI matches your donation with nearby NGOs and volunteers for quick pickup and distribution.",
                icon: "🤝",
                color: "from-emerald-500 to-emerald-600",
                iconBg: "bg-emerald-500/20",
                component: Users
              },
              {
                step: "03",
                title: "Track Your Impact",
                description: "Watch your contribution feed families and build communities. See the lives you're changing in real-time.",
                icon: "📊",
                color: "from-indigo-500 to-indigo-600",
                iconBg: "bg-indigo-500/20",
                component: Globe
              }
            ].map((step, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                <motion.div 
                  whileHover={{ y: -10, scale: 1.03 }}
                  className="p-8 h-full rounded-2xl bg-black/20 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300 shadow-xl"
                >
                  {/* Step number with gradient background */}
                  <div className="flex items-center mb-6">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                      {step.step}
                    </div>
                    <div className="ml-4 text-sm text-white/60 font-medium uppercase tracking-wider">
                      Step {index + 1}
                    </div>
                  </div>
                  
                  {/* Icon with background */}
                  <div className="flex items-center space-x-4 mb-5">
                    <div className={`w-12 h-12 ${step.iconBg} rounded-full flex items-center justify-center`}>
                      {React.createElement(step.component, { className: "h-6 w-6 text-white" })}
                    </div>
                    <div className="text-4xl">{step.icon}</div>
                  </div>
                  
                  {/* Content */}
                  <h3 className={`text-2xl font-bold bg-gradient-to-r ${step.color} bg-clip-text text-transparent mb-4`}>
                    {step.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">{step.description}</p>
                </motion.div>
                
                {/* Connection arrows */}
                {index < 2 && (
                  <div className="hidden md:flex absolute top-1/2 -right-6 transform -translate-y-1/2 items-center justify-center">
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <ArrowRight className="h-8 w-8 text-amber-500/50" />
                    </motion.div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Testimonials - Redesigned with real Indian people */}
      <section id="community" className="py-24 bg-gradient-to-br from-black to-slate-950 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute right-0 top-0 w-1/2 h-1/2 bg-amber-500/5 rounded-full blur-[120px]" />
          <div className="absolute left-0 bottom-0 w-1/2 h-1/2 bg-indigo-500/5 rounded-full blur-[120px]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-white/10 text-white py-1 px-4 border-white/20">
              TESTIMONIALS
            </Badge>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-5xl font-bold text-white mb-4"
            >
              Voices from Our <span className="text-amber-400">Community</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-xl text-gray-300 max-w-2xl mx-auto"
            >
              Real people, real impact, real change — these are their stories
            </motion.p>
          </motion.div>
          
          {/* Featured testimonial */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16 relative"
          >
            <div className="bg-black/30 backdrop-blur-xl p-8 md:p-12 rounded-3xl border border-white/10 relative overflow-hidden">
              {/* Quote mark decorations */}
              <div className="absolute top-4 left-6 text-8xl text-amber-500/10 font-serif">"</div>
              <div className="absolute bottom-4 right-6 text-8xl text-amber-500/10 font-serif rotate-180">"</div>
              
              {/* Testimonial content */}
              <div className="max-w-3xl mx-auto relative z-10">
                <div className="text-center mb-8">
                  <div className="flex justify-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-6 w-6 text-amber-400 fill-current mx-0.5" />
                    ))}
                  </div>
                  <p className="text-xl md:text-2xl text-gray-200 italic leading-relaxed">
                    "I used to feel guilty throwing away leftover food from my restaurant. Now with Annapurna, every surplus meal finds a family in need. The platform is intuitive, the pickup process is seamless, and the impact tracking gives me such joy."
                  </p>
                </div>
                
                <div className="flex items-center justify-center">
                  <div className="flex-shrink-0 h-16 w-16 rounded-full overflow-hidden mr-4">
                    <img 
                      src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                      alt="Priya Sharma" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-left">
                    <h4 className="text-white font-bold text-lg">Priya Sharma</h4>
                    <p className="text-amber-300">Restaurant Owner & Food Donor</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* More testimonials in cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Rohan Mehta",
                role: "NGO Director", 
                imageSrc: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                quote: "Annapurna has revolutionized how we source food for our shelter. The real-time notifications help us respond quickly to families in crisis.",
                rating: 5,
                color: "from-teal-500 to-teal-600",
                iconBg: "bg-teal-500/20"
              },
              {
                name: "Rahul Verma",
                role: "Volunteer",
                imageSrc: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                quote: "Being a volunteer on Annapurna gives me purpose. Every pickup I make feeds 10-15 people. The impact tracking keeps me motivated!",
                rating: 5,
                color: "from-indigo-500 to-indigo-600",
                iconBg: "bg-indigo-500/20"
              },
              {
                name: "Meera Patel",
                role: "Community Member",
                imageSrc: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                quote: "As a single mother, Annapurna's food sharing network has been a blessing for my family during tough times. I'm now giving back as a volunteer.",
                rating: 5,
                color: "from-purple-500 to-purple-600",
                iconBg: "bg-purple-500/20"
              }
            ].map((testimonial, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.03 }}
                className="h-full"
              >
                <div className="bg-black/20 backdrop-blur-xl p-6 h-full rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 shadow-xl">
                  <div className="flex items-center mb-4">
                    <div className="h-14 w-14 rounded-full overflow-hidden mr-4">
                      <img 
                        src={testimonial.imageSrc} 
                        alt={testimonial.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{testimonial.name}</h4>
                      <p className={`text-sm bg-gradient-to-r ${testimonial.color} bg-clip-text text-transparent`}>
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-amber-400 fill-current" />
                    ))}
                  </div>
                  
                  <p className="text-gray-300 italic">"{testimonial.quote}"</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section - Enhanced design */}
      <section className="py-32 bg-gradient-to-br from-slate-900 via-black to-slate-900 text-white relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-amber-500/10 to-transparent opacity-30"
            animate={{ opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-indigo-500/10 to-transparent opacity-30"
            animate={{ opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          />
          
          {/* Particle effect */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`cta-particle-${i}`}
              className="absolute rounded-full bg-white/30 backdrop-blur-md w-2 h-2"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100],
                opacity: [0, 0.8, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 10 + Math.random() * 10,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Badge className="mb-6 bg-white/10 text-white py-1.5 px-6 border-white/20 text-base">
              JOIN THE MOVEMENT
            </Badge>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-5xl md:text-6xl font-bold mb-6 tracking-tight"
            >
              Ready to <span className="text-amber-400">Change Lives</span> One Meal at a Time?
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              Join thousands of food heroes who are building a hunger-free world through the power of community and technology. Your journey to make a difference starts here.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row gap-6 justify-center"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  onClick={handleGetStarted}
                  size="lg" 
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-8 py-7 text-lg font-semibold rounded-xl shadow-lg shadow-amber-700/20 border-0"
                >
                  <Users className="mr-2 h-5 w-5" />
                  Join Annapurna Today
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  onClick={handleGetStarted}
                  variant="outline"
                  size="lg"
                  className="border-white/20 text-white hover:bg-white/10 px-8 py-7 text-lg font-semibold rounded-xl shadow-lg shadow-white/5"
                >
                  <Globe className="mr-2 h-5 w-5" />
                  Explore Community
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>



      {/* Modern Footer with Navigation and Social Links */}
      <footer className="bg-black text-white py-16 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {/* Logo and Description */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <Logo size="md" />
                <Badge className="ml-2 bg-amber-500/20 text-amber-300 border-amber-500/30 font-medium">
                  BETA
                </Badge>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Annapurna is a revolutionary platform connecting surplus food with those in need. 
                Our AI-powered system makes food sharing efficient, trackable, and impactful.
              </p>
              <div className="flex space-x-4">
                <motion.a 
                  href="#facebook"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-blue-500/20 transition-colors duration-300"
                  whileHover={{ y: -5 }}
                >
                  <Facebook className="h-5 w-5 text-blue-400" />
                </motion.a>
                <motion.a 
                  href="#twitter"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-sky-500/20 transition-colors duration-300"
                  whileHover={{ y: -5 }}
                >
                  <Twitter className="h-5 w-5 text-sky-400" />
                </motion.a>
                <motion.a 
                  href="#instagram"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-pink-500/20 transition-colors duration-300"
                  whileHover={{ y: -5 }}
                >
                  <Instagram className="h-5 w-5 text-pink-400" />
                </motion.a>
                <motion.a 
                  href="#linkedin"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-blue-500/20 transition-colors duration-300"
                  whileHover={{ y: -5 }}
                >
                  <Linkedin className="h-5 w-5 text-blue-400" />
                </motion.a>
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-amber-300">Quick Links</h3>
              <ul className="space-y-2">
                {['How It Works', 'About Us', 'Impact Stories', 'Blog', 'Partner With Us'].map((link) => (
                  <motion.li key={link} whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">{link}</a>
                  </motion.li>
                ))}
              </ul>
            </div>
            
            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-amber-300">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center">
                  <span className="mr-2">📍</span> Kanpur, Uttar Pradesh, India
                </li>
                <li className="flex items-center">
                  <span className="mr-2">📧</span> pranjulrathour41@gmail.com
                </li>
                <li className="flex items-center">
                  <span className="mr-2">📱</span> +91 8467977141
                </li>
              </ul>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                className="mt-4 bg-white/10 hover:bg-white/20 py-2 px-4 rounded-lg text-sm transition-colors duration-300"
              >
                Contact Us
              </motion.button>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">© 2024 Annapurna. All rights reserved. Made with ❤️ for fighting hunger.</p>
            <div className="flex space-x-6 text-sm text-gray-500">
              <a href="#" className="hover:text-amber-300 transition-colors duration-200">Privacy Policy</a>
              <a href="#" className="hover:text-amber-300 transition-colors duration-200">Terms of Service</a>
              <a href="#" className="hover:text-amber-300 transition-colors duration-200">Cookie Policy</a>
            </div>
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
