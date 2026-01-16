import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { SupportService } from '../../../core/services/support/support.service';
import { Faq } from '../../../core/models/faq';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-support',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './support.html',
  styleUrl: './support.scss',
})
export class Support {
  private fb = inject(FormBuilder);
  private support = inject(SupportService);

  faqs$: Observable<Faq[]> = this.support.getFaqs();
  sent = false;

  form = this.fb.group({
    subject: ['', Validators.required],
    message: ['', Validators.required]
  });

  submit(): void {
    if (this.form.invalid) return;
    this.support.submitTicket(this.form.value.subject!, this.form.value.message!).subscribe({
      next: () => { this.sent = true; this.form.reset(); }
    });
  }
}