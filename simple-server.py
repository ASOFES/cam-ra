#!/usr/bin/env python3
"""
Serveur local simple pour éviter les problèmes CORS
Usage: python simple-server.py
"""

import http.server
import socketserver
import webbrowser
import os
import sys
from urllib.parse import urlparse

# Configuration
HOST = '0.0.0.0'  # Écouter sur toutes les interfaces
PORT = 8000

class CORSRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Ajouter les headers CORS pour permettre l'accès depuis le téléphone
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        super().end_headers()
    
    def do_OPTIONS(self):
        # Gérer les requêtes OPTIONS pour CORS
        self.send_response(200)
        self.end_headers()

def get_local_ip():
    """Obtenir l'adresse IP locale"""
    import socket
    try:
        # Se connecter à un serveur externe pour obtenir l'IP locale
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        local_ip = s.getsockname()[0]
        s.close()
        return local_ip
    except:
        return "localhost"

def main():
    # Obtenir l'adresse IP locale
    local_ip = get_local_ip()
    
    # Créer le serveur avec l'adresse IP spécifique
    with socketserver.TCPServer((HOST, PORT), CORSRequestHandler) as httpd:
        print(f"🚀 Serveur démarré sur http://{local_ip}:{PORT}")
        print(f"📱 Accessible depuis votre téléphone sur le même réseau WiFi")
        print(f"🌐 Ouvrez votre navigateur sur le téléphone et allez à:")
        print(f"   http://{local_ip}:{PORT}")
        print(f"📋 Ou scannez ce QR code avec votre téléphone:")
        print(f"   http://{local_ip}:{PORT}")
        print("\n" + "="*50)
        print("📱 POUR TESTER SUR TÉLÉPHONE:")
        print("1. Assurez-vous que votre téléphone est sur le même WiFi")
        print("2. Ouvrez le navigateur sur votre téléphone")
        print(f"3. Allez à: http://{local_ip}:{PORT}")
        print("4. Testez la connexion et le scanner QR!")
        print("="*50 + "\n")
        
        # Ouvrir le navigateur sur l'ordinateur
        webbrowser.open(f'http://localhost:{PORT}')
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n🛑 Serveur arrêté par l'utilisateur")
            httpd.shutdown()

if __name__ == "__main__":
    main()
