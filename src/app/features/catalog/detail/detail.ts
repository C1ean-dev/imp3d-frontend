import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CatalogService } from '../../../core/services/catalog/catalog.service';
import { CartService } from '../../../core/services/cart/cart.service';
import { CatalogItem } from '../../../core/models/catalog-item';

@Component({
  selector: 'app-detail',
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './detail.html',
  styleUrl: './detail.scss',
})
export class Detail {
 

 private route = inject(ActivatedRoute);
  private catalog = inject(CatalogService);
  private cart = inject(CartService);

  item$: Observable<CatalogItem> = this.route.paramMap.pipe(
    switchMap((params) => this.catalog.getById(params.get('id')!))
  );

  addToCart(item: CatalogItem): void {
    this.cart.addItem(item, 1);
  }
}