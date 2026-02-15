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
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-certifications-step',
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
    MatDividerModule
  ],
  template: `
    <form [formGroup]="form" class="step-form">
      <div class="improvement-badge">
        <span class="badge">개선 5</span> 자격증과 어학을 별도 폼으로 분리하여 관리가 용이합니다
      </div>

      <!-- 자격증 섹션 -->
      <section class="section">
        <h3><mat-icon>verified</mat-icon> 자격증</h3>

        <ng-container formArrayName="certifications">
          <mat-card class="item-card" *ngFor="let cert of certifications.controls; let i = index">
            <mat-card-header>
              <mat-card-title>자격증 {{ i + 1 }}</mat-card-title>
              <button mat-icon-button color="warn" (click)="removeCertification.emit(i)" *ngIf="certifications.length > 1">
                <mat-icon>delete</mat-icon>
              </button>
            </mat-card-header>
            <mat-card-content [formGroupName]="i">
              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>자격증명</mat-label>
                  <input matInput formControlName="certName" placeholder="정보처리기사">
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>발급기관</mat-label>
                  <input matInput formControlName="issuer" placeholder="한국산업인력공단">
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>취득일</mat-label>
                  <input matInput [matDatepicker]="certDatePicker" formControlName="acquiredDate">
                  <mat-datepicker-toggle matSuffix [for]="certDatePicker"></mat-datepicker-toggle>
                  <mat-datepicker #certDatePicker></mat-datepicker>
                </mat-form-field>
              </div>
            </mat-card-content>
          </mat-card>
        </ng-container>

        <button mat-stroked-button color="primary" (click)="addCertification.emit()" class="add-btn">
          <mat-icon>add</mat-icon> 자격증 추가
        </button>
      </section>

      <mat-divider></mat-divider>

      <!-- 어학 섹션 -->
      <section class="section">
        <h3><mat-icon>language</mat-icon> 어학 능력</h3>

        <ng-container formArrayName="languages">
          <mat-card class="item-card" *ngFor="let lang of languageSkills.controls; let i = index">
            <mat-card-header>
              <mat-card-title>어학 {{ i + 1 }}</mat-card-title>
              <button mat-icon-button color="warn" (click)="removeLanguage.emit(i)" *ngIf="languageSkills.length > 1">
                <mat-icon>delete</mat-icon>
              </button>
            </mat-card-header>
            <mat-card-content [formGroupName]="i">
              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>언어</mat-label>
                  <mat-select formControlName="language">
                    <mat-option *ngFor="let lang of languageOptions" [value]="lang">{{ lang }}</mat-option>
                  </mat-select>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>시험명</mat-label>
                  <mat-select formControlName="examName">
                    <mat-option *ngFor="let exam of examOptions" [value]="exam">{{ exam }}</mat-option>
                  </mat-select>
                </mat-form-field>
              </div>

              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>등급</mat-label>
                  <mat-select formControlName="grade">
                    <mat-option *ngFor="let grade of gradeOptions" [value]="grade">{{ grade }}</mat-option>
                  </mat-select>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>점수</mat-label>
                  <input matInput formControlName="score" placeholder="990">
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>취득일</mat-label>
                  <input matInput [matDatepicker]="langDatePicker" formControlName="acquiredDate">
                  <mat-datepicker-toggle matSuffix [for]="langDatePicker"></mat-datepicker-toggle>
                  <mat-datepicker #langDatePicker></mat-datepicker>
                </mat-form-field>
              </div>
            </mat-card-content>
          </mat-card>
        </ng-container>

        <button mat-stroked-button color="primary" (click)="addLanguage.emit()" class="add-btn">
          <mat-icon>add</mat-icon> 어학 추가
        </button>
      </section>

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
    .section { margin: 24px 0; }
    .form-row { display: flex; gap: 16px; flex-wrap: wrap; }
    .form-row mat-form-field { flex: 1; min-width: 180px; }
    .item-card { margin-bottom: 16px; }
    mat-card-header { display: flex; justify-content: space-between; align-items: center; }
    .add-btn { margin: 16px 0; }
    .step-actions { margin-top: 24px; display: flex; gap: 12px; justify-content: flex-end; }
    h3 {
      margin: 0 0 16px;
      color: #1976d2;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    mat-divider { margin: 32px 0; }
    .improvement-badge {
      background: #e3f2fd;
      padding: 12px 16px;
      border-radius: 8px;
      margin-bottom: 24px;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .badge {
      background: #1976d2;
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: bold;
    }
  `]
})
export class CertificationsStepComponent {
  @Input() form!: FormGroup;
  @Output() next = new EventEmitter<void>();
  @Output() prev = new EventEmitter<void>();
  @Output() addCertification = new EventEmitter<void>();
  @Output() removeCertification = new EventEmitter<number>();
  @Output() addLanguage = new EventEmitter<void>();
  @Output() removeLanguage = new EventEmitter<number>();

  languageOptions = ['영어', '일본어', '중국어', '한국어', '독일어', '프랑스어', '스페인어'];
  examOptions = ['TOEIC', 'TOEFL', 'IELTS', 'JLPT', 'HSK', 'DELF/DALF', 'TestDaF'];
  gradeOptions = ['Native', 'N1', 'N2', 'N3', 'N4', 'N5', 'HSK 6급', 'HSK 5급', 'C2', 'C1', 'B2', 'B1', 'A2', 'A1'];

  get certifications(): FormArray {
    return this.form.get('certifications') as FormArray;
  }

  get languageSkills(): FormArray {
    return this.form.get('languages') as FormArray;
  }
}
