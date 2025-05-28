import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Search, Filter, MapPin, Clock, Star, ChevronRight, Tag } from 'lucide-react';
import { useLocation } from 'wouter';
import { Logo } from '@/components/Logo';

// Sample food data for the discover page
const foodItems = [
  {
    id: 1,
    title: "Vegetable Curry Feast",
    description: "Freshly prepared vegetable curry with rice and naan bread. Enough to feed 10-12 people.",
    location: "Kanpur Central, Uttar Pradesh",
    time: "Available for 3 more hours",
    distance: "1.2 km away",
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    tags: ["Vegetarian", "Indian", "Dinner"],
    donorRating: 4.8,
    quantity: "5 kg"
  },
  {
    id: 2,
    title: "Wedding Catering Surplus",
    description: "Variety of dishes from a wedding reception including biryani, paneer dishes, and desserts.",
    location: "Swaroop Nagar, Kanpur",
    time: "Available for 5 more hours",
    distance: "3.5 km away",
    image: "https://images.unsplash.com/photo-1626236162874-5a54571a76c4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    tags: ["Mixed", "Wedding Food", "Large Quantity"],
    donorRating: 4.9,
    quantity: "25 kg"
  },
  {
    id: 3,
    title: "Fresh Fruit Collection",
    description: "Assorted fresh fruits including apples, bananas, and oranges from a local market.",
    location: "Civil Lines, Kanpur",
    time: "Available for 2 more days",
    distance: "2.8 km away",
    image: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    tags: ["Fruits", "Fresh", "Healthy"],
    donorRating: 4.7,
    quantity: "8 kg"
  },
  {
    id: 4,
    title: "Bakery Items",
    description: "Day-old bread, pastries, and cakes from a local bakery. Still fresh and delicious.",
    location: "Arya Nagar, Kanpur",
    time: "Available for 1 more day",
    distance: "4.1 km away",
    image: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    tags: ["Bakery", "Bread", "Desserts"],
    donorRating: 4.5,
    quantity: "3 kg"
  },
  {
    id: 5,
    title: "School Lunch Surplus",
    description: "Nutritious meals including rice, dal, and vegetables prepared for a school lunch program.",
    location: "Kidwai Nagar, Kanpur",
    time: "Available for 2 more hours",
    distance: "5.3 km away",
    image: "https://images.unsplash.com/photo-1600335895229-6e75511892c8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    tags: ["School Food", "Lunch", "Kids Meals"],
    donorRating: 4.6,
    quantity: "15 kg"
  },
  {
    id: 6,
    title: "Restaurant Thali Surplus",
    description: "Complete thali meals with roti, rice, 3 sabzis, dal, and dessert from a popular restaurant.",
    location: "Harsh Nagar, Kanpur",
    time: "Available for 4 more hours",
    distance: "6.2 km away",
    image: "https://images.unsplash.com/photo-1567337710282-00832b415979?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    tags: ["Restaurant", "Thali", "Complete Meal"],
    donorRating: 4.9,
    quantity: "10 kg"
  }
];

// Categories for food filtering
const categories = [
  { name: "All Foods", icon: "🍲" },
  { name: "Vegetarian", icon: "🥗" },
  { name: "Non-Vegetarian", icon: "🍗" },
  { name: "Grains & Bread", icon: "🍞" },
  { name: "Fruits", icon: "🍎" },
  { name: "Cooked Meals", icon: "🍱" },
  { name: "Desserts", icon: "🍰" }
];

export default function Discover() {
  const [_, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-slate-950 text-white">
      {/* Header */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/60 border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="cursor-pointer"
                onClick={() => setLocation("/")}
              >
                <Logo size="sm" />
              </motion.div>
            </div>
            
            <div className="hidden md:flex space-x-1">
              {[
                { name: "Home", path: "/" },
                { name: "Discover", path: "/discover" },
                { name: "About", path: "/about" },
                { name: "Impact", path: "/#impact" },
                { name: "Community", path: "/#community" }
              ].map((item, index) => (
                <motion.a
                  key={item.name}
                  href={item.path}
                  className="relative px-4 py-2 mx-1 text-gray-200 rounded-full hover:text-white hover:bg-white/10 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                >
                  {item.name}
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
                onClick={() => setLocation("/dashboard")} 
                className="bg-primary hover:bg-primary/90 text-white rounded-full px-6 font-medium"
                size="lg"
              >
                Dashboard
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* Main content */}
      <main className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero section */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-white/10 text-white py-1 px-4 border-white/20">
              DISCOVER
            </Badge>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl md:text-6xl font-bold text-white mb-4"
            >
              Find Food <span className="text-primary">Near You</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-gray-300 max-w-2xl mx-auto"
            >
              Browse available food donations in your area and help reduce food waste
            </motion.p>
          </motion.div>

          {/* Search and filter */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-12"
          >
            <div className="bg-black/30 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-xl">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search for food items, locations, or donors..." 
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-white"
                  />
                </div>
                <div className="flex gap-4">
                  <Button className="bg-white/10 hover:bg-white/20 text-white border border-white/10">
                    <Filter className="mr-2 h-4 w-4" /> Filters
                  </Button>
                  <Button className="bg-primary hover:bg-primary/90 text-white">
                    Search
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Categories */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-12 overflow-x-auto hide-scrollbar"
          >
            <div className="flex space-x-4 pb-2">
              {categories.map((category, index) => (
                <motion.div 
                  key={index}
                  whileHover={{ y: -5, scale: 1.05 }}
                  className="flex-shrink-0 cursor-pointer"
                >
                  <div className="bg-black/20 backdrop-blur-xl rounded-xl border border-white/10 p-4 flex flex-col items-center transition-all hover:border-white/30 min-w-[100px]">
                    <div className="text-3xl mb-2">{category.icon}</div>
                    <div className="text-sm font-medium text-white">{category.name}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Food items grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {foodItems.map((item, index) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden hover:border-white/30 transition-all duration-300 shadow-xl"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium text-white">
                    {item.quantity}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-white">{item.title}</h3>
                    <div className="flex items-center text-amber-400">
                      <Star className="h-4 w-4 fill-current mr-1" />
                      <span className="text-sm">{item.donorRating}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-4">{item.description}</p>
                  
                  <div className="flex items-center mb-3 text-gray-400 text-sm">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{item.location}</span>
                  </div>
                  
                  <div className="flex items-center mb-4 text-gray-400 text-sm">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{item.time}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.tags.map((tag, idx) => (
                      <div key={idx} className="bg-white/5 rounded-full px-3 py-1 text-xs font-medium text-primary">
                        {tag}
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    className="w-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 mt-2"
                  >
                    Request Food <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Load more button */}
          <div className="mt-12 text-center">
            <Button 
              className="bg-white/10 hover:bg-white/20 text-white border border-white/10 px-8"
              size="lg"
            >
              Load More <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </main>

      {/* Footer - Same as Landing page for consistency */}
      <footer className="bg-black/50 backdrop-blur-xl border-t border-white/10 py-12 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-1">
              <Logo size="sm" />
              <p className="mt-4 text-sm text-gray-400">
                Connecting surplus food with those who need it most, reducing waste and fighting hunger together.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Contact</h3>
              <div className="space-y-3 text-sm">
                <p>Kanpur, Uttar Pradesh</p>
                <p>+91 8467977141</p>
                <p>pranjulrathour41@gmail.com</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Links</h3>
              <ul className="space-y-2 text-sm">
                {["Home", "About Us", "Discover", "Impact", "Community", "FAQ"].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-primary transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
              <div className="flex space-x-4 mb-4">
                <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors">
                  <img src="/facebook.svg" alt="Facebook" className="h-5 w-5" />
                </a>
                <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors">
                  <img src="/twitter.svg" alt="Twitter" className="h-5 w-5" />
                </a>
                <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors">
                  <img src="/instagram.svg" alt="Instagram" className="h-5 w-5" />
                </a>
                <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors">
                  <img src="/linkedin.svg" alt="LinkedIn" className="h-5 w-5" />
                </a>
              </div>
              <p className="text-sm text-gray-400">
                Subscribe to our newsletter for updates on food donation opportunities.
              </p>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-white/10 text-center text-sm">
            <p>© {new Date().getFullYear()} Annapurna Nutrition. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
