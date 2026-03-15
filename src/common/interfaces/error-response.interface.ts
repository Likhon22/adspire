export interface IErrorResponse {
  success: boolean;
  statusCode: number;
  message: string;
  errorType: string;
  errors?: string[];
  path: string;
  timestamp: string;
}
