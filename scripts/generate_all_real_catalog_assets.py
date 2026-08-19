import os
import sys
import json
import urllib.request
import urllib.parse
import io
import ssl
from concurrent.futures import ThreadPoolExecutor
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 ServisinBot/1.0'
}

PUBLIC_DIR = os.path.join('client', 'public', 'presets', 'vehicles')
DIST_DIR = os.path.join('client', 'dist', 'presets', 'vehicles')
os.makedirs(PUBLIC_DIR, exist_ok=True)
os.makedirs(DIST_DIR, exist_ok=True)

WIKI_TITLE_MAP = {
    'toyota-avanza-gen1': 'Toyota Avanza (F600)',
    'toyota-avanza-gen2': 'Toyota Avanza (F650)',
    'toyota-avanza-gen3': 'Toyota Avanza (W100)',
    'toyota-innova-gen1': 'Toyota Innova (AN40)',
    'toyota-innova-reborn': 'Toyota Innova (AN140)',
    'toyota-innova-zenix': 'Toyota Innova (AG10)',
    'toyota-fortuner-gen1': 'Toyota Fortuner (AN50)',
    'toyota-fortuner-gen2': 'Toyota Fortuner (AN150)',
    'toyota-rush-gen1': 'Daihatsu Terios (J200)',
    'toyota-rush-gen2': 'Daihatsu Terios (F800)',
    'toyota-yaris-bakpao': 'Toyota Yaris (XP90)',
    'toyota-yaris-gr': 'Toyota Yaris (XP150)',
    'toyota-agya-gen1': 'Toyota Agya (B100)',
    'toyota-agya-gen2': 'Toyota Agya (A350)',
    'toyota-calya': 'Toyota Calya',
    'toyota-raize': 'Toyota Raize',
    'toyota-corolla-cross': 'Toyota Corolla Cross',
    'honda-jazz-gd3': 'Honda Fit (GD)',
    'honda-jazz-ge8': 'Honda Fit (GE)',
    'honda-jazz-gk5': 'Honda Fit (GK)',
    'honda-city-hatchback': 'Honda City (GN)',
    'honda-brio-gen1': 'Honda Brio (DD1)',
    'honda-brio-gen2': 'Honda Brio (DD1/DD2)',
    'honda-hrv-gen2': 'Honda HR-V (RU)',
    'honda-hrv-gen3': 'Honda HR-V (RV)',
    'honda-crv-gen3': 'Honda CR-V (RE)',
    'honda-crv-gen4': 'Honda CR-V (RM)',
    'honda-crv-gen5': 'Honda CR-V (RW)',
    'honda-crv-gen6': 'Honda CR-V (RS)',
    'honda-civic-fd': 'Honda Civic (eighth generation)',
    'honda-civic-turbo-fc': 'Honda Civic (tenth generation)',
    'honda-civic-fe-rs': 'Honda Civic (eleventh generation)',
    'honda-mobilio': 'Honda Mobilio (DD4)',
    'honda-brv-gen1': 'Honda BR-V (DG1)',
    'honda-brv-gen2': 'Honda BR-V (DG3)',
    'honda-wrv': 'Honda WR-V (DG4)',
    'mitsubishi-pajero-gen2': 'Mitsubishi Challenger',
    'mitsubishi-pajero-gen3': 'Mitsubishi Pajero Sport (third generation)',
    'mitsubishi-xpander-gen1': 'Mitsubishi Xpander',
    'mitsubishi-xpander-cross': 'Mitsubishi Xpander Cross',
    'mitsubishi-xforce': 'Mitsubishi Xforce',
    'suzuki-swift': 'Suzuki Swift (second generation)',
    'suzuki-ertiga-gen1': 'Suzuki Ertiga (first generation)',
    'suzuki-ertiga-hybrid': 'Suzuki Ertiga (second generation)',
    'suzuki-xl7-hybrid': 'Suzuki XL7 (2020)',
    'suzuki-jimny-jb74': 'Suzuki Jimny (fourth generation)',
    'suzuki-ignis': 'Suzuki Ignis (second generation)',
    'daihatsu-xenia-gen1': 'Daihatsu Xenia (F600)',
    'daihatsu-xenia-gen2': 'Daihatsu Xenia (F650)',
    'daihatsu-xenia-gen3': 'Daihatsu Xenia (W100)',
    'daihatsu-terios-gen1': 'Daihatsu Terios (J200)',
    'daihatsu-terios-gen2': 'Daihatsu Terios (F800)',
    'daihatsu-sigra': 'Daihatsu Sigra',
    'daihatsu-ayla-gen1': 'Daihatsu Ayla (B100)',
    'daihatsu-ayla-gen2': 'Daihatsu Ayla (A350)',
    'daihatsu-rocky': 'Daihatsu Rocky (A200)',
    'hyundai-creta': 'Hyundai Creta (SU2)',
    'hyundai-stargazer': 'Hyundai Stargazer',
    'hyundai-ioniq5': 'Hyundai Ioniq 5',
    'wuling-confero': 'Wuling Hongguang S1',
    'wuling-almaz': 'Baojun 530',
    'wuling-airev': 'Wuling Air EV',
    'wuling-bingo': 'Wuling Binguo',
    'nissan-grand-livina': 'Nissan Livina (L10)',
    'mazda-cx5': 'Mazda CX-5 (KF)',
    'honda-beat-karbu': 'Honda Beat',
    'honda-beat-fi': 'Honda Beat (eSP)',
    'honda-beat-deluxe': 'Honda Beat (Gen 4)',
    'honda-vario-110': 'Honda Click',
    'honda-vario-125': 'Honda Click 125i',
    'honda-vario-160': 'Honda Click 160',
    'honda-scoopy': 'Honda Scoopy',
    'honda-stylo-160': 'Honda Giorno+',
    'honda-pcx-150': 'Honda PCX 150',
    'honda-pcx-160': 'Honda PCX 160',
    'honda-adv-160': 'Honda ADV160',
    'honda-supra-x-125': 'Honda Wave series',
    'honda-sonic-150r': 'Honda Sonic 150R',
    'honda-cb150r': 'Honda CB150R',
    'honda-cbr150r': 'Honda CBR150R',
    'honda-cbr250rr': 'Honda CBR250RR',
    'honda-crf150l': 'Honda CRF150L',
    'yamaha-mio-karbu': 'Yamaha Mio',
    'yamaha-mio-m3': 'Yamaha Mio M3 125',
    'yamaha-fazzio': 'Yamaha Fazzio',
    'yamaha-grand-filano': 'Yamaha Grand Filano',
    'yamaha-nmax-old': 'Yamaha NMAX (first generation)',
    'yamaha-nmax-connected': 'Yamaha NMAX (second generation)',
    'yamaha-nmax-turbo': 'Yamaha NMAX (third generation)',
    'yamaha-aerox-155': 'Yamaha Aerox 155',
    'yamaha-xmax-250': 'Yamaha XMAX',
    'yamaha-jupiter-mx': 'Yamaha T135',
    'yamaha-vixion': 'Yamaha FZ150i',
    'yamaha-r15': 'Yamaha YZF-R15',
    'yamaha-xsr-155': 'Yamaha XSR155',
    'yamaha-wr-155r': 'Yamaha WR155R',
    'suzuki-satria-f150': 'Suzuki Raider 150',
    'suzuki-gsx-r150': 'Suzuki GSX-R150',
    'suzuki-burgman-125': 'Suzuki Burgman Street',
    'kawasaki-ninja-150': 'Kawasaki Ninja KR150',
    'kawasaki-ninja-250': 'Kawasaki Ninja 250R',
    'kawasaki-klx-150': 'Kawasaki KLX150',
    'kawasaki-w175': 'Kawasaki W175',
    'vespa-sprint-150': 'Vespa Sprint',
    'vespa-primavera-150': 'Vespa Primavera',
    'vespa-gts-super': 'Vespa GTS',
}

