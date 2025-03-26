/**
 * Utility function to handle image fallbacks
 * @param imagePath The original image path
 * @param width Width for the placeholder
 * @param height Height for the placeholder
 * @returns A valid image path or a placeholder
 */
export function getImageWithFallback(imagePath: string, width = 400, height = 400): string {
  // If the image path is already a placeholder or starts with http/https, return it as is
  if (imagePath.includes("placeholder.svg") || imagePath.startsWith("http")) {
    return imagePath
  }

  // In a real application, you might check if the file exists
  // For now, we'll just return the original path and rely on Next.js Image component's error handling
  return imagePath || `/placeholder.svg?height=${height}&width=${width}`
}

/**
 * Get a placeholder image URL with specific dimensions
 */
export function getPlaceholder(width: number, height: number): string {
  return `/placeholder.svg?height=${height}&width=${width}`
}

