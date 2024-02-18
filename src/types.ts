export enum DeploymentActionType {
  Create = "deployment.create-revision",
  Delete = "deployment.delete",
  Clone = "deployment.clone",
}

export enum ErrorCode {
  DEPLOYMENT_NOT_FOUND = "DEPLOYMENT_NOT_FOUND",
  DEPLOYMENT_NAME_ALREADY_EXISTS = "DEPLOYMENT_NAME_ALREADY_EXISTS",
}

export interface Inputs {
  action: DeploymentActionType;
  project: string;
  location: string;
  name: string;
  image: string;
  port: number;
  type: string;
}

export interface ResponseError {
  code: string;
  message?: string;
}

export interface ResponseDto<T = unknown> {
  ok: boolean;
  result?: T;
  error?: ResponseError;
}

export interface GetDeploymentRequest {
  project: string;
  location: string;
  name: string;
}

export interface GetDeploymentResponse {
  id: number;
  project: string;
  location: string;
  name: string;
  image: string;
  minReplica: number;
  maxReplica: number;
  type: string;
  port: number;
  protocol: string;
  internal: boolean;
  env: any;
  command: string[];
  arg: string[];
  pullSecret: string;
  disk: any;
  schedule: string;
  mountData: any;
  resource: any;
  revision: number;
  latestDeployAt: string;
  deployedBy: number;
  createdAt: string;
  action: string;
  actionStatus: string;

  url: string;
  internalUrl: string;
  logUrl: string;
  eventUrl: string;
  podUrl: string;
  StatusUrl: string;
  address: string;
  internalAddress: string;
  DeployedByEmail: string;
}

export interface Deployment {
  project: string;
  location: string;
  name: string;
  image: string;
  port: number;
  type: string;
}

export interface DeployNewRevisionRequest extends Deployment {}

export interface CreateDeploymentRequest extends Deployment {}

export interface CreateDeploymentResponse {
  id: number;
}
