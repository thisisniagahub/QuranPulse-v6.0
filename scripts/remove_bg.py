from PIL import Image
import os

def remove_black_background(input_path, output_path):
    """Remove black/dark background from image and make it true transparent"""
    print(f"Processing: {input_path}")
    try:
        img = Image.open(input_path).convert("RGBA")
        width, height = img.size
        pixels = img.load()
        
        for y in range(height):
            for x in range(width):
                r, g, b, a = pixels[x, y]
                # Threshold for black/dark gray. 
                # Since these are neon icons, we want to keep the bright colors but remove the dark background.
                # Threshold of 30-40 usually works well for deep blacks.
                if r < 40 and g < 40 and b < 40:
                    # Make it transparent
                    pixels[x, y] = (0, 0, 0, 0)
        
        img.save(output_path, "PNG")
        print(f"✓ Saved transparent: {output_path}")
    except Exception as e:
        print(f"Error processing {input_path}: {e}")

icons_dir = r"h:\ANTIGRAVITY\QuranPulse-v6.0\src\assets\icons"

target_icons = [
    "nav-home-neon.png",
    "nav-quran-neon.png",
    "nav-qiblat-neon.png",
    "nav-iqra-neon.png"
]

for icon in target_icons:
    full_path = os.path.join(icons_dir, icon)
    # Overwrite the file with transparent version
    remove_black_background(full_path, full_path)

print("\nAll neon icons processed to be transparent!")
