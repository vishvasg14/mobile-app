export interface ApiResponse<T> {
  responseCode: number;
  responseMessage: string;
  responseObject: T;
  pageSize: number | null;
}