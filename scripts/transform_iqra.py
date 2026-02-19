import json
import os
import re

# Source and Target Directories
SOURCE_DIR = r"h:\ANTIGRAVITY\QuranPulse-v6.0\public\iqra_json"
OUTPUT_FILE_PREFIX = "iqra-"

# Helper to group segments into lines
# Since we don't have Y-coordinates reliably in all files (or easy to parse logic without visual rendering),
# We will use valid assumptions:
# 1. Segments are ordered by ID (e.g., 2-1-1, 2-1-2).
# 2. We can try to group them. If `type` is "word", it's a unit.
# 3. For now, we'll just gather all Arabic text for a page and try to format it nicely or just dump it as lines.
#    The user wants "page" structure.
#    We will group by 'type' -> 'word' implies a chunk.
#    Since we don't know line breaks, we might have to make an educated guess or just put them in a list.
#    Actually, the `text_arabic` in "word" segments usually contains spaces if it's multiple chars.
#    Let's look at the source `iqra-2.json` snippet:
#    {"id": "2-1-1", "text_arabic": "اِ", ...} -> char
#    {"id": "2-1-9", "text_arabic": "بِ اِ", ...type: word} -> word
#    It seems later segments (words) might overlap or repeat earlier (chars)?
#    NO. Page 1 has chars 1-8, then words 9-12.
#    Visual layout: Chars are usually at the top (Title/Intro). Words are the exercises below.
#    We will combine them.

def transform_json(book_num):
    filename = f"iqra-{book_num}.json"
    filepath = os.path.join(SOURCE_DIR, filename)
    
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return

    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)

    new_book_data = []

    # Data is a list of pages
    for page in data:
        page_num = page.get('page_number')
        title = page.get('title', f"Page {page_num}")
        
        # Placeholder instructions (User can fill these later)
        instruction_jawi = "باچ دڠن ڤينديق" # Generic placeholder
        instruction_rumi = "Baca dengan pendek." # Generic placeholder

        segments = page.get('segments', [])
        
        # Strategy:
        # We need to form "Content Lines".
        # Existing JSON has separated `character` segments and `word` segments.
        # Often `character` segments are the "intro" at the top.
        # `word` segments are the practice lines.
        # We will collect `text_arabic` from all segments in order.
        # To avoid just one giant line, we can maybe group every 3-4 items into a line?
        # Or checking the `bounding_box`? 
        # Bounding box format: [x, y, w, h]? Or [x, y, right, bottom]?
        # Snippet: "bounding_box": [15, 12, 30, 28]. y=12.
        # Next: "bounding_box": [35, 12, ...]. y=12. -> Same line.
        # Next: "bounding_box": [15, 32, ...]. y=32. -> New line.
        # PERFECT. We can use Y-coordinate to group lines!
        # [x, y, ...] -> Index 1 is Y.

        lines_map = {} # Y-coord -> list of texts

        for seg in segments:
            bbox = seg.get('bounding_box', [])
            if len(bbox) >= 2:
                y = bbox[1]
                # Fuzzy grouping for Y (tolerance of e.g. 5 pixels)
                found_y = None
                for existing_y in lines_map.keys():
                    if abs(existing_y - y) < 5:
                        found_y = existing_y
                        break
                
                if found_y is None:
                    found_y = y
                    lines_map[found_y] = []
                
                lines_map[found_y].append(seg)
        
        # Sort Y keys (Top to Bottom)
        sorted_ys = sorted(lines_map.keys())
        
        content_lines = []
        for y in sorted_ys:
            row_segments = lines_map[y]
            # Sort individual line segments by X (Right to Left for Arabic? Or Left to Right in JSON?)
            # Valid JSON usually stores X as left-edge.
            # Arabic is RTL. But the visual "sequence" in the book is:
            # Rightmost item is read first.
            # Let's verify X.
            # 1-1-1: x=15. Text: "A". (Right side? Or Left side?)
            # 1-1-2: x=35. Text: "Ba".
            # If standard coordinate system (0,0 top-left), X=15 is Left, X=35 is Right.
            # So 1-1-1 is Left. 1-1-2 is Right.
            # Arabic: Ali (Right) -> Ba (Left)? 
            # Wait. "Alif" is usually first. "Ba" second.
            # If 1-1-1 is Alif and at x=15, and 1-1-2 is Ba at x=35... that reads Left-to-Right.
            # User snippet: "أَ بَ". Alif then Ba.
            # If visual is 15 then 35, that's Left to Right.
            # BUT Arabic books are RTL.
            # Usually Page 1: Top Right is Alif?
            # Let's stick to the Segment ID order or simple X sorting?
            # User's JSON for P1: "أَ بَ"
            # Source JSON P1: 1-1-1 "A", 1-1-2 "Ba".
            # So Segment Order corresponds to Read Order (Sequence).
            # We will use Segment Order within the line (assuming segments are sorted by ID in source, which they seem to be).
            # Let's cross check: `row_segments` might need sorting by ID.
            
            row_segments.sort(key=lambda s: s['id']) # Trust ID order for sequence
            
            line_text = " ".join([s['text_arabic'] for s in row_segments])
            content_lines.append(line_text)

        new_page = {
            "page": page_num,
            "title": title,
            "instruction_jawi": instruction_jawi, # Placeholder
            "instruction_rumi": instruction_rumi, # Placeholder
            "content": content_lines
        }
        new_book_data.append(new_page)

    final_json = {f"Iqra_{book_num}": new_book_data}
    
    # Write to file
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(final_json, f, ensure_ascii=False, indent=4)
    
    print(f"Transformed Iqra {book_num}")

# Run for 2 to 6
for i in range(2, 7):
    transform_json(i)
