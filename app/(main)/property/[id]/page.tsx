"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { MapPin, Bed, Bath, Square, Heart, Share2 } from "lucide-react";
import PropertyCard from "@/components/property/PropertyCard";
import BookingModal from "@/components/booking/BookingModal";

interface Property {
  id: string;
  title: string;
  description: string;
  type: string;
  category: "RENT" | "BUY";
  status: string;
  address: string;
  city: string;
  state: string;
  price: number;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  images: string[];
  videos: string[];
  amenities: string[];
  owner: {
    id: string;
    name: string;
    email: string;
  };
}

export default function PropertyDetailPage() {
  const params = useParams();
  const propertyId = params.id as string;
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    fetchProperty();
    checkBookmark();
  }, [propertyId]);

  const fetchProperty = async () => {
    try {
      const response = await fetch(`/api/property/${propertyId}`);
      if (response.ok) {
        const data = await response.json();
        setProperty(data.property);
      }
    } catch (error) {
      console.error("Error fetching property:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkBookmark = async () => {
    try {
      const response = await fetch(`/api/bookmark/${propertyId}`);
      if (response.ok) {
        const data = await response.json();
        setIsBookmarked(data.isBookmarked);
      }
    } catch (error) {
      // Ignore errors
    }
  };

  const handleBookmark = async () => {
    try {
      const response = await fetch(`/api/bookmark/${propertyId}`, {
        method: "POST",
      });
      if (response.ok) {
        setIsBookmarked(!isBookmarked);
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="container mx-auto">
          <p className="text-muted-foreground">Loading property...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="container mx-auto">
          <p className="text-muted-foreground">Property not found</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Image Gallery */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
            <div className="relative h-96 rounded-lg overflow-hidden">
              <Image
                src={property.images[0] || "/placeholder.jpg"}
                alt={property.title}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            {property.images.length > 1 && (
              <div className="grid grid-cols-2 gap-4">
                {property.images.slice(1, 5).map((image, index) => (
                  <div key={index} className="relative h-44 rounded-lg overflow-hidden">
                    <Image
                      src={image}
                      alt={`${property.title} ${index + 2}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-display font-bold text-primary mb-2">
                    {property.title}
                  </h1>
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>
                      {property.address}, {property.city}
                      {property.state && `, ${property.state}`}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleBookmark}
                    className="p-2 hover:bg-muted rounded-full transition-colors"
                  >
                    <Heart
                      className={`w-6 h-6 ${
                        isBookmarked
                          ? "fill-accent text-accent"
                          : "text-foreground"
                      }`}
                    />
                  </button>
                  <button className="p-2 hover:bg-muted rounded-full transition-colors">
                    <Share2 className="w-6 h-6 text-foreground" />
                  </button>
                </div>
              </div>

              {/* Property Details */}
              <div className="flex items-center gap-6 mb-6 p-4 bg-card rounded-lg border border-border">
                {property.bedrooms && (
                  <div className="flex items-center gap-2">
                    <Bed className="w-5 h-5 text-muted-foreground" />
                    <span className="text-foreground">{property.bedrooms} Bedrooms</span>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex items-center gap-2">
                    <Bath className="w-5 h-5 text-muted-foreground" />
                    <span className="text-foreground">{property.bathrooms} Bathrooms</span>
                  </div>
                )}
                {property.area && (
                  <div className="flex items-center gap-2">
                    <Square className="w-5 h-5 text-muted-foreground" />
                    <span className="text-foreground">{property.area} sqft</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mb-6">
                <h2 className="text-2xl font-display font-semibold text-primary mb-4">
                  Description
                </h2>
                <p className="text-foreground leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
              </div>

              {/* Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-2xl font-display font-semibold text-primary mb-4">
                    Amenities
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {property.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-muted rounded-full text-sm text-foreground"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-card rounded-lg border border-border p-6">
                <div className="mb-6">
                  <p className="text-4xl font-display font-bold text-primary mb-2">
                    ${property.price.toLocaleString()}
                  </p>
                  {property.category === "RENT" && (
                    <p className="text-sm text-muted-foreground">per month</p>
                  )}
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => setIsBookingOpen(true)}
                    className="w-full px-6 py-3 bg-accent text-primary font-semibold rounded-md hover:bg-accent/90 transition-colors"
                  >
                    {property.category === "RENT" ? "Book Now" : "Schedule Viewing"}
                  </button>
                  <button className="w-full px-6 py-3 border border-border text-foreground font-medium rounded-md hover:bg-muted transition-colors">
                    Contact Owner
                  </button>
                </div>

                <div className="mt-6 pt-6 border-t border-border">
                  <h3 className="text-sm font-semibold text-foreground mb-2">
                    Property Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type</span>
                      <span className="text-foreground">{property.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Category</span>
                      <span className="text-foreground">{property.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <span className="text-foreground">{property.status}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        property={property}
      />
    </>
  );
}

