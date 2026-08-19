import os
import sys
from PIL import Image

def process_image(src_path, preset_id):
    public_dir = os.path.join('client', 'public', 'presets', 'vehicles')
    dist_dir = os.path.join('client', 'dist', 'presets', 'vehicles')
    os.makedirs(public_dir, exist_ok=True)
    os.makedirs(dist_dir, exist_ok=True)

    dest_public = os.path.join(public_dir, f'{preset_id}.webp')
    dest_dist = os.path.join(dist_dir, f'{preset_id}.webp')

    img = Image.open(src_path)
    if img.mode in ('RGBA', 'LA', 'P'):
        background = Image.new('RGB', img.size, (255, 255, 255))
        if img.mode == 'P':
            img = img.convert('RGBA')
        background.paste(img, mask=img.split()[-1])
        img = background
    elif img.mode != 'RGB':
        img = img.convert('RGB')

    img.save(dest_public, 'WEBP', quality=85)
    img.save(dest_dist, 'WEBP', quality=85)
    print(f'[OK] Converted {preset_id} -> {dest_public} ({os.path.getsize(dest_public)} bytes)')

if __name__ == '__main__':
    if len(sys.argv) >= 3:
        process_image(sys.argv[1], sys.argv[2])
    else:
        print('Usage: python convert_to_webp.py <src_path> <preset_id>')