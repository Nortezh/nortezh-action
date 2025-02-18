export const parseEnvInput = (envInput: string): Record<string, string> => {
  if (!envInput.trim()) return {};

  return envInput
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && line.includes(':'))
    .reduce(
      (acc, line) => {
        const [key, ...valueParts] = line.split(':');
        const keyTrimmed = key.trim();
        const valueTrimmed = valueParts.join(':').trim();

        if (keyTrimmed && valueTrimmed) {
          acc[keyTrimmed] = valueTrimmed;
        }
        return acc;
      },
      {} as Record<string, string>,
    );
};