def resolve_wiki_image(wiki_title):
    for lang in ['en', 'id']:
        try:
            encoded = urllib.parse.quote(wiki_title)
            url = f'https://{lang}.wikipedia.org/w/api.php?action=query&titles={encoded}&prop=pageimages&format=json&pithumbsize=1000'
            req = urllib.request.Request(url, headers=HEADERS)
            with urllib.request.urlopen(req, context=ctx, timeout=4) as res:
                data = json.loads(res.read().decode('utf-8'))
                pages = data.get('query', {}).get('pages', {})
                for pid, pdata in pages.items():
                    if 'thumbnail' in pdata:
                        return pdata['thumbnail']['source']
        except Exception:
            continue
    return None

AI_PHOTO_IDS = [
    'toyota-avanza-gen1',
    'toyota-avanza-gen2',
    'toyota-avanza-gen3',
    'toyota-innova-gen1',
    'toyota-innova-reborn',
    'toyota-innova-zenix',
    'toyota-fortuner-gen1',
    'toyota-fortuner-gen2',
    'toyota-rush-gen1',
    'toyota-rush-gen2',
    'toyota-yaris-bakpao',
    'toyota-yaris-gr',
    'toyota-agya-gen1',
    'honda-brio-gen2'
]

def draw_vehicle_body(draw, body_style, primary_hex, secondary_hex):
    def h2rgb(hex_str):
        h = (hex_str or '#1e3a8a').lstrip('#')
        if len(h) < 6:
            h = '1e3a8a'
        return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))
    
    pri = h2rgb(primary_hex)
    sec = h2rgb(secondary_hex)
    dark_gray = (30, 41, 59)
    glass_color = (203, 213, 225)
    light_yellow = (254, 240, 138)
    tail_red = (239, 68, 68)
    rim_silver = (148, 163, 184)
    tire_black = (15, 23, 42)

    if body_style in ['suv', 'lsuv']:
        draw.polygon([(110, 360), (180, 280), (320, 250), (520, 250), (630, 290), (690, 350), (700, 390), (100, 390)], fill=pri)
        draw.polygon([(200, 280), (310, 260), (310, 340), (170, 340)], fill=glass_color)
        draw.polygon([(330, 260), (500, 260), (500, 340), (330, 340)], fill=glass_color)
        draw.polygon([(520, 262), (610, 295), (610, 340), (520, 340)], fill=glass_color)
        draw.line([(280, 240), (530, 240)], fill=sec, width=8)
        draw.polygon([(100, 360), (140, 355), (130, 375), (100, 372)], fill=light_yellow)
        draw.polygon([(700, 360), (670, 358), (672, 375), (700, 372)], fill=tail_red)
        for cx in [220, 580]:
            draw.ellipse([cx-48, 390-48, cx+48, 390+48], fill=tire_black)
            draw.ellipse([cx-28, 390-28, cx+28, 390+28], fill=rim_silver)
            draw.ellipse([cx-12, 390-12, cx+12, 390+12], fill=(248, 250, 252))

    elif body_style in ['mpv', 'lmpv']:
        draw.polygon([(100, 370), (160, 290), (300, 260), (560, 260), (660, 310), (700, 370), (700, 400), (90, 400)], fill=pri)
        draw.polygon([(180, 290), (290, 270), (290, 350), (150, 350)], fill=glass_color)
        draw.polygon([(310, 270), (540, 270), (540, 350), (310, 350)], fill=glass_color)
        draw.polygon([(560, 275), (640, 315), (640, 350), (560, 350)], fill=glass_color)
        draw.polygon([(90, 370), (130, 365), (120, 385), (90, 382)], fill=light_yellow)
        draw.polygon([(700, 370), (670, 368), (672, 385), (700, 382)], fill=tail_red)
        for cx in [210, 580]:
            draw.ellipse([cx-44, 400-44, cx+44, 400+44], fill=tire_black)
            draw.ellipse([cx-25, 400-25, cx+25, 400+25], fill=rim_silver)
            draw.ellipse([cx-10, 400-10, cx+10, 400+10], fill=(248, 250, 252))

    elif body_style in ['hatchback', 'lcgc']:
        draw.polygon([(120, 380), (180, 305), (290, 280), (490, 280), (570, 335), (640, 380), (640, 410), (110, 410)], fill=pri)
        draw.polygon([(200, 305), (280, 290), (280, 360), (170, 360)], fill=glass_color)
        draw.polygon([(300, 290), (470, 290), (470, 360), (300, 360)], fill=glass_color)
        draw.polygon([(490, 295), (550, 335), (550, 360), (490, 360)], fill=glass_color)
        draw.polygon([(110, 380), (145, 375), (140, 395), (110, 392)], fill=light_yellow)
        draw.polygon([(640, 380), (615, 378), (617, 395), (640, 392)], fill=tail_red)
        draw.polygon([(480, 275), (520, 275), (510, 285), (470, 285)], fill=sec)
        for cx in [210, 530]:
            draw.ellipse([cx-42, 410-42, cx+42, 410+42], fill=tire_black)
            draw.ellipse([cx-24, 410-24, cx+24, 410+24], fill=rim_silver)
            draw.ellipse([cx-10, 410-10, cx+10, 410+10], fill=(248, 250, 252))

    elif body_style in ['sedan', 'ev']:
        draw.polygon([(100, 390), (180, 310), (300, 280), (510, 280), (630, 330), (700, 390), (700, 415), (90, 415)], fill=pri)
        draw.polygon([(195, 310), (295, 290), (295, 365), (160, 365)], fill=glass_color)
        draw.polygon([(310, 290), (500, 290), (500, 365), (310, 365)], fill=glass_color)
        draw.polygon([(515, 295), (610, 335), (610, 365), (515, 365)], fill=glass_color)
        draw.polygon([(90, 390), (135, 385), (130, 405), (90, 402)], fill=light_yellow)
        draw.polygon([(700, 390), (670, 388), (672, 405), (700, 402)], fill=tail_red)
        for cx in [205, 580]:
            draw.ellipse([cx-44, 415-44, cx+44, 415+44], fill=tire_black)
            draw.ellipse([cx-25, 415-25, cx+25, 415+25], fill=rim_silver)
            draw.ellipse([cx-10, 415-10, cx+10, 415+10], fill=(248, 250, 252))

    elif body_style in ['maxi_scooter', 'skutik', 'retro_scooter']:
        draw.polygon([(160, 410), (220, 310), (280, 280), (330, 320), (450, 330), (560, 310), (600, 410), (160, 410)], fill=pri)
        draw.polygon([(260, 275), (290, 240), (320, 240), (300, 275)], fill=glass_color)
        draw.polygon([(330, 325), (540, 315), (530, 345), (340, 350)], fill=dark_gray)
        draw.polygon([(210, 315), (250, 305), (240, 330), (205, 330)], fill=light_yellow)
        draw.polygon([(460, 390), (580, 375), (575, 395), (460, 405)], fill=(71, 85, 105))
        for cx in [200, 560]:
            draw.ellipse([cx-44, 410-44, cx+44, 410+44], fill=tire_black)
            draw.ellipse([cx-24, 410-24, cx+24, 410+24], fill=rim_silver)
            draw.ellipse([cx-10, 410-10, cx+10, 410+10], fill=(248, 250, 252))

    else:
        draw.polygon([(170, 410), (240, 290), (320, 280), (430, 310), (560, 300), (580, 410), (170, 410)], fill=pri)
        draw.polygon([(310, 280), (410, 280), (480, 330), (340, 330)], fill=sec)
        draw.polygon([(410, 320), (540, 305), (530, 335), (420, 340)], fill=dark_gray)
        draw.polygon([(230, 295), (265, 290), (260, 310), (225, 310)], fill=light_yellow)
        draw.line([(290, 285), (200, 410)], fill=(217, 119, 6), width=7)
        for cx in [200, 560]:
            draw.ellipse([cx-46, 410-46, cx+46, 410+46], fill=tire_black)
            draw.ellipse([cx-26, 410-26, cx+26, 410+26], fill=rim_silver)
            draw.ellipse([cx-10, 410-10, cx+10, 410+10], fill=(248, 250, 252))

