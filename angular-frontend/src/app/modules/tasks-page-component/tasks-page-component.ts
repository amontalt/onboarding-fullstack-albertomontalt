import { Component, ViewChild } from '@angular/core'; 
import { CommonModule } from '@angular/common'; 
import { Router } from '@angular/router'; // 1. Importamos el Router
import { BackToLandingButtonComponent } from '../../shared/components/back-to-landing-button/back-to-landing-button'; 
import { PageTitleComponent } from '../../shared/components/page-title/page-title'; 
import { TaskFormComponent } from './components/task-form-component/task-form-component'; 
import { TaskListComponent } from './components/task-list-component/task-list-component'; 
import { TaskFiltersComponent } from './components/task-filters-component/task-filters-component'; 
import { TaskApiService } from '../../features/tasks/data/task-api'; 
import { TaskPayload, TaskFilters } from '../../shared/interfaces/tasks'; 
import { ToastService } from '../../shared/services/toast-service'; 
import { AuthStore } from '../../shared/services/auth-store'; // 2. Importamos el AuthStore

@Component({ 
  selector: 'app-tasks-page', 
  standalone: true, 
  imports: [ 
    CommonModule, 
    BackToLandingButtonComponent, 
    PageTitleComponent, 
    TaskFormComponent, 
    TaskListComponent, 
    TaskFiltersComponent 
  ], 
  templateUrl: './tasks-page-component.html' 
}) 
export class TasksPageComponent { 
  @ViewChild(TaskListComponent) list?: TaskListComponent;  

  // Inyectamos AuthStore y Router en el constructor 
  constructor( 
    private readonly api: TaskApiService, 
    private readonly toast: ToastService,
    private readonly authStore: AuthStore,
    private readonly router: Router
  ) {} 

  // Función para cerrar sesión requerida en el ejercicio
  logout() {
    this.authStore.clearSession();
    this.router.navigateByUrl('/');
  }

  onTaskSubmitted(payload: TaskPayload) { 
    this.api.createTask(payload).subscribe({ 
      next: () => {  
        this.toast.success('Tarea guardada'); 
        this.list?.loadTasks(); 
      }, 
      error: (err) => { 
        console.error('Error al crear la tarea', err);  
        this.toast.error('No se pudo guardar la tarea'); 
      }, 
    }); 
  } 

  onFiltersApply(filters: TaskFilters) { 
    this.toast.info('Aplicando filtros de búsqueda'); 
     
    this.list?.loadTasks({ 
      q: filters.q, 
      estado: filters.estado 
    }); 
  } 

  onFiltersReset() { 
    this.toast.warning('Filtros eliminados'); 
     
    this.list?.loadTasks(); 
  } 
}