import qrcode
from PIL import Image, ImageDraw, ImageFont
import os

def generate_access_qr():
    # URL d'accès depuis le téléphone
    url = "http://192.168.11.105:8000"
    
    # Créer le QR code
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(url)
    qr.make(fit=True)
    
    # Créer l'image du QR code
    qr_image = qr.make_image(fill_color="black", back_color="white")
    
    # Créer une image plus grande avec du texte
    width, height = qr_image.size
    margin = 50
    new_width = width + 2 * margin
    new_height = height + 2 * margin + 100  # Espace pour le texte
    
    # Créer une nouvelle image avec fond blanc
    final_image = Image.new('RGB', (new_width, new_height), 'white')
    
    # Coller le QR code au centre
    qr_x = (new_width - width) // 2
    qr_y = margin
    final_image.paste(qr_image, (qr_x, qr_y))
    
    # Ajouter du texte
    draw = ImageDraw.Draw(final_image)
    
    # Essayer de charger une police, sinon utiliser la police par défaut
    try:
        font = ImageFont.truetype("arial.ttf", 16)
    except:
        font = ImageFont.load_default()
    
    # Texte à ajouter
    text = "Pointage QR - Accès Mobile"
    text2 = "Scannez pour accéder à l'application"
    text3 = "http://192.168.11.105:8000"
    
    # Calculer la position du texte
    text_bbox = draw.textbbox((0, 0), text, font=font)
    text_width = text_bbox[2] - text_bbox[0]
    text_x = (new_width - text_width) // 2
    text_y = qr_y + height + 20
    
    # Dessiner le texte
    draw.text((text_x, text_y), text, fill='black', font=font)
    
    # Texte secondaire
    try:
        font_small = ImageFont.truetype("arial.ttf", 12)
    except:
        font_small = ImageFont.load_default()
    
    text2_bbox = draw.textbbox((0, 0), text2, font=font_small)
    text2_width = text2_bbox[2] - text2_bbox[0]
    text2_x = (new_width - text2_width) // 2
    text2_y = text_y + 25
    
    draw.text((text2_x, text2_y), text2, fill='gray', font=font_small)
    
    # URL
    text3_bbox = draw.textbbox((0, 0), text3, font=font_small)
    text3_width = text3_bbox[2] - text3_bbox[0]
    text3_x = (new_width - text3_width) // 2
    text3_y = text2_y + 20
    
    draw.text((text3_x, text3_y), text3, fill='blue', font=font_small)
    
    # Sauvegarder l'image
    filename = "qr-access-mobile.png"
    final_image.save(filename)
    
    print("✅ QR Code généré avec succès!")
    print(f"📱 Fichier: {filename}")
    print(f"🌐 URL: {url}")
    print("\n📋 Instructions:")
    print("1. Ouvrez le fichier qr-access-mobile.png")
    print("2. Scannez-le avec votre téléphone")
    print("3. Ou tapez directement: http://192.168.11.105:8000")
    print("\n🔧 Assurez-vous que:")
    print("- Votre téléphone est sur le même réseau WiFi")
    print("- Le serveur est démarré (python simple-server.py)")
    print("- Le pare-feu autorise les connexions sur le port 8000")

if __name__ == "__main__":
    try:
        generate_access_qr()
    except ImportError:
        print("❌ Erreur: Le module qrcode n'est pas installé")
        print("📦 Installez-le avec: pip install qrcode[pil]")
    except Exception as e:
        print(f"❌ Erreur lors de la génération: {e}")
        print("📦 Assurez-vous d'avoir installé: pip install qrcode[pil]")
