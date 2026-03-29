import { z } from 'zod';

export const envValidationSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(3000),
});
export type EnvironmentVariables = z.infer<typeof envValidationSchema>;
export function validate(config: Record<string, unknown>) {
  const result = envValidationSchema.safeParse(config);

  if (!result.success) {
    throw new Error(`Config validation error: ${result.error.message}`);
  }

  return result.data;
}
