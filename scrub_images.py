#!/usr/bin/env python3
"""
Image Metadata Scrubber
Strips all EXIF and metadata from images to protect location privacy.

Requirements:
    pip install Pillow

Usage:
    python scrub_images.py
"""

import os
import sys
from pathlib import Path
from PIL import Image
from PIL.ExifTags import TAGS

def scrub_image_metadata(image_path):
    """
    Remove all EXIF and metadata from an image file.
    
    Args:
        image_path: Path to the image file
        
    Returns:
        bool: True if metadata was removed, False otherwise
    """
    try:
        # Open the image
        img = Image.open(image_path)
        
        # Get original format
        original_format = img.format
        
        # Create a new image without EXIF data by copying pixel data only
        # This automatically strips all metadata (EXIF, IPTC, XMP, etc.)
        data = list(img.getdata())
        image_without_exif = Image.new(img.mode, img.size)
        image_without_exif.putdata(data)
        
        # Save without EXIF data
        # Use the same format as original
        if original_format == 'JPEG':
            image_without_exif.save(image_path, 'JPEG', quality=95, optimize=True)
        elif original_format == 'PNG':
            image_without_exif.save(image_path, 'PNG', optimize=True)
        else:
            # For other formats, try to save in original format
            image_without_exif.save(image_path, format=original_format)
        
        # Close images
        img.close()
        image_without_exif.close()
        
        return True
        
    except Exception as e:
        print(f"  ❌ Error processing {image_path}: {str(e)}", file=sys.stderr)
        return False

def find_images(directories):
    """
    Find all JPEG and PNG images in the specified directories.
    
    Args:
        directories: List of directory paths to search
        
    Returns:
        list: List of image file paths
    """
    image_extensions = {'.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG'}
    images = []
    
    for directory in directories:
        dir_path = Path(directory)
        if not dir_path.exists():
            print(f"⚠️  Directory not found: {directory}", file=sys.stderr)
            continue
            
        # Recursively find all image files
        for ext in image_extensions:
            images.extend(dir_path.rglob(f'*{ext}'))
    
    return images

def main():
    """Main function to scrub image metadata."""
    print("🔒 Image Metadata Scrubber")
    print("=" * 50)
    
    # Directories to scan
    directories_to_scan = [
        'static',
        'themes/mussell-portfolio/assets',
        'themes/mussell-portfolio/static'
    ]
    
    # Find all images
    print("\n📁 Scanning for images...")
    images = find_images(directories_to_scan)
    
    if not images:
        print("✅ No images found to process.")
        return 0
    
    print(f"📸 Found {len(images)} image(s) to process\n")
    
    # Process each image
    success_count = 0
    failed_count = 0
    
    for image_path in images:
        print(f"Processing: {image_path}")
        if scrub_image_metadata(image_path):
            print(f"  ✅ Metadata removed successfully")
            success_count += 1
        else:
            failed_count += 1
        print()
    
    # Summary
    print("=" * 50)
    print(f"✅ Successfully processed: {success_count}")
    if failed_count > 0:
        print(f"❌ Failed: {failed_count}", file=sys.stderr)
    print("\n🔒 All image metadata has been scrubbed for privacy protection.")
    
    return 0 if failed_count == 0 else 1

if __name__ == '__main__':
    # Check if Pillow is installed
    try:
        from PIL import Image
    except ImportError:
        print("❌ Error: Pillow library not found.", file=sys.stderr)
        print("   Install it with: pip install Pillow", file=sys.stderr)
        sys.exit(1)
    
    sys.exit(main())

