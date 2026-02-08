import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class TokenService {
  private KEY = 'access_token';

  set(token: string) {
    localStorage.setItem(this.KEY, token);
  }

  get(): string | null {
    return localStorage.getItem(this.KEY);
  }

  clear() {
    localStorage.removeItem(this.KEY);
  }
}
