import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

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
    TranslateModule
  ],
  template: `
    <form [formGroup]="form" class="step-form">
      <h3>{{ 'SELF_INTRO.TITLE' | translate }}</h3>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>{{ 'SELF_INTRO.MOTIVATION' | translate }}</mat-label>
        <textarea matInput formControlName="motivation" rows="5" [placeholder]="'SELF_INTRO.MOTIVATION_PLACEHOLDER' | translate"></textarea>
        <mat-hint>{{ 'SELF_INTRO.CHAR_LIMIT' | translate }}</mat-hint>
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>{{ 'SELF_INTRO.STRENGTHS' | translate }}</mat-label>
        <textarea matInput formControlName="strengths" rows="5" [placeholder]="'SELF_INTRO.STRENGTHS_PLACEHOLDER' | translate"></textarea>
        <mat-hint>{{ 'SELF_INTRO.CHAR_LIMIT' | translate }}</mat-hint>
      </mat-form-field>

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
  `]
})
export class SelfIntroStepComponent {
  @Input() form!: FormGroup;
  @Output() next = new EventEmitter<void>();
  @Output() prev = new EventEmitter<void>();
  @Output() preview = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();
}
