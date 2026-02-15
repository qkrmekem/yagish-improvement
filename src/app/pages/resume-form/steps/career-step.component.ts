import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormArray } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-career-step',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatIconModule,
    MatCardModule
  ],
  template: `
    <form [formGroup]="form" class="step-form">
      <h3>경력 사항</h3>

      <ng-container formArrayName="careers">
        <mat-card class="item-card" *ngFor="let career of careers.controls; let i = index">
          <mat-card-header>
            <mat-card-title>경력 {{ i + 1 }}</mat-card-title>
            <button mat-icon-button color="warn" (click)="removeCareer.emit(i)" class="remove-btn" *ngIf="careers.length > 1">
              <mat-icon>delete</mat-icon>
            </button>
          </mat-card-header>
          <mat-card-content [formGroupName]="i">
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>회사명</mat-label>
                <input matInput formControlName="companyName" placeholder="OO회사">
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>직책/직위</mat-label>
                <input matInput formControlName="position" placeholder="개발자">
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>입사일</mat-label>
                <input matInput [matDatepicker]="startPicker" formControlName="startDate">
                <mat-datepicker-toggle matSuffix [for]="startPicker"></mat-datepicker-toggle>
                <mat-datepicker #startPicker></mat-datepicker>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>퇴사일</mat-label>
                <input matInput [matDatepicker]="endPicker" formControlName="endDate">
                <mat-datepicker-toggle matSuffix [for]="endPicker"></mat-datepicker-toggle>
                <mat-datepicker #endPicker></mat-datepicker>
              </mat-form-field>
            </div>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>담당 업무</mat-label>
              <textarea matInput formControlName="description" rows="3" placeholder="담당했던 업무를 입력하세요"></textarea>
            </mat-form-field>
          </mat-card-content>
        </mat-card>
      </ng-container>

      <button mat-stroked-button color="primary" (click)="addCareer.emit()" class="add-btn">
        <mat-icon>add</mat-icon> 경력 추가
      </button>

      <div class="step-actions">
        <button mat-button (click)="prev.emit()">
          <mat-icon>arrow_back</mat-icon> 이전
        </button>
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
    .item-card { margin-bottom: 16px; }
    mat-card-header { display: flex; justify-content: space-between; align-items: center; }
    .remove-btn { margin-left: auto; }
    .add-btn { margin: 16px 0; }
    .step-actions { margin-top: 24px; display: flex; gap: 12px; justify-content: flex-end; }
    h3 { margin: 0 0 24px; color: #1976d2; }
  `]
})
export class CareerStepComponent {
  @Input() form!: FormGroup;
  @Output() next = new EventEmitter<void>();
  @Output() prev = new EventEmitter<void>();
  @Output() addCareer = new EventEmitter<void>();
  @Output() removeCareer = new EventEmitter<number>();

  get careers(): FormArray {
    return this.form.get('careers') as FormArray;
  }
}
