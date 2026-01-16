import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../core/services/cart/cart.service';
import { PaymentService } from '../../core/services/payment/payment.service';
import { Observable } from 'rxjs';
import { CartItem } from '../../core/models/cart-item';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, MatButtonModule, ReactiveFormsModule, MatSelectModule],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class Cart {
  private cart = inject(CartService);
  private pay = inject(PaymentService);
  private fb = inject(FormBuilder);

  items$: Observable<CartItem[]> = this.cart.items$;
  loading = false;

  form = this.fb.group({
    method: ['card', Validators.required]
  });

  remove(id: string): void {
    this.cart.remove(id);
  }

  total(items: CartItem[]): number {
    return this.cart.getTotal(items);
  }

  checkout(items: CartItem[]): void {
    this.loading = true;
    const amount = this.total(items);
    const method = this.form.value.method as 'card' | 'paypal' | 'crypto';
    this.pay.createCheckout({ amount, method }).subscribe({
      next: (res) => { window.location.href = res.url; },
      error: () => { this.loading = false; }
    });
  }
}