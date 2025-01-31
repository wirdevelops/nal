interface OptimizationOptions {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    format?: 'jpeg' | 'png' | 'webp';
    preserveMetadata?: boolean;
  }
  
  export async function optimizeImage(
    file: File | Blob,
    options: OptimizationOptions = {}
  ): Promise<Blob> {
    const {
      maxWidth = 1920,
      maxHeight = 1080,
      quality = 0.8,
      format = 'jpeg',
      preserveMetadata = false
    } = options;
  
    // Create a temporary URL for the image
    const url = URL.createObjectURL(file);
    
    try {
      // Load the image
      const image = await createImage(url);
      
      // Calculate dimensions
      const { width, height } = calculateDimensions(
        image.width,
        image.height,
        maxWidth,
        maxHeight
      );
      
      // Create canvas
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      
      // Draw image
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');
      
      ctx.drawImage(image, 0, 0, width, height);
  
      // Convert to desired format
      const mimeType = `image/${format}`;
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to create blob'));
            }
          },
          mimeType,
          quality
        );
      });
  
      // If preserving metadata, combine original metadata with new image
      if (preserveMetadata && 'arrayBuffer' in file) {
        // const originalBuffer = await file.arrayBuffer();
        // const optimizedBuffer = await blob.arrayBuffer();
        
        // Here you could add logic to preserve EXIF data if needed
        // For now, we'll just return the optimized blob
        return blob;
      }
  
      return blob;
    } finally {
      // Clean up the temporary URL
      URL.revokeObjectURL(url);
    }
  }
  
  // Helper function to create an image from a URL
  function createImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  }
  
  // Helper function to calculate dimensions while maintaining aspect ratio
  function calculateDimensions(
    originalWidth: number,
    originalHeight: number,
    maxWidth: number,
    maxHeight: number
  ): { width: number; height: number } {
    let width = originalWidth;
    let height = originalHeight;
  
    // Scale down if necessary
    if (width > maxWidth) {
      height = (height * maxWidth) / width;
      width = maxWidth;
    }
  
    if (height > maxHeight) {
      width = (width * maxHeight) / height;
      height = maxHeight;
    }
  
    return { width: Math.round(width), height: Math.round(height) };
  }
  
  // Function to generate different sizes for responsive images
  export async function generateResponsiveSizes(
    file: File | Blob,
    sizes: number[] = [640, 960, 1280, 1920]
  ): Promise<Blob[]> {
    return Promise.all(
      sizes.map(size =>
        optimizeImage(file, {
          maxWidth: size,
          maxHeight: Math.round(size * 9/16), // Assuming 16:9 aspect ratio
          quality: 0.8,
          format: 'webp' // Modern format with good compression
        })
      )
    );
  }
  
  // Function to analyze image and suggest optimization strategies
  export async function analyzeImage(file: File): Promise<{
    size: number;
    dimensions: { width: number; height: number };
    format: string;
    suggestions: string[];
  }> {
    const url = URL.createObjectURL(file);
    const img = await createImage(url);
  
    try {
      const suggestions: string[] = [];
  
      // Check size
      if (file.size > 1024 * 1024) { // If larger than 1MB
        suggestions.push('Image size is large. Consider using compression.');
      }
  
      // Check dimensions
      if (img.width > 1920 || img.height > 1080) {
        suggestions.push('Image dimensions are very large. Consider resizing.');
      }
  
      // Check format
      const format = file.type.split('/')[1];
      if (!['webp', 'avif'].includes(format)) {
        suggestions.push('Consider using modern image formats like WebP or AVIF.');
      }
  
      // Aspect ratio check
      const aspectRatio = img.width / img.height;
      if (Math.abs(aspectRatio - 16/9) > 0.1) {
        suggestions.push('Image aspect ratio is not 16:9. Consider cropping.');
      }
  
      return {
        size: file.size,
        dimensions: {
          width: img.width,
          height: img.height
        },
        format,
        suggestions
      };
    } finally {
      URL.revokeObjectURL(url);
    }
  }
  
  // Function to auto-optimize image based on analysis
  export async function autoOptimizeImage(file: File): Promise<Blob> {
    const analysis = await analyzeImage(file);
    
    const options: OptimizationOptions = {
      maxWidth: 1920,
      maxHeight: 1080,
      quality: 0.8,
      format: 'webp'
    };
  
    // Adjust quality based on file size
    if (analysis.size > 2 * 1024 * 1024) { //If larger than 2MB
      options.quality = 0.6;
    } else if (analysis.size > 1024 * 1024) { // If larger than 1MB
      options.quality = 0.7;
    }
  
    // Adjust dimensions if needed
    if (analysis.dimensions.width > 3840 || analysis.dimensions.height > 2160) {
      options.maxWidth = 1920;
      options.maxHeight = 1080;
    }
  
    return optimizeImage(file, options);
  }