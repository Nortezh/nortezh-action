import * as core from "@actions/core";
import { deleteDeployment } from "./deleteDeployment";
import { DeleteDeploymentRequest } from "../types";
import DeploymentService from "../deployment";

jest.mock("@actions/core");
jest.mock("../deployment");

const mockedCore = core as jest.Mocked<typeof core>;
const mockedDeploymentService = DeploymentService as jest.Mocked<
  typeof DeploymentService
>;

describe("deleteDeployment", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should delete the deployment successfully", async () => {
    const input: DeleteDeploymentRequest = {
      project: "test-project",
      location: "test-location",
      name: "test-name",
    };

    mockedCore.getInput.mockImplementation(
      (name) => input[name as keyof DeleteDeploymentRequest]
    );
    mockedDeploymentService.delete.mockResolvedValue({ ok: true });

    await deleteDeployment();

    expect(mockedCore.getInput).toHaveBeenCalledWith("project", {
      required: true,
    });
    expect(mockedCore.getInput).toHaveBeenCalledWith("location", {
      required: true,
    });
    expect(mockedCore.getInput).toHaveBeenCalledWith("name", {
      required: true,
    });
    expect(mockedDeploymentService.delete).toHaveBeenCalledWith(input);
    expect(mockedCore.setFailed).not.toHaveBeenCalled();
  });

  it("should handle deletion failure with error details", async () => {
    const input: DeleteDeploymentRequest = {
      project: "test-project",
      location: "test-location",
      name: "test-name",
    };

    const errorResponse = {
      ok: false,
      error: { code: "ERROR_CODE", message: "Error message" },
    };

    mockedCore.getInput.mockImplementation(
      (name) => input[name as keyof DeleteDeploymentRequest]
    );
    mockedDeploymentService.delete.mockResolvedValue(errorResponse);

    await deleteDeployment();

    expect(mockedCore.getInput).toHaveBeenCalledWith("project", {
      required: true,
    });
    expect(mockedCore.getInput).toHaveBeenCalledWith("location", {
      required: true,
    });
    expect(mockedCore.getInput).toHaveBeenCalledWith("name", {
      required: true,
    });
    expect(mockedDeploymentService.delete).toHaveBeenCalledWith(input);
    expect(mockedCore.setFailed).toHaveBeenCalledWith(
      ` ${errorResponse.error.code}: ${errorResponse.error.message}`
    );
  });

  it("should handle deletion failure without error details", async () => {
    const input: DeleteDeploymentRequest = {
      project: "test-project",
      location: "test-location",
      name: "test-name",
    };

    const errorResponse = { ok: false, error: {} };

    mockedCore.getInput.mockImplementation(
      (name) => input[name as keyof DeleteDeploymentRequest]
    );
    mockedDeploymentService.delete.mockResolvedValue(errorResponse);

    await deleteDeployment();

    expect(mockedCore.getInput).toHaveBeenCalledWith("project", {
      required: true,
    });
    expect(mockedCore.getInput).toHaveBeenCalledWith("location", {
      required: true,
    });
    expect(mockedCore.getInput).toHaveBeenCalledWith("name", {
      required: true,
    });
    expect(mockedDeploymentService.delete).toHaveBeenCalledWith(input);
    expect(mockedCore.setFailed).toHaveBeenCalledWith(
      "Deleting the deployment failed due to an unexpected error"
    );
  });

  it("should handle unexpected errors", async () => {
    const input: DeleteDeploymentRequest = {
      project: "test-project",
      location: "test-location",
      name: "test-name",
    };

    const error = new Error("Unexpected error");

    mockedCore.getInput.mockImplementation(
      (name) => input[name as keyof DeleteDeploymentRequest]
    );
    mockedDeploymentService.delete.mockRejectedValue(error);

    await deleteDeployment();

    expect(mockedCore.getInput).toHaveBeenCalledWith("project", {
      required: true,
    });
    expect(mockedCore.getInput).toHaveBeenCalledWith("location", {
      required: true,
    });
    expect(mockedCore.getInput).toHaveBeenCalledWith("name", {
      required: true,
    });
    expect(mockedDeploymentService.delete).toHaveBeenCalledWith(input);
    expect(mockedCore.setFailed).toHaveBeenCalledWith(error.message);
  });
});
