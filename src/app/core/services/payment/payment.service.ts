import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private http = inject(HttpClient);

  createCheckout(payload: { amount: number; method: 'card' | 'paypal' | 'crypto' }): Observable<{ url: string }> {
    return this.http.post<{ url: string }>('/api/payments/checkout',

 payload);
  }
}