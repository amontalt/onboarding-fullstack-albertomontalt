import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
// Importamos withInterceptors de Angular HTTP
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http'; 
import { routes } from './app.routes';
// Importamos nuestro interceptor personalizado
import { authInterceptor } from './shared/interceptor/auth-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    // Registramos el interceptor globalmente
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])), 
  ]
};