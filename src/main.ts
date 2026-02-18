import { bootstrapApplication } from '@angular/platform-browser';
import { registerLocaleData } from '@angular/common';
import localeKo from '@angular/common/locales/ko';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// 한국어 로케일 등록
registerLocaleData(localeKo);

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
