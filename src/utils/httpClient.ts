import axios, { AxiosRequestConfig } from 'axios';

export default class HttpClient {
  protected static async post<T, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      const response = await axios.post<T>(url, data, config);

      return response.data;
    } catch (error) {
      throw new Error(`HTTP POST request failed: ${error}`);
    }
  }
}
