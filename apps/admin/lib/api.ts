import { ApiResponseI, StatusE } from '@repo/types'

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl
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
