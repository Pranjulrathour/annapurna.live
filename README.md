# Annapurna Nutrition - Food Sharing Platform

![Annapurna Nutrition](client/src/ASSETS/README%20SS/Screenshot%202025-05-28%20095738.png)

## 📝 Problem Statement

Every day, millions of people go hungry while tons of good food is wasted. In India alone, approximately 40% of the food produced is wasted, while 189.2 million people remain undernourished. This paradox exists because of inefficient food distribution systems and a lack of technology to connect food donors with recipients.

Annapurna Nutrition aims to solve this problem by creating a digital bridge between those with surplus food and those who need it most, using technology to reduce food waste and fight hunger simultaneously.

## 🚀 Approach & Solution

The Annapurna Nutrition platform takes a multi-faceted approach to addressing food waste and hunger:

1. **User-Centric Platform**: We've created an intuitive, visually appealing platform that makes food sharing simple for donors, NGOs, and volunteers.

2. **Community Connectivity**: The platform connects individual donors, restaurants, and event organizers with nearby NGOs and volunteers for efficient food redistribution.

3. **Real-Time Coordination**: Through our platform, donors can quickly post available food, and recipients/volunteers can respond in real-time, ensuring food is transferred while still fresh.

4. **Impact Tracking**: Users can see the direct impact of their donations, encouraging continued participation.

5. **Scalable Infrastructure**: Built with modern web technologies, the platform is designed to scale from local communities to nationwide coverage.

## ✨ Features

### For Food Donors
- Easy food listing with photo uploads and details
- Scheduling pickup times
- Impact tracking and statistics
- Donor recognition and community engagement

### For NGOs & Recipients
- Real-time food availability notifications
- Donor verification system
- Detailed food information (quantity, type, expiration)
- Request submission for specific food needs

### For Volunteers
- Route optimization for food pickup and delivery
- Scheduling and availability management
- Impact tracking for contributions
- Community recognition

### Platform Features
- Modern, responsive UI with dark theme
- Animated components for enhanced user experience
- Real-time updates and notifications
- Interactive maps for location-based services
- Comprehensive dashboards for all user types

## 🛠️ Tech Stack

### Frontend
- **React**: For building the user interface
- **TypeScript**: For type-safe code
- **Tailwind CSS**: For styling and responsive design
- **Framer Motion**: For smooth animations and transitions
- **Shadcn UI**: For beautiful, accessible UI components
- **Lucide React**: For icon components

### Backend & Services
- **Supabase**: For authentication, database, and storage
- **React Query**: For data fetching and state management
- **Wouter**: For lightweight routing

### Build Tools
- **Vite**: For fast development and optimized production builds
- **Node.js**: For the development environment

## 📸 Screenshots

### Landing Page with Animated Food Cards
![Landing Page](client/src/ASSETS/README%20SS/Screenshot%202025-05-28%20095738.png)

### NGO DASHBOARD for Finding Food
![Discover Page](client/src/ASSETS/README%20SS/Screenshot%202025-05-28%20095935.png)

### VOLUNTEER DASHBOARD  with Team Information
![About Page](client/src/ASSETS/README%20SS/Screenshot%202025-05-28%20100001.png)

### FOOD DONER  DASHBOARD WITH FOOD UPLOADING DETAILS 
![Impact Stories](client/src/ASSETS/README%20SS/Screenshot%202025-05-28%20100022.png)

## 🚦 Running the Application

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/annapurna-nutrition.git
cd annapurna-nutrition
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
Create a `.env` file in the project root with:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Development

To run the application in development mode:
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

### Production Build

To build the application for production:
```bash
npm run build
# or
yarn build
```

To preview the production build locally:
```bash
npm run preview
# or
yarn preview
```

## 📄 Configuration

The application uses environment variables for configuration, stored in the `.env` file:

- `VITE_SUPABASE_URL`: The URL of your Supabase project
- `VITE_SUPABASE_ANON_KEY`: The anonymous key for your Supabase project

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- Special thanks to all contributors and supporters
- Inspired by the spirit of Anna Purna, the Hindu goddess of food and nourishment
