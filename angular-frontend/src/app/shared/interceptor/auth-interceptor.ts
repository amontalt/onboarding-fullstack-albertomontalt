import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthStore } from '../services/auth-store';
import { ToastService } from '../services/toast-service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. Añadimos el token a la petición (tu código original)
  const token = localStorage.getItem('token');
  if (token && !req.headers.has('Authorization')) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }

  // 2. Inyectamos los servicios necesarios para reaccionar a los errores
  const authStore = inject(AuthStore);
  const router = inject(Router);
  const toast = inject(ToastService);

  // 3. Pasamos la petición y escuchamos la respuesta
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Si el servidor nos bloquea (401 Unauthorized)
      if (error.status === 401) {
        authStore.clearSession(); // Limpiamos la sesión caducada/inválida
        toast.warning('Tu sesión ha expirado. Por favor, inicia sesión de nuevo.'); // Avisamos al usuario
        router.navigateByUrl('/login'); // Lo mandamos fuera
      }
      
      // Dejamos que el error siga su curso por si algún componente lo necesita
      return throwError(() => error); 
    })
  );
};