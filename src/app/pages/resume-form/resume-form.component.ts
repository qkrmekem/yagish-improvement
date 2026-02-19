import { Component, signal, computed, ViewChild, ViewContainerRef, ComponentRef, Type, effect, AfterViewInit, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { TranslateModule, TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { BasicInfoStepComponent } from './steps/basic-info-step.component';
import { EducationStepComponent } from './steps/education-step.component';
import { CareerStepComponent } from './steps/career-step.component';
import { CertificationsStepComponent } from './steps/certifications-step.component';
import { SelfIntroStepComponent } from './steps/self-intro-step.component';
import { PlaceholderStepComponent } from './steps/placeholder-step.component';
import { PdfService } from '../../services/pdf.service';

// 이력서 양식 타입
type ResumeType = 'standard' | 'original' | 'career' | 'free-form';

const RESUME_TYPE_NAMES: Record<ResumeType, string> = {
  standard: '스탠다드 이력서',
  original: '오리지널 이력서',
  career: '경력기술서',
  'free-form': '자유양식 (Resume)'
};

@Component({
  selector: 'app-resume-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTabsModule,
    MatCardModule,
    MatDatepickerModule,
    MatSelectModule,
    MatIconModule,
    MatDialogModule,
    MatChipsModule,
    MatDividerModule,
    TranslateModule
  ],
  templateUrl: './resume-form.component.html',
  styleUrl: './resume-form.component.scss'
})
export class ResumeFormComponent implements AfterViewInit, OnInit {
  @ViewChild('stepContainer', { read: ViewContainerRef }) stepContainer!: ViewContainerRef;

  private currentComponentRef: ComponentRef<any> | null = null;

  isVerticalStepper = signal(true);
  currentLanguage = signal<'ko' | 'ja' | 'en'>('ko');
  currentStep = signal(0);

  // 이력서 양식 타입
  resumeType = signal<ResumeType>('standard');
  resumeTypeName = computed(() => RESUME_TYPE_NAMES[this.resumeType()]);

  // 스텝 정의 (labelKey는 번역 키) - 야기시 실제 스텝 구조 반영
  steps: Array<{ labelKey: string; icon: string; component: any; isPlaceholder?: boolean }> = [
    { labelKey: 'BASIC_INFO', icon: 'person', component: BasicInfoStepComponent },
    { labelKey: 'ADDRESS', icon: 'location_on', component: PlaceholderStepComponent, isPlaceholder: true },
    { labelKey: 'CONTACT', icon: 'phone', component: PlaceholderStepComponent, isPlaceholder: true },
    { labelKey: 'PHOTO', icon: 'photo_camera', component: PlaceholderStepComponent, isPlaceholder: true },
    { labelKey: 'EDUCATION', icon: 'school', component: EducationStepComponent },
    { labelKey: 'CAREER', icon: 'work', component: CareerStepComponent },
    { labelKey: 'CERTIFICATIONS', icon: 'verified', component: CertificationsStepComponent },
    { labelKey: 'MOTIVATION', icon: 'lightbulb', component: SelfIntroStepComponent },
    { labelKey: 'PREFERENCES', icon: 'tune', component: PlaceholderStepComponent, isPlaceholder: true },
    { labelKey: 'WRITE_DATE', icon: 'calendar_today', component: PlaceholderStepComponent, isPlaceholder: true },
    { labelKey: 'CONFIRM', icon: 'check_circle', component: PlaceholderStepComponent, isPlaceholder: true },
    { labelKey: 'DOWNLOAD', icon: 'download', component: PlaceholderStepComponent, isPlaceholder: true },
  ];

  // 언어별 날짜 포맷
  dateFormats = computed(() => {
    switch (this.currentLanguage()) {
      case 'ko': return { display: 'YYYY년 MM월 DD일', placeholder: '2024년 01월 01일' };
      case 'ja': return { display: 'YYYY年MM月DD日', placeholder: '2024年01月01日' };
      case 'en': return { display: 'MM/DD/YYYY', placeholder: '01/01/2024' };
      default: return { display: 'YYYY-MM-DD', placeholder: '2024-01-01' };
    }
  });

  // 폼 그룹들
  basicInfoForm: FormGroup;
  educationForm: FormGroup;
  careerForm: FormGroup;
  certificationsForm: FormGroup;
  selfIntroForm: FormGroup;

  languages = [
    { code: 'ko', label: '한국어' },
    { code: 'ja', label: '日本語' },
    { code: 'en', label: 'English' }
  ];

  languageOptions = ['영어', '일본어', '중국어', '한국어', '독일어', '프랑스어', '스페인어'];
  private langSubscription?: Subscription;
  examOptions = ['TOEIC', 'TOEFL', 'IELTS', 'JLPT', 'HSK', 'DELF/DALF', 'TestDaF'];
  gradeOptions = ['Native', 'N1', 'N2', 'N3', 'N4', 'N5', 'HSK 6급', 'HSK 5급', 'C2', 'C1', 'B2', 'B1', 'A2', 'A1'];

  constructor(
    private fb: FormBuilder,
    private breakpointObserver: BreakpointObserver,
    private dialog: MatDialog,
    private dateAdapter: DateAdapter<Date>,
    private translateService: TranslateService,
    private route: ActivatedRoute,
    private pdfService: PdfService
  ) {
    // 반응형: 768px 이하에서는 가로 스텝퍼
    this.breakpointObserver.observe(['(max-width: 768px)']).subscribe(result => {
      this.isVerticalStepper.set(!result.matches);
    });

    this.basicInfoForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: [''],
      birthDate: [null],
      resumeDate: [new Date()]
    });

    this.educationForm = this.fb.group({
      schools: this.fb.array([this.createSchoolGroup()])
    });

    this.careerForm = this.fb.group({
      careers: this.fb.array([this.createCareerGroup()])
    });

    this.certificationsForm = this.fb.group({
      certifications: this.fb.array([this.createCertificationGroup()]),
      languages: this.fb.array([this.createLanguageGroup()])
    });

    this.selfIntroForm = this.fb.group({
      motivation: [''],
      strengths: [''],
      hobbies: ['']
    });

    // 스텝 변경 시 컴포넌트 동적 로딩
    effect(() => {
      const step = this.currentStep();
      if (this.stepContainer) {
        this.loadStepComponent(step);
      }
    });

    // 언어 변경 시 날짜 placeholder 업데이트
    effect(() => {
      const lang = this.currentLanguage();
      if (this.currentComponentRef?.instance?.datePlaceholder !== undefined) {
        this.currentComponentRef.instance.datePlaceholder = this.dateFormats().placeholder;
      }
    });
  }

  ngOnInit(): void {
    // 쿼리 파라미터에서 이력서 타입 읽기 (snapshot 사용)
    const type = this.route.snapshot.queryParamMap.get('type') as ResumeType;
    if (type && ['standard', 'original', 'career', 'free-form'].includes(type)) {
      this.resumeType.set(type);
    }

    // 앱 헤더의 언어 변경 구독
    const currentLang = this.translateService.currentLang as 'ko' | 'ja' | 'en';
    if (currentLang) {
      this.currentLanguage.set(currentLang);
    }
    this.langSubscription = this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.currentLanguage.set(event.lang as 'ko' | 'ja' | 'en');
    });
  }

  ngOnDestroy(): void {
    this.langSubscription?.unsubscribe();
  }

  ngAfterViewInit(): void {
    // 초기 스텝 컴포넌트 로드
    setTimeout(() => this.loadStepComponent(0));
  }

  // 동적 컴포넌트 로딩
  private loadStepComponent(stepIndex: number): void {
    if (!this.stepContainer) return;

    // 기존 컴포넌트 제거
    this.stepContainer.clear();

    const stepConfig = this.steps[stepIndex];
    const componentRef = this.stepContainer.createComponent(stepConfig.component);

    // 컴포넌트별 Input/Output 바인딩
    this.bindComponentIO(componentRef, stepIndex);

    this.currentComponentRef = componentRef;
  }

  // 컴포넌트 Input/Output 바인딩
  private bindComponentIO(componentRef: ComponentRef<any>, stepIndex: number): void {
    const instance = componentRef.instance;
    const stepConfig = this.steps[stepIndex];

    // 플레이스홀더 스텝 처리
    if (stepConfig.isPlaceholder) {
      instance.title = this.translateService.instant('STEPS.' + stepConfig.labelKey);
      instance.icon = stepConfig.icon;
      instance.showPrev = stepIndex > 0;
      instance.showNext = stepIndex < this.steps.length - 1;
      instance.next.subscribe(() => this.nextStep());
      instance.prev.subscribe(() => this.prevStep());
      return;
    }

    switch (stepIndex) {
      case 0: // BasicInfoStep
        instance.form = this.basicInfoForm;
        instance.datePlaceholder = this.dateFormats().placeholder;
        instance.next.subscribe(() => this.nextStep());
        break;

      case 4: // EducationStep
        instance.form = this.educationForm;
        instance.next.subscribe(() => this.nextStep());
        instance.prev.subscribe(() => this.prevStep());
        instance.addSchool.subscribe(() => this.addSchool());
        instance.removeSchool.subscribe((i: number) => this.removeSchool(i));
        break;

      case 5: // CareerStep
        instance.form = this.careerForm;
        instance.next.subscribe(() => this.nextStep());
        instance.prev.subscribe(() => this.prevStep());
        instance.addCareer.subscribe(() => this.addCareer());
        instance.removeCareer.subscribe((i: number) => this.removeCareer(i));
        break;

      case 6: // CertificationsStep
        instance.form = this.certificationsForm;
        instance.next.subscribe(() => this.nextStep());
        instance.prev.subscribe(() => this.prevStep());
        instance.addCertification.subscribe(() => this.addCertification());
        instance.removeCertification.subscribe((i: number) => this.removeCertification(i));
        instance.addLanguage.subscribe(() => this.addLanguageSkill());
        instance.removeLanguage.subscribe((i: number) => this.removeLanguageSkill(i));
        break;

      case 7: // SelfIntroStep
        instance.form = this.selfIntroForm;
        instance.next.subscribe(() => this.nextStep());
        instance.prev.subscribe(() => this.prevStep());
        instance.preview.subscribe(() => this.openPreview());
        instance.save.subscribe(() => this.saveResume());
        break;
    }
  }

  // School 폼 그룹 생성
  createSchoolGroup(): FormGroup {
    return this.fb.group({
      schoolName: [''],
      major: [''],
      startDate: [null],
      endDate: [null],
      status: ['졸업']
    });
  }

  // Career 폼 그룹 생성
  createCareerGroup(): FormGroup {
    return this.fb.group({
      companyName: [''],
      position: [''],
      startDate: [null],
      endDate: [null],
      description: ['']
    });
  }

  // 자격증 폼 그룹 생성
  createCertificationGroup(): FormGroup {
    return this.fb.group({
      certName: [''],
      issuer: [''],
      acquiredDate: [null]
    });
  }

  // 어학 폼 그룹 생성
  createLanguageGroup(): FormGroup {
    return this.fb.group({
      language: [''],
      examName: [''],
      grade: [''],
      score: [''],
      acquiredDate: [null]
    });
  }

  // FormArray getters
  get schools(): FormArray {
    return this.educationForm.get('schools') as FormArray;
  }

  get careers(): FormArray {
    return this.careerForm.get('careers') as FormArray;
  }

  get certifications(): FormArray {
    return this.certificationsForm.get('certifications') as FormArray;
  }

  get languageSkills(): FormArray {
    return this.certificationsForm.get('languages') as FormArray;
  }

  // 항목 추가/제거 메서드
  addSchool(): void {
    this.schools.push(this.createSchoolGroup());
  }

  removeSchool(index: number): void {
    if (this.schools.length > 1) {
      this.schools.removeAt(index);
    }
  }

  addCareer(): void {
    this.careers.push(this.createCareerGroup());
  }

  removeCareer(index: number): void {
    if (this.careers.length > 1) {
      this.careers.removeAt(index);
    }
  }

  addCertification(): void {
    this.certifications.push(this.createCertificationGroup());
  }

  removeCertification(index: number): void {
    if (this.certifications.length > 1) {
      this.certifications.removeAt(index);
    }
  }

  addLanguageSkill(): void {
    this.languageSkills.push(this.createLanguageGroup());
  }

  removeLanguageSkill(index: number): void {
    if (this.languageSkills.length > 1) {
      this.languageSkills.removeAt(index);
    }
  }

  // 언어 변경 (i18n, datepicker locale 모두 변경)
  changeLanguage(lang: 'ko' | 'ja' | 'en'): void {
    this.currentLanguage.set(lang);

    // i18n 언어 변경
    this.translateService.use(lang);

    // DateAdapter locale 변경
    const localeMap = { ko: 'ko-KR', ja: 'ja-JP', en: 'en-US' };
    this.dateAdapter.setLocale(localeMap[lang]);
  }

  // 스텝 네비게이션
  goToStep(index: number): void {
    this.currentStep.set(index);
  }

  nextStep(): void {
    if (this.currentStep() < this.steps.length - 1) {
      this.currentStep.update(v => v + 1);
    }
  }

  prevStep(): void {
    if (this.currentStep() > 0) {
      this.currentStep.update(v => v - 1);
    }
  }

  // 날짜 포맷팅
  formatDate(date: Date | null): string {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    switch (this.currentLanguage()) {
      case 'ko': return `${year}년 ${month}월 ${day}일`;
      case 'ja': return `${year}年${month}月${day}日`;
      case 'en': return `${month}/${day}/${year}`;
      default: return `${year}-${month}-${day}`;
    }
  }

  // 미리보기 다이얼로그 열기
  openPreview(): void {
    const formData = {
      basicInfo: this.basicInfoForm.value,
      education: this.educationForm.value,
      career: this.careerForm.value,
      certifications: this.certificationsForm.value,
      selfIntro: this.selfIntroForm.value,
      dateFormat: this.dateFormats(),
      resumeType: this.resumeType()
    };

    this.dialog.open(PreviewDialogComponent, {
      data: formData,
      panelClass: 'preview-lightbox-dialog',
      maxWidth: '100vw',
      maxHeight: '100vh',
      width: '100vw',
      height: '100vh'
    });
  }

  @ViewChild('resumePreviewWrapper') resumePreviewWrapper!: ElementRef<HTMLElement>;

  // PDF 다운로드 (jsPDF + html2canvas)
  async downloadPdf(): Promise<void> {
    if (this.resumePreviewWrapper?.nativeElement) {
      const filename = `${this.basicInfoForm.get('name')?.value || 'resume'}_이력서.pdf`;
      await this.pdfService.generatePdf(this.resumePreviewWrapper.nativeElement, filename);
    }
  }

  // 저장
  saveResume(): void {
    console.log('Resume saved:', {
      basicInfo: this.basicInfoForm.value,
      education: this.educationForm.value,
      career: this.careerForm.value,
      certifications: this.certificationsForm.value,
      selfIntro: this.selfIntroForm.value
    });
    alert('이력서가 저장되었습니다!');
  }
}

