import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { AiGenerateDialogComponent, AiDialogData } from '../../../components/ai-generate-dialog.component';

@Component({
  selector: 'app-self-intro-step',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    TranslateModule
  ],
  template: `
    <form [formGroup]="form" class="step-form">
      <h3>{{ 'SELF_INTRO.TITLE' | translate }}</h3>

      <!-- 개선점: AI 지원동기 생성 -->
      <div class="ai-feature-badge">
        <span class="badge">NEW</span> AI 자동 생성 기능
      </div>

      <div class="form-section">
        <div class="field-header">
          <mat-label>{{ 'SELF_INTRO.MOTIVATION' | translate }}</mat-label>
          <button mat-stroked-button color="accent" class="ai-btn" (click)="openAiDialog('motivation')">
            <mat-icon>auto_awesome</mat-icon>
            AI로 생성
          </button>
        </div>
        <mat-form-field appearance="outline" class="full-width">
          <textarea matInput formControlName="motivation" rows="5" [placeholder]="'SELF_INTRO.MOTIVATION_PLACEHOLDER' | translate"></textarea>
          <mat-hint>{{ 'SELF_INTRO.CHAR_LIMIT' | translate }}</mat-hint>
        </mat-form-field>
      </div>

      <div class="form-section">
        <div class="field-header">
          <mat-label>{{ 'SELF_INTRO.STRENGTHS' | translate }}</mat-label>
          <button mat-stroked-button color="accent" class="ai-btn" (click)="openAiDialog('strengths')">
            <mat-icon>auto_awesome</mat-icon>
            AI로 생성
          </button>
        </div>
        <mat-form-field appearance="outline" class="full-width">
          <textarea matInput formControlName="strengths" rows="5" [placeholder]="'SELF_INTRO.STRENGTHS_PLACEHOLDER' | translate"></textarea>
          <mat-hint>{{ 'SELF_INTRO.CHAR_LIMIT' | translate }}</mat-hint>
        </mat-form-field>
      </div>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>{{ 'SELF_INTRO.HOBBIES' | translate }}</mat-label>
        <textarea matInput formControlName="hobbies" rows="3" [placeholder]="'SELF_INTRO.HOBBIES_PLACEHOLDER' | translate"></textarea>
      </mat-form-field>

      <div class="step-actions final-actions">
        <button mat-button (click)="prev.emit()">
          <mat-icon>arrow_back</mat-icon> {{ 'COMMON.PREV' | translate }}
        </button>
        <button mat-raised-button color="accent" (click)="preview.emit()">
          <mat-icon>preview</mat-icon> {{ 'COMMON.PREVIEW' | translate }}
        </button>
        <button mat-raised-button color="primary" (click)="next.emit()">
          {{ 'COMMON.NEXT' | translate }} <mat-icon>arrow_forward</mat-icon>
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
    h3 { margin: 0 0 24px; color: #00C8AA; }

    .ai-feature-badge {
      background: linear-gradient(135deg, #FF6B35 0%, #FF8C5A 100%);
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      margin-bottom: 24px;
      display: flex;
      align-items: center;
      gap: 8px;

      .badge {
        background: white;
        color: #FF6B35;
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: bold;
      }
    }

    .form-section {
      margin-bottom: 8px;
    }

    .field-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;

      mat-label {
        font-weight: 500;
        color: #333;
      }
    }

    .ai-btn {
      mat-icon {
        font-size: 18px;
        height: 18px;
        width: 18px;
        margin-right: 4px;
      }
    }
  `]
})
export class SelfIntroStepComponent {
  @Input() form!: FormGroup;
  @Output() next = new EventEmitter<void>();
  @Output() prev = new EventEmitter<void>();
  @Output() preview = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();

  constructor(private dialog: MatDialog) {}

  openAiDialog(type: 'motivation' | 'strengths' | 'selfIntro'): void {
    const dialogRef = this.dialog.open(AiGenerateDialogComponent, {
      width: '550px',
      data: {
        type,
        currentText: this.form.get(type)?.value
      } as AiDialogData
    });

    dialogRef.afterClosed().subscribe((result: string | undefined) => {
      if (result) {
        this.form.get(type)?.setValue(result);
      }
    });
  }
}
