import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-placeholder-step',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    TranslateModule
  ],
  template: `
    <div class="placeholder-step">
      <div class="placeholder-content">
        <mat-icon class="placeholder-icon">{{ icon }}</mat-icon>
        <h3>{{ title }}</h3>
        <p class="placeholder-text">이 섹션은 데모용 플레이스홀더입니다.</p>
        <p class="placeholder-subtext">실제 구현 시 해당 기능이 추가됩니다.</p>
      </div>

      <div class="step-actions">
        <button mat-stroked-button (click)="prev.emit()" *ngIf="showPrev">
          <mat-icon>arrow_back</mat-icon> {{ 'COMMON.PREV' | translate }}
        </button>
        <button mat-raised-button color="primary" (click)="next.emit()" *ngIf="showNext">
          {{ 'COMMON.NEXT' | translate }} <mat-icon>arrow_forward</mat-icon>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .placeholder-step {
      padding: 24px;
      min-height: 300px;
      display: flex;
      flex-direction: column;
    }
    .placeholder-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      color: #666;
    }
    .placeholder-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #1976d2;
      opacity: 0.5;
      margin-bottom: 16px;
    }
    h3 {
      margin: 0 0 8px;
      color: #333;
    }
    .placeholder-text {
      margin: 0;
      font-size: 14px;
    }
    .placeholder-subtext {
      margin: 4px 0 0;
      font-size: 12px;
      opacity: 0.7;
    }
    .step-actions {
      margin-top: 24px;
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }
  `]
})
export class PlaceholderStepComponent {
  @Input() title = '준비 중';
  @Input() icon = 'construction';
  @Input() showPrev = true;
  @Input() showNext = true;
  @Output() next = new EventEmitter<void>();
  @Output() prev = new EventEmitter<void>();
}
