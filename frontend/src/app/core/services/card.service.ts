import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { ApiResponse } from '../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class CardService {
  constructor(private api: ApiService) {}

  getMyCards() {
    return this.api.get<ApiResponse<any[]>>('/cards');
  }

  getCard(cardId: string) {
    return this.api.get<ApiResponse<any>>(`/cards/${cardId}`);
  }

  togglePublic(cardId: string) {
    return this.api.patch(`/cards/${cardId}/public`, {});
 }

  updateCard(cardId: string, payload: any) {
    return this.api.patch(`/cards/${cardId}`, payload);
  }
}
