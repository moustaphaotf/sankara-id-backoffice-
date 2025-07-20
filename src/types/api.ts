export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface FilterParams {
  search?: string;
  status?: string;
  tier?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}