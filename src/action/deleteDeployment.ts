import * as core from '@actions/core';
import { DeleteDeploymentRequest } from '../types';
import DeploymentService from '../deployment';

export const deleteDeployment = async (): Promise<void> => {
  try {
    const input = {
      project: core.getInput('project', { required: true }),
      location: core.getInput('location', { required: true }),
      name: core.getInput('name', { required: true }),
    };

    const deleteResponse = await DeploymentService.delete(input as DeleteDeploymentRequest);

    if (!deleteResponse.ok) {
      if (!deleteResponse.error || Object.keys(deleteResponse.error).length === 0) {
        core.setFailed(`Deleting the deployment failed due to an unexpected error`);
        return;
      }
      core.setFailed(` ${deleteResponse.error.code}: ${deleteResponse.error.message}`);
      return;
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message);
  }
};
