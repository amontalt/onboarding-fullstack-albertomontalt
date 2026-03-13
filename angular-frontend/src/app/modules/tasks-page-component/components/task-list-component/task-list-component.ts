import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { TaskApiService } from '../../../../features/tasks/data/task-api';
import { Task, TaskFilters } from '../../../../shared/interfaces/tasks';
import { ToastService } from '../../../../shared/services/toast-service'; // Importamos ToastService

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-list-component.html',
})
export class TaskListComponent implements OnInit {
  loading$ = new BehaviorSubject<boolean>(false);
  error$ = new BehaviorSubject<string | null>(null);
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasksSubject.asObservable();

  private readonly toast = inject(ToastService); // Inyectamos el servicio de notificaciones

  constructor(private readonly api: TaskApiService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(filters?: TaskFilters): void {
    this.loading$.next(true);
    this.error$.next(null);

    this.api
      .getTasks(filters)
      .pipe(
        finalize(() => this.loading$.next(false)),
        catchError((err) => {
          const msg = err?.error?.message || 'Error al cargar tareas';
          this.error$.next(msg);
          this.tasksSubject.next([]);
          return of([]);
        })
      )
      .subscribe((tasks) => this.tasksSubject.next(tasks));
  }

  updateTaskStatus(task: Task, newStatus: Task['estado']): void {
    this.api.updateTaskStatus(task.id, newStatus).subscribe({
      next: () => {
        this.toast.success(`Tarea movida a ${newStatus}`);
        this.loadTasks();
      },
      error: (err) => {
        console.error('Error al actualizar estado', err);
        this.toast.error('No se pudo actualizar la tarea');
      }
    });
  }

  deleteTask(id: number): void {
    if (!confirm('¿Seguro que quieres eliminar esta tarea de forma permanente?')) return;
    
    this.api.deleteTask(id).subscribe({
      next: () => {
        this.toast.warning('Tarea eliminada');
        this.loadTasks(); 
      },
      error: (err) => {
        console.error('Error al eliminar tarea', err);
        this.toast.error('No se pudo eliminar la tarea');
      }
    });
  }
}