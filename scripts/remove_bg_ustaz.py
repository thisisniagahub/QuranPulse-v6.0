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
                # Keep gold/cyan, remove black
                if r < 40 and g < 40 and b < 40:
                    pixels[x, y] = (0, 0, 0, 0)
        
        img.save(output_path, "PNG")
        print(f"✓ Saved transparent: {output_path}")
    except Exception as e:
        print(f"Error processing {input_path}: {e}")

icons_dir = r"h:\ANTIGRAVITY\QuranPulse-v6.0\src\assets\icons"

# Only process the new Ustaz AI icon
target_icon = "nav-ustaz-ai.png"
full_path = os.path.join(icons_dir, target_icon)

remove_black_background(full_path, full_path)

print("\nUstaz AI icon background removed!")
