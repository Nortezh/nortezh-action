export interface Disk {
  name: string;
  mountPath: string;
  subPath: string;
}

interface ResourceValue {
  cpu: string;
  memory: string;
}

export interface Resource {
  requests: ResourceValue;
  limits: ResourceValue;
}
