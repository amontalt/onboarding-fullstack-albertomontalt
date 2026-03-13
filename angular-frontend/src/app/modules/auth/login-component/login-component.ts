import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../shared/services/auth-service';
import { AuthStore } from '../../../shared/services/auth-store';
import { ToastService } from '../../../shared/services/toast-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login-component.html',
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private store: AuthStore,
    private toast: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.auth.login(this.form.getRawValue() as any).subscribe({
      next: (res) => {
        // Guardamos el token en nuestro estado reactivo
        this.store.setSession(res.token);
        // Pedimos los datos del usuario que acaba de entrar
        this.auth.me().subscribe({
          next: (user) => {
            this.store.setUser(user);
            this.toast.success('Sesión iniciada');
            // Comprobamos el rol para la redirección
            const isAdmin = user.roles?.includes('ROLE_ADMIN');
            this.router.navigateByUrl(isAdmin ? '/admin' : '/tasks');
          },
          error: () => {
            this.toast.success('Sesión iniciada');
            this.router.navigateByUrl('/tasks');
          },
        });
      },
      error: () => {
        this.toast.error('Credenciales inválidas');
        this.loading = false;
      },
    });
  }
}