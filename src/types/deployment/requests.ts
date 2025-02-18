import { DeploymentType, Disk, Resource } from '..';

export interface GetDeploymentRequest {
  project: string;
  location: string;
  name: string;
}

export interface CreateDeploymentRequest {
  project: string;
  location: string;
  name: string;
  image: string;
  port?: number;
  type?: DeploymentType;
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
  resource?: Resource;
}

export interface DeployNewRevisionRequest extends CreateDeploymentRequest {}

export interface DeleteDeploymentRequest {
  project: string;
  location: string;
  name: string;
}
