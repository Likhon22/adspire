import { Request } from 'express';

export function getHeaderSafely(
  request: Request,
  headerName: string,
  fallback = 'unknown',
): string {
  const rawValue = request.headers[headerName.toLowerCase()];

  if (Array.isArray(rawValue)) {
    return rawValue[0];
  }

  if (typeof rawValue === 'string' && rawValue.trim() !== '') {
    return rawValue;
  }

  return fallback;
}
