import React from "react";
import Navbar from "./Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background dark:bg-background flex flex-col">
      {/* Use the Navbar component */}
      <Navbar />
      
      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full text-foreground">
        {children}
      </main>
    </div>
  );
}
