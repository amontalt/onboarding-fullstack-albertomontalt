import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TaskFilters } from '../../../../shared/interfaces/tasks';

@Component({
  selector: 'app-task-filters',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // Importante: ReactiveFormsModule
  templateUrl: './task-filters-component.html',
})
export class TaskFiltersComponent implements OnInit {
  form!: FormGroup;
  @Output() apply = new EventEmitter<TaskFilters>();
  @Output() reset = new EventEmitter<void>();
  
  constructor(private readonly fb: FormBuilder) {}

  ngOnInit(): void {
    // Definimos el grupo de controles para el formulario reactivo
    this.form = this.fb.group({
      texto: [''],
      estado: [''], 
      mostrarSoloPendientes: [false],
      fechaDesde: [null],
      fechaHasta: [null],
    });
  }
  
  onApply(): void {
    const v = this.form.value;
    const filters: TaskFilters = {
      q: v.texto?.trim() || undefined,
      estado: v.mostrarSoloPendientes ? 'pendiente' : (v.estado || undefined),
    };
    this.apply.emit(filters);
  }

  onReset(): void {
    this.form.reset({ texto: '', estado: '', mostrarSoloPendientes: false, fechaDesde: null, fechaHasta: null });
    this.reset.emit();
  }
}