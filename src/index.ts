import * as core from "@actions/core";
import { DeploymentActionType } from "./types";
import { cloneDeployment, deployNewRevision } from "./action";

async function run(): Promise<void> {
  try {
    const actionType = core.getInput("action") as DeploymentActionType;
    if (Object.values(DeploymentActionType).includes(actionType)) {
      if (actionType === DeploymentActionType.Create) {
        await deployNewRevision();
      }

      if (actionType === DeploymentActionType.Delete) {
        // delete
      }

      if (actionType === DeploymentActionType.Clone) {
        await cloneDeployment();
      }
    } else {
      core.setFailed(
        'Deployment action type must be "deployment.create-revision", "deployment.delete" or "deployment.clone"'
      );
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message);
  }
}

run();
