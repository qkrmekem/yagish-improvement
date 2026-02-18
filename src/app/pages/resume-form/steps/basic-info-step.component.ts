import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-basic-info-step',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatIconModule,
    TranslateModule
  ],
  template: `
    <form [formGroup]="form" class="step-form">
      <h3>{{ 'BASIC_INFO.TITLE' | translate }}</h3>

      <div class="form-row">
        <mat-form-field appearance="outline">
          <mat-label>{{ 'BASIC_INFO.NAME' | translate }}</mat-label>
          <input matInput formControlName="name" [placeholder]="'BASIC_INFO.NAME_PLACEHOLDER' | translate">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>{{ 'BASIC_INFO.EMAIL' | translate }}</mat-label>
          <input matInput formControlName="email" type="email" [placeholder]="'BASIC_INFO.EMAIL_PLACEHOLDER' | translate">
        </mat-form-field>
      </div>

      <div class="form-row">
        <mat-form-field appearance="outline">
          <mat-label>{{ 'BASIC_INFO.PHONE' | translate }}</mat-label>
          <input matInput formControlName="phone" [placeholder]="'BASIC_INFO.PHONE_PLACEHOLDER' | translate">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>{{ 'BASIC_INFO.BIRTH_DATE' | translate }}</mat-label>
          <input matInput [matDatepicker]="birthPicker" formControlName="birthDate">
          <mat-datepicker-toggle matSuffix [for]="birthPicker"></mat-datepicker-toggle>
          <mat-datepicker #birthPicker></mat-datepicker>
          <mat-hint>{{ datePlaceholder }}</mat-hint>
        </mat-form-field>
      </div>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>{{ 'BASIC_INFO.ADDRESS' | translate }}</mat-label>
        <input matInput formControlName="address" [placeholder]="'BASIC_INFO.ADDRESS_PLACEHOLDER' | translate">
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>{{ 'BASIC_INFO.RESUME_DATE' | translate }}</mat-label>
        <input matInput [matDatepicker]="resumeDatePicker" formControlName="resumeDate">
        <mat-datepicker-toggle matSuffix [for]="resumeDatePicker"></mat-datepicker-toggle>
        <mat-datepicker #resumeDatePicker></mat-datepicker>
      </mat-form-field>

      <div class="step-actions">
        <button mat-raised-button color="primary" (click)="next.emit()">
          {{ 'COMMON.NEXT' | translate }} <mat-icon>arrow_forward</mat-icon>
        </button>
      </div>
    </form>
  `,
  styles: [`
    .step-form { padding: 16px; }
    .form-row { display: flex; gap: 16px; flex-wrap: wrap; }
    .form-row mat-form-field { flex: 1; min-width: 200px; }
    .full-width { width: 100%; }
    .step-actions { margin-top: 24px; display: flex; gap: 12px; justify-content: flex-end; }
    h3 { margin: 0 0 24px; color: #00C8AA; }
  `]
})
export class BasicInfoStepComponent {
  @Input() form!: FormGroup;
  @Input() datePlaceholder = '';
  @Output() next = new EventEmitter<void>();
}
