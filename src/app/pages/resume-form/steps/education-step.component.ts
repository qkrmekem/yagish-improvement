import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormArray } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-education-step',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatSelectModule,
    MatIconModule,
    MatCardModule,
    TranslateModule
  ],
  template: `
    <form [formGroup]="form" class="step-form">
      <h3>{{ 'EDUCATION.TITLE' | translate }}</h3>

      <ng-container formArrayName="schools">
        <mat-card class="item-card" *ngFor="let school of schools.controls; let i = index">
          <mat-card-header>
            <mat-card-title>{{ 'EDUCATION.TITLE' | translate }} {{ i + 1 }}</mat-card-title>
            <button mat-icon-button color="warn" (click)="removeSchool.emit(i)" class="remove-btn" *ngIf="schools.length > 1">
              <mat-icon>delete</mat-icon>
            </button>
          </mat-card-header>
          <mat-card-content [formGroupName]="i">
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>{{ 'EDUCATION.SCHOOL_NAME' | translate }}</mat-label>
                <input matInput formControlName="schoolName" [placeholder]="'EDUCATION.SCHOOL_PLACEHOLDER' | translate">
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>{{ 'EDUCATION.MAJOR' | translate }}</mat-label>
                <input matInput formControlName="major" [placeholder]="'EDUCATION.MAJOR_PLACEHOLDER' | translate">
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>{{ 'EDUCATION.START_DATE' | translate }}</mat-label>
                <input matInput [matDatepicker]="startPicker" formControlName="startDate">
                <mat-datepicker-toggle matSuffix [for]="startPicker"></mat-datepicker-toggle>
                <mat-datepicker #startPicker></mat-datepicker>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>{{ 'EDUCATION.END_DATE' | translate }}</mat-label>
                <input matInput [matDatepicker]="endPicker" formControlName="endDate">
                <mat-datepicker-toggle matSuffix [for]="endPicker"></mat-datepicker-toggle>
                <mat-datepicker #endPicker></mat-datepicker>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>{{ 'EDUCATION.STATUS' | translate }}</mat-label>
                <mat-select formControlName="status">
                  <mat-option value="graduated">{{ 'EDUCATION.STATUS_GRADUATED' | translate }}</mat-option>
                  <mat-option value="enrolled">{{ 'EDUCATION.STATUS_ENROLLED' | translate }}</mat-option>
                  <mat-option value="leave">{{ 'EDUCATION.STATUS_LEAVE' | translate }}</mat-option>
                  <mat-option value="dropout">{{ 'EDUCATION.STATUS_DROPOUT' | translate }}</mat-option>
                  <mat-option value="expected">{{ 'EDUCATION.STATUS_EXPECTED' | translate }}</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
          </mat-card-content>
        </mat-card>
      </ng-container>

      <button mat-stroked-button color="primary" (click)="addSchool.emit()" class="add-btn">
        <mat-icon>add</mat-icon> {{ 'EDUCATION.ADD_EDUCATION' | translate }}
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
    .item-card { margin-bottom: 16px; }
    mat-card-header { display: flex; justify-content: space-between; align-items: center; }
    .remove-btn { margin-left: auto; }
    .add-btn { margin: 16px 0; }
    .step-actions { margin-top: 24px; display: flex; gap: 12px; justify-content: flex-end; }
    h3 { margin: 0 0 24px; color: #1976d2; }
  `]
})
export class EducationStepComponent {
  @Input() form!: FormGroup;
  @Output() next = new EventEmitter<void>();
  @Output() prev = new EventEmitter<void>();
  @Output() addSchool = new EventEmitter<void>();
  @Output() removeSchool = new EventEmitter<number>();

  get schools(): FormArray {
    return this.form.get('schools') as FormArray;
  }
}
