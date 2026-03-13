import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthStore } from '../../services/auth-store';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
})
export class NavbarComponent implements OnInit {
  public readonly store = inject(AuthStore);
  private readonly router = inject(Router);

  // Variable para controlar qué icono mostrar
  isDarkMode = false;

  ngOnInit(): void {
    // 1. Al cargar la app, comprobamos qué tema prefiere el usuario
    const savedTheme = localStorage.getItem('theme');
    
    // Si guardó 'dark' o si no guardó nada pero su sistema operativo es oscuro
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      this.isDarkMode = true;
      document.documentElement.classList.add('dark');
    } else {
      this.isDarkMode = false;
      document.documentElement.classList.remove('dark');
    }
  }

  // 2. Función que se ejecuta al pulsar el botón del Sol/Luna
  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark'); // Guardamos en el navegador
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light'); // Guardamos en el navegador
    }
  }

  logout(): void {
    this.store.clearSession();
    this.router.navigateByUrl('/');
  }
}