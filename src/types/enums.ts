export enum DeploymentType {
  WebService = 'Webservice',
  Worker = 'Worker',
  Cronjob = 'Cronjob',
}

export enum DeploymentActionType {
  Create = 'deployment.create-revision',
  Delete = 'deployment.delete',
  Clone = 'deployment.clone',
}
