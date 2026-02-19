# Yagish 이력서 서비스 UX 개선안

야기슈(Yagish) 이력서 서비스의 사용자 경험을 개선한 Angular 기반 프로토타입 프로젝트입니다.

## 프로젝트 개요

기존 야기슈 서비스의 UX 문제점을 분석하고, 개선안을 실제 동작하는 프로토타입으로 구현했습니다.

## 기존 서비스 문제점 분석

| 영역 | 문제점 |
|-----|--------|
| 메인 페이지 | 이력서 작성 진입점이 눈에 잘 들어오지 않음 |
| 양식 선택 | 이력서 변경이 불편하고, 양식 파악이 어려움 |
| 스텝퍼 UI | 가로 스크롤링 불편, 데스크탑 화면 활용 어려움 |
| 미리보기 | 버튼이 눈에 띄지 않고, 페이지 전환이 불편함 |
| 입력 폼 | 자격증/어학 필드 구분 모호, 달력이 일본 형식 |

## 개선사항

### 1. 메인 페이지 리뉴얼
- 히어로 섹션으로 서비스 핵심 가치 전달
- 이력서 양식 카드 UI로 직관적인 선택
- 추천 양식 하이라이트

### 2. 양식 선택 UX 개선
- 드롭다운으로 페이지 새로고침 없이 양식 변경
- 큰 미리보기 이미지로 양식 확인 용이
- 라이트박스 스타일 이미지 뷰어

### 3. 반응형 스텝퍼
- **데스크탑**: 세로 스텝퍼로 화면 활용도 향상
- **모바일**: 가로 스텝퍼로 기존 UX 유지
- 현재 단계 및 완료 상태 시각적 표시

### 4. 미리보기 기능 개선
- 입력폼/미리보기 탭 분리로 빠른 전환
- 라이트박스 스타일 전체화면 미리보기
- 줌 인/아웃 및 PDF 다운로드 기능

### 5. 자유양식 이력서 (US Resume 스타일)
- 사진 없는 US 스타일 레이아웃
- 섹션 기반 구성 (Summary, Experience, Education, Skills)

### 6. AI 기능 도입 (프로토타입)
- Gemini API 연동
- 자기소개/지원동기 자동 생성 다이얼로그

### 7. 다국어 지원 (i18n)
- 한국어, 일본어, 영어 지원
- 언어별 날짜 포맷 자동 적용

### 8. 입력 폼 개선
- 자격증과 어학 섹션 분리
- 각 섹션별 필드 최적화

## 기술 스택

| 분류 | 기술 |
|-----|------|
| Frontend | Angular 17, TypeScript |
| UI Library | Angular Material, Angular CDK |
| State | RxJS, Signals |
| i18n | @ngx-translate |
| AI | Google Gemini API |
| PDF | jsPDF, html2canvas |

## 프로젝트 구조

```
src/
├── app/
│   ├── components/
│   │   └── ai-generate-dialog.component.ts    # AI 생성 다이얼로그
│   ├── pages/
│   │   ├── home/                              # 메인 페이지
│   │   ├── resume-select/                     # 이력서 양식 선택
│   │   └── resume-form/                       # 이력서 작성 폼
│   │       └── steps/                         # 스텝별 컴포넌트
│   └── services/
│       ├── gemini.service.ts                  # AI 서비스
│       └── pdf.service.ts                     # PDF 생성 서비스
├── assets/
│   └── i18n/                                  # 다국어 번역 파일
│       ├── ko.json
│       ├── ja.json
│       └── en.json
└── environments/                              # 환경 설정
```

## 시작하기

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm start
# http://localhost:4200 에서 확인
```

### 빌드

```bash
npm run build
```

## 환경 설정

Gemini AI 기능을 사용하려면 `src/environments/environment.ts`에 API 키를 설정하세요:

```typescript
export const environment = {
  production: false,
  geminiApiKey: 'YOUR_GEMINI_API_KEY'
};
```

## 스크린샷

### 메인 페이지
- 히어로 섹션과 이력서 양식 카드

### 양식 선택
- 드롭다운 + 큰 미리보기 이미지

### 이력서 작성
- 세로 스텝퍼 (데스크탑) / 가로 스텝퍼 (모바일)

### 미리보기
- 탭 기반 미리보기 + 라이트박스 전체화면

## 향후 개선 계획

1. **다양한 PDF 템플릿** - 여러 디자인의 이력서 출력 지원
2. **AI 서비스 고도화** - 지원동기, 자기소개 품질 향상
3. **멀티 디바이스 입력** - 모바일에서 시작, PC에서 마무리

## 라이선스

MIT License

## 작성자

박의민 (Fullstack Developer)
