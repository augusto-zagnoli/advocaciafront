import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { LoginRequest, LoginResponse, Usuario } from '../models/models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = `${environment.apiUrl}/auth`;
  private readonly TOKEN_KEY = 'advocacia_token';
  private readonly USER_KEY = 'advocacia_user';

  usuarioLogado = signal<Usuario | null>(this.carregarUsuarioStorage());

  constructor(private http: HttpClient, private router: Router) {}

  login(dados: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API}/login`, dados).pipe(
      tap(res => {
        localStorage.setItem(this.TOKEN_KEY, res.token);
        const usuario: Usuario = { id: 0, nome: res.nome, email: res.email, perfil: res.perfil };
        localStorage.setItem(this.USER_KEY, JSON.stringify(usuario));
        this.usuarioLogado.set(usuario);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.usuarioLogado.set(null);
    this.router.navigate(['/admin/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  private carregarUsuarioStorage(): Usuario | null {
    try {
      const raw = localStorage.getItem(this.USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }
}
