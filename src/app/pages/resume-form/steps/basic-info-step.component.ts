import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';

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
    MatIconModule
  ],
  template: `
    <form [formGroup]="form" class="step-form">
      <h3>기본 정보 입력</h3>

      <div class="form-row">
        <mat-form-field appearance="outline">
          <mat-label>이름</mat-label>
          <input matInput formControlName="name" placeholder="홍길동">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>이메일</mat-label>
          <input matInput formControlName="email" type="email" placeholder="example@email.com">
        </mat-form-field>
      </div>

      <div class="form-row">
        <mat-form-field appearance="outline">
          <mat-label>연락처</mat-label>
          <input matInput formControlName="phone" placeholder="010-1234-5678">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>생년월일</mat-label>
          <input matInput [matDatepicker]="birthPicker" formControlName="birthDate">
          <mat-datepicker-toggle matSuffix [for]="birthPicker"></mat-datepicker-toggle>
          <mat-datepicker #birthPicker></mat-datepicker>
          <mat-hint>{{ datePlaceholder }}</mat-hint>
        </mat-form-field>
      </div>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>주소</mat-label>
        <input matInput formControlName="address" placeholder="서울특별시 강남구">
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>이력서 작성일</mat-label>
        <input matInput [matDatepicker]="resumeDatePicker" formControlName="resumeDate">
        <mat-datepicker-toggle matSuffix [for]="resumeDatePicker"></mat-datepicker-toggle>
        <mat-datepicker #resumeDatePicker></mat-datepicker>
      </mat-form-field>

      <div class="step-actions">
        <button mat-raised-button color="primary" (click)="next.emit()">
          다음 <mat-icon>arrow_forward</mat-icon>
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
    h3 { margin: 0 0 24px; color: #1976d2; }
  `]
})
export class BasicInfoStepComponent {
  @Input() form!: FormGroup;
  @Input() datePlaceholder = '';
  @Output() next = new EventEmitter<void>();
}
