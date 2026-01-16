import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { CustomService } from '../../../core/services/custom/custom.service';
import { CartService } from '../../../core/services/cart/cart.service';

@Component({
  selector: 'app-submit',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule],
  templateUrl: './submit.html',
  styleUrl: './submit.scss',
})
export class Submit {
  private fb = inject(FormBuilder);
  private custom = inject(CustomService);
  private cart = inject(CartService);

  loading = false;
  success = false;
  error = '';
  file: File | null = null;

  form = this.fb.group({
    material: ['', Validators.required],
    color: ['', Validators.required],
    dimensions: ['', Validators.required],
    notes: ['']
  });

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.file = input.files && input.files.length ? input.files[0] : null;
  }

  submit(): void {
    if (this.form.invalid || !this.file) return;
    this.loading = true;
    this.error = '';
    this.custom.submit({ ...(this.form.value as any), file: this.file }).subscribe({
      next: (res) => { this.loading = false; this.success = true; this.cart.addCustom(res, 1); },
      error: () => { this.loading = false; this.error = 'Falha ao enviar'; }
    });
  }
}