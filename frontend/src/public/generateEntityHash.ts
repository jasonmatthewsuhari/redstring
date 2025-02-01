export const generateEntityHash = (name: string): string => {
  if (!name) return "";

  // Extract initials from name
  const initials = name
    .split(" ")
    .map((word) => word[0].toUpperCase())
    .join("");

  // Generate a random 4-character alphanumeric string
  const array = new Uint8Array(4);
  window.crypto.getRandomValues(array);
  const randomPart = Array.from(array)
    .map((byte) => (byte % 36).toString(36).toUpperCase())
    .join("");

  // Generate an 8-character hash using a simple hashing method
  const hash = btoa(unescape(encodeURIComponent(name)))
    .replace(/[^A-Za-z0-9]/g, "")
    .substring(0, 8)
    .toUpperCase();

  return `${initials}${randomPart}${hash}`;
};