// 미리보기 다이얼로그 컴포넌트
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-preview-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule, MatDividerModule, MatIconModule],
  template: `
    <div class="lightbox-container">
      <!-- 상단 툴바 -->
      <div class="lightbox-toolbar">
        <span class="title">{{ data.resumeType === 'free-form' ? 'Resume Preview' : '이력서 미리보기' }}</span>
        <div class="toolbar-actions">
          <button mat-icon-button (click)="zoomOut()" matTooltip="축소">
            <mat-icon>zoom_out</mat-icon>
          </button>
          <span class="zoom-level">{{ zoomLevel }}%</span>
          <button mat-icon-button (click)="zoomIn()" matTooltip="확대">
            <mat-icon>zoom_in</mat-icon>
          </button>
          <button mat-icon-button (click)="downloadPdf()" matTooltip="PDF 다운로드">
            <mat-icon>download</mat-icon>
          </button>
          <button mat-icon-button (click)="close()" matTooltip="닫기">
            <mat-icon>close</mat-icon>
          </button>
        </div>
      </div>

      <!-- PDF 스타일 콘텐츠 -->
      <div class="lightbox-content">
        <!-- 한국식 이력서 -->
        <div class="resume-paper" *ngIf="data.resumeType !== 'free-form'" [style.transform]="'scale(' + zoomLevel / 100 + ')'">
          <div class="paper-header">
            <h1>이력서</h1>
            <p class="date">작성일: {{ formatDate(data.basicInfo.resumeDate) }}</p>
          </div>

          <section class="paper-section">
            <h2>기본 정보</h2>
            <div class="info-grid">
              <div class="info-row">
                <span class="label">이름</span>
                <span class="value">{{ data.basicInfo.name || '미입력' }}</span>
              </div>
              <div class="info-row">
                <span class="label">이메일</span>
                <span class="value">{{ data.basicInfo.email || '미입력' }}</span>
              </div>
              <div class="info-row">
                <span class="label">연락처</span>
                <span class="value">{{ data.basicInfo.phone || '미입력' }}</span>
              </div>
              <div class="info-row">
                <span class="label">주소</span>
                <span class="value">{{ data.basicInfo.address || '미입력' }}</span>
              </div>
            </div>
          </section>

          <section class="paper-section">
            <h2>학력</h2>
            <div class="item-list">
              <div class="item" *ngFor="let school of data.education.schools">
                <strong>{{ school.schoolName || '학교명 미입력' }}</strong>
                <span>{{ school.major }} ({{ school.status }})</span>
              </div>
            </div>
          </section>

          <section class="paper-section">
            <h2>경력</h2>
            <div class="item-list">
              <div class="item" *ngFor="let career of data.career.careers">
                <strong>{{ career.companyName || '회사명 미입력' }}</strong>
                <span>{{ career.position }}</span>
                <p class="description">{{ career.description }}</p>
              </div>
            </div>
          </section>

          <section class="paper-section">
            <h2>자격증</h2>
            <div class="item-list">
              <div class="item" *ngFor="let cert of data.certifications.certifications">
                <strong>{{ cert.certName || '자격증명 미입력' }}</strong>
                <span>{{ cert.issuer }}</span>
              </div>
            </div>
          </section>

          <section class="paper-section">
            <h2>어학</h2>
            <div class="item-list">
              <div class="item" *ngFor="let lang of data.certifications.languages">
                <strong>{{ lang.language }} - {{ lang.examName }}</strong>
                <span>등급: {{ lang.grade }} | 점수: {{ lang.score }}</span>
              </div>
            </div>
          </section>

          <section class="paper-section">
            <h2>자기소개</h2>
            <div class="text-block">
              <h4>지원동기</h4>
              <p>{{ data.selfIntro.motivation || '미입력' }}</p>
            </div>
            <div class="text-block">
              <h4>장점</h4>
              <p>{{ data.selfIntro.strengths || '미입력' }}</p>
            </div>
          </section>
        </div>

        <!-- 자유양식 (US Resume) -->
        <div class="resume-paper free-form" *ngIf="data.resumeType === 'free-form'" [style.transform]="'scale(' + zoomLevel / 100 + ')'">
          <div class="free-form-header">
            <h1 class="free-form-name">{{ data.basicInfo.name || 'Your Name' }}</h1>
            <p class="free-form-title">{{ getFirstPosition() }}</p>
            <p class="free-form-contact">
              {{ data.basicInfo.email || 'email@example.com' }} 
              <span class="separator">|</span> 
              {{ data.basicInfo.phone || '+82-10-0000-0000' }}
              <ng-container *ngIf="data.basicInfo.address">
                <span class="separator">|</span> 
                {{ data.basicInfo.address }}
              </ng-container>
            </p>
          </div>

          <hr class="free-form-divider">

          <section class="free-form-section" *ngIf="data.selfIntro.motivation">
            <h2 class="free-form-section-title">SUMMARY</h2>
            <p class="free-form-content">{{ data.selfIntro.motivation }}</p>
          </section>

          <section class="free-form-section" *ngIf="data.selfIntro.strengths">
            <h2 class="free-form-section-title">STRENGTHS</h2>
            <p class="free-form-content">{{ data.selfIntro.strengths }}</p>
          </section>

          <section class="free-form-section" *ngIf="hasCareerData()">
            <h2 class="free-form-section-title">EXPERIENCE</h2>
            <div class="free-form-item" *ngFor="let career of data.career.careers">
              <div class="free-form-item-header" *ngIf="career.companyName">
                <strong>{{ career.companyName }}</strong>
                <span class="free-form-date">{{ formatDate(career.startDate) }} - {{ career.isCurrent ? 'Present' : formatDate(career.endDate) }}</span>
              </div>
              <p class="free-form-item-title" *ngIf="career.position">{{ career.position }}</p>
              <p class="free-form-item-description" *ngIf="career.description">{{ career.description }}</p>
            </div>
          </section>

          <section class="free-form-section" *ngIf="hasEducationData()">
            <h2 class="free-form-section-title">EDUCATION</h2>
            <div class="free-form-item" *ngFor="let school of data.education.schools">
              <div class="free-form-item-header" *ngIf="school.schoolName">
                <strong>{{ school.schoolName }}</strong>
                <span class="free-form-date">{{ school.status }}</span>
              </div>
              <p class="free-form-item-title" *ngIf="school.major">{{ school.major }}</p>
            </div>
          </section>

          <section class="free-form-section" *ngIf="hasSkillsData()">
            <h2 class="free-form-section-title">SKILLS & CERTIFICATIONS</h2>
            <ul class="free-form-skills-list">
              <ng-container *ngFor="let cert of data.certifications.certifications">
                <li *ngIf="cert.certName">{{ cert.certName }} <span class="free-form-issuer" *ngIf="cert.issuer">- {{ cert.issuer }}</span></li>
              </ng-container>
              <ng-container *ngFor="let lang of data.certifications.languages">
                <li *ngIf="lang.language">{{ lang.language }}: {{ lang.examName }} {{ lang.score ? '(' + lang.score + ')' : '' }}</li>
              </ng-container>
            </ul>
          </section>

          <section class="free-form-section" *ngIf="data.selfIntro.hobbies">
            <h2 class="free-form-section-title">HOBBIES & INTERESTS</h2>
            <p class="free-form-content">{{ data.selfIntro.hobbies }}</p>
          </section>
        </div>
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
      background: #525659;
      display: flex;
      flex-direction: column;
    }
    .lightbox-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 16px;
      background: #323639;
      color: white;
    }
    .title {
      font-size: 16px;
      font-weight: 500;
    }
    .toolbar-actions {
      display: flex;
      align-items: center;
      gap: 4px;
      button {
        color: white;
      }
    }
    .zoom-level {
      min-width: 50px;
      text-align: center;
      font-size: 14px;
    }
    .lightbox-content {
      flex: 1;
      overflow: auto;
      display: flex;
      justify-content: center;
      padding: 24px;
    }
    .resume-paper {
      background: white;
      width: 210mm;
      min-height: 297mm;
      padding: 20mm;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      transform-origin: top center;
    }
    .paper-header {
      text-align: center;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 2px solid #333;
      h1 {
        margin: 0 0 8px;
        font-size: 28px;
      }
      .date {
        color: #666;
        font-size: 14px;
        margin: 0;
      }
    }
    .paper-section {
      margin-bottom: 20px;
      h2 {
        font-size: 18px;
        color: #00C8AA;
        border-bottom: 1px solid #ddd;
        padding-bottom: 6px;
        margin: 0 0 12px;
      }
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }
    .info-row {
      display: flex;
      gap: 12px;
      .label {
        font-weight: 500;
        min-width: 60px;
        color: #666;
      }
      .value {
        flex: 1;
      }
    }
    .item-list .item {
      padding: 8px 0;
      border-bottom: 1px solid #eee;
      strong {
        display: block;
        margin-bottom: 4px;
      }
      span {
        color: #666;
        font-size: 14px;
      }
      .description {
        margin: 8px 0 0;
        font-size: 14px;
        color: #444;
      }
    }
    .text-block {
      margin-bottom: 16px;
      h4 {
        font-size: 14px;
        margin: 0 0 8px;
        color: #333;
      }
      p {
        margin: 0;
        font-size: 14px;
        line-height: 1.6;
        white-space: pre-wrap;
      }
    }
    /* 자유양식 스타일 */
    .resume-paper.free-form {
      font-family: 'Georgia', 'Times New Roman', serif;
    }
    .free-form-header {
      text-align: center;
      margin-bottom: 24px;
    }
    .free-form-name {
      font-size: 28px;
      font-weight: bold;
      color: #1a1a1a;
      margin: 0 0 4px;
      letter-spacing: 1px;
      text-transform: uppercase;
    }
    .free-form-title {
      font-size: 16px;
      color: #444;
      margin: 0 0 8px;
      font-style: italic;
    }
    .free-form-contact {
      font-size: 14px;
      color: #666;
      margin: 0;
      .separator { margin: 0 12px; color: #ccc; }
    }
    .free-form-divider {
      border: none;
      border-top: 2px solid #1a1a1a;
      margin: 16px 0 24px;
    }
    .free-form-section {
      margin-bottom: 24px;
    }
    .free-form-section-title {
      font-size: 14px;
      font-weight: bold;
      color: #1a1a1a;
      text-transform: uppercase;
      letter-spacing: 2px;
      border-bottom: 1px solid #ddd;
      padding-bottom: 6px;
      margin: 0 0 16px;
    }
    .free-form-content {
      font-size: 14px;
      line-height: 1.6;
      color: #333;
      margin: 0;
      text-align: justify;
    }
    .free-form-item {
      margin-bottom: 16px;
    }
    .free-form-item-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      strong { font-size: 15px; color: #1a1a1a; }
      .free-form-date { font-size: 13px; color: #666; font-style: italic; }
    }
    .free-form-item-title {
      font-size: 14px;
      color: #444;
      font-style: italic;
      margin: 2px 0 8px;
    }
    .free-form-item-description {
      font-size: 14px;
      line-height: 1.5;
      color: #333;
      margin: 0;
      padding-left: 16px;
      border-left: 2px solid #eee;
    }
    .free-form-skills-list {
      margin: 0;
      padding-left: 20px;
      li { font-size: 14px; color: #333; line-height: 1.8; }
      .free-form-issuer { color: #666; font-style: italic; }
    }
  `]
})
export class PreviewDialogComponent {
  zoomLevel = 100;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<PreviewDialogComponent>
  ) {}

  getFirstPosition(): string {
    if (this.data.career?.careers?.length > 0 && this.data.career.careers[0].position) {
      return this.data.career.careers[0].position;
    }
    return 'Professional Title';
  }

  hasCareerData(): boolean {
    return this.data.career?.careers?.some((c: any) => c.companyName);
  }

  hasEducationData(): boolean {
    return this.data.education?.schools?.some((s: any) => s.schoolName);
  }

  hasSkillsData(): boolean {
    const hasCerts = this.data.certifications?.certifications?.some((c: any) => c.certName);
    const hasLangs = this.data.certifications?.languages?.some((l: any) => l.language);
    return hasCerts || hasLangs;
  }

  zoomIn(): void {
    if (this.zoomLevel < 200) {
      this.zoomLevel += 25;
    }
  }

  zoomOut(): void {
    if (this.zoomLevel > 50) {
      this.zoomLevel -= 25;
    }
  }

  downloadPdf(): void {
    alert('PDF 다운로드 기능 (구현 예정)');
  }

  close(): void {
    this.dialogRef.close();
  }

  formatDate(date: Date | string): string {
    if (!date) return '';
    const d = new Date(date);
    if (this.data.resumeType === 'free-form') {
      return `${d.getMonth() + 1}/${d.getFullYear()}`;
    }
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
  }
}
