import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SupportTicket } from '../../models/support-ticket';
import { Faq } from '../../models/faq';

@Injectable({ providedIn: 'root' })
export class SupportService {
  private http = inject(HttpClient);

  getFaqs(): Observable<Faq[]> {
    return this.http.get<Faq[]>('/api/support/faqs');
  }

  submitTicket(subject: string, message: string): Observable<SupportTicket> {
    return this.http.post<SupportTicket>('/api/support/tickets', { subject, message });
  }
}