import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, Sparkles, HandHeart, Leaf, Globe, Award } from 'lucide-react';
import { useLocation, Link } from 'wouter';
import { Logo } from '@/components/Logo';

// Team members data
const teamMembers = [
  {
    name: "Pranjul Rathour",
    role: "Founder & CEO",
    bio: "Passionate about technology and social impact, Pranjul founded Annapurna to solve the food waste crisis in India.",
    image: "https://raw.githubusercontent.com/Pranjulrathour/photo/refs/heads/main/image_(1)%5B1%5D.png"
  },
  {
    name: "Aisha Sharma",
    role: "Head of Partnerships",
    bio: "With 10+ years in nonprofit management, Aisha builds crucial relationships with NGOs and government bodies.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    name: "Vikram Singh",
    role: "Technology Director",
    bio: "A software engineer with expertise in AI and mobile development, Vikram leads our tech innovations.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    name: "Neha Patel",
    role: "Community Manager",
    bio: "Neha bridges the gap between volunteers, donors, and communities through engagement programs.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  }
];

// Core values
const coreValues = [
  {
    icon: HandHeart,
    title: "Compassion",
    description: "We believe in the dignity of all people and their right to food security.",
    color: "from-amber-500 to-amber-600"
  },
  {
    icon: Leaf,
    title: "Sustainability",
    description: "Our work reduces food waste while supporting environmental health.",
    color: "from-emerald-500 to-emerald-600"
  },
  {
    icon: Users,
    title: "Community",
    description: "We build connections that strengthen neighborhoods and social bonds.",
    color: "from-indigo-500 to-indigo-600"
  },
  {
    icon: Globe,
    title: "Accessibility",
    description: "Our platform is designed to be accessible to all regardless of technical expertise.",
    color: "from-purple-500 to-purple-600"
  },
  {
    icon: Award,
    title: "Excellence",
    description: "We strive for excellence in all aspects of our operations and impact.",
    color: "from-rose-500 to-rose-600"
  },
  {
    icon: Sparkles,
    title: "Innovation",
    description: "We continuously seek new solutions to address hunger and food waste.",
    color: "from-blue-500 to-blue-600"
  }
];

// Milestones data
const milestones = [
  {
    year: "2021",
    title: "The Beginning",
    description: "Annapurna was founded in Kanpur with a vision to address food waste and hunger."
  },
  {
    year: "2022",
    title: "First 1,000 Meals",
    description: "We celebrated our first major milestone of connecting 1,000 meals with people in need."
  },
  {
    year: "2023",
    title: "Tech Platform Launch",
    description: "Our mobile app and website were launched, making food sharing more accessible."
  },
  {
    year: "2024",
    title: "Expansion to 10 Cities",
    description: "Annapurna expanded operations to 10 cities across Uttar Pradesh and beyond."
  },
  {
    year: "2025",
    title: "25,000 Meals Milestone",
    description: "We've now facilitated over 25,000 meals, creating a significant impact on hunger."
  }
];

export default function About() {
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
                <Link key={item.name} href={item.path}>
                  <motion.a
                    className="relative px-4 py-2 mx-1 text-gray-200 rounded-full hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                  >
                    {item.name}
                  </motion.a>
                </Link>
              ))}
            </div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
            >
              <Link href="/dashboard">
                <Button 
                  className="bg-primary hover:bg-primary/90 text-white rounded-full px-6 font-medium"
                  size="lg"
                >
                  Dashboard
                </Button>
              </Link>
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
              ABOUT US
            </Badge>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl md:text-6xl font-bold text-white mb-4"
            >
              Our <span className="text-primary">Mission</span> & Vision
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-gray-300 max-w-2xl mx-auto"
            >
              Dedicated to connecting surplus food with those who need it most
            </motion.p>
          </motion.div>

          {/* Mission & Vision */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-24"
          >
            <div className="grid md:grid-cols-2 gap-12">
              <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 p-8 hover:border-white/20 transition-all duration-300 shadow-xl">
                <h2 className="text-3xl font-bold text-primary mb-6">Our Mission</h2>
                <p className="text-gray-300 leading-relaxed mb-6">
                  Annapurna Nutrition exists to reduce food waste and combat hunger by creating an efficient, 
                  community-driven platform that connects food donors with individuals and organizations in need. 
                  We believe that no good food should go to waste when people are hungry.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  Through innovative technology and compassionate action, we're building a more sustainable and 
                  equitable food system for all, starting right here in Kanpur and expanding throughout India.
                </p>
              </div>
              
              <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 p-8 hover:border-white/20 transition-all duration-300 shadow-xl">
                <h2 className="text-3xl font-bold text-amber-400 mb-6">Our Vision</h2>
                <p className="text-gray-300 leading-relaxed mb-6">
                  We envision a future where no one goes hungry while good food goes to waste. A world where 
                  communities are empowered to share resources efficiently, reducing environmental impact while 
                  ensuring food security for all.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  By 2030, we aim to have created a model of food sharing that can be replicated across India and beyond, 
                  redirecting millions of meals from landfills to people's plates, and creating stronger, more 
                  resilient communities in the process.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Our Story */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-24"
          >
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-white/10 text-white py-1 px-4 border-white/20">
                OUR JOURNEY
              </Badge>
              <h2 className="text-4xl font-bold text-white mb-4">The <span className="text-primary">Annapurna</span> Story</h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                From a simple idea to a growing movement
              </p>
            </div>
            
            <div className="bg-black/30 backdrop-blur-xl rounded-2xl border border-white/10 p-8 md:p-12 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 to-transparent opacity-50"></div>
              
              <div className="relative z-10">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div>
                    <p className="text-gray-300 leading-relaxed mb-6">
                      Annapurna began in 2021 when our founder, Pranjul Rathour, witnessed significant food waste at a 
                      wedding celebration while people were sleeping hungry just streets away. This stark contrast sparked 
                      the idea for a platform that could bridge this disconnect.
                    </p>
                    <p className="text-gray-300 leading-relaxed mb-6">
                      Starting with a simple WhatsApp group connecting local restaurants with a shelter in Kanpur, 
                      the initiative quickly grew as more businesses and volunteers joined. The positive impact was 
                      immediate, with hundreds of meals redirected to those in need within the first few months.
                    </p>
                    <p className="text-gray-300 leading-relaxed">
                      By 2023, we had developed a full-fledged technology platform to scale our operations, making it 
                      easier for anyone to participate in food sharing. Today, Annapurna operates in multiple cities, 
                      with thousands of active users and dozens of partner organizations working together to create a 
                      hunger-free India.
                    </p>
                  </div>
                  
                  <div className="relative h-80 rounded-xl overflow-hidden shadow-2xl">
                    <img 
                      src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                      alt="Community food sharing" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-white text-sm font-medium">Our first community food sharing event in Kanpur, 2021</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Timeline/Milestones */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-24"
          >
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-white/10 text-white py-1 px-4 border-white/20">
                MILESTONES
              </Badge>
              <h2 className="text-4xl font-bold text-white mb-4">Our <span className="text-amber-400">Journey</span> So Far</h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Key moments that have shaped our growth
              </p>
            </div>
            
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-0.5 bg-white/10 transform md:translate-x-px"></div>
              
              {/* Milestones */}
              {milestones.map((milestone, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  viewport={{ once: true }}
                  className={`relative md:flex items-center mb-12 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  {/* Year indicator */}
                  <div className="hidden md:block md:w-1/2"></div>
                  
                  {/* Content */}
                  <div className="pl-8 md:pl-0 md:w-1/2 relative">
                    <div className={`absolute left-0 md:left-auto ${index % 2 === 0 ? 'md:right-full md:mr-8' : 'md:left-full md:ml-8'} top-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary border-2 border-black z-10`}></div>
                    <div className={`bg-black/20 backdrop-blur-xl rounded-xl border border-white/10 p-6 md:max-w-sm ${index % 2 === 0 ? 'md:ml-auto md:mr-8' : 'md:mr-auto md:ml-8'}`}>
                      <div className="font-bold text-primary text-xl mb-2">{milestone.year}</div>
                      <h3 className="text-xl font-bold text-white mb-2">{milestone.title}</h3>
                      <p className="text-gray-300">{milestone.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Core Values */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-24"
          >
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-white/10 text-white py-1 px-4 border-white/20">
                CORE VALUES
              </Badge>
              <h2 className="text-4xl font-bold text-white mb-4">What <span className="text-primary">Guides</span> Us</h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                The principles that drive everything we do
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {coreValues.map((value, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10, scale: 1.03 }}
                  className="bg-black/20 backdrop-blur-xl rounded-xl border border-white/10 p-6 hover:border-white/20 transition-all duration-300 shadow-xl"
                >
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${value.color} flex items-center justify-center mb-4`}>
                    {React.createElement(value.icon, { className: "h-6 w-6 text-white" })}
                  </div>
                  <h3 className={`text-xl font-bold bg-gradient-to-r ${value.color} bg-clip-text text-transparent mb-3`}>{value.title}</h3>
                  <p className="text-gray-300">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Team */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-24"
          >
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-white/10 text-white py-1 px-4 border-white/20">
                OUR TEAM
              </Badge>
              <h2 className="text-4xl font-bold text-white mb-4">Meet the <span className="text-amber-400">Team</span></h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                The passionate people behind Annapurna
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10, scale: 1.05 }}
                  className="bg-black/20 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-300 shadow-xl"
                >
                  <div className="h-60 overflow-hidden">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                    <p className="text-primary text-sm font-medium mb-3">{member.role}</p>
                    <p className="text-gray-300 text-sm">{member.bio}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="bg-black/30 backdrop-blur-xl rounded-2xl border border-white/10 p-12 relative overflow-hidden">
              <div className="absolute inset-0 overflow-hidden opacity-30">
                <motion.div 
                  className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-amber-500/10 to-transparent"
                  animate={{ opacity: [0.2, 0.4, 0.2] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div 
                  className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-indigo-500/10 to-transparent"
                  animate={{ opacity: [0.2, 0.4, 0.2] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 4 }}
                />
              </div>
              
              <div className="relative z-10">
                <h2 className="text-4xl font-bold text-white mb-4">Ready to Make a Difference?</h2>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
                  Join our community of food heroes and help us create a world where no good food goes to waste
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link href="/signup">
                    <Button 
                      className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 py-6 text-lg font-semibold"
                      size="lg"
                    >
                      Join Annapurna <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button 
                      className="bg-white/10 hover:bg-white/20 text-white rounded-full px-8 py-6 text-lg font-semibold"
                      size="lg"
                    >
                      Contact Us
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer - Same as Landing page for consistency */}
      <footer className="bg-black text-white py-16 border-t border-white/10 relative z-10 pointer-events-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pointer-events-auto">
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
                <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors cursor-pointer pointer-events-auto">
                  <img src="/facebook.svg" alt="Facebook" className="h-5 w-5" />
                </a>
                <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors cursor-pointer pointer-events-auto">
                  <img src="/twitter.svg" alt="Twitter" className="h-5 w-5" />
                </a>
                <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors cursor-pointer pointer-events-auto">
                  <img src="/instagram.svg" alt="Instagram" className="h-5 w-5" />
                </a>
                <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors cursor-pointer pointer-events-auto">
                  <img src="/linkedin.svg" alt="LinkedIn" className="h-5 w-5" />
                </a>
              </div>
              <p className="text-sm text-gray-400">
                Subscribe to our newsletter for updates on food donation opportunities.
              </p>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-white/10 text-center text-sm pointer-events-auto">
            <p className="pointer-events-auto">© {new Date().getFullYear()} Annapurna Nutrition. All rights reserved. Made with ❤️ by</p>
            <a href="https://github.com/Pranjulrathour/annapurna.live" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300 transition-colors inline-block cursor-pointer pointer-events-auto mt-2 mb-2">Pranjul Rathour</a>
            <p className="pointer-events-auto">for fighting hunger.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
