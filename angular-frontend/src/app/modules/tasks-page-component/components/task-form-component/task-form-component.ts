import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-task-form-component',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './task-form-component.html',
})
export class TaskFormComponent implements OnInit {

  @Output() submitted = new EventEmitter<any>();
  
  form!: FormGroup;
  isSubmitting = false; // Añadido para el loading state del Bloque 4

  constructor(private readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.maxLength(500)]],
      estado: ['pendiente', [Validators.required]],
      fechaLimite: [null],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true; // Bloqueamos el botón
    
    // Emitimos el evento. Suponemos que el padre (la página) nos avisará cuando termine, 
    // pero para simular el reseteo rápido de UX:
    this.submitted.emit(this.form.getRawValue());
    
    setTimeout(() => {
      this.isSubmitting = false;
      this.form.reset({ estado: 'pendiente' }); // Limpiamos el form tras crear
    }, 500); 
  }
}