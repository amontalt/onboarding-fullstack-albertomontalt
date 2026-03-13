import { TestBed } from '@angular/core/testing';
import { AuthStore } from './auth-store';
import { AuthService } from './auth-service';

describe('AuthStore', () => {
  let store: AuthStore;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    // 1. Simulamos (mock) el AuthService para que el Store pueda construirse
    mockAuthService = jasmine.createSpyObj('AuthService', ['me']);

    TestBed.configureTestingModule({
      providers: [
        AuthStore,
        { provide: AuthService, useValue: mockAuthService }
      ]
    });

    store = TestBed.inject(AuthStore);
    
    // Limpiamos el localStorage antes de empezar por si hubiera basura de pruebas anteriores
    localStorage.removeItem('token');
  });

  it('debería borrar el token, el usuario y limpiar el localStorage al hacer logout', () => {
    // 2. Preparamos la trampa: forzamos una sesión guardada
    store.setSession('token-falso-123');
    store.setUser({ id: 1, email: 'test@empresa.com', roles: ['ROLE_USER'] });
    
    // Nos aseguramos de que el test empezó con los datos guardados
    expect(store.token()).toBe('token-falso-123');
    expect(localStorage.getItem('token')).toBe('token-falso-123');

    // 3. Ejecutamos tu función a testear
    store.clearSession();

    // 4. Verificamos la magia: todo debe estar borrado (null)
    expect(store.token()).toBeNull();
    expect(store.user()).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
  });
});