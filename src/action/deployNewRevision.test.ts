import { deployNewRevision } from "./deployNewRevision";
import DeploymentService from "../deployment";
import { ErrorCode } from "../types";
import * as core from "@actions/core";

jest.mock("../deployment");
jest.mock("@actions/core");

describe("deployNewRevision", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should create a new deployment if it does not exist", async () => {
    (DeploymentService.create as jest.Mock).mockResolvedValue({
      ok: true,
    });

    (DeploymentService.get as jest.Mock).mockResolvedValue({
      ok: true,
      result: { url: "testUrl" },
    });

    await deployNewRevision();

    expect(DeploymentService.create).toHaveBeenCalled;
    expect(DeploymentService.get).toHaveBeenCalled;
    expect(core.setOutput).toHaveBeenCalled;
  });

  it("should deploy a new revision if the deployment already exists", async () => {
    (DeploymentService.create as jest.Mock).mockResolvedValue({
      ok: false,
      error: { code: ErrorCode.DEPLOYMENT_NAME_ALREADY_EXISTS },
    });

    (DeploymentService.deploy as jest.Mock).mockResolvedValue({
      ok: true,
    });

    (DeploymentService.get as jest.Mock).mockResolvedValue({
      ok: true,
      result: { url: "testUrl" },
    });

    await deployNewRevision();

    expect(DeploymentService.create).toHaveBeenCalled;
    expect(DeploymentService.deploy).toHaveBeenCalled;
    expect(DeploymentService.get).toHaveBeenCalled;

    expect(core.setOutput).toHaveBeenCalled;
  });

  it("should handle errors from the DeploymentService", async () => {
    (DeploymentService.create as jest.Mock).mockResolvedValue({
      ok: false,
      error: { code: "ERROR_CODE", message: "Error message" },
    });

    await deployNewRevision();

    expect(DeploymentService.create).toHaveBeenCalled;
    expect(core.setFailed).toHaveBeenCalledWith(" ERROR_CODE: Error message");
    expect(core.setOutput).not.toHaveBeenCalled();
  });

  it("should handle unexpected errors", async () => {
    (DeploymentService.create as jest.Mock).mockRejectedValue(
      new Error("Unexpected error")
    );

    await deployNewRevision();

    expect(DeploymentService.create).toHaveBeenCalled;
    expect(core.setFailed).toHaveBeenCalledWith("Unexpected error");
    expect(core.setOutput).not.toHaveBeenCalled();
  });

  it("should handle deployment creation failure with an unexpected error", async () => {
    (DeploymentService.create as jest.Mock).mockResolvedValue({
      ok: false,
      error: {},
    });

    await deployNewRevision();

    expect(DeploymentService.create).toHaveBeenCalled;
    expect(core.setFailed).toHaveBeenCalledWith(
      "Creating the deployment failed due to an unexpected error"
    );
    expect(core.setOutput).not.toHaveBeenCalled();
  });

  it("should handle deployment revision failure with an unexpected error", async () => {
    (DeploymentService.create as jest.Mock).mockResolvedValue({
      ok: false,
      error: { code: ErrorCode.DEPLOYMENT_NAME_ALREADY_EXISTS },
    });

    (DeploymentService.deploy as jest.Mock).mockResolvedValue({
      ok: false,
      error: {},
    });

    await deployNewRevision();

    expect(DeploymentService.create).toHaveBeenCalled;
    expect(DeploymentService.deploy).toHaveBeenCalled;
    expect(core.setFailed).toHaveBeenCalledWith(
      "Deploying the new revision failed due to an unexpected error"
    );
    expect(core.setOutput).not.toHaveBeenCalled();
  });

  it("should handle getting deployment failure with an unexpected error", async () => {
    (DeploymentService.create as jest.Mock).mockResolvedValue({
      ok: true,
    });

    (DeploymentService.get as jest.Mock).mockResolvedValue({
      ok: false,
      error: {},
    });

    await deployNewRevision();

    expect(DeploymentService.create).toHaveBeenCalled;
    expect(DeploymentService.get).toHaveBeenCalled;
    expect(core.setFailed).toHaveBeenCalledWith(
      "Getting the deployment failed due to an unexpected error"
    );
    expect(core.setOutput).not.toHaveBeenCalled();
  });
});
