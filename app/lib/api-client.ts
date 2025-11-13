/**
 * API Client para sa Backend Communication
 * Nag-handle ng lahat ng HTTP requests sa backend
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
const API_TIMEOUT = parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000'); // 30s for BatchData async API

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
    profile: UserProfile;
  };
}

export interface UserProfile {
  id: string;
  email: string;
  user_id_supabase: string;
  current_credits: number;
  subscription_plan?: string | null;
  plan_id?: string | null;
  plan_name?: string | null;
  chargebee_customer_id?: string | null;
  period_end?: string | null;
  cancel_period_at?: string | null;
  status?: string | null;
  auto_renews?: boolean | null;
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

export interface SearchResponse {
  success: boolean;
  data: unknown[];
  credits_used: number;
  remaining_credits: number;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
  repeat_search?: boolean;
  matched_saved_search_id?: string;
  error?: string;
  message?: string;
}

export interface ExportResponse {
  csv: string;
  filename: string;
  total_properties: number;
}

export interface ExportSearchResponse {
  success: boolean;
  data: ExportResponse;
  credits_used: number;
  remaining_credits: number;
  repeat_search?: boolean;
  matched_saved_search_id?: string;
  error?: string;
}

export interface QuickList {
  id: string;
  name: string;
  description: string;
  query: string;
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
    options: RequestInit = {},
    customTimeout?: number
  ): Promise<Response> {
    const controller = new AbortController();
    const timeout = customTimeout || this.timeout;
    const timeoutId = setTimeout(() => controller.abort(), timeout);

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
    token?: string,
    customTimeout?: number
  ): Promise<ApiResponse<T>> {
    if (endpoint === '/search/export') {
      console.log('🌐 HTTP POST Request:', {
        url: `${this.baseUrl}${endpoint}`,
        hasToken: !!token,
        bodyKeys: Object.keys(body),
        timeout: customTimeout || this.timeout,
      });
    }
    
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await this.fetchWithTimeout(
        `${this.baseUrl}${endpoint}`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify(body),
        },
        customTimeout
      );
      
      if (endpoint === '/search/export') {
        console.log('🌐 HTTP POST Response status:', response.status, response.statusText);
      }

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

  async createSubscription(
    token: string,
    planId: string
  ): Promise<ApiResponse<UserProfile>> {
    return this.post<UserProfile>('/users/subscription', { planId }, token);
  }

  async cancelSubscription(
    token: string
  ): Promise<ApiResponse<UserProfile>> {
    return this.post<UserProfile>('/users/subscription/cancel', {}, token);
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
  ): Promise<SearchResponse> {
    return this.post(
      '/search',
      {
        query,
        filters,
        page,
        limit,
      },
      token
    ) as Promise<SearchResponse>;
  }

  /**
   * Get quick lists
   */
  async getQuickLists(token: string): Promise<ApiResponse<QuickList[]>> {
    return this.get<QuickList[]>('/search/quick-lists', token);
  }

  /**
   * AI-powered search using natural language
   */
  async searchWithAI(
    token: string,
    query: string,
    page: number = 1,
    limit: number = 1
  ): Promise<SearchResponse> {
    return this.post<unknown[]>(
      '/search/ai',
      {
        query,
        page,
        limit,
      },
      token
    ) as Promise<SearchResponse>;
  }

  /**
   * Export search results to CSV
   */
  async exportSearchToCsv(
    token: string,
    query: string,
    filters?: Record<string, unknown>,
    limit?: number
  ): Promise<ExportSearchResponse> {
    console.log('📤 API Client: exportSearchToCsv called', { 
      endpoint: '/search/export', 
      hasToken: !!token,
      query,
      filtersCount: filters ? Object.keys(filters).length : 0,
      limit,
    });
    
    // Use longer timeout for export (120 seconds) since it may take longer
    const exportTimeout = 120000; // 120 seconds
    
    const result = await this.post<ExportResponse>(
      '/search/export',
      {
        query,
        filters,
        limit,
      },
      token,
      exportTimeout
    ) as ExportSearchResponse;
    
    console.log('📥 API Client: exportSearchToCsv response', { 
      success: result.success,
      hasData: !!result.data,
      credits_used: result.credits_used,
      error: result.error,
    });
    
    return result;
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

