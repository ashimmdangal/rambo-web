"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, MapPin, Bed, Bath, Square } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface PropertyCardProps {
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
  isBookmarked?: boolean;
  onBookmark?: (id: string) => void;
}

export default function PropertyCard({
  id,
  title,
  location,
  price,
  image,
  type,
  category,
  bedrooms,
  bathrooms,
  area,
  isBookmarked = false,
  onBookmark,
}: PropertyCardProps) {
  const [bookmarked, setBookmarked] = useState(isBookmarked);

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/bookmark/${id}`, {
        method: "POST",
      });
      if (response.ok) {
        const data = await response.json();
        setBookmarked(data.isBookmarked);
        onBookmark?.(id);
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Link href={`/property/${id}`}>
      <div className="group relative bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-border/50 hover:border-accent/30">
        {/* Image Container */}
        <div className="relative h-64 w-full overflow-hidden">
          <Image
            src={image || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"}
            alt={title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized
          />
          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <span
              className={cn(
                "px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm",
                category === "RENT"
                  ? "bg-accent/90 text-primary"
                  : "bg-primary/90 text-secondary"
              )}
            >
              {category}
            </span>
          </div>
          {/* Bookmark Button */}
          <button
            onClick={handleBookmark}
            className="absolute top-4 right-4 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
            aria-label="Bookmark property"
          >
            <Heart
              className={cn(
                "w-5 h-5 transition-colors",
                bookmarked ? "fill-accent text-accent" : "text-foreground"
              )}
            />
          </button>
          {/* Type Badge */}
          <div className="absolute bottom-4 left-4">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-background/90 backdrop-blur-sm text-foreground">
              {type}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="font-display text-xl font-semibold text-foreground mb-2 line-clamp-1 group-hover:text-accent transition-colors">
            {title}
          </h3>
          <div className="flex items-center text-muted-foreground mb-4">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="text-sm">{location}</span>
          </div>

          {/* Details */}
          {(bedrooms || bathrooms || area) && (
            <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
              {bedrooms && (
                <div className="flex items-center gap-1">
                  <Bed className="w-4 h-4" />
                  <span>{bedrooms}</span>
                </div>
              )}
              {bathrooms && (
                <div className="flex items-center gap-1">
                  <Bath className="w-4 h-4" />
                  <span>{bathrooms}</span>
                </div>
              )}
              {area && (
                <div className="flex items-center gap-1">
                  <Square className="w-4 h-4" />
                  <span>{area} sqft</span>
                </div>
              )}
            </div>
          )}

          {/* Price */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div>
              <p className="text-2xl font-display font-bold text-primary">
                {formatPrice(price)}
              </p>
              {category === "RENT" && (
                <p className="text-xs text-muted-foreground">per month</p>
              )}
            </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-accent hover:underline">
              View Details →
            </span>
          </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

