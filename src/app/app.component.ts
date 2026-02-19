import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    TranslateModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Yagish 이력서 개선 프로토타입';

  languages = [
    { code: 'ko', label: '한국어' },
    { code: 'ja', label: '日本語' },
    { code: 'en', label: 'English' }
  ];

  currentLanguage = signal<'ko' | 'ja' | 'en'>('ko');

  constructor(
    private translateService: TranslateService,
    private dateAdapter: DateAdapter<Date>
  ) {
    this.translateService.setDefaultLang('ko');
    this.translateService.use('ko');
  }

  changeLanguage(lang: 'ko' | 'ja' | 'en'): void {
    this.currentLanguage.set(lang);
    this.translateService.use(lang);
    const localeMap = { ko: 'ko-KR', ja: 'ja-JP', en: 'en-US' };
    this.dateAdapter.setLocale(localeMap[lang]);
  }
}
