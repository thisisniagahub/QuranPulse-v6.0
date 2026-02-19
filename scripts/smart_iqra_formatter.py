import json
import os

# Files to process
FILES = [
    "public/iqra_json/iqra-1.json",
    "public/iqra_json/iqra-2.json",
    "public/iqra_json/iqra-3.json",
    "public/iqra_json/iqra-4.json",
    "public/iqra_json/iqra-5.json",
    "public/iqra_json/iqra-6.json"
]

# Instructions
INSTR_JAWI = "باچ تروس دغن ڤينديق. تيدق ڤرلو دايجا."
INSTR_RUMI = "Baca terus dengan pendek. Tidak perlu dieja."

def format_line(line_str):
    """
    Format a single line of Arabic text by adding grouping spaces.
    Rules:
    - 6 items: "1 2 3   4 5 6" (3+3)
    - 4 items: "1 2   3 4" (2+2)
    - 5 items: "1 2 3   4 5" (3+2) or "1 2   3 4 5" (2+3)? Let's do 3+2.
    - 2 items: "1   2" (1+1) if they are words? Or just "1 2"? 
      Standard practice seems to be grouping chunks.
      If it's just 2 letters like the intro line, usually keep them close.
      Let's use a heuristic: Group if > 3 items.
    """
    # Clean up multiple spaces first to get raw items
    items = [x for x in line_str.split(' ') if x.strip()]
    count = len(items)
    
    if count == 6:
        return f"{' '.join(items[:3])}   {' '.join(items[3:])}"
    elif count == 5:
         return f"{' '.join(items[:3])}   {' '.join(items[3:])}"
    elif count == 4:
         return f"{' '.join(items[:2])}   {' '.join(items[2:])}"
    elif count == 8: # Sometimes occurs
         return f"{' '.join(items[:4])}   {' '.join(items[4:])}"
    else:
        # Just return uniformly spaced
        return " ".join(items)

def process_file(file_path):
    if not os.path.exists(file_path):
        print(f"Skipping {file_path}, not found.")
        return

    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    # Key is usually "Iqra_X"
    keys = list(data.keys())
    if not keys: return
    main_key = keys[0]
    
    pages = data[main_key]
    new_pages = []
    
    for page in pages:
        # Ensure instructions exist
        if "instruction_jawi" not in page:
             page["instruction_jawi"] = INSTR_JAWI
        if "instruction_rumi" not in page:
             page["instruction_rumi"] = INSTR_RUMI
             
        # Format content
        raw_content = page.get("content", [])
        new_content = []
        for line in raw_content:
            new_line = format_line(line)
            new_content.append(new_line)
            
        page["content"] = new_content
        new_pages.append(page)
        
    data[main_key] = new_pages
    
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=4)
    print(f"Processed {file_path}")

def main():
    for f in FILES:
        process_file(f)

if __name__ == "__main__":
    main()
