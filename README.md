# Nortezh Action to Manage Deployments

## Feature

- Create a deployment (or deploy new revision)
- Clone a deployment
- Delete a deployment

## Usage

### Create a deployment (or deploy new revision)

This action type will create a new deployment if no deployment with the provided project, location, and name has been created before. If a deployment already exists, it will deploy a new revision with the new provided configuration.

If `env` is provided, it will override all existing environment variables. If env is not provided, the deployment will retain the existing environment variables to prevent accidental deletion.

**Inputs:**

| Parameter | Description |
|-----------|-------------------------|
| `action` | **Required** type of an action. Should be `deployment.create-revision` to create a deployment or deploy new revision. |
| `project` | **Required** project |
| `location`| **Required** deploy location id |
| `name` | **Required** deployment name |
| `image` | **Required** docker image to deploy |
| `port` | **Optional** deployment port, default is 80 |
| `type` | **Optional** deployment type, default is 'WebService'. Supported types: WebService, Worker, Cronjob. |
| `env` | **Optional** environment variables in YAML format. If omitted, existing environment variables will be retained. |

**Environment variables:**

| Variable | Description |
|-----------|-------------------------|
| `SA_AUTH_EMAIL` | Service account email |
| `SA_AUTH_KEY` | Service account key |

**Outputs:**

| Outputs | Description |
|---------|-------------------------|
| `public_url` | Deployment public URL to access |

### Clone a deployment

The new cloned deployment will have a new name and image, with its configuration copied from the original deployment.

**Inputs:**

| Parameter | Description |
|-----------|-------------------------|
| `action` | **Required** type of an action. Should be `deployment.clone` to clone a deployment. |
| `project` | **Required** project |
| `location`| **Required** deploy location id |
| `name` | **Required** deployment name that is to be cloned |
| `image` | **Required** docker image to deploy |
| `new_name`| **Optional** new deployment name. Randomly generated if a new deployment name is not provided |
| `env` | **Optional** environment variables in YAML format |

**Environment variables:**

| Variable | Description |
|-----------|-------------------------|
| `SA_AUTH_EMAIL` | Service account email |
| `SA_AUTH_KEY` | Service account key |

**Outputs:**

| Outputs | Description |
|---------|-------------------------|
| `public_url` | Deployment public URL to access |

### Delete a deployment

**Inputs:** (all required)

| Parameter | Description |
|-----------|-------------------------|
| `action` | Type of an action. Should be `deployment.delete` to delete a deployment. |
| `project` | Project |
| `location`| Deploy location id |
| `name` | Deployment name |

**Environment variables:**

| Variable | Description |
|-----------|-------------------------|
| `SA_AUTH_EMAIL` | Service account email |
| `SA_AUTH_KEY` | Service account key |

**Outputs:** None

## Example

```yaml
name: Deploy

on:
  push:
    branches:
    - master

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: Nortezh/nortezh-action@v1
        with:
          action: deployment.create-revision
          project: project-test
          location: nortezh-stag
          name: deployment-name-1
          image: nginx
          port: 80
          type: WebService
          env: |
            PORT: 80
            DB_URL: localhost:5432
        env:
          SA_AUTH_EMAIL: ${{ secrets.SA_AUTH_EMAIL }}
          SA_AUTH_KEY: ${{ secrets.SA_AUTH_KEY }}
```