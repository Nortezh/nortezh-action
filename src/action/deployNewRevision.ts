import * as core from '@actions/core';
import {
  CreateDeploymentRequest,
  DeployNewRevisionRequest,
  DeploymentType,
  ErrorCode,
  GetDeploymentRequest,
} from '../types';
import DeploymentService from '../deployment';
import { parseEnvInput, readEnvFile } from '../utils';

export const deployNewRevision = async (): Promise<void> => {
  try {
    let envVars: Record<string, string> | null = null;

    const envFilePath = core.getInput('env_file');
    if (envFilePath) {
      const result = readEnvFile(envFilePath);
      if (result.error) {
        core.warning(result.error);
      } else {
        envVars = result.data;
      }
    }

    if (!envVars) {
      const envInput = core.getInput('env');
      if (envInput) {
        envVars = parseEnvInput(envInput);
      }
    }

    const typeInput = core.getInput('type');
    const deploymentType = typeInput ? (typeInput as DeploymentType) : undefined;

    const baseInput = {
      project: core.getInput('project', { required: true }),
      location: core.getInput('location', { required: true }),
      name: core.getInput('name', { required: true }),
      image: core.getInput('image', { required: true }),
      port: parseInt(core.getInput('port')) || undefined,
      type: deploymentType,
    };

    const createInput: CreateDeploymentRequest = {
      ...baseInput,
      env: envVars || undefined,
    };

    const deployInput: DeployNewRevisionRequest = {
      ...baseInput,
      addEnv: envVars || undefined,
    };

    const createResponse = await DeploymentService.create(createInput);
    if (
      !createResponse.ok &&
      createResponse.error?.code === ErrorCode.DEPLOYMENT_NAME_ALREADY_EXISTS
    ) {
      const deployResponse = await DeploymentService.deploy(deployInput);
      if (!deployResponse.ok) {
        if (!deployResponse.error || Object.keys(deployResponse.error).length === 0) {
          core.setFailed(`Deploying the new revision failed due to an unexpected error`);
          return;
        }
        core.setFailed(
          ` ${deployResponse.error.code}: ${deployResponse.error.message}` +
            (deployResponse.error.items ? ` (error causes: ${deployResponse.error.items})` : ''),
        );
        return;
      }
    } else {
      if (!createResponse.ok) {
        if (!createResponse.error || Object.keys(createResponse.error).length === 0) {
          core.setFailed(`Creating the deployment failed due to an unexpected error`);
          return;
        }
        core.setFailed(
          ` ${createResponse.error.code}: ${createResponse.error.message}` +
            (createResponse.error.items ? ` (error causes: ${createResponse.error.items})` : ''),
        );
        return;
      }
    }

    const getResponse = await DeploymentService.get({
      project: baseInput.project,
      location: baseInput.location,
      name: baseInput.name,
    } as GetDeploymentRequest);

    if (!getResponse.ok) {
      if (!getResponse.error || Object.keys(getResponse.error).length === 0) {
        core.setFailed(`Getting the deployment failed due to an unexpected error`);
        return;
      }
      core.setFailed(
        ` ${getResponse.error.code}: ${getResponse.error.message}` +
          (getResponse.error.items ? ` (error causes: ${getResponse.error.items})` : ''),
      );
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
