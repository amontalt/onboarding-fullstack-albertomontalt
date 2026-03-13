import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";

export interface AdminUser {
  id: number;
  email: string;
  roles: string[];
  nombre?: string | null;
}
export interface CreateUserPayload {
  email: string;
  password: string;
  nombre?: string;
  roles?: string[];
}
export interface ResetPasswordResponse {
  message: string;
  passwordTemporal: string;
}

@Injectable({ providedIn: "root" })
export class AdminUsersApiService {
  private readonly http = inject(HttpClient);
  private readonly API = "http://localhost:8000/api/admin/users";

  getUsers(q?: string): Observable<AdminUser[]> {
    let params = new HttpParams();
    if (q) params = params.set("q", q);
    return this.http.get<AdminUser[]>(this.API, { params });
  }

  createUser(payload: CreateUserPayload): Observable<AdminUser> {
    return this.http.post<AdminUser>(this.API, payload);
  }

  resetPassword(id: number): Observable<ResetPasswordResponse> {
    return this.http.post<ResetPasswordResponse>(
      `${this.API}/${id}/reset-password`,
      {}
    );
  }
}