import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar';
import { AuthStore } from '../../services/auth-store';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing'; // <--- LA PIEZA CLAVE
import { signal } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  
  let mockAuthStore: any;

  beforeEach(async () => {
    // Simulamos un Store con señales (signals)
    mockAuthStore = {
      isLoggedIn: signal(true),
      isAdmin: signal(false),
      user: signal({ id: 1, email: 'user@test.com', roles: ['ROLE_USER'] }),
      clearSession: jasmine.createSpy('clearSession')
    };

    await TestBed.configureTestingModule({
      // Importamos el componente Y el módulo de pruebas de rutas
      imports: [NavbarComponent, RouterTestingModule],
      providers: [
        { provide: AuthStore, useValue: mockAuthStore }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Esto renderiza el HTML del componente
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería borrar la sesión y redirigir a / al hacer clic en Cerrar Sesión', () => {
    // Espiamos el router real que viene con RouterTestingModule
    const router = TestBed.inject(Router);
    const spy = spyOn(router, 'navigateByUrl');

    component.logout();

    expect(mockAuthStore.clearSession).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith('/');
  });

  it('debería mostrar el enlace de Admin SOLO si el usuario es administrador', () => {
    // 1. Con isAdmin en false, no debería haber enlace a /admin
    let adminLink = fixture.debugElement.query(By.css('a[routerLink="/admin"]'));
    expect(adminLink).toBeFalsy(); 

    // 2. Cambiamos a true y refrescamos
    mockAuthStore.isAdmin.set(true);
    fixture.detectChanges();
    
    // 3. Ahora debería aparecer
    adminLink = fixture.debugElement.query(By.css('a[routerLink="/admin"]'));
    expect(adminLink).toBeTruthy();
  });
});