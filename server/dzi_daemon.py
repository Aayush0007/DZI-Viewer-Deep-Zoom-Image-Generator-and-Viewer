import os
import pyvips
import logging
import sys
from dotenv import load_dotenv  # Load environment variables from .env
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import time

# Load environment variables from .env file
load_dotenv()

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
log = logging.getLogger()

# Get paths from environment variables
input_dir = os.getenv('INPUT_DIR')
output_dir = os.getenv('OUTPUT_DIR')
thumbnail_size = int(os.getenv('THUMBNAIL_SIZE', 256))

if not input_dir or not output_dir:
    raise EnvironmentError("INPUT_DIR or OUTPUT_DIR is not defined in environment variables")

log.info(f"Input directory: {input_dir}, Output directory: {output_dir}")

class WatcherHandler(FileSystemEventHandler):
    def on_created(self, event):
        if not event.is_directory:
            input_path = event.src_path
            file_name, ext = os.path.splitext(os.path.basename(input_path))

            # Check for supported file extensions
            valid_extensions = {'.jpg', '.jpeg', '.png', '.tif', '.tiff', '.bmp'}
            if ext.lower() not in valid_extensions:
                log.info(f"Skipped non-image file: {input_path}")
                return

            output_path = os.path.join(output_dir, file_name)
        
            # Check if the directory exists, if not create it
            if not os.path.exists(output_path):
                os.makedirs(output_path)
            log.info(f"Detected new file: {input_path}")
            generate_dzi_and_store(input_path, output_path)


def generate_dzi_and_store(input_path, output_path):
    try:
        # Open the image
        log.info(f"Opening image: {input_path}")
        image = pyvips.Image.new_from_file(input_path, access='random')

        # Generate DZI
        dz_output_path = os.path.join(output_path, "dzi")
        pyvips.Image.dzsave(image, dz_output_path, tile_size=254, overlap=1, suffix=".jpeg", layout="dz")
        log.info(f"Generated DZI for {input_path} at {dz_output_path}")

        # Generate thumbnail
        thumbnail_output_path = os.path.join(output_path, "thumbnail.jpg")
        thumbnail = image.thumbnail_image(thumbnail_size, height=thumbnail_size, crop="centre")
        thumbnail.write_to_file(thumbnail_output_path)
        log.info(f"Generated thumbnail for {input_path} at {thumbnail_output_path}")

    except Exception as e:
        log.error(f"Error generating DZI or thumbnail for {input_path}: {e}")

def start_dzi_daemon(input_dir, output_dir):
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    event_handler = WatcherHandler()
    observer = Observer()
    observer.schedule(event_handler, path=input_dir, recursive=False)
    observer.start()
    log.info(f"Watching directory: {input_dir}")
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop() 
    observer.join()

# Start the daemon
start_dzi_daemon(input_dir, output_dir)