// Gestionnaire de sessions sécurisé
class SessionManager {
  constructor() {
    this.sessionKey = 'qr_scanner_session';
    this.tokenKey = 'auth_token';
    this.userKey = 'user_data';
  }

  // Créer une session
  createSession(token, userData) {
    try {
      const session = {
        token: token,
        user: userData,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24h
      };

      localStorage.setItem(this.sessionKey, JSON.stringify(session));
      localStorage.setItem(this.tokenKey, token);
      localStorage.setItem(this.userKey, JSON.stringify(userData));

      return true;
    } catch (error) {
      console.error('Erreur création session:', error);
      return false;
    }
  }

  // Obtenir la session actuelle
  getSession() {
    try {
      const sessionData = localStorage.getItem(this.sessionKey);
      if (!sessionData) return null;

      const session = JSON.parse(sessionData);
      
      // Vérifier si la session a expiré
      if (new Date(session.expiresAt) < new Date()) {
        this.clearSession();
        return null;
      }

      return session;
    } catch (error) {
      console.error('Erreur lecture session:', error);
      return null;
    }
  }

  // Vérifier si une session existe et est valide
  isSessionValid() {
    const session = this.getSession();
    return session !== null;
  }

  // Obtenir le token d'authentification
  getToken() {
    const session = this.getSession();
    return session ? session.token : null;
  }

  // Obtenir les données utilisateur
  getUser() {
    const session = this.getSession();
    return session ? session.user : null;
  }

  // Rafraîchir la session
  refreshSession() {
    const session = this.getSession();
    if (session) {
      session.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      localStorage.setItem(this.sessionKey, JSON.stringify(session));
      return true;
    }
    return false;
  }

  // Effacer la session
  clearSession() {
    try {
      localStorage.removeItem(this.sessionKey);
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userKey);
      return true;
    } catch (error) {
      console.error('Erreur suppression session:', error);
      return false;
    }
  }

  // Vérifier la validité du token avec le serveur
  async validateSessionWithServer() {
    const session = this.getSession();
    if (!session) return false;

    try {
      const response = await fetch('https://timesheetapp.azurewebsites.net/api/Auth/users/me', {
        headers: {
          'Authorization': `Bearer ${session.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Rafraîchir la session si elle est valide
        this.refreshSession();
        return true;
      } else {
        // Session invalide, la supprimer
        this.clearSession();
        return false;
      }
    } catch (error) {
      console.error('Erreur validation session serveur:', error);
      return false;
    }
  }

  // Obtenir les headers d'authentification
  getAuthHeaders() {
    const token = this.getToken();
    return token ? {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    } : {};
  }

  // Requête API avec authentification automatique
  async authenticatedRequest(url, options = {}) {
    const headers = {
      ...this.getAuthHeaders(),
      ...options.headers
    };

    const response = await fetch(url, {
      ...options,
      headers
    });

    if (response.status === 401) {
      // Token expiré, effacer la session
      this.clearSession();
      window.location.href = 'login.html';
      throw new Error('Session expirée');
    }

    return response;
  }
}

// Exporter pour utilisation globale
window.SessionManager = SessionManager;
