import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Observable, startWith, switchMap, tap, combineLatest } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CatalogService } from '../../../core/services/catalog/catalog.service';
import { CartService } from '../../../core/services/cart/cart.service';
import { CatalogItem } from '../../../core/models/catalog-item';

@Component({
  selector: 'app-list',
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RouterLink, 
    MatFormFieldModule, 
    MatInputModule, 
    MatCardModule, 
    MatButtonModule, 
    MatPaginatorModule
  ],
  templateUrl: './list.html',
  styleUrl: './list.scss',
})
export class List {
  private fb = inject(FormBuilder);
  private catalog = inject(CatalogService);
  private cart = inject(CartService);

  isLoading = signal(true);
  pageIndex = signal(0);
  pageSize = signal(4);
  totalItems = signal(0);

  form = this.fb.group({
    searchQuery: ['']
  });

  items$: Observable<CatalogItem[]> = combineLatest([
    this.form.valueChanges.pipe(
      startWith(this.form.getRawValue()), 
      tap(() => this.pageIndex.set(0))
    ),
    this.pageSize.asReadonly(),
    this.pageIndex.asReadonly()
  ]).pipe(
    tap(() => this.isLoading.set(true)),
    switchMap(([values]) => {
      const formValues = values as { searchQuery?: string | null };
      return this.catalog.getCatalog({ 
        q: formValues.searchQuery ?? undefined 
      });
    }),
    tap(items => this.totalItems.set(items.length)),
    switchMap(items => {
      const start = this.pageIndex() * this.pageSize();
      const end = start + this.pageSize();
      return [items.slice(start, end)];
    }),
    tap(() => this.isLoading.set(false))
  );

  handlePageEvent(e: PageEvent) {
    this.pageIndex.set(e.pageIndex);
    this.pageSize.set(e.pageSize);
  }

  addToCart(item: CatalogItem): void {
    this.cart.addItem(item, 1);
  }
}