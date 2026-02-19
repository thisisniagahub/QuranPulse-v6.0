"""
PDF Text Extractor for QuranPulse CONTENT_DATA
Extracts text from all PDFs and saves to markdown files
"""

import os
from pathlib import Path

try:
    import pypdf
except ImportError:
    print("Installing pypdf...")
    os.system("pip install pypdf")
    import pypdf

def extract_pdf_text(pdf_path: Path) -> str:
    """Extract all text from a PDF file."""
    try:
        reader = pypdf.PdfReader(str(pdf_path))
        text_parts = []

        for i, page in enumerate(reader.pages, 1):
            page_text = page.extract_text()
            if page_text:
                text_parts.append(f"\n--- PAGE {i} ---\n")
                text_parts.append(page_text)

        return "".join(text_parts)
    except Exception as e:
        return f"ERROR extracting {pdf_path.name}: {str(e)}"

def main():
    # Paths
    content_dir = Path(r"H:\ANTIGRAVITY\QuranPulse-v6.0\CONTENT_DATA")
    output_dir = content_dir / "extracted_text"
    output_dir.mkdir(exist_ok=True)

    # Find all PDFs
    pdf_files = list(content_dir.glob("*.pdf"))
    print(f"Found {len(pdf_files)} PDF files\n")

    # Extract each PDF
    all_content = []

    for pdf_path in pdf_files:
        print(f"Extracting: {pdf_path.name}...")

        # Extract text
        text = extract_pdf_text(pdf_path)

        # Save individual file
        output_file = output_dir / f"{pdf_path.stem}.md"
        with open(output_file, "w", encoding="utf-8") as f:
            f.write(f"# {pdf_path.name}\n\n")
            f.write(text)

        # Add to combined content
        all_content.append(f"\n\n{'='*60}\n# {pdf_path.name}\n{'='*60}\n")
        all_content.append(text)

        print(f"  ✅ Saved to {output_file.name}")

    # Save combined file
    combined_file = output_dir / "_ALL_CONTENT.md"
    with open(combined_file, "w", encoding="utf-8") as f:
        f.write("# COMBINED PDF CONTENT\n\n")
        f.write(f"Extracted from {len(pdf_files)} files\n\n")
        f.write("".join(all_content))

    print(f"\n✅ All content saved to: {output_dir}")
    print(f"📄 Combined file: {combined_file}")

if __name__ == "__main__":
    main()
