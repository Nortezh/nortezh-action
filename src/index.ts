import * as core from "@actions/core";
import { DeploymentActionType, Inputs } from "./types";
import { deployNewRevision } from "./action";

async function run(): Promise<void> {
  try {
    const inputs: Inputs = {
      action: core.getInput("action") as DeploymentActionType,
      project: core.getInput("project"),
      location: core.getInput("location"),
      name: core.getInput("name"),
      image: core.getInput("image"),
      port: parseInt(core.getInput("port")),
      type: core.getInput("type"),
    };
    
    if (Object.values(DeploymentActionType).includes(inputs.action)) {
      if (inputs.action === DeploymentActionType.Create) {
        await deployNewRevision(inputs);
      }

      if (inputs.action === DeploymentActionType.Delete) {
        // delete
      }

      if (inputs.action === DeploymentActionType.Clone) {
        // clone
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
