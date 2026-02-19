import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

interface ResumeType {
  id: string;
  name: string;
  description: string;
  previewImages: string[];
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
export class ResumeSelectComponent implements OnInit {
  resumeTypes: ResumeType[] = [
    {
      id: 'standard',
      name: '스탠다드 이력서',
      description: '고민되면 이 이력서! 지원동기, 특기가 포함된 이력서 양식으로 학력, 경력, 자격사항이 세부적으로 분류되어 있습니다.',
      previewImages: [
        'https://www.yagish.com/kr/resume/static/img/formats/sample/rirekisho_kr1_01.png',
        'https://www.yagish.com/kr/resume/static/img/formats/sample/rirekisho_kr1_02.png'
      ]
    },
    {
      id: 'original',
      name: '오리지널 이력서',
      description: 'Yagish 한정! 차별화된 디자인의 이력서입니다. A4/2장 이상으로 작성 가능합니다.',
      previewImages: [
        'https://www.yagish.com/kr/resume/static/img/formats/sample/rirekisho_kr1_02.png'
      ]
    },
    {
      id: 'career',
      name: '경력기술서',
      description: '경력직 지원자를 위한 목적별 작성이 가능한 경력기술서입니다.',
      previewImages: [
        'https://www.yagish.com/kr/resume/static/img/formats/sample/rirekisho_kr1_01.png'
      ]
    },
    {
      id: 'free-form',
      name: '자유양식 (Resume)',
      description: '미국/글로벌 스타일의 자유양식 이력서입니다. 텍스트 중심의 깔끔한 레이아웃으로 해외 취업에 적합합니다.',
      previewImages: [
        'https://www.yagish.com/kr/resume/static/img/formats/sample/rirekisho_kr1_01.png'
      ]
    }
  ];

  selectedResumeType: ResumeType = this.resumeTypes[0];

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const type = params['type'];
      if (type) {
        const found = this.resumeTypes.find(r => r.id === type);
        if (found) {
          this.selectedResumeType = found;
        }
      }
    });
  }

  onResumeTypeChange(resumeId: string): void {
    const selected = this.resumeTypes.find(r => r.id === resumeId);
    if (selected) {
      this.selectedResumeType = selected;
    }
  }

  goToResumeForm(): void {
    this.router.navigate(['/resume-form'], {
      queryParams: { type: this.selectedResumeType.id }
    });
  }

  openPreviewDialog(): void {
    this.dialog.open(ResumePreviewDialogComponent, {
      data: this.selectedResumeType,
      panelClass: 'lightbox-dialog',
      maxWidth: '100vw',
      maxHeight: '100vh',
      width: '100vw',
      height: '100vh'
    });
  }
}

@Component({
  selector: 'app-resume-preview-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule, MatIconModule, RouterModule],
  template: `
    <div class="lightbox-container" (click)="onBackdropClick($event)">
      <!-- 닫기 버튼 -->
      <button class="close-btn" mat-icon-button (click)="close()">
        <mat-icon>close</mat-icon>
      </button>

      <!-- 이미지 카운터 -->
      <div class="image-counter" *ngIf="data.previewImages.length > 1">
        {{ currentIndex + 1 }} / {{ data.previewImages.length }}
      </div>

      <!-- 이전 버튼 -->
      <button
        class="nav-btn prev-btn"
        mat-icon-button
        (click)="prevImage()"
        *ngIf="data.previewImages.length > 1">
        <mat-icon>chevron_left</mat-icon>
      </button>

      <!-- 메인 이미지 -->
      <div class="image-wrapper" (click)="$event.stopPropagation()">
        <img
          [src]="data.previewImages[currentIndex]"
          [alt]="data.name"
          class="lightbox-image">
      </div>

      <!-- 다음 버튼 -->
      <button
        class="nav-btn next-btn"
        mat-icon-button
        (click)="nextImage()"
        *ngIf="data.previewImages.length > 1">
        <mat-icon>chevron_right</mat-icon>
      </button>

      <!-- 하단 정보 및 액션 -->
      <div class="bottom-info" (click)="$event.stopPropagation()">
        <span class="resume-name">{{ data.name }}</span>
        <button mat-raised-button color="primary" mat-dialog-close routerLink="/resume-form">
          작성 시작
        </button>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
      width: 100vw;
    }
    .lightbox-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.9);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .close-btn {
      position: absolute;
      top: 16px;
      right: 16px;
      color: white;
      z-index: 10;
      background: rgba(255, 255, 255, 0.1);
      &:hover {
        background: rgba(255, 255, 255, 0.2);
      }
    }
    .image-counter {
      position: absolute;
      top: 24px;
      left: 50%;
      transform: translateX(-50%);
      color: white;
      font-size: 14px;
      background: rgba(0, 0, 0, 0.5);
      padding: 4px 12px;
      border-radius: 16px;
    }
    .nav-btn {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      color: white;
      z-index: 10;
      background: rgba(255, 255, 255, 0.1);
      width: 56px;
      height: 56px;
      &:hover {
        background: rgba(255, 255, 255, 0.2);
      }
      mat-icon {
        font-size: 32px;
        width: 32px;
        height: 32px;
      }
    }
    .prev-btn {
      left: 16px;
    }
    .next-btn {
      right: 16px;
    }
    .image-wrapper {
      max-width: calc(100% - 160px);
      max-height: calc(100% - 120px);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .lightbox-image {
      max-width: 100%;
      max-height: calc(100vh - 120px);
      object-fit: contain;
      border-radius: 4px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
    }
    .bottom-info {
      position: absolute;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      align-items: center;
      gap: 16px;
      background: rgba(0, 0, 0, 0.6);
      padding: 12px 24px;
      border-radius: 8px;
    }
    .resume-name {
      color: white;
      font-size: 16px;
      font-weight: 500;
    }
  `]
})
export class ResumePreviewDialogComponent {
  currentIndex = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ResumeType,
    private dialogRef: MatDialogRef<ResumePreviewDialogComponent>
  ) {}

  prevImage(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.data.previewImages.length - 1;
    }
  }

  nextImage(): void {
    if (this.currentIndex < this.data.previewImages.length - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0;
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  onBackdropClick(event: MouseEvent): void {
    this.dialogRef.close();
  }
}
