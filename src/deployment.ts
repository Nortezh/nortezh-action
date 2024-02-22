import { AxiosRequestConfig } from 'axios';
import HttpClient from './utils/httpClient';
import {
  CreateDeploymentRequest,
  CreateDeploymentResponse,
  DeleteDeploymentRequest,
  DeployNewRevisionRequest,
  GetDeploymentRequest,
  GetDeploymentResponse,
  ResponseDto,
} from './types';

const baseUrl = 'https://api-stag-899570118063554590.nortezh0.deploys.app/user';

export default class DeploymentService extends HttpClient {
  private static async sendRequest<T, D = unknown>(
    url: string,
    payload?: D,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const credential = `${process.env['SA_AUTH_EMAIL']}:${process.env['SA_AUTH_KEY']}`;
    const encodedCred = Buffer.from(credential).toString('base64');
    const headers = {
      ...config?.headers,
      Authorization: `Basic ${encodedCred}`,
    };

    const updatedConfig: AxiosRequestConfig = {
      ...config,
      headers,
    };

    return await this.post<T, D>(url, payload, updatedConfig);
  }

  static async get(
    payload: GetDeploymentRequest,
    config?: AxiosRequestConfig,
  ): Promise<ResponseDto<GetDeploymentResponse>> {
    return await this.sendRequest<ResponseDto<GetDeploymentResponse>>(
      `${baseUrl}/deployment.get`,
      payload,
      config,
    );
  }

  static async deploy(
    payload: DeployNewRevisionRequest,
    config?: AxiosRequestConfig,
  ): Promise<ResponseDto<any>> {
    return await this.sendRequest<ResponseDto<any>>(
      `${baseUrl}/deployment.deploy`,
      payload,
      config,
    );
  }

  static async create(
    payload: CreateDeploymentRequest,
    config?: AxiosRequestConfig,
  ): Promise<ResponseDto<CreateDeploymentResponse>> {
    return await this.sendRequest<ResponseDto<CreateDeploymentResponse>>(
      `${baseUrl}/deployment.create`,
      payload,
      config,
    );
  }

  static async delete(
    payload: DeleteDeploymentRequest,
    config?: AxiosRequestConfig,
  ): Promise<ResponseDto<any>> {
    return await this.sendRequest<ResponseDto<any>>(
      `${baseUrl}/deployment.delete`,
      payload,
      config,
    );
  }
}
