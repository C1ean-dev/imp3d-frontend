import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CatalogItem } from '../../models/catalog-item';

@Injectable({ providedIn: 'root' })
export class CatalogService {
  private http = inject(HttpClient);

  getCatalog(filters?: { category?: string; material?: string; q?: string; min?: number; max?: number }): Observable<CatalogItem[]> {
    let params = new HttpParams();
    if (filters?.category) params = params.set('category', filters.category);
    if (filters?.material) params = params.set('material', filters.material);
    if (filters?.q) params = params.set('q', filters.q);
    if (filters?.min != null) params = params.set('min', filters.min);
    if (filters?.max != null) params = params.set('max', filters.max);
    return this.http.get<CatalogItem[]>('/api/catalog', { params });
  }

  getById(id: string): Observable<CatalogItem> {
    return this.http.get<CatalogItem>(`/api/catalog/${id}`);
  }
}