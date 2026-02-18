import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormArray } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';

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
    MatCardModule,
    TranslateModule
  ],
  template: `
    <form [formGroup]="form" class="step-form">
      <h3>{{ 'CAREER.TITLE' | translate }}</h3>

      <ng-container formArrayName="careers">
        <mat-card class="item-card" *ngFor="let career of careers.controls; let i = index">
          <mat-card-header>
            <mat-card-title>{{ 'CAREER.TITLE' | translate }} {{ i + 1 }}</mat-card-title>
            <button mat-icon-button color="warn" (click)="removeCareer.emit(i)" class="remove-btn" *ngIf="careers.length > 1">
              <mat-icon>delete</mat-icon>
            </button>
          </mat-card-header>
          <mat-card-content [formGroupName]="i">
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>{{ 'CAREER.COMPANY_NAME' | translate }}</mat-label>
                <input matInput formControlName="companyName" [placeholder]="'CAREER.COMPANY_PLACEHOLDER' | translate">
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>{{ 'CAREER.POSITION' | translate }}</mat-label>
                <input matInput formControlName="position" [placeholder]="'CAREER.POSITION_PLACEHOLDER' | translate">
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>{{ 'CAREER.START_DATE' | translate }}</mat-label>
                <input matInput [matDatepicker]="startPicker" formControlName="startDate">
                <mat-datepicker-toggle matSuffix [for]="startPicker"></mat-datepicker-toggle>
                <mat-datepicker #startPicker></mat-datepicker>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>{{ 'CAREER.END_DATE' | translate }}</mat-label>
                <input matInput [matDatepicker]="endPicker" formControlName="endDate">
                <mat-datepicker-toggle matSuffix [for]="endPicker"></mat-datepicker-toggle>
                <mat-datepicker #endPicker></mat-datepicker>
              </mat-form-field>
            </div>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>{{ 'CAREER.DESCRIPTION' | translate }}</mat-label>
              <textarea matInput formControlName="description" rows="3" [placeholder]="'CAREER.DESCRIPTION_PLACEHOLDER' | translate"></textarea>
            </mat-form-field>
          </mat-card-content>
        </mat-card>
      </ng-container>

      <button mat-stroked-button color="primary" (click)="addCareer.emit()" class="add-btn">
        <mat-icon>add</mat-icon> {{ 'CAREER.ADD_CAREER' | translate }}
      </button>

      <div class="step-actions">
        <button mat-button (click)="prev.emit()">
          <mat-icon>arrow_back</mat-icon> {{ 'COMMON.PREV' | translate }}
        </button>
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
