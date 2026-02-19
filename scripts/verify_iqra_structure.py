import json

FILE_PATH = "public/iqra_json/iqra-1.json"

def verify_page(page):
    page_num = page.get("page")
    content = page.get("content", [])
    
    issues = []
    
    # 1. Check Line Count (Should be 7: Intro + 5 + 1)
    if len(content) != 7:
        issues.append(f"Line count is {len(content)}, expected 7.")
    
    # 2. Check Spacing Patterns
    if len(content) >= 7:
        # Intro (Line 0) - No strict check, just existence
        if not content[0].strip():
            issues.append("Line 0 (Intro) is empty.")
            
        # Lines 1-5 (Indices 1-5) -> Should be "Group   Group" (3 spaces)
        # And roughly 6 items (though counting Arabic letters is tricky string-wise, checking for the gap is solid)
        for i in range(1, 6):
            if "   " not in content[i]:
                 issues.append(f"Line {i} missing 3-space gap.")
            else:
                parts = content[i].split("   ")
                if len(parts) != 2:
                     issues.append(f"Line {i} split incorrectly (found {len(parts)} parts, expected 2).")

        # Line 6 (Index 6) -> Should be "Group   Group   Group" (3 spaces x 2)
        final_line = content[6]
        if final_line.count("   ") < 2:
             issues.append(f"Line 6 (Final) missing dual 3-space gaps (found count: {final_line.count('   ')}).")
    
    if issues:
        return f"Page {page_num}: " + "; ".join(issues)
    return None

def main():
    try:
        with open(FILE_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error loading file: {e}")
        return

    iqra_1 = data.get("Iqra_1", [])
    errors = []
    
    for page in iqra_1:
        result = verify_page(page)
        if result:
            errors.append(result)
            
    if errors:
        print(f"Found {len(errors)} pages with issues:")
        for e in errors:
            print(e)
    else:
        print("All pages passed strict structural verification (7 lines, correct spacing).")

if __name__ == "__main__":
    main()
