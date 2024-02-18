import { AxiosRequestConfig } from "axios";
import HttpClient from "./utils/httpClient";
import {
  CreateDeploymentRequest,
  CreateDeploymentResponse,
  DeployNewRevisionRequest,
  GetDeploymentRequest,
  GetDeploymentResponse,
  ResponseDto,
} from "./types";

export default class DeploymentService extends HttpClient {
  private static async sendRequest<T>(
    url: string,
    payload: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const credential = `${process.env["DEPLOYS_AUTH_USER"]}:${process.env["DEPLOYS_AUTH_PASS"]}`;
    const encodedCred = Buffer.from(credential).toString("base64");
    const headers = {
      ...config?.headers,
      Authorization: `Basic ${encodedCred}`,
    };

    const updatedConfig: AxiosRequestConfig = {
      ...config,
      headers,
    };

    return await this.post<T>(url, payload, updatedConfig);
  }

  static async get(
    payload: GetDeploymentRequest,
    config?: AxiosRequestConfig
  ): Promise<ResponseDto<GetDeploymentResponse>> {
    return await this.sendRequest<ResponseDto<GetDeploymentResponse>>(
      "https://api-stag-899570118063554590.nortezh0.deploys.app/user/deployment.get",
      payload,
      config
    );
  }

  static async deploy(
    payload: DeployNewRevisionRequest,
    config?: AxiosRequestConfig
  ): Promise<ResponseDto<any>> {
    return await this.sendRequest<ResponseDto<any>>(
      "https://api-stag-899570118063554590.nortezh0.deploys.app/user/deployment.deploy",
      payload,
      config
    );
  }

  static async create(
    payload: CreateDeploymentRequest,
    config?: AxiosRequestConfig
  ): Promise<ResponseDto<CreateDeploymentResponse>> {
    return await this.sendRequest<ResponseDto<CreateDeploymentResponse>>(
      "https://api-stag-899570118063554590.nortezh0.deploys.app/user/deployment.create",
      payload,
      config
    );
  }

}
