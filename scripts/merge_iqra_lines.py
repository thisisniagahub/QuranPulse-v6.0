import json
import os

FILE_PATH = "public/iqra_json/iqra-1.json"

def merge_lines(page):
    content = page.get("content", [])
    if not content: return page
    
    # Heuristic: If we have many short lines (e.g. 3 items), merge them into pairs.
    # Exclude the first line if it's an intro? P3 line 1 is "Ba Ta Tsa" (3 items). P1 line 1 was 2 items.
    
    # Let's clean the items first.
    clean_lines = [line.strip() for line in content]
    
    # If a line has 3 items (words separated by spaces), it's a candidate for merging with the next.
    # If a line has 6 items, it's already merged.
    
    new_content = []
    buffer = None
    
    # Strategy:
    # Iterate through lines.
    # If line is "short" (e.g. <= 4 items), try to pair it with next.
    # If line is "long" (>= 5 items), keep it as is.
    
    for line in clean_lines:
        items = [x for x in line.split(' ') if x.strip()]
        
        # Exception for Intro lines? 
        # Page 3 Line 1: "Ba Ta Tsa" (3 items). 
        # If we buffer it, it merges with Line 2. 
        # "Ba Ta Tsa   Tsa A Ba". -> 6 items. This looks like a valid drill line.
        # Page 1 Line 1: "A Ba" (2 items). Merging with Line 2 "Ba A Ba" (3 items) -> 5 items. Asymmetric.
        # User accepted Page 1 Line 1 as separate. 
        # So maybe keep Line 1 separate IF it's very short (2 items)? 
        # Page 3 Line 1 is 3 items. 
        
        # Let's try merging everything except 2-item lines?
        if len(items) <= 3:
            if buffer:
                # Merge!
                # Ensure "   " spacing
                merged = f"{buffer}   {line}"
                new_content.append(merged)
                buffer = None
            else:
                buffer = line
        else:
            # Current line is long enough (e.g. 6 items), push buffer if any, then push this.
            if buffer:
                new_content.append(buffer) # Orphaned buffer
                buffer = None
            new_content.append(line)
            
    if buffer:
        new_content.append(buffer)
        
    page["content"] = new_content
    return page

def main():
    if not os.path.exists(FILE_PATH): return

    with open(FILE_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    iqra_1 = data.get("Iqra_1", [])
    new_pages = []
    
    # Apply to Page 3 onwards? 
    # Pages 1 and 2 are already perfect manual overrides.
    for i, page in enumerate(iqra_1):
        if i < 2: 
            new_pages.append(page)
        else:
            new_pages.append(merge_lines(page))
            
    data["Iqra_1"] = new_pages
    
    with open(FILE_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=4)
        
    print("Merged short lines for Iqra 1 (Pages 3+).")

if __name__ == "__main__":
    main()
