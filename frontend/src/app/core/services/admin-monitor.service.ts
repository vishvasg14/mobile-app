import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { ApiResponse } from '../models/api-response.model';

export interface InteractionDashboard {
  window: { sinceHours: number; from: string; to: string };
  totals: { requests: number; errors: number; success: number };
  topIps: Array<{ ip: string; hits: number }>;
  topPaths: Array<{ path: string; hits: number }>;
  recent: Array<{
    _id: string;
    createdAt: string;
    ip: string;
    method: string;
    path: string;
    statusCode: number;
    durationMs: number;
    userId?: string;
    userRole?: string;
  }>;
}

@Injectable({ providedIn: 'root' })
export class AdminMonitorService {
  constructor(private api: ApiService) {}

  getDashboard(sinceHours = 24, limit = 50) {
    return this.api.get<ApiResponse<InteractionDashboard>>(
      `/admin/interactions/dashboard?sinceHours=${sinceHours}&limit=${limit}`,
    );
  }
}
