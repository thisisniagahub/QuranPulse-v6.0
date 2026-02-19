import json

FILE_PATH = "public/iqra_json/iqra-1.json"

# Generic instructions for Iqra 1
INSTR_JAWI = "باچ تروس دغن ڤينديق. تيدق ڤرلو دايجا."
INSTR_RUMI = "Baca terus dengan pendek. Tidak perlu dieja."

def improve_page(page):
    # Only process if content exists and seems to be the "short line" style
    content = page.get("content", [])
    if not content:
        return page

    # ADD INSTRUCTIONS if missing
    if "instruction_jawi" not in page:
        page["instruction_jawi"] = INSTR_JAWI
    if "instruction_rumi" not in page:
        page["instruction_rumi"] = INSTR_RUMI

    # IMPROVE LAYOUT (Merge short lines)
    # Check if lines are mostly short (e.g., < 10 chars implies 3 Arabic letters + spaces)
    # and if we have enough lines to justify merging.
    
    # Heuristic: If we have > 6 lines, we likely need to merge to fit the "dense" style.
    if len(content) > 6:
        new_content = []
        
        # Keep the first line as "Intro/Title Line" (usually 2-3 letters)
        new_content.append(content[0])
        
        # Process the rest pairs
        buffer_line = None
        
        for line in content[1:]:
            if buffer_line:
                # Merge current line with buffer
                merged = f"{buffer_line}   {line}" # 3 spaces gap
                new_content.append(merged)
                buffer_line = None
            else:
                buffer_line = line
        
        # If odd number of practice lines, append the last one
        if buffer_line:
            new_content.append(buffer_line)
            
        page["content"] = new_content

    return page

def main():
    with open(FILE_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    iqra_1 = data.get("Iqra_1", [])
    
    # Process pages 3 onwards (Indices 2 to end)
    # Note: Page 1 and 2 are already "Fixed" by manual user request so we skip them?
    # User said "improve kan muka surat seterusnya" (next pages).
    # Assuming P1 (index 0) and P2 (index 1) are good.
    
    improved_iqra_1 = []
    improved_iqra_1.append(iqra_1[0]) # P1
    improved_iqra_1.append(iqra_1[1]) # P2
    
    for page in iqra_1[2:]:
        improved_page = improve_page(page)
        improved_iqra_1.append(improved_page)
        
    data["Iqra_1"] = improved_iqra_1
    
    with open(FILE_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=4)
    
    print("Iqra 1 Improved Successfully.")

if __name__ == "__main__":
    main()
