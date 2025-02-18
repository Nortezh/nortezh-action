import { DeploymentType, Disk, Resource } from '..';

export interface GetDeploymentResponse {
  id: string;
  project: string;
  location: string;
  name: string;
  image: string;
  minReplica: number;
  maxReplica: number;
  type: DeploymentType;
  port: number;
  protocol: string;
  internal: boolean;
  env: Record<string, string>;
  command: string[];
  args: string[];
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

export interface CreateDeploymentResponse {
  id: string;
}
