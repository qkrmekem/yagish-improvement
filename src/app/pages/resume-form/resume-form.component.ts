import { Component, signal, computed, ViewChild, ViewContainerRef, ComponentRef, Type, effect, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
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

import { BasicInfoStepComponent } from './steps/basic-info-step.component';
import { EducationStepComponent } from './steps/education-step.component';
import { CareerStepComponent } from './steps/career-step.component';
import { CertificationsStepComponent } from './steps/certifications-step.component';
import { SelfIntroStepComponent } from './steps/self-intro-step.component';

@Component({
  selector: 'app-resume-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
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
    MatDividerModule
  ],
  templateUrl: './resume-form.component.html',
  styleUrl: './resume-form.component.scss'
})
export class ResumeFormComponent implements AfterViewInit {
  @ViewChild('stepContainer', { read: ViewContainerRef }) stepContainer!: ViewContainerRef;

  private currentComponentRef: ComponentRef<any> | null = null;

  isVerticalStepper = signal(true);
  currentLanguage = signal<'ko' | 'ja' | 'en'>('ko');
  currentStep = signal(0);

  // 스텝 정의
  steps: Array<{ label: string; icon: string; component: any }> = [
    { label: '기본 정보', icon: 'person', component: BasicInfoStepComponent },
    { label: '학력', icon: 'school', component: EducationStepComponent },
    { label: '경력', icon: 'work', component: CareerStepComponent },
    { label: '자격/어학', icon: 'verified', component: CertificationsStepComponent },
    { label: '자기소개', icon: 'description', component: SelfIntroStepComponent }
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
  examOptions = ['TOEIC', 'TOEFL', 'IELTS', 'JLPT', 'HSK', 'DELF/DALF', 'TestDaF'];
  gradeOptions = ['Native', 'N1', 'N2', 'N3', 'N4', 'N5', 'HSK 6급', 'HSK 5급', 'C2', 'C1', 'B2', 'B1', 'A2', 'A1'];

  constructor(
    private fb: FormBuilder,
    private breakpointObserver: BreakpointObserver,
    private dialog: MatDialog,
    private dateAdapter: DateAdapter<Date>
  ) {
    // 반응형: 모바일에서는 가로 스텝퍼
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
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

    switch (stepIndex) {
      case 0: // BasicInfoStep
        instance.form = this.basicInfoForm;
        instance.datePlaceholder = this.dateFormats().placeholder;
        instance.next.subscribe(() => this.nextStep());
        break;

      case 1: // EducationStep
        instance.form = this.educationForm;
        instance.next.subscribe(() => this.nextStep());
        instance.prev.subscribe(() => this.prevStep());
        instance.addSchool.subscribe(() => this.addSchool());
        instance.removeSchool.subscribe((i: number) => this.removeSchool(i));
        break;

      case 2: // CareerStep
        instance.form = this.careerForm;
        instance.next.subscribe(() => this.nextStep());
        instance.prev.subscribe(() => this.prevStep());
        instance.addCareer.subscribe(() => this.addCareer());
        instance.removeCareer.subscribe((i: number) => this.removeCareer(i));
        break;

      case 3: // CertificationsStep
        instance.form = this.certificationsForm;
        instance.next.subscribe(() => this.nextStep());
        instance.prev.subscribe(() => this.prevStep());
        instance.addCertification.subscribe(() => this.addCertification());
        instance.removeCertification.subscribe((i: number) => this.removeCertification(i));
        instance.addLanguage.subscribe(() => this.addLanguageSkill());
        instance.removeLanguage.subscribe((i: number) => this.removeLanguageSkill(i));
        break;

      case 4: // SelfIntroStep
        instance.form = this.selfIntroForm;
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
      score: ['']
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

  // 언어 변경 (datepicker locale도 함께 변경)
  changeLanguage(lang: 'ko' | 'ja' | 'en'): void {
    this.currentLanguage.set(lang);

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
      dateFormat: this.dateFormats()
    };

    this.dialog.open(PreviewDialogComponent, {
      data: formData,
      width: '90vw',
      maxWidth: '800px',
      maxHeight: '90vh'
    });
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
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-preview-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule, MatDividerModule],
  template: `
    <h2 mat-dialog-title>이력서 미리보기</h2>
    <mat-dialog-content class="preview-content">
      <div class="resume-preview">
        <section class="preview-section">
          <h3>기본 정보</h3>
          <mat-divider></mat-divider>
          <p><strong>이름:</strong> {{ data.basicInfo.name || '미입력' }}</p>
          <p><strong>이메일:</strong> {{ data.basicInfo.email || '미입력' }}</p>
          <p><strong>연락처:</strong> {{ data.basicInfo.phone || '미입력' }}</p>
          <p><strong>주소:</strong> {{ data.basicInfo.address || '미입력' }}</p>
        </section>

        <section class="preview-section">
          <h3>학력</h3>
          <mat-divider></mat-divider>
          <div class="preview-item" *ngFor="let school of data.education.schools">
            <p><strong>{{ school.schoolName || '학교명 미입력' }}</strong> - {{ school.major }}</p>
            <p class="sub-text">{{ school.status }}</p>
          </div>
        </section>

        <section class="preview-section">
          <h3>경력</h3>
          <mat-divider></mat-divider>
          <div class="preview-item" *ngFor="let career of data.career.careers">
            <p><strong>{{ career.companyName || '회사명 미입력' }}</strong> - {{ career.position }}</p>
            <p class="sub-text">{{ career.description }}</p>
          </div>
        </section>

        <section class="preview-section">
          <h3>자격증</h3>
          <mat-divider></mat-divider>
          <div class="preview-item" *ngFor="let cert of data.certifications.certifications">
            <p><strong>{{ cert.certName || '자격증명 미입력' }}</strong></p>
            <p class="sub-text">발행처: {{ cert.issuer }}</p>
          </div>
        </section>

        <section class="preview-section">
          <h3>어학</h3>
          <mat-divider></mat-divider>
          <div class="preview-item" *ngFor="let lang of data.certifications.languages">
            <p><strong>{{ lang.language }}</strong> - {{ lang.examName }}</p>
            <p class="sub-text">등급: {{ lang.grade }} / 점수: {{ lang.score }}</p>
          </div>
        </section>

        <section class="preview-section">
          <h3>자기소개</h3>
          <mat-divider></mat-divider>
          <p><strong>지원동기:</strong></p>
          <p>{{ data.selfIntro.motivation || '미입력' }}</p>
          <p><strong>장점:</strong></p>
          <p>{{ data.selfIntro.strengths || '미입력' }}</p>
        </section>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>닫기</button>
      <button mat-raised-button color="primary" mat-dialog-close>PDF 다운로드</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .preview-content {
      max-height: 70vh;
      overflow-y: auto;
    }
    .resume-preview {
      padding: 16px;
      background: #fafafa;
      border-radius: 8px;
    }
    .preview-section {
      margin-bottom: 24px;
      h3 {
        color: #1976d2;
        margin-bottom: 8px;
      }
      mat-divider {
        margin-bottom: 12px;
      }
    }
    .preview-item {
      padding: 8px 0;
      border-bottom: 1px solid #eee;
    }
    .sub-text {
      color: #666;
      font-size: 14px;
      margin-top: 4px;
    }
  `]
})
export class PreviewDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
