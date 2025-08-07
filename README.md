# Scanner QR Code - Système d'Authentification

Un scanner de QR codes moderne et responsive avec authentification intégrée, connecté à votre backend Azure pour la gestion des employés et des feuilles de temps.

## 🚀 Fonctionnalités

- ✅ Scanner de QR codes en temps réel
- 🔐 Authentification sécurisée avec votre backend Azure
- 👤 Gestion des sessions utilisateur
- 📱 Interface responsive optimisée pour mobile
- 🔒 Vérification automatique HTTPS
- 🎨 Interface moderne et intuitive
- 🔄 Possibilité de scanner plusieurs QR codes
- ⚡ Performance optimisée
- 📊 Intégration avec les API de feuilles de temps

## 📋 Prérequis

- Serveur web avec support HTTPS
- Navigateur moderne avec support WebRTC
- Permissions caméra accordées
- Compte utilisateur dans votre système Azure
- Accès à l'API `https://timesheetapp.azurewebsites.net/api`

## 🌐 Déploiement HTTPS

### Option 1: Netlify (Recommandé)

1. **Créer un compte Netlify** : https://netlify.com
2. **Déployer depuis GitHub** :
   - Créez un repository GitHub avec vos fichiers
   - Connectez votre repo à Netlify
   - Netlify fournit automatiquement HTTPS

### Option 2: Vercel

1. **Créer un compte Vercel** : https://vercel.com
2. **Déployer** :
   ```bash
   npm i -g vercel
   vercel
   ```

### Option 3: GitHub Pages avec HTTPS

1. **Créer un repository GitHub**
2. **Activer GitHub Pages** dans les paramètres
3. **Forcer HTTPS** dans les paramètres du repository

### Option 4: Serveur local avec certificat SSL

```bash
# Installer mkcert pour certificats locaux
npm install -g mkcert

# Générer certificat local
mkcert localhost

# Servir avec HTTPS
npx http-server -S -C localhost.pem -K localhost-key.pem
```

### Option 5: Serveur simple avec Python

```bash
# Python 3
python -m http.server 8000

# Avec HTTPS (nécessite certificat)
python -m http.server 8000 --bind 0.0.0.0
```

## 🔧 Configuration

### Variables d'environnement (optionnel)

```bash
# Pour certains hébergeurs
HTTPS_FORCE=true
CAMERA_PERMISSION=true
```

### Headers de sécurité

Le projet inclut déjà les headers CSP nécessaires pour la sécurité.

## 📱 Test sur mobile

1. **Déployez votre site en HTTPS**
2. **Ouvrez sur mobile** : `https://votre-domaine.com`
3. **Autorisez l'accès à la caméra**
4. **Pointez vers un QR code**

## 🛠️ Développement local

```bash
# Cloner le projet
git clone <votre-repo>
cd qr-scanner

# Servir en local (HTTP pour développement)
python -m http.server 8000

# Ou avec Node.js
npx http-server
```

## 🔍 Dépannage

### Problème : "HTTPS requis pour la caméra"
- **Solution** : Déployez sur un serveur avec HTTPS
- **Test local** : Utilisez `localhost` (HTTP autorisé)

### Problème : "Erreur d'accès à la caméra"
- **Solution** : Vérifiez les permissions du navigateur
- **Mobile** : Assurez-vous que le site est en HTTPS

### Problème : Scanner ne fonctionne pas
- **Vérifiez** : Permissions caméra accordées
- **Testez** : Avec un QR code simple
- **Console** : Regardez les erreurs dans les outils de développement

## 📊 Compatibilité

| Navigateur | Support |
|------------|---------|
| Chrome 60+ | ✅ |
| Firefox 55+ | ✅ |
| Safari 11+ | ✅ |
| Edge 79+ | ✅ |
| Mobile Chrome | ✅ |
| Mobile Safari | ✅ |

## 🎯 Utilisation

1. **Ouvrez l'application** sur votre téléphone
2. **Cliquez sur "Démarrer le scanner"**
3. **Autorisez l'accès à la caméra**
4. **Pointez vers un QR code**
5. **Le résultat s'affiche automatiquement**
6. **Cliquez "Scanner un autre QR code"** pour continuer

## 📝 Structure du projet

```
qr-scanner/
├── login.html              # Page de connexion
├── qr-scanner-project.html # Scanner QR protégé
├── auth.js                 # Gestion de l'authentification
├── session.js              # Gestion des sessions
├── index.html              # Page d'accueil
├── README.md               # Documentation
└── .gitignore             # Fichiers à ignorer
```

## 🔐 Authentification

### API Endpoints utilisés :
- **POST** `/api/Auth/login` - Connexion utilisateur
- **GET** `/api/Auth/users/{userId}` - Informations utilisateur
- **POST** `/api/Timesheet` - Créer une feuille de temps
- **GET** `/api/Timesheet/Resume/UserId/{userId}/scope/{scope}` - Feuilles de temps utilisateur

### Gestion des sessions :
- ✅ **Sessions sécurisées** avec expiration automatique (24h)
- 🔄 **Rafraîchissement automatique** des tokens
- 🚪 **Déconnexion automatique** si session expirée
- 📱 **Support mobile** complet

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
- Signaler des bugs
- Proposer des améliorations
- Ajouter de nouvelles fonctionnalités

## 📄 Licence

Ce projet est sous licence MIT. Libre d'utilisation pour projets personnels et commerciaux.

---

**Note importante** : L'application nécessite HTTPS pour accéder à la caméra sur mobile. Assurez-vous de déployer sur un serveur sécurisé.
