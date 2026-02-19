import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

interface ResumeFormat {
  id: string;
  name: string;
  description: string;
  features: string[];
  recommended?: boolean;
  previewImage: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  selectedType = signal<string | null>(null);

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['type']) {
        this.selectedType.set(params['type']);
      }
    });
  }

  resumeFormats: ResumeFormat[] = [
    {
      id: 'standard',
      name: '스탠다드 이력서',
      description: '회사 입사용 A4 2장 표준 이력서',
      features: ['지원동기 포함', '특기 기재란', '학력/경력 상세 분류'],
      recommended: true,
      previewImage: 'https://www.yagish.com/kr/resume/static/img/formats/sample/rirekisho_kr1_01.png'
    },
    {
      id: 'original',
      name: '오리지널 이력서',
      description: 'Yagish 한정! 차별화된 디자인',
      features: ['A4 2장 이상', '모던 디자인', '자유 양식'],
      previewImage: 'https://www.yagish.com/kr/resume/static/img/formats/sample/rirekisho_kr1_02.png'
    },
    {
      id: 'career',
      name: '경력기술서',
      description: '경력직 지원자를 위한 양식',
      features: ['목적별 작성 가능', '프로젝트 상세 기술', '성과 중심'],
      previewImage: 'https://www.yagish.com/kr/resume/static/img/formats/sample/rirekisho_kr1_01.png'
    }
  ];

  features = [
    {
      icon: 'save',
      title: '로그인 없이 자동저장',
      description: '브라우저에 자동 저장되어 로그인 없이도 이어서 작성할 수 있습니다'
    },
    {
      icon: 'edit_note',
      title: '무료로 이력서 간단입력',
      description: '워드같은 편집소프트가 없어도 필요사항 입력만으로 누구나 간단하게 이력서를 브라우저에서 작성'
    },
    {
      icon: 'picture_as_pdf',
      title: 'PDF로 저장 가능',
      description: '완성된 이력서를 PDF로 출력할 수 있는 광고없는 무료서비스'
    }
  ];

  steps = [
    {
      number: 1,
      title: '양식 선택',
      description: '스탠다드, 오리지널, 경력기술서 등 목적에 맞는 양식을 선택하세요',
      icon: 'description'
    },
    {
      number: 2,
      title: '이력서 만들기',
      description: '항목별로 입력만 하면 자동으로 이력서가 완성됩니다',
      icon: 'edit'
    },
    {
      number: 3,
      title: 'PDF 출력',
      description: '완성된 이력서를 PDF 파일로 다운로드하여 지원하세요',
      icon: 'download'
    }
  ];

  // 더미 통계 (실제로는 API에서 가져옴)
  totalUsers = 1234567;
  todayCompleted = 342;

  // 유용한 정보
  usefulInfo = [
    {
      icon: 'school',
      title: '학력 작성 가이드',
      description: '최종 학력부터 역순으로 작성하는 것이 기본입니다'
    },
    {
      icon: 'work',
      title: '경력 작성 팁',
      description: '구체적인 성과와 수치를 포함하면 더욱 효과적입니다'
    },
    {
      icon: 'photo_camera',
      title: '증명사진 가이드',
      description: '6개월 이내 촬영한 정면 사진을 사용하세요'
    },
    {
      icon: 'tips_and_updates',
      title: '자기소개서 작성법',
      description: '지원 회사에 맞춤화된 내용으로 작성하세요'
    }
  ];

  // FAQ
  faqs = [
    {
      question: '이력서 작성은 무료인가요?',
      answer: '네, 모든 기능이 완전 무료입니다. 광고도 없습니다.'
    },
    {
      question: '작성한 이력서는 어디에 저장되나요?',
      answer: '회원가입 후 로그인하면 클라우드에 자동 저장됩니다. 비회원은 브라우저에만 임시 저장됩니다.'
    },
    {
      question: 'PDF 출력 시 워터마크가 있나요?',
      answer: '아니요, 워터마크 없이 깔끔하게 출력됩니다.'
    },
    {
      question: '모바일에서도 작성 가능한가요?',
      answer: '네, 모바일 브라우저에서도 작성 가능합니다. 다만 PC 사용을 권장합니다.'
    }
  ];

  expandedFaq: number | null = null;

  toggleFaq(index: number): void {
    this.expandedFaq = this.expandedFaq === index ? null : index;
  }
}
