import { cloneDeployment } from './cloneDeployment';
import * as core from '@actions/core';
import DeploymentService from '../deployment';

jest.mock('@actions/core');
jest.mock('../deployment');

describe('cloneDeployment', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should successfully clone deployment', async () => {
    (DeploymentService.get as jest.Mock).mockResolvedValueOnce({ ok: true, result: {} });
    (DeploymentService.create as jest.Mock).mockResolvedValue({ ok: true, result: {} });
    (DeploymentService.get as jest.Mock).mockResolvedValueOnce({ ok: true, result: {} });

    await cloneDeployment();

    expect(core.setFailed).not.toHaveBeenCalled();
    expect(core.setOutput).toHaveBeenCalled();
  });

  it('should fail if getting the deployment fails', async () => {
    (DeploymentService.get as jest.Mock).mockResolvedValue({ ok: false, error: { code: 'error_code', message: 'error_message' } });

    await cloneDeployment();

    expect(core.setFailed).toHaveBeenCalledWith(' error_code: error_message');
    expect(core.setOutput).not.toHaveBeenCalled;
  });

  it('should fail if cloning the deployment fails', async () => {
    (DeploymentService.get as jest.Mock).mockResolvedValue({ ok: true, result: {} });
    (DeploymentService.create as jest.Mock).mockResolvedValue({ ok: false, error: { code: 'error_code', message: 'error_message' } });

    await cloneDeployment();

    expect(core.setFailed).toHaveBeenCalledWith(' error_code: error_message');
    expect(core.setOutput).not.toHaveBeenCalled;
  });

  it('should fail if getting the cloned deployment fails', async () => {
    (DeploymentService.get as jest.Mock).mockResolvedValueOnce({ ok: true, result: {} });
    (DeploymentService.create as jest.Mock).mockResolvedValue({ ok: true, result: {} });
    (DeploymentService.get as jest.Mock).mockResolvedValueOnce({ ok: false, error: { code: 'error_code', message: 'error_message' } });

    await cloneDeployment();

    expect(core.setFailed).toHaveBeenCalledWith(' error_code: error_message');
    expect(core.setOutput).not.toHaveBeenCalled;
  });
});