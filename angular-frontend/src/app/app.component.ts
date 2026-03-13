import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './shared/components/toast-component/toast-component';
import { AuthStore } from './shared/services/auth-store';
// 1. Importamos la nueva cabecera
import { NavbarComponent } from './shared/components/navbar/navbar'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastComponent, NavbarComponent], // 2. La añadimos a los imports
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor(private readonly authStore: AuthStore) {
    if (this.authStore.token()) {
      this.authStore.loadMe().subscribe({
        error: () => this.authStore.clearSession(),
      });
    }
  }
}