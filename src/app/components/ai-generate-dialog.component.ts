import { Component, Inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { GeminiService, AiGenerateRequest } from '../services/gemini.service';

export interface AiDialogData {
  type: 'motivation' | 'strengths' | 'selfIntro';
  currentText?: string;
}

@Component({
  selector: 'app-ai-generate-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    TranslateModule
  ],
  template: `
    <h2 mat-dialog-title>
      <mat-icon class="ai-icon">auto_awesome</mat-icon>
      AI로 {{ getTypeLabel() }} 초안 생성
    </h2>

    <mat-dialog-content>
      <p class="description">
        회사와 직무 정보를 입력하면 AI가 맞춤형 초안을 작성해드립니다.
      </p>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>회사명</mat-label>
        <input matInput [(ngModel)]="companyName" placeholder="예: 주식회사 야기슈">
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>지원 직무</mat-label>
        <input matInput [(ngModel)]="position" placeholder="예: 프론트엔드 개발자">
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>추가 정보 (선택)</mat-label>
        <textarea matInput [(ngModel)]="additionalInfo" rows="3"
          placeholder="예: 3년차 개발자, React/Angular 경험, 스타트업 선호"></textarea>
        <mat-hint>본인의 경력, 강점, 특이사항 등을 입력하면 더 맞춤화된 결과를 받을 수 있습니다.</mat-hint>
      </mat-form-field>

      <!-- 생성된 결과 -->
      <div class="result-section" *ngIf="generatedText()">
        <h4>생성된 초안</h4>
        <div class="result-box">
          <textarea [(ngModel)]="editableResult" rows="8" class="result-textarea"></textarea>
        </div>
      </div>

      <!-- 에러 메시지 -->
      <div class="error-message" *ngIf="errorMessage()">
        <mat-icon>error</mat-icon>
        {{ errorMessage() }}
      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">취소</button>

      <button mat-raised-button color="accent"
        *ngIf="!generatedText()"
        (click)="generate()"
        [disabled]="isLoading() || !companyName || !position">
        <mat-spinner *ngIf="isLoading()" diameter="20"></mat-spinner>
        <ng-container *ngIf="!isLoading()">
          <mat-icon>auto_awesome</mat-icon>
          생성하기
        </ng-container>
      </button>

      <button mat-button color="accent"
        *ngIf="generatedText()"
        (click)="regenerate()"
        [disabled]="isLoading()">
        <mat-icon>refresh</mat-icon>
        다시 생성
      </button>

      <button mat-raised-button color="primary"
        *ngIf="generatedText()"
        (click)="onApply()">
        <mat-icon>check</mat-icon>
        적용하기
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .ai-icon {
      color: #FF6B35;
      margin-right: 8px;
      vertical-align: middle;
    }

    .description {
      color: #666;
      margin-bottom: 16px;
    }

    .full-width {
      width: 100%;
      margin-bottom: 8px;
    }

    .result-section {
      margin-top: 16px;
      padding: 16px;
      background: #f5f5f5;
      border-radius: 8px;

      h4 {
        margin: 0 0 12px;
        color: #00C8AA;
      }
    }

    .result-textarea {
      width: 100%;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 12px;
      font-size: 14px;
      line-height: 1.6;
      resize: vertical;
      font-family: inherit;
      box-sizing: border-box;
    }

    .result-box {
      overflow: hidden;
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #f44336;
      margin-top: 16px;
      padding: 12px;
      background: #ffebee;
      border-radius: 4px;
    }

    mat-dialog-content {
      min-width: 400px;
      max-width: 500px;
    }

    mat-dialog-actions button {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    mat-spinner {
      margin-right: 8px;
    }
  `]
})
export class AiGenerateDialogComponent {
  companyName = '';
  position = '';
  additionalInfo = '';
  editableResult = '';

  isLoading = signal(false);
  generatedText = signal('');
  errorMessage = signal('');

  constructor(
    private dialogRef: MatDialogRef<AiGenerateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AiDialogData,
    private geminiService: GeminiService
  ) {}

  getTypeLabel(): string {
    const labels = {
      motivation: '지원동기',
      strengths: '강점/장점',
      selfIntro: '자기소개'
    };
    return labels[this.data.type];
  }

  async generate(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set('');

    try {
      const request: AiGenerateRequest = {
        companyName: this.companyName,
        position: this.position,
        type: this.data.type,
        additionalInfo: this.additionalInfo
      };

      const result = await this.geminiService.generateText(request);
      this.generatedText.set(result);
      this.editableResult = result;
    } catch (error) {
      this.errorMessage.set('AI 생성에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      this.isLoading.set(false);
    }
  }

  regenerate(): void {
    this.generatedText.set('');
    this.generate();
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onApply(): void {
    this.dialogRef.close(this.editableResult);
  }
}
