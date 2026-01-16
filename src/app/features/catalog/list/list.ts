import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Observable, startWith, switchMap } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CatalogService } from '../../../core/services/catalog/catalog.service';
import { CartService } from '../../../core/services/cart/cart.service';
import { CatalogItem } from '../../../core/models/catalog-item';

@Component({
  selector: 'app-list',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, MatFormFieldModule, MatInputModule, MatSelectModule, MatCardModule, MatButtonModule],
  templateUrl: './list.html',
  styleUrl: './list.scss',
})
export class List {
  private fb = inject(FormBuilder);
  private catalog = inject(CatalogService);
  private cart = inject(CartService);

  form = this.fb.group({
    q: [''],
    category: [''],
    material: [''],
    min: [''],
    max: ['']
  });

  items$: Observable<CatalogItem[]> = this.form.valueChanges.pipe(
    startWith(this.form.value),
    switchMap((v) => this.catalog.getCatalog({
      q: v.q || undefined,
      category: v.category || undefined,
      material: v.material || undefined,
      min: v.min ? Number(v.min) : undefined,
      max: v.max ? Number(v.max) : undefined
    }))
  );

  addToCart(item: CatalogItem): void {
    this.cart.addItem(item, 1);
  }
}