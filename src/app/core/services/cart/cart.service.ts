import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../../models/cart-item';
import { CatalogItem } from '../../models/catalog-item';
import { CustomRequest } from '../../models/custom-request';

@Injectable({ providedIn: 'root' })
export class CartService {
  private itemsSubject = new BehaviorSubject<CartItem[]>(this.load());
  items$ = this.itemsSubject.asObservable();

  addItem(item: CatalogItem, quantity = 1): void {
    const items = this.itemsSubject.getValue();
    const existing = items.find((i) => i.item?.id === item.id);
    if (existing) {
      existing.quantity += quantity;
      existing.price = existing.quantity * item.price;
    } else {
      items.push({ id: crypto.randomUUID(), item, quantity, price: item.price * quantity });
    }
    this.save(items);
  }

  addCustom(custom: CustomRequest, quantity = 1): void {
    const items = this.itemsSubject.getValue();
    items.push({ id: crypto.randomUUID(), custom, quantity, price: (custom.priceEstimate ?? 0) * quantity });
    this.save(items);
  }

  remove(id: string): void {
    const items = this.itemsSubject.getValue().filter((i) => i.id !== id);
    this.save(items);
  }

  clear(): void {
    this.save([]);
  }

  getTotal(items: CartItem[]): number {
    return items.reduce((sum, i) => sum + i.price, 0);
  }

  private save(items: CartItem[]): void {
    this.itemsSubject.next([...items]);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }

  private load(): CartItem[] {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem('cart');
    return raw ? JSON.parse(raw) : [];
  }
}