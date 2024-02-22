import * as core from '@actions/core';
import {
  CreateDeploymentRequest,
  DeployNewRevisionRequest,
  ErrorCode,
  GetDeploymentRequest,
} from '../types';
import DeploymentService from '../deployment';

export const deployNewRevision = async (): Promise<void> => {
  try {
    const input = {
      project: core.getInput('project', { required: true }),
      location: core.getInput('location', { required: true }),
      name: core.getInput('name', { required: true }),
      image: core.getInput('image', { required: true }),
      port: parseInt(core.getInput('port', { required: true })),
      type: core.getInput('type', { required: true }),
    };

    const createResponse = await DeploymentService.create(input as CreateDeploymentRequest);
    if (
      !createResponse.ok &&
      createResponse.error?.code === ErrorCode.DEPLOYMENT_NAME_ALREADY_EXISTS
    ) {
      const deployResponse = await DeploymentService.deploy(input as DeployNewRevisionRequest);
      if (!deployResponse.ok) {
        if (!deployResponse.error || Object.keys(deployResponse.error).length === 0) {
          core.setFailed(`Deploying the new revision failed due to an unexpected error`);
          return;
        }
        core.setFailed(` ${deployResponse.error.code}: ${deployResponse.error.message}`);
        return;
      }
    } else {
      if (!createResponse.ok) {
        if (!createResponse.error || Object.keys(createResponse.error).length === 0) {
          core.setFailed(`Creating the deployment failed due to an unexpected error`);
          return;
        }
        core.setFailed(` ${createResponse.error.code}: ${createResponse.error.message}`);
        return;
      }
    }

    const getResponse = await DeploymentService.get({
      project: input.project,
      location: input.location,
      name: input.name,
    } as GetDeploymentRequest);

    if (!getResponse.ok) {
      if (!getResponse.error || Object.keys(getResponse.error).length === 0) {
        core.setFailed(`Getting the deployment failed due to an unexpected error`);
        return;
      }
      core.setFailed(` ${getResponse.error.code}: ${getResponse.error.message}`);
      return;
    }

    core.setOutput('public_url', getResponse.result?.url);
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    } else {
      core.setFailed(`An unknown error occurred: \n${error}`);
    }
  }
};
