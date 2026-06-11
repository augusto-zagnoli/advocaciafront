import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-vh-100 d-flex align-items-center justify-content-center" style="background: linear-gradient(135deg, #1b2a4a, #243557);">
      <div class="card border-0 shadow-lg p-5" style="width: 100%; max-width: 420px;">
        <div class="text-center mb-4">
          <i class="bi bi-balance-scale text-gold" style="font-size: 3rem;"></i>
          <h4 class="fw-bold text-navy mt-2">Painel Administrativo</h4>
          <p class="text-muted small">Advocacia Gabriela</p>
        </div>

        <div class="alert alert-danger" *ngIf="erro">
          <i class="bi bi-exclamation-triangle me-2"></i>{{ erro }}
        </div>

        <form [formGroup]="form" (ngSubmit)="login()">
          <div class="mb-3">
            <label class="form-label fw-semibold text-navy">E-mail</label>
            <div class="input-group">
              <span class="input-group-text"><i class="bi bi-envelope"></i></span>
              <input type="email" class="form-control" formControlName="email"
                     [class.is-invalid]="f['email'].touched && f['email'].invalid"
                     placeholder="admin@advocacia.com">
              <div class="invalid-feedback">E-mail inválido</div>
            </div>
          </div>
          <div class="mb-4">
            <label class="form-label fw-semibold text-navy">Senha</label>
            <div class="input-group">
              <span class="input-group-text"><i class="bi bi-lock"></i></span>
              <input [type]="showPass ? 'text' : 'password'" class="form-control" formControlName="senha"
                     [class.is-invalid]="f['senha'].touched && f['senha'].invalid"
                     placeholder="Sua senha">
              <button type="button" class="btn btn-outline-secondary" (click)="showPass = !showPass">
                <i class="bi" [class.bi-eye]="!showPass" [class.bi-eye-slash]="showPass"></i>
              </button>
              <div class="invalid-feedback">Senha é obrigatória</div>
            </div>
          </div>
          <button type="submit" class="btn btn-gold w-100 btn-lg" [disabled]="carregando">
            <span *ngIf="carregando" class="spinner-border spinner-border-sm me-2"></span>
            <i class="bi bi-box-arrow-in-right me-2" *ngIf="!carregando"></i>
            {{ carregando ? 'Entrando...' : 'Entrar' }}
          </button>
        </form>

        <div class="text-center mt-3">
          <small class="text-muted">Login padrão: admin&#64;advocacia.com / Admin&#64;123</small>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  form;
  carregando = false;
  erro = '';
  showPass = false;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required]]
    });
  }

  get f() { return this.form.controls; }

  login(): void {
    this.erro = '';
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.carregando = true;
    this.auth.login(this.form.value as any).subscribe({
      next: () => this.router.navigate(['/admin/dashboard']),
      error: (err: HttpErrorResponse) => {
        this.erro = err.error?.message || 'E-mail ou senha inválidos. Verifique suas credenciais.';
        this.carregando = false;
      }
    });
  }
}
