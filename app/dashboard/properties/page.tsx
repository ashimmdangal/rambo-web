"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Home, Edit, Trash2 } from "lucide-react";
import PropertyStatusToggle from "@/components/owner/PropertyStatusToggle";
import Image from "next/image";
import Link from "next/link";

interface Property {
  id: string;
  title: string;
  type: string;
  category: string;
  status: "AVAILABLE" | "RENTED" | "BOUGHT";
  price: number;
  city: string;
  images: string[];
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await fetch("/api/property/my-properties");
      if (response.ok) {
        const data = await response.json();
        setProperties(data.properties || []);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = (propertyId: string) => {
    // Refresh properties after status change
    fetchProperties();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="container mx-auto">
          <p className="text-muted-foreground">Loading properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-display font-bold text-primary">
            My Properties
          </h1>
          <Link
            href="/dashboard"
            className="px-6 py-2.5 bg-accent text-primary font-semibold rounded-md hover:bg-accent/90 transition-colors"
          >
            Add New Property
          </Link>
        </div>

        {properties.length === 0 ? (
          <div className="text-center py-12">
            <Home className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg text-muted-foreground mb-4">
              You have not listed any properties yet.
            </p>
            <Link
              href="/dashboard"
              className="px-6 py-2.5 bg-accent text-primary font-semibold rounded-md hover:bg-accent/90 transition-colors inline-block"
            >
              List Your First Property
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-lg overflow-hidden shadow-sm border border-border"
              >
                <div className="relative h-48 w-full">
                  <Image
                    src={property.images[0] || "/placeholder.jpg"}
                    alt={property.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-display text-xl font-semibold text-foreground line-clamp-1">
                      {property.title}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {property.city} • {property.type}
                  </p>
                  <p className="text-2xl font-display font-bold text-primary mb-4">
                    ${property.price.toLocaleString()}
                    {property.category === "RENT" && (
                      <span className="text-sm font-normal text-muted-foreground">
                        /month
                      </span>
                    )}
                  </p>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-muted-foreground mb-2 block">
                        Status
                      </label>
                      <PropertyStatusToggle
                        propertyId={property.id}
                        currentStatus={property.status}
                        onStatusChange={() => handleStatusChange(property.id)}
                      />
                    </div>
                    <div className="flex items-center gap-2 pt-2 border-t border-border">
                      <Link
                        href={`/property/${property.id}/edit`}
                        className="flex-1 px-4 py-2 text-sm font-medium text-foreground bg-muted hover:bg-muted/80 rounded-md transition-colors flex items-center justify-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </Link>
                      <button className="px-4 py-2 text-sm font-medium text-red-500 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-md transition-colors flex items-center justify-center gap-2">
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

