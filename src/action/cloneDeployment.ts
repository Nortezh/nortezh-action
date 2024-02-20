import * as core from "@actions/core";
import { CreateDeploymentRequest, GetDeploymentRequest } from "../types";
import DeploymentService from "../deployment";
import { cryptpRandomString } from "../utils";

export const cloneDeployment = async (): Promise<void> => {
  try {
    const input = {
      project: core.getInput("project", { required: true }),
      location: core.getInput("location", { required: true }),
      name: core.getInput("name", { required: true }),
      image: core.getInput("image", { required: true }),
      newName:
        core.getInput("new-name") ||
        `${core.getInput("name")}-${cryptpRandomString(6)}`,
    };

    const getResponse = await DeploymentService.get({
      project: input.project,
      location: input.location,
      name: input.name,
    } as GetDeploymentRequest);
    if (!getResponse.ok) {
      if (!getResponse.error || Object.keys(getResponse.error).length === 0) {
        core.setFailed(
          `Getting the deployment failed due to an unexpected error`
        );
        return;
      }
      core.setFailed(
        ` ${getResponse.error.code}: ${getResponse.error.message}`
      );
      return;
    }

    const cloneResponse = await DeploymentService.create({
      project: input.project,
      location: input.location,
      name: input.newName,
      image: input.image,
      minReplica: getResponse.result?.minReplica,
      maxReplica: getResponse.result?.maxReplica,
      type: getResponse.result?.type,
      port: getResponse.result?.port,
      protocol: getResponse.result?.protocol,
      internal: getResponse.result?.internal,
      env: getResponse.result?.env,
      command: getResponse.result?.command,
      arg: getResponse.result?.arg,
      pullSecret: getResponse.result?.pullSecret,
      disk: getResponse.result?.disk,
      schedule: getResponse.result?.schedule,
      mountData: getResponse.result?.mountData,
      resource: getResponse.result?.resource,
    } as CreateDeploymentRequest);

    if (!cloneResponse.ok) {
      if (
        !cloneResponse.error ||
        Object.keys(cloneResponse.error).length === 0
      ) {
        core.setFailed(
          `Cloning the deployment failed due to an unexpected error`
        );
        return;
      }
      core.setFailed(
        ` ${cloneResponse.error.code}: ${cloneResponse.error.message}`
      );
      return;
    }
    const clonedResponse = await DeploymentService.get({
      project: input.project,
      location: input.location,
      name: input.newName,
    } as GetDeploymentRequest);

    if (!clonedResponse.ok) {
      if (
        !clonedResponse.error ||
        Object.keys(clonedResponse.error).length === 0
      ) {
        core.setFailed(
          `Getting the cloned deployment failed due to an unexpected error`
        );
        return;
      }
      core.setFailed(
        ` ${clonedResponse.error.code}: ${clonedResponse.error.message}`
      );
      return;
    }

    core.setOutput("public-url", clonedResponse.result?.url);
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message);
  }
};
