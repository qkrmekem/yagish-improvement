import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';

interface ResumeType {
  id: string;
  name: string;
  description: string;
  previewImage: string;
}

@Component({
  selector: 'app-resume-select',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    RouterModule
  ],
  templateUrl: './resume-select.component.html',
  styleUrl: './resume-select.component.scss'
})
export class ResumeSelectComponent {
  resumeTypes: ResumeType[] = [
    {
      id: 'standard',
      name: '스탠다드 이력서',
      description: '고민되면 이 이력서! 지원동기, 특기가 포함된 이력서 양식으로 학력, 경력, 자격사항이 세부적으로 분류되어 있습니다.',
      previewImage: 'https://www.yagish.com/kr/resume/static/img/formats/sample/rirekisho_kr1_01.png'
    },
    {
      id: 'original',
      name: '오리지널 이력서',
      description: 'Yagish 한정! 차별화된 디자인의 이력서입니다. A4/2장 이상으로 작성 가능합니다.',
      previewImage: 'https://www.yagish.com/kr/resume/static/img/formats/sample/rirekisho_kr1_02.png'
    },
    {
      id: 'career',
      name: '경력기술서',
      description: '경력직 지원자를 위한 목적별 작성이 가능한 경력기술서입니다.',
      previewImage: 'https://www.yagish.com/kr/resume/static/img/formats/sample/rirekisho_kr1_01.png'
    }
  ];

  selectedResumeType: ResumeType = this.resumeTypes[0];

  constructor(private dialog: MatDialog) {}

  onResumeTypeChange(resumeId: string): void {
    const selected = this.resumeTypes.find(r => r.id === resumeId);
    if (selected) {
      this.selectedResumeType = selected;
    }
  }

  openPreviewDialog(): void {
    this.dialog.open(ResumePreviewDialogComponent, {
      data: this.selectedResumeType,
      width: '80vw',
      maxWidth: '800px'
    });
  }
}

@Component({
  selector: 'app-resume-preview-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule, RouterModule],
  template: `
    <h2 mat-dialog-title>{{ data.name }} 미리보기</h2>
    <mat-dialog-content>
      <img [src]="data.previewImage" [alt]="data.name" class="preview-image">
      <p>{{ data.description }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>닫기</button>
      <button mat-raised-button color="primary" mat-dialog-close routerLink="/resume-form">작성 시작</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .preview-image {
      width: 100%;
      max-height: 60vh;
      object-fit: contain;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    mat-dialog-content {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
  `]
})
export class ResumePreviewDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: ResumeType) {}
}
