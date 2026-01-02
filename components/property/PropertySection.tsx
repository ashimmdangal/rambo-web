"use client";

import { motion } from "framer-motion";
import PropertyCard from "@/components/property/PropertyCard";

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  image: string;
  type: string;
  category: "RENT" | "BUY";
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
}

interface PropertySectionProps {
  title: string;
  description: string;
  properties: Property[];
  bookmarkedIds: Set<string>;
  bgColor?: string;
}

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

export default function PropertySection({
  title,
  description,
  properties,
  bookmarkedIds,
  bgColor = "bg-background",
}: PropertySectionProps) {
  return (
    <section className={`py-20 ${bgColor}`}>
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="mb-12">
            <h2 className="text-5xl font-display font-bold text-primary mb-4">
              {title}
            </h2>
            <p className="text-lg text-muted-foreground">{description}</p>
          </motion.div>

          {properties.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                No properties available at the moment.
              </p>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {properties.map((property) => (
                <motion.div key={property.id} variants={itemVariants}>
                  <PropertyCard
                    {...property}
                    isBookmarked={bookmarkedIds.has(property.id)}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

