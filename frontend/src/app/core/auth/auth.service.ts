import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ApiResponse } from '../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private api: ApiService) { }

  login(payload: { email: string; password: string }) {
    return this.api.post<ApiResponse<any>>('/auth/login', payload);
  }

  register(payload: any) {
    return this.api.post<ApiResponse<any>>('/auth/register', payload);
  }

  resetPassword(payload: { email: string; password: string }) {
    return this.api.post<ApiResponse<any>>('/auth/reset-password', payload);
  }

  me() {
    return this.api.get<ApiResponse<any>>('/auth/me');
  }
}
