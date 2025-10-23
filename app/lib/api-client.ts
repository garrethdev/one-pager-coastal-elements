/**
 * API Client para sa Backend Communication
 * Nag-handle ng lahat ng HTTP requests sa backend
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
const API_TIMEOUT = parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000');

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      email: string;
      access_token: string;
      refresh_token: string;
      expires_in: number;
      token_type: string;
    };
    profile: {
      id: string;
      email: string;
      user_id_supabase: string;
      current_credits: number;
      subscription_plan: string;
      created_at: string;
    };
  };
}

export interface UserProfile {
  id: string;
  email: string;
  user_id_supabase: string;
  current_credits: number;
  subscription_plan: string;
  created_at: string;
}

export interface SavedSearch {
  id: string;
  search_query: string;
  created_at: string;
}

export interface SavedSearchesResponse {
  data: SavedSearch[];
  total: number;
  page: number;
  limit: number;
}

export interface SearchResultsResponse {
  data: unknown[];
  credits_used: number;
  remaining_credits: number;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface ExportResponse {
  csv: string;
  filename: string;
  total_properties: number;
}

class ApiClient {
  private baseUrl: string;
  private timeout: number;

  constructor() {
    this.baseUrl = API_URL;
    this.timeout = API_TIMEOUT;
  }

  /**
   * Generic fetch wrapper with timeout
   */
  private async fetchWithTimeout(
    url: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }

  /**
   * GET request
   */
  async get<T = unknown>(endpoint: string, token?: string): Promise<ApiResponse<T>> {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await this.fetchWithTimeout(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || 'Request failed',
        };
      }

      return data;
    } catch (error) {
      console.error('API GET Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  /**
   * POST request
   */
  async post<T = unknown>(
    endpoint: string,
    body: Record<string, unknown>,
    token?: string
  ): Promise<ApiResponse<T>> {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await this.fetchWithTimeout(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || 'Request failed',
        };
      }

      return data;
    } catch (error) {
      console.error('API POST Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  /**
   * DELETE request
   */
  async delete<T = unknown>(endpoint: string, token?: string): Promise<ApiResponse<T>> {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await this.fetchWithTimeout(`${this.baseUrl}${endpoint}`, {
        method: 'DELETE',
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || 'Request failed',
        };
      }

      return data;
    } catch (error) {
      console.error('API DELETE Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // ============= AUTH ENDPOINTS =============

  /**
   * Request OTP code sa email
   */
  async requestOtp(email: string): Promise<ApiResponse> {
    return this.post('/auth/otp/request', { email });
  }

  /**
   * Verify OTP code
   */
  async verifyOtp(email: string, token: string): Promise<AuthResponse> {
    return this.post('/auth/otp/verify', { email, token }) as Promise<AuthResponse>;
  }

  /**
   * Logout user
   */
  async logout(token: string): Promise<ApiResponse> {
    return this.post('/auth/logout', {}, token);
  }

  // ============= USER ENDPOINTS =============

  /**
   * Get user profile
   */
  async getUserProfile(token: string): Promise<ApiResponse<UserProfile>> {
    return this.get<UserProfile>('/users/profile', token);
  }

  /**
   * Update user credits
   */
  async updateCredits(
    token: string,
    credits: number
  ): Promise<ApiResponse<UserProfile>> {
    return this.post<UserProfile>('/users/credits', { credits }, token);
  }

  /**
   * Update subscription plan
   */
  async updateSubscription(
    token: string,
    plan: string
  ): Promise<ApiResponse<UserProfile>> {
    return this.post<UserProfile>('/users/subscription', { plan }, token);
  }

  // ============= SEARCH ENDPOINTS =============

  /**
   * Search properties
   */
  async searchProperties(
    token: string,
    query: string,
    filters?: Record<string, unknown>,
    page?: number,
    limit?: number
  ): Promise<ApiResponse<SearchResultsResponse>> {
    return this.post<SearchResultsResponse>(
      '/search',
      {
        query,
        filters,
        page,
        limit,
      },
      token
    );
  }

  /**
   * Get quick lists
   */
  async getQuickLists(token: string): Promise<ApiResponse> {
    return this.get('/search/quick-lists', token);
  }

  /**
   * Export search results to CSV
   */
  async exportSearchToCsv(
    token: string,
    query: string,
    filters?: Record<string, unknown>
  ): Promise<ApiResponse<ExportResponse>> {
    return this.post<ExportResponse>(
      '/search/export',
      {
        query,
        filters,
      },
      token
    );
  }

  // ============= SAVED SEARCHES ENDPOINTS =============

  /**
   * Get saved searches
   */
  async getSavedSearches(
    token: string,
    page?: number,
    limit?: number
  ): Promise<ApiResponse<SavedSearchesResponse>> {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    
    const queryString = params.toString();
    return this.get<SavedSearchesResponse>(
      `/saved-searches${queryString ? `?${queryString}` : ''}`,
      token
    );
  }

  /**
   * Save a search
   */
  async saveSearch(token: string, searchQuery: string): Promise<ApiResponse<SavedSearch>> {
    return this.post<SavedSearch>('/saved-searches', { search_query: searchQuery }, token);
  }

  /**
   * Delete a saved search
   */
  async deleteSavedSearch(token: string, searchId: string): Promise<ApiResponse> {
    return this.delete(`/saved-searches/${searchId}`, token);
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;

