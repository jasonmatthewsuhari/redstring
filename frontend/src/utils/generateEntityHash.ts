import crypto from "crypto";

/**
 * Generate a unique hash for an entity based on its name.
 * Mimics the Python version: "Initials + Random Part + Hash"
 */
export const generateEntityHash = (name: string): string => {
  if (!name) return "";

  // Extract initials from name
  const initials = name
    .split(" ")
    .map((word) => word[0].toUpperCase())
    .join("");

  // Generate a random 4-character alphanumeric string
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();

  // Generate an 8-character hash from the name
  const hash = crypto.createHash("sha256").update(name).digest("hex").substring(0, 8);

  // Combine parts to create unique identifier
  return `${initials}${randomPart}${hash}`;
};
