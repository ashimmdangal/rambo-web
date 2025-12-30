"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, MapPin } from "lucide-react";
import PropertyCard from "@/components/property/PropertyCard";
import Link from "next/link";

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      const response = await fetch("/api/bookmarks");
      if (response.ok) {
        const data = await response.json();
        setBookmarks(data.bookmarks || []);
      }
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookmarkRemove = (propertyId: string) => {
    setBookmarks(bookmarks.filter((b) => b.propertyId !== propertyId));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="container mx-auto">
          <p className="text-muted-foreground">Loading bookmarks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-display font-bold text-primary">
            My Bookmarks
          </h1>
        </div>

        {bookmarks.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg text-muted-foreground mb-4">
              No bookmarks yet
            </p>
            <Link
              href="/"
              className="px-6 py-2.5 bg-accent text-primary font-semibold rounded-md hover:bg-accent/90 transition-colors inline-block"
            >
              Browse Properties
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {bookmarks.map((bookmark) => (
              <motion.div
                key={bookmark.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <PropertyCard
                  id={bookmark.property.id}
                  title={bookmark.property.title}
                  location={`${bookmark.property.city}, ${bookmark.property.state || ""}`}
                  price={bookmark.property.price}
                  image={bookmark.property.images[0] || ""}
                  type={bookmark.property.type}
                  category={bookmark.property.category}
                  bedrooms={bookmark.property.bedrooms || undefined}
                  bathrooms={bookmark.property.bathrooms || undefined}
                  area={bookmark.property.area || undefined}
                  isBookmarked={true}
                  onBookmark={() => handleBookmarkRemove(bookmark.property.id)}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

