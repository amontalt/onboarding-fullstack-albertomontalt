import { Routes } from '@angular/router';
import { LandingPageComponent } from './modules/landing-page-component/landing-page-component';
import { TasksPageComponent } from './modules/tasks-page-component/tasks-page-component';
import { LoginComponent } from './modules/auth/login-component/login-component';
import { RegisterComponent } from './modules/auth/register-component/register-component';
// 1. Importamos el nuevo componente de administración
import { AdminDashboardComponent } from './modules/admin/dashboard-component/dashboard-component';
// 2. Importamos nuestros guards (porteros)
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  // Añadimos el guard de autenticación a las tareas
  { path: 'tasks', component: TasksPageComponent, canActivate: [authGuard] },
  // Creamos la ruta admin protegida por los dos guards (logueado + rol admin)
  { path: 'admin', component: AdminDashboardComponent, canActivate: [authGuard, adminGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent }
];