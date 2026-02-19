import json
import os

FILE_PATH = "public/iqra_json/iqra-1.json"

# Instructions
INSTR_JAWI = "باچ تروس دغن ڤينديق. تيدق ڤرلو دايجا."
INSTR_RUMI = "Baca terus dengan pendek. Tidak perlu dieja."

def clean_items(content_list):
    """Extract individual words/letters from the existing line-based content."""
    items = []
    for line in content_list:
        # Split by space and filter out empty strings
        parts = [p for p in line.split(' ') if p.strip()]
        items.extend(parts)
    return items

def generate_strict_page(page_data):
    original_content = page_data.get("content", [])
    if not original_content:
        return page_data

    items = clean_items(original_content)
    if not items:
        return page_data

    new_content = []

    # --- 1. Intro Line (Awal Baris) ---
    # Usually the first 2 or 3 items are the title letters.
    # We'll take the first 2 distinct items if possible, or just first 2.
    intro_items = items[:2]
    # If explicit specific letters are needed we rely on the source order.
    new_content.append(" ".join(intro_items))

    # Pattern for Drilling
    # We need to fill:
    # 5 Lines of (3 items + gap + 3 items)
    # 1 Line of (2 items + gap + 2 items + gap + 2 items)
    
    # We will use the 'items' pool (excluding the first few if they are just title repeats, 
    # but actually in Iqra drills, everything is reused).
    # Let's use the whole 'items' list and cycle through it to fill the lines.
    
    current_idx = 0
    total_items = len(items)

    def get_next_chunk(size):
        nonlocal current_idx
        chunk = []
        for _ in range(size):
            chunk.append(items[current_idx % total_items])
            current_idx += 1
        return chunk

    # --- 2. Lines Latihan 1-5 (3 + 3) ---
    for _ in range(5):
        group_left = get_next_chunk(3)  # Visually Right (Arabic starts right)
        group_right = get_next_chunk(3) # Visually Left
        
        # In JSON string: "RightGroup   LeftGroup" (since Arabic renders RTL)
        # Wait, if we write "A B C   D E F" in JSON:
        # Browser renders:   D E F   A B C  (RTL) 
        # OR:                A B C   D E F  (LTR) ?
        # Standard Editor: LTR.
        # User's Example Page 1: "أَ بَ" -> Visually Right "Alif", Left "Ba".
        # JSON: "أَ بَ". Alif is first char.
        # So First Char = Rightmost.
        # So we want: "RightGroup   LeftGroup"
        
        line = f"{' '.join(group_left)}   {' '.join(group_right)}"
        new_content.append(line)

    # --- 3. Line Latihan 6 (2 + 2 + 2) ---
    g1 = get_next_chunk(2)
    g2 = get_next_chunk(2)
    g3 = get_next_chunk(2)
    
    final_line = f"{' '.join(g1)}   {' '.join(g2)}   {' '.join(g3)}"
    new_content.append(final_line)

    # Update Page
    page_data["content"] = new_content
    page_data["instruction_jawi"] = INSTR_JAWI
    page_data["instruction_rumi"] = INSTR_RUMI
    
    return page_data

def main():
    if not os.path.exists(FILE_PATH):
        print("File not found.")
        return

    with open(FILE_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    iqra_1 = data.get("Iqra_1", [])
    
    # Apply to ALL pages in Iqra 1
    # User said "aku nak semua muka surat"
    new_iqra_1 = []
    
    # Note: Page 1 and 2 where manually fixed. 
    # Should we overwrite them? 
    # "aku nak semua muka surat ko kena generate data macam nie"
    # User implies the pattern applies everywhere.
    # The pattern matches Page 1's fix. So regenerating Page 1 should result in result ~similar to current, 
    # OR potentially better/more consistent cycling.
    # I will regenerate ALL to ensure total consistency.
    
    for page in iqra_1:
         # Preserve Title/Page Num, regenerate content
         new_page = generate_strict_page(page)
         new_iqra_1.append(new_page)
         
    data["Iqra_1"] = new_iqra_1
    
    with open(FILE_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=4)
        
    print("Strict generation complete for Iqra 1.")

if __name__ == "__main__":
    main()
