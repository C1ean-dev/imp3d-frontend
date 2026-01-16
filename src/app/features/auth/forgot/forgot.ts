import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-forgot',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule,

 MatButtonModule],
  templateUrl: './forgot.html',
  styleUrl: './forgot.scss',
})
export class Forgot {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);

  loading = false;
  sent = false;
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  submit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.auth.forgot(this.form.value.email!).subscribe({
      next: () => { this.loading = false; this.sent = true; },
      error: () => { this.loading = false; }
    });
  }
}