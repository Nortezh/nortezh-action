export enum DeploymentActionType {
  Create = 'deployment.create-revision',
  Delete = 'deployment.delete',
  Clone = 'deployment.clone',
}

export enum ErrorCode {
  DEPLOYMENT_NOT_FOUND = 'DEPLOYMENT_NOT_FOUND',
  DEPLOYMENT_NAME_ALREADY_EXISTS = 'DEPLOYMENT_NAME_ALREADY_EXISTS',
}

export interface ResponseError {
  code?: string;
  message?: string;
}

export interface ResponseDto<T = unknown> {
  ok: boolean;
  result?: T;
  error?: ResponseError;
}

interface Disk {
  name: string;
  mountPath: string;
  subPath: string;
}

export interface GetDeploymentRequest {
  project: string;
  location: string;
  name: string;
}

export interface GetDeploymentResponse {
  id: string;
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
  env: Record<string, string>;
  command: string[];
  arg: string[];
  pullSecret: string;
  disk: Disk;
  schedule: string;
  mountData: Record<string, string>;
  resource: Resource;
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
  statusUrl: string;
  address: string;
  internalAddress: string;
  deployedByEmail: string;
}

interface ResourceValue {
  cpu: string;
  memory: string;
}

interface Resource {
  requests: ResourceValue;
  limits: ResourceValue;
}

export interface CreateDeploymentRequest {
  project: string;
  location: string;
  name: string;
  image: string;
  port?: number;
  type?: string;
  minReplica?: number;
  maxReplica?: number;
  protocol?: string;
  internal?: boolean;
  env?: Record<string, string>;
  addEnv?: Record<string, string>;
  removeEnv?: string[];
  command?: string[];
  args?: string[];
  pullSecret?: string;
  disk?: Disk;
  schedule?: string;
  mountData?: Record<string, string>;
  resources?: Resource;
}

export interface CreateDeploymentResponse {
  id: string;
}

export interface DeployNewRevisionRequest extends CreateDeploymentRequest {}
export interface DeleteDeploymentRequest {
  project: string;
  location: string;
  name: string;
}
