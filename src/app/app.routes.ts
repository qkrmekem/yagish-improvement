import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ResumeSelectComponent } from './pages/resume-select/resume-select.component';
import { ResumeFormComponent } from './pages/resume-form/resume-form.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'resume-select', component: ResumeSelectComponent },
  { path: 'resume-form', component: ResumeFormComponent }
];