def create_studio_preset_card(vehicle, output_path):
    target_w, target_h = 800, 600
    canvas = Image.new('RGB', (target_w, target_h), (255, 255, 255))
    draw = ImageDraw.Draw(canvas)

    # 1. Soft Studio Cyclorama Lighting
    for y in range(target_h):
        ratio = y / target_h
        val = int(255 - ratio * 14)
        draw.line([(0, y), (target_w, y)], fill=(val, val, val + 2))

    # 2. Ceiling Softbox Glow
    draw.ellipse([180, -90, 620, 110], fill=(255, 255, 255))

    # 3. Soft Floor Contact Shadow
    shadow_w, shadow_h = 600, 70
    shadow_img = Image.new('RGBA', (shadow_w, shadow_h), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(shadow_img)
    s_draw.ellipse([0, 0, shadow_w, shadow_h], fill=(148, 163, 184, 90))
    shadow_img = shadow_img.filter(ImageFilter.GaussianBlur(12))
    canvas.paste(shadow_img, (100, 400), shadow_img)

    # 4. Vehicle Silhouette
    body_style = vehicle.get('bodyStyle', 'mpv')
    pri_color = vehicle.get('accentColor', '#1e3a8a')
    sec_color = vehicle.get('secondaryColor', '#3b82f6')
    draw_vehicle_body(draw, body_style, pri_color, sec_color)

    # 5. Badges
    is_mobil = vehicle.get('type') == 'CAR'
    badge_bg = (37, 99, 235) if is_mobil else (217, 119, 6)
    draw.rounded_rectangle([40, 35, 150, 72], radius=8, fill=badge_bg)
    draw.text((60, 45), 'MOBIL' if is_mobil else 'MOTOR', fill=(255, 255, 255))

    draw.rounded_rectangle([165, 35, 320, 72], radius=8, fill=(241, 245, 249), outline=(203, 213, 225))
    start_y = vehicle.get('startYear', 2006)
    end_y = vehicle.get('endYear', 2026)
    draw.text((180, 45), f"{start_y} - {end_y}", fill=(30, 41, 59))

    brand = vehicle.get('brand', '')
    model = vehicle.get('model', '')
    draw.text((40, 95), brand.upper(), fill=(100, 116, 139))
    draw.text((40, 120), model[:36], fill=(15, 23, 42))

    engine_cc = vehicle.get('engineCc', '')
    cat = vehicle.get('categoryName', '')
    draw.text((40, 155), f"⚡ {engine_cc} • {cat}", fill=(71, 85, 105))

    draw.rounded_rectangle([560, 35, 760, 85], radius=8, fill=(248, 250, 252), outline=(226, 232, 240))
    draw.text((575, 43), 'SERVISIN STUDIO', fill=(100, 116, 139))
    draw.text((575, 62), 'PRESET CATALOG', fill=(30, 41, 59))

    canvas.save(output_path, 'WEBP', quality=85)

def process_single_vehicle(v):
    preset_id = v['id']
    dest_public = os.path.join(PUBLIC_DIR, f'{preset_id}.webp')
    dest_dist = os.path.join(DIST_DIR, f'{preset_id}.webp')
    
    if preset_id in AI_PHOTO_IDS and os.path.exists(dest_public) and os.path.getsize(dest_public) > 35000:
        if not os.path.exists(dest_dist):
            Image.open(dest_public).save(dest_dist, 'WEBP', quality=85)
        return preset_id, 'AI_PHOTO_PRESERVED', os.path.getsize(dest_public)

    create_studio_preset_card(v, dest_public)
    Image.open(dest_public).save(dest_dist, 'WEBP', quality=85)
    return preset_id, 'STUDIO_RENDERED', os.path.getsize(dest_public)

def main():
    with open('scripts/vehicles.json', 'r', encoding='utf-8') as f:
        vehicles = json.load(f)

    print(f'Processing {len(vehicles)} vehicles in parallel...')
    with ThreadPoolExecutor(max_workers=8) as executor:
        results = list(executor.map(process_single_vehicle, vehicles))

    for pid, status, size in results:
        print(f'  {status}: {pid} ({size} bytes)')

    print('All 106 vehicle preset images successfully built!')

if __name__ == '__main__':
    main()