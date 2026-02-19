import yt_dlp
import os

def download_facebook_reel(url, output_folder="downloads"):
    # Create downloads folder if it doesn't exist
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    # yt-dlp options
    ydl_opts = {
        'outtmpl': f'{output_folder}/%(title)s.%(ext)s',  # Save to 'downloads' folder with video title
        'format': 'best',  # Download best quality available
        'noplaylist': True, # Ensure only single video is downloaded
    }

    print(f"🚀 Memulakan download untuk: {url}")
    
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            # Extract info first to show title
            info = ydl.extract_info(url, download=False)
            print(f"🎥 Tajuk Video: {info.get('title', 'Unknown')}")
            
            # Download
            ydl.download([url])
            print(f"✅ Download berjaya! Disimpan dalam folder '{output_folder}'")
            
    except Exception as e:
        print(f"❌ Ralat berlaku: {str(e)}")

if __name__ == "__main__":
    # URL yang diberikan
    video_url = "https://www.facebook.com/reel/3256180354563671"
    
    download_facebook_reel(video_url)
