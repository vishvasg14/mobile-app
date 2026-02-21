import { Injectable } from '@angular/core';
import { TokenService } from './token.service';

@Injectable({ providedIn: 'root' })
export class CurrentUserService {
  constructor(private tokenService: TokenService) {}

  getRole(): string | null {
    const payload = this.getPayload();
    return payload?.role || null;
  }

  getUserId(): string | null {
    const payload = this.getPayload();
    return payload?.id || payload?._id || payload?.userId || null;
  }

  private getPayload(): any {
    const token = this.tokenService.get();
    if (!token) {
      return null;
    }

    const parts = token.split('.');
    if (parts.length < 2) {
      return null;
    }

    try {
      return JSON.parse(atob(parts[1]));
    } catch {
      return null;
    }
  }
}
