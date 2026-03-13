import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
  FormsModule,
} from "@angular/forms";
import { AuthStore } from "../../../shared/services/auth-store";
import {
  AdminUsersApiService,
  AdminUser,
} from "../../../shared/services/admin-users.service";
import { ToastService } from "../../../shared/services/toast-service";

@Component({
  selector: "app-admin-dashboard",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: "./dashboard-component.html",
})
export class AdminDashboardComponent implements OnInit {
  users: AdminUser[] = [];
  form!: FormGroup;
  q = "";

  // Nuevas variables para gestionar la contraseña temporal y el copiado
  tempPassword: { userId: number; password: string; email: string } | null = null;
  copiedSuccessfully = false;

  constructor(
    public readonly store: AuthStore,
    private readonly api: AdminUsersApiService,
    private readonly fb: FormBuilder,
    private readonly toast: ToastService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      nombre: [""],
      roles: [["ROLE_USER"] as string[]],
    }) as FormGroup;
    this.load();
  }

  logout() {
    this.store.clearSession();
    this.router.navigateByUrl('/');
  }
  
  load(): void {
    this.api.getUsers(this.q).subscribe({ next: (u) => (this.users = u) });
  }

  create(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.api.createUser(this.form.getRawValue() as any).subscribe({
      next: () => {
        this.toast.success("Usuario creado");
        this.form.reset({ roles: ["ROLE_USER"] });
        this.load();
      },
      error: () => this.toast.error("No se pudo crear el usuario"),
    });
  }

  // Modificado: Ahora guardamos la contraseña para mostrarla en la UI
  resetPassword(user: AdminUser): void {
    this.tempPassword = null; // Reseteamos si ya había una
    this.copiedSuccessfully = false;
    
    this.api.resetPassword(user.id).subscribe({
      next: (res) => {
        this.toast.success(`Contraseña de ${user.email} reseteada`);
        // Guardamos los datos para mostrarlos en la alerta
        this.tempPassword = {
          userId: user.id,
          email: user.email,
          password: res.passwordTemporal
        };
      },
      error: () => this.toast.error("No se pudo resetear la contraseña"),
    });
  }

  // Nueva función: Usa la API del navegador para copiar al portapapeles
  copyToClipboard(): void {
    if (this.tempPassword?.password) {
      navigator.clipboard.writeText(this.tempPassword.password).then(() => {
        this.copiedSuccessfully = true;
        // Ocultamos el mensaje de "¡Copiado!" después de 3 segundos
        setTimeout(() => {
          this.copiedSuccessfully = false;
        }, 3000);
      }).catch(err => {
        console.error('Error al copiar: ', err);
        this.toast.error('No se pudo copiar al portapapeles');
      });
    }
  }

  // Nueva función: Para cerrar la alerta manualmente
  clearTempPassword(): void {
    this.tempPassword = null;
  }
}