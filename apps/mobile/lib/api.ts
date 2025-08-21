import { ApiResponseI, StatusE } from '@repo/types'

class ApiClient {
  private baseUrl: string

  constructor(baseUrl?: string) {
    // For mobile apps, we might need to use absolute URLs when running as native app
    if (typeof window !== 'undefined' && 'Capacitor' in window) {
      // Running in Capacitor (native app) - use absolute URL
      this.baseUrl = baseUrl || `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api`
    } else {
      // Running in browser (development) - use relative URL
      this.baseUrl = baseUrl || '/api'
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponseI<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`)
      const data = await response.json()
      
      return {
        data,
        message: 'Success',
        status: StatusE.SUCCESS
      }
    } catch (error) {
      return {
        data: null as T,
        message: `Failed to fetch: ${error}`,
        status: StatusE.ERROR
      }
    }
  }
}

export const apiClient = new ApiClient()

export default apiClient
