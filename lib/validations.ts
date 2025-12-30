// Property type validation based on category

export const PROPERTY_TYPES = {
  HOUSE: "HOUSE",
  APARTMENT: "APARTMENT",
  ROOM: "ROOM",
  VILLA: "VILLA",
} as const;

export const PROPERTY_CATEGORIES = {
  RENT: "RENT",
  BUY: "BUY",
} as const;

// Allowed property types for each category
export const ALLOWED_TYPES_BY_CATEGORY = {
  [PROPERTY_CATEGORIES.RENT]: [
    PROPERTY_TYPES.ROOM,
    PROPERTY_TYPES.HOUSE,
    PROPERTY_TYPES.APARTMENT,
    PROPERTY_TYPES.VILLA,
  ],
  [PROPERTY_CATEGORIES.BUY]: [
    PROPERTY_TYPES.HOUSE,
    PROPERTY_TYPES.APARTMENT,
  ],
} as const;

/**
 * Get allowed property types for a given category
 */
export function getAllowedTypes(category: "RENT" | "BUY"): string[] {
  return ALLOWED_TYPES_BY_CATEGORY[category] as string[];
}

/**
 * Check if a property type is valid for a given category
 */
export function isValidTypeForCategory(
  type: string,
  category: "RENT" | "BUY"
): boolean {
  return getAllowedTypes(category).includes(type);
}

/**
 * Filter properties by category and type restrictions
 */
export function filterPropertiesByCategory<T extends { type: string; category: "RENT" | "BUY" }>(
  properties: T[]
): { rent: T[]; buy: T[] } {
  return {
    rent: properties.filter(
      (p) =>
        p.category === "RENT" &&
        isValidTypeForCategory(p.type, "RENT")
    ),
    buy: properties.filter(
      (p) =>
        p.category === "BUY" &&
        isValidTypeForCategory(p.type, "BUY")
    ),
  };
}

