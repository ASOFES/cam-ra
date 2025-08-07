// Gestionnaire d'authentification centralisé
class AuthManager {
  constructor() {
    this.API_BASE_URL = 'https://timesheetapp.azurewebsites.net/api';
    this.token = localStorage.getItem('authToken');
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  // Connexion
  async login(username, password) {
    try {
      const response = await fetch(`${this.API_BASE_URL}/Auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      
      // Stocker les informations d'authentification
      this.token = data.token || data.accessToken || data.jwt;
      this.user = data.user || data.userInfo || { 
        username: username,
        id: data.userId || data.id
      };
      
      localStorage.setItem('authToken', this.token);
      localStorage.setItem('user', JSON.stringify(this.user));
      
      return { success: true, data };
    } catch (error) {
      console.error('Erreur de connexion:', error);
      throw error;
    }
  }

  // Déconnexion
  logout() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
  }

  // Vérifier si connecté
  isAuthenticated() {
    return !!this.token;
  }

  // Obtenir le token
  getToken() {
    return this.token;
  }

  // Obtenir les informations utilisateur
  getUser() {
    return this.user;
  }

  // Vérifier la validité du token
  async validateToken() {
    if (!this.token) return false;
    
    try {
      const userId = this.user?.id || 'me';
      const response = await fetch(`${this.API_BASE_URL}/Auth/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.ok;
    } catch (error) {
      console.error('Erreur validation token:', error);
      return false;
    }
  }

  // Obtenir les headers d'authentification
  getAuthHeaders() {
    return {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    };
  }

  // Requête API authentifiée
  async authenticatedRequest(url, options = {}) {
    if (!this.isAuthenticated()) {
      throw new Error('Non authentifié');
    }

    const headers = {
      ...this.getAuthHeaders(),
      ...options.headers
    };

    const response = await fetch(url, {
      ...options,
      headers
    });

    if (response.status === 401) {
      // Token expiré, déconnecter
      this.logout();
      throw new Error('Session expirée');
    }

    return response;
  }

  // Obtenir les informations de l'utilisateur
  async getUserInfo() {
    try {
      const userId = this.user?.id || 'me';
      const response = await this.authenticatedRequest(`${this.API_BASE_URL}/Auth/users/${userId}`);
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des informations utilisateur');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur récupération infos utilisateur:', error);
      throw error;
    }
  }

  // Enregistrer une feuille de temps
  async createTimesheet(timesheetData) {
    try {
      const response = await this.authenticatedRequest(`${this.API_BASE_URL}/Timesheet`, {
        method: 'POST',
        body: JSON.stringify(timesheetData)
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création de la feuille de temps');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur création feuille de temps:', error);
      throw error;
    }
  }

  // Obtenir les feuilles de temps de l'utilisateur
  async getUserTimesheets(userId, scope = 'daily') {
    try {
      const response = await this.authenticatedRequest(
        `${this.API_BASE_URL}/Timesheet/Resume/UserId/${userId}/scope/${scope}`
      );

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des feuilles de temps');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur récupération feuilles de temps:', error);
      throw error;
    }
  }

  // Obtenir les statistiques du dashboard
  async getDashboardStats() {
    try {
      const response = await this.authenticatedRequest(`${this.API_BASE_URL}/Dashboard/stats`);
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des statistiques');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur récupération statistiques:', error);
      throw error;
    }
  }
}

// Exporter pour utilisation globale
window.AuthManager = AuthManager;
