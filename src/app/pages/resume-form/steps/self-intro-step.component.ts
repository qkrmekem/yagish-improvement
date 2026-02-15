import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-self-intro-step',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <form [formGroup]="form" class="step-form">
      <h3>자기소개서</h3>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>지원 동기</mat-label>
        <textarea matInput formControlName="motivation" rows="5" placeholder="지원 동기를 작성해주세요"></textarea>
        <mat-hint>500자 이내</mat-hint>
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>성격의 장단점</mat-label>
        <textarea matInput formControlName="strengths" rows="5" placeholder="본인의 장점과 단점을 작성해주세요"></textarea>
        <mat-hint>500자 이내</mat-hint>
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>취미 / 특기</mat-label>
        <textarea matInput formControlName="hobbies" rows="3" placeholder="취미나 특기를 작성해주세요"></textarea>
      </mat-form-field>

      <div class="step-actions final-actions">
        <button mat-button (click)="prev.emit()">
          <mat-icon>arrow_back</mat-icon> 이전
        </button>
        <button mat-raised-button color="accent" (click)="preview.emit()">
          <mat-icon>preview</mat-icon> 미리보기
        </button>
        <button mat-raised-button color="primary" (click)="next.emit()">
          다음 <mat-icon>arrow_forward</mat-icon>
        </button>
      </div>
    </form>
  `,
  styles: [`
    .step-form { padding: 16px; }
    .full-width { width: 100%; margin-bottom: 16px; }
    .step-actions { margin-top: 24px; display: flex; gap: 12px; justify-content: flex-end; }
    .final-actions {
      background: #f5f5f5;
      padding: 16px;
      border-radius: 8px;
      margin-top: 32px;
    }
    h3 { margin: 0 0 24px; color: #1976d2; }
  `]
})
export class SelfIntroStepComponent {
  @Input() form!: FormGroup;
  @Output() next = new EventEmitter<void>();
  @Output() prev = new EventEmitter<void>();
  @Output() preview = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();
}
