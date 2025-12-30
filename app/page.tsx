"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, MapPin } from "lucide-react";
import PropertyCard from "@/components/property/PropertyCard";
import SignUpModal from "@/components/auth/SignUpModal";
import { filterPropertiesByCategory } from "@/lib/validations";

// Mock data - Replace with actual data from Prisma
const rentProperties = [
  {
    id: "1",
    title: "Luxury Villa with Ocean View",
    location: "Malibu, California",
    price: 12000,
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
    type: "VILLA",
    category: "RENT" as const,
    bedrooms: 5,
    bathrooms: 4,
    area: 4500,
  },
  {
    id: "2",
    title: "Modern Studio Apartment",
    location: "Manhattan, New York",
    price: 3500,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
    type: "APARTMENT",
    category: "RENT" as const,
    bedrooms: 1,
    bathrooms: 1,
    area: 750,
  },
  {
    id: "3",
    title: "Cozy Room in Shared House",
    location: "Brooklyn, New York",
    price: 1200,
    image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=80",
    type: "ROOM",
    category: "RENT" as const,
    bedrooms: 1,
    bathrooms: 1,
    area: 300,
  },
  {
    id: "4",
    title: "Beachfront Villa Paradise",
    location: "Miami Beach, Florida",
    price: 15000,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    type: "VILLA",
    category: "RENT" as const,
    bedrooms: 6,
    bathrooms: 5,
    area: 6000,
  },
];

const buyProperties = [
  {
    id: "5",
    title: "Elegant Family Home",
    location: "Beverly Hills, California",
    price: 2500000,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    type: "HOUSE",
    category: "BUY" as const,
    bedrooms: 4,
    bathrooms: 3,
    area: 3200,
  },
  {
    id: "6",
    title: "Downtown Penthouse",
    location: "San Francisco, California",
    price: 3200000,
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
    type: "APARTMENT",
    category: "BUY" as const,
    bedrooms: 3,
    bathrooms: 2,
    area: 2800,
  },
  {
    id: "7",
    title: "Spacious Modern House",
    location: "Austin, Texas",
    price: 1850000,
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80",
    type: "HOUSE",
    category: "BUY" as const,
    bedrooms: 5,
    bathrooms: 4,
    area: 4200,
  },
  {
    id: "8",
    title: "Luxury Apartment Complex Unit",
    location: "Seattle, Washington",
    price: 950000,
    image: "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&q=80",
    type: "APARTMENT",
    category: "BUY" as const,
    bedrooms: 2,
    bathrooms: 2,
    area: 1500,
  },
];

const locations = [
  "All Locations",
  "New York, NY",
  "Los Angeles, CA",
  "San Francisco, CA",
  "Miami, FL",
  "Chicago, IL",
  "Austin, TX",
  "Seattle, WA",
];

export default function Home() {
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  // Filter properties by category restrictions
  const allProperties = [...rentProperties, ...buyProperties];
  const { rent: filteredRent, buy: filteredBuy } = filterPropertiesByCategory(allProperties);

  // Load bookmarks on mount
  useEffect(() => {
    const loadBookmarks = async () => {
      try {
        const response = await fetch("/api/bookmarks");
        if (response.ok) {
          const data = await response.json();
          const ids = new Set<string>(data.bookmarks?.map((b: any) => b.propertyId) || []);
          setBookmarkedIds(ids);
        }
      } catch (error) {
        // Ignore errors
      }
    };
    loadBookmarks();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[calc(100vh-5rem)] flex items-center justify-center overflow-hidden -mt-20">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80)",
            }}
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-7xl md:text-8xl lg:text-9xl font-display font-bold text-secondary mb-8 leading-tight"
          >
            Find Your
            <br />
            <span className="text-accent">Sanctuary</span>
          </motion.h1>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl mx-auto mt-12"
          >
            <div className="glassmorphism rounded-2xl p-2 shadow-2xl border border-white/20">
              <div className="flex flex-col md:flex-row gap-2">
                {/* Location Selector */}
                <div className="relative flex-1">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-background/90 backdrop-blur-sm border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-accent appearance-none"
                  >
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Search Input */}
                <div className="relative flex-2">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search properties..."
                    className="w-full pl-12 pr-4 py-4 bg-background/90 backdrop-blur-sm border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                {/* Search Button */}
                <button className="px-8 py-4 bg-accent text-primary font-semibold rounded-xl hover:bg-accent/90 transition-all duration-200 shadow-lg hover:shadow-xl">
                  Search
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Available for Rent Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="mb-12">
              <h2 className="text-5xl font-display font-bold text-primary mb-4">
                Available for Rent
              </h2>
              <p className="text-lg text-muted-foreground">
                Discover premium rental properties
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {filteredRent.map((property) => (
                <motion.div key={property.id} variants={itemVariants}>
                  <PropertyCard
                    {...property}
                    isBookmarked={bookmarkedIds.has(property.id)}
                  />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Available for Purchase Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="mb-12">
              <h2 className="text-5xl font-display font-bold text-primary mb-4">
                Available for Purchase
              </h2>
              <p className="text-lg text-muted-foreground">
                Invest in your dream property
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {filteredBuy.map((property) => (
                <motion.div key={property.id} variants={itemVariants}>
                  <PropertyCard
                    {...property}
                    isBookmarked={bookmarkedIds.has(property.id)}
                  />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Sign Up Modal */}
      <SignUpModal isOpen={isSignUpOpen} onClose={() => setIsSignUpOpen(false)} />
    </>
  );
}
