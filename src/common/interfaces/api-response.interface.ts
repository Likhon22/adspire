export interface IApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: {
    total?: number;
    page?: number;
    lastPage?: number;
  };

  timestamp: string;
}
