import { Routes } from '@angular/router';
import { ResumeSelectComponent } from './pages/resume-select/resume-select.component';
import { ResumeFormComponent } from './pages/resume-form/resume-form.component';

export const routes: Routes = [
  { path: '', redirectTo: 'resume-select', pathMatch: 'full' },
  { path: 'resume-select', component: ResumeSelectComponent },
  { path: 'resume-form', component: ResumeFormComponent }
];
