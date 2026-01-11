from moviepy import VideoFileClip
import os

video_path = "downloads/AI in Action Summit – coming this January.mp4"
audio_output = "extracted_audio.mp3"

if os.path.exists(video_path):
    print(f"🎬 Processing: {video_path}")
    try:
        video = VideoFileClip(video_path)
        video.audio.write_audiofile(audio_output)
        print(f"✅ Audio extracted to: {audio_output}")
        video.close()
    except Exception as e:
        print(f"❌ Error: {e}")
else:
    print(f"❌ File not found: {video_path}")
