import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthStore } from '../shared/services/auth-store';
import { ToastService } from '../shared/services/toast-service';
import { catchError, map, of } from 'rxjs';

export const adminGuard: CanActivateFn = () => {
  const store = inject(AuthStore);
  const router = inject(Router);
  const toast = inject(ToastService);

  // 1. Si no hay token, al login (Toast Azul)
  if (!store.token()) {
    toast.info('Inicia sesión para continuar');
    return router.createUrlTree(['/login']);
  }

  // 2. Si ya tenemos el usuario cargado en el Store
  if (store.user()) {
    if (store.isAdmin()) return true;
    
    // Si es usuario normal, mensaje y a tareas (Toast Rojo)
    toast.error('No tienes permisos de administrador');
    return router.createUrlTree(['/tasks']);
  }

  // 3. Si tenemos token pero no datos del usuario, los cargamos
  return store.loadMe().pipe(
    map(() => {
      if (store.isAdmin()) {
        return true;
      } else {
        // Si tras cargar vemos que no es admin (Toast Rojo)
        toast.error('No tienes permisos de administrador');
        return router.createUrlTree(['/tasks']);
      }
    }),
    catchError(() => {
      toast.error('No se pudo verificar permisos');
      return of(router.createUrlTree(['/tasks']));
    })
  );
};