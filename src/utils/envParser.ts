import * as fs from 'fs';
import * as path from 'path';

export const parseEnvInput = (envInput: string): Record<string, string> | null => {
  if (!envInput.trim()) return null;

  const result = envInput
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .reduce(
      (acc, line) => {
        if (line.includes('=')) {
          const [key, ...valueParts] = line.split('=');
          const keyTrimmed = key.trim();
          const valueTrimmed = valueParts.join('=').trim();

          if (keyTrimmed && valueTrimmed) {
            acc[keyTrimmed] = valueTrimmed;
          }
        } else if (line.includes(':')) {
          const [key, ...valueParts] = line.split(':');
          const keyTrimmed = key.trim();
          const valueTrimmed = valueParts.join(':').trim();

          if (keyTrimmed && valueTrimmed) {
            acc[keyTrimmed] = valueTrimmed;
          }
        }
        return acc;
      },
      {} as Record<string, string>,
    );

  return Object.keys(result).length > 0 ? result : null;
};

export const readEnvFile = (
  filePath: string = '.env',
): {
  data: Record<string, string> | null;
  error: string | null;
} => {
  try {
    const absolutePath = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);

    if (!fs.existsSync(absolutePath)) {
      return {
        data: null,
        error: `Environment file not found: ${absolutePath}`,
      };
    }

    const fileContent = fs.readFileSync(absolutePath, 'utf-8');
    const parsedEnv = parseEnvInput(fileContent);

    return {
      data: parsedEnv,
      error: null,
    };
  } catch (error) {
    const errorMessage = `Error reading environment file: ${error instanceof Error ? error.message : String(error)}`;
    return {
      data: null,
      error: errorMessage,
    };
  }
};
