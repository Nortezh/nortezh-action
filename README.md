# Nortezh Action to Manage Deployments

## Feature

- Create a deployment (or deploy new revision)
- Clone a deployment
- Delete a deployment

## Usage

### Create a deployment (or deploy new revision)

This action type will create a new deployment if no deployment with the provided project, location, and name has been created before. If a deployment already exists, it will deploy a new revision with the new provided configuration.

If `env` or `env_file` is provided, it will be merged with existing environment variables (with new values taking precedence over existing ones with the same key). If neither is provided, the deployment will retain all existing environment variables unchanged.

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
| `env` | **Optional** environment variables in standard `KEY=VALUE` format or YAML-like `KEY: VALUE` format. Each variable should be on a new line. If both `env` and `env_file` are provided, `env_file` takes precedence. |
| `env_file` | **Optional** path to an environment file. Supports both .env format (`KEY=VALUE`) and YAML-like format (`KEY: VALUE`). Comments (lines starting with #) are ignored. |

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
| `env` | **Optional** environment variables in standard `KEY=VALUE` format or YAML-like `KEY: VALUE` format. Each variable should be on a new line. |
| `env_file` | **Optional** path to an environment file. Supports both formats. |

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

## Environment Variable Format
The action supports two formats for environment variables:

### Standard .env Format (Recommended)
This is the standard format used in .env files:
```
# This is a comment and will be ignored
PORT=80
DB_URL=localhost:5432
API_KEY=your-api-key
```

### YAML-like Format (Legacy Support)
For backward compatibility, the action also supoort YAML-like format:
```
PORT: 80
DB_URL: localhost:5432
API_KEY: your-api-key
```

Both formats can be used interchangeably in either `env` or `env_file`. 
You can even mix both formats in the same input, though using one consistent format is recommended.
You can provide these variables in two ways:
1. Using an `env_file` - Point to a file containing your environment variables
2. Using inline `env` - Specify the variables directly in your workflow file

### Behavior with Existing Deployments
When updating an existing deployment:

- New environment variables will be added to the existing ones
- Existing environment variables with the same keys will be updated
- Existing environment variables with different keys will be preserved

## Examples
### Using an .env file

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
          env_file: .env
        env:
          SA_AUTH_EMAIL: ${{ secrets.SA_AUTH_EMAIL }}
          SA_AUTH_KEY: ${{ secrets.SA_AUTH_KEY }}
```

### Using inline environment variables (with standard .env format)

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
            PORT=80
            DB_URL=localhost:5432
        env:
          SA_AUTH_EMAIL: ${{ secrets.SA_AUTH_EMAIL }}
          SA_AUTH_KEY: ${{ secrets.SA_AUTH_KEY }}
```

### Using inline environment variables (with YAML-like format)

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

## Error Handling
When using `env_file`, the action will:

- Check if the file exists at the specified path
- Attempt to parse the file content as environment variables
- Log any errors that occur during the process
- Fall back to the inline env parameter if file reading fails

Common errors that might occur:

- File not found at the specified path
- Invalid format in the environment file