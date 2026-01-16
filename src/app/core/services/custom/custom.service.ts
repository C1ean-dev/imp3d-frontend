import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CustomRequest } from '../../models/custom-request';

@Injectable({ providedIn: 'root' })
export class CustomService {
  private http = inject(HttpClient);

  submit(request: { material: string; color: string; dimensions: string; notes: string; file: File }): Observable<CustomRequest> {
   

 const form = new FormData();
    form.append('material', request.material);
    form.append('color', request.color);
    form.append('dimensions', request.dimensions);
    form.append('notes', request.notes);
    form.append('file', request.file);
    return this.http.post<CustomRequest>('/api/custom', form);
  }
}