import { deployNewRevision } from './deployNewRevision';
import DeploymentService from '../deployment';
import { DeploymentActionType, ErrorCode, Inputs } from '../types';
import * as core from '@actions/core';

jest.mock('../deployment');
jest.mock('@actions/core');

describe('deployNewRevision', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should create a new deployment if it does not exist', async () => {
    const input: Inputs = {
      action: 'deployment.create-revision' as DeploymentActionType,
      project: 'testProject',
      location: 'testLocation',
      name: 'testName',
      image: 'testImage',
      port: 8080,
      type: 'WebService',
    };

    (DeploymentService.create as jest.Mock).mockResolvedValue({
      ok: true,
    });

    (DeploymentService.get as jest.Mock).mockResolvedValue({
      ok: true,
      result: { url: 'testUrl' },
    });

    await deployNewRevision(input);

    expect(DeploymentService.create).toHaveBeenCalledWith(input);
    expect(DeploymentService.get).toHaveBeenCalledWith({
      project: input.project,
      location: input.location,
      name: input.name,
    });
    expect(core.setOutput).toHaveBeenCalledWith('public-url', 'testUrl');
  });

  it('should deploy a new revision if the deployment already exists', async () => {
    const input = {
      action: 'deployment.create-revision' as DeploymentActionType,
      project: 'testProject',
      location: 'testLocation',
      name: 'testName',
      image: 'testImage',
      port: 8080,
      type: 'WebService',
    };

    (DeploymentService.create as jest.Mock).mockResolvedValue({
      ok: false,
      error: { code: ErrorCode.DEPLOYMENT_NAME_ALREADY_EXISTS },
    });

    (DeploymentService.deploy as jest.Mock).mockResolvedValue({
      ok: true,
    });

    (DeploymentService.get as jest.Mock).mockResolvedValue({
      ok: true,
      result: { url: 'testUrl' },
    });

    await deployNewRevision(input);

    expect(DeploymentService.create).toHaveBeenCalledWith(input);
    expect(DeploymentService.deploy).toHaveBeenCalledWith(input);
    expect(DeploymentService.get).toHaveBeenCalledWith({
      project: input.project,
      location: input.location,
      name: input.name,
    });
    expect(core.setOutput).toHaveBeenCalledWith('public-url', 'testUrl');
  });

  it('should handle errors from the DeploymentService', async () => {
    const input = {
      action: 'deployment.create-revision' as DeploymentActionType,
      project: 'testProject',
      location: 'testLocation',
      name: 'testName',
      image: 'testImage',
      port: 8080,
      type: 'WebService',
    };

    (DeploymentService.create as jest.Mock).mockResolvedValue({
      ok: false,
      error: { code: 'ERROR_CODE', message: 'Error message' },
    });

    await deployNewRevision(input);

    expect(DeploymentService.create).toHaveBeenCalledWith(input);
    expect(core.setFailed).toHaveBeenCalledWith(' ERROR_CODE: Error message');
    expect(core.setOutput).not.toHaveBeenCalled();
  });

  it('should handle unexpected errors', async () => {
    const input = {
      action: 'deployment.create-revision' as DeploymentActionType,
      project: 'testProject',
      location: 'testLocation',
      name: 'testName',
      image: 'testImage',
      port: 8080,
      type: 'WebService',
    };

    (DeploymentService.create as jest.Mock).mockRejectedValue(new Error('Unexpected error'));

    await deployNewRevision(input);

    expect(DeploymentService.create).toHaveBeenCalledWith(input);
    expect(core.setFailed).toHaveBeenCalledWith('Unexpected error');
    expect(core.setOutput).not.toHaveBeenCalled();
  });

  it('should handle deployment creation failure with an unexpected error', async () => {
    const input: Inputs = {
      action: 'deployment.create-revision' as DeploymentActionType,
      project: 'testProject',
      location: 'testLocation',
      name: 'testName',
      image: 'testImage',
      port: 8080,
      type: 'WebService',
    };

    (DeploymentService.create as jest.Mock).mockResolvedValue({
      ok: false,
      error: {},
    });

    await deployNewRevision(input);

    expect(DeploymentService.create).toHaveBeenCalledWith(input);
    expect(core.setFailed).toHaveBeenCalledWith('Creating the deployment failed due to an unexpected error');
    expect(core.setOutput).not.toHaveBeenCalled();
  });

  it('should handle deployment revision failure with an unexpected error', async () => {
    const input: Inputs = {
      action: 'deployment.create-revision' as DeploymentActionType,
      project: 'testProject',
      location: 'testLocation',
      name: 'testName',
      image: 'testImage',
      port: 8080,
      type: 'WebService',
    };

    (DeploymentService.create as jest.Mock).mockResolvedValue({
      ok: false,
      error: { code: ErrorCode.DEPLOYMENT_NAME_ALREADY_EXISTS },
    });

    (DeploymentService.deploy as jest.Mock).mockResolvedValue({
      ok: false,
      error: {},
    });

    await deployNewRevision(input);

    expect(DeploymentService.create).toHaveBeenCalledWith(input);
    expect(DeploymentService.deploy).toHaveBeenCalledWith(input);
    expect(core.setFailed).toHaveBeenCalledWith('Deploying the new revision failed due to an unexpected error');
    expect(core.setOutput).not.toHaveBeenCalled();
  });

  it('should handle getting deployment failure with an unexpected error', async () => {
    const input: Inputs = {
      action: 'deployment.create-revision' as DeploymentActionType,
      project: 'testProject',
      location: 'testLocation',
      name: 'testName',
      image: 'testImage',
      port: 8080,
      type: 'WebService',
    };

    (DeploymentService.create as jest.Mock).mockResolvedValue({
      ok: true,
    });

    (DeploymentService.get as jest.Mock).mockResolvedValue({
      ok: false,
      error: {},
    });

    await deployNewRevision(input);

    expect(DeploymentService.create).toHaveBeenCalledWith(input);
    expect(DeploymentService.get).toHaveBeenCalledWith({
      project: input.project,
      location: input.location,
      name: input.name,
    });
    expect(core.setFailed).toHaveBeenCalledWith('Getting the deployment failed due to an unexpected error');
    expect(core.setOutput).not.toHaveBeenCalled();
  });
});