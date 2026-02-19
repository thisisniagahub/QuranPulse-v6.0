import fitz  # PyMuPDF
import os
import json
import time
from dotenv import load_dotenv
import google.generativeai as genai
import logging

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Load environment variables from .env file
load_dotenv()

# --- Configuration ---
# Ensure your .env file has GOOGLE_API_KEY
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    logging.error("GOOGLE_API_KEY not found in .env file. Please set it.")
    exit(1)

genai.configure(api_key=GOOGLE_API_KEY)

# Directory setup
PDF_DIR = "public/books"
IMAGE_OUTPUT_DIR = "public/iqra_images"
JSON_OUTPUT_DIR = "public/iqra_json"

os.makedirs(IMAGE_OUTPUT_DIR, exist_ok=True)
os.makedirs(JSON_OUTPUT_DIR, exist_ok=True)

# --- PDF to Image Conversion ---
def convert_pdf_to_images(pdf_path, output_folder):
    images = []
    try:
        doc = fitz.open(pdf_path)
        logging.info(f"Converting {pdf_path} to images. Total pages: {doc.page_count}")
        for page_num in range(doc.page_count):
            page = doc.load_page(page_num)
            pix = page.get_pixmap()
            
            image_filename = os.path.join(output_folder, f"{os.path.basename(pdf_path).replace('.pdf', '')}_page_{page_num + 1}.png")
            pix.save(image_filename)
            images.append(image_filename)
            logging.info(f"Saved: {image_filename}")
        doc.close()
    except Exception as e:
        logging.error(f"Error converting PDF {pdf_path}: {e}")
    return images

# --- Gemini Vision AI Processing ---
def get_gemini_vision_response(image_path, prompt):
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        with open(image_path, "rb") as image_file:
            image_data = image_file.read()

        image_part = {
            'mime_type': 'image/png', # Assuming PNG, adjust if needed
            'data': image_data
        }

        response = model.generate_content([prompt, image_part], request_options={"timeout": 600})
        # Check if text is present and not just a citation
        if response.candidates and response.candidates[0].content.parts:
            text_response = response.candidates[0].content.parts[0].text
            # Attempt to parse JSON, handle cases where AI wraps JSON in markdown block
            try:
                # Remove markdown code block if present
                if text_response.strip().startswith("```json") and text_response.strip().endswith("```"):
                    text_response = text_response.strip()[7:-3].strip()
                return json.loads(text_response)
            except json.JSONDecodeError as e:
                logging.error(f"JSON Decode Error for {image_path}: {e}")
                logging.error(f"AI Raw Response (might not be JSON): {text_response[:500]}...")
                return None
        return None
    except Exception as e:
        logging.error(f"Error with Gemini Vision API for {image_path}: {e}")
        # Log specific details if available
        if hasattr(e, 'response') and hasattr(e.response, 'text'):
            logging.error(f"API Error Response: {e.response.text}")
        return None

# --- Main Digitization Process ---
def digitize_iqra_book(pdf_filename):
    pdf_path = os.path.join(PDF_DIR, pdf_filename)
    book_id = os.path.basename(pdf_filename).replace('.pdf', '')
    
    if not os.path.exists(pdf_path):
        logging.error(f"PDF file not found: {pdf_path}")
        return

    logging.info(f"Starting digitization for {pdf_filename}...")

    # 1. Convert PDF pages to images
    page_images = convert_pdf_to_images(pdf_path, IMAGE_OUTPUT_DIR)
    
    if not page_images:
        logging.error("No images converted from PDF. Exiting.")
        return

    # 2. Process each image with Gemini Vision AI
    digitized_pages = []
    for i, image_path in enumerate(page_images):
        logging.info(f"Processing image {i+1}/{len(page_images)}: {image_path}")
        prompt = f"""
            Analyze this image of an Iqra learning page (Arabic alphabet and words).
            Identify every distinct Arabic character, short word, or segment that is meant to be learned or read aloud.
            For each identified item, provide:
            1. "text_arabic": The exact Arabic text identified.
            2. "transliteration_rumi": The most accurate Rumi transliteration for pronunciation (e.g., "Ba", "Ta", "Bismillaah").
            3. "bounding_box": The bounding box coordinates [x_min, y_min, x_max, y_max] in pixels relative to the image size.
            4. "type": "character", "word", or "phrase" depending on the segment.
            
            Return the result strictly as a JSON array of objects.
            Example for a page:
            [
              {{"text_arabic": "بَ", "transliteration_rumi": "Ba", "bounding_box": [100, 50, 150, 100], "type": "character"}},
              {{"text_arabic": "تَ", "transliteration_rumi": "Ta", "bounding_box": [180, 50, 230, 100], "type": "character"}},
              {{"text_arabic": "سَمِعَ", "transliteration_rumi": "Sami'a", "bounding_box": [100, 120, 250, 150], "type": "word"}}
            ]
            Ensure accuracy for Arabic text and provide clean JSON. Do not include introductory or concluding remarks.
        """
        
        vision_result = get_gemini_vision_response(image_path, prompt)
        
        if vision_result:
            digitized_pages.append({
                "book_id": book_id,
                "page_number": i + 1,
                "image_path": image_path.replace('public/', ''), # Relative path for web
                "segments": vision_result
            })
            logging.info(f"Successfully digitized page {i+1}. Found {len(vision_result)} segments.")
        else:
            logging.warning(f"No valid JSON response for {image_path}. Skipping page.")
        
        # Add a delay to avoid hitting API rate limits
        time.sleep(10 + i) # 10 seconds + sequential delay

    # 3. Save all digitized pages to a single JSON file for the book
    json_output_path = os.path.join(JSON_OUTPUT_DIR, f"{book_id}_digitized.json")
    with open(json_output_path, 'w', encoding='utf-8') as f:
        json.dump(digitized_pages, f, ensure_ascii=False, indent=2)
    logging.info(f"Full digitization for {pdf_filename} complete. Saved to {json_output_path}")

# --- Example Usage (Process Iqra 1) ---
if __name__ == "__main__":
    # Ensure GOOGLE_API_KEY is set in your .env file
    # Example: digitize_iqra_book("buku-iqra-1 (1).pdf")
    
    # User needs to choose which PDF to process
    logging.info("Please uncomment the digitize_iqra_book call below and provide a valid PDF filename.")
    logging.info("Example: digitize_iqra_book('buku-iqra-1 (1).pdf')")
    
    # --- UNCOMMENT AND MODIFY BELOW TO RUN ---
    # digitize_iqra_book("buku-iqra-1 (1).pdf")
