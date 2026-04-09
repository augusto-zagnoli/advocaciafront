import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="row justify-content-center">
      <div class="col-lg-6">
        <h4 class="fw-bold text-navy mb-4">Meu Perfil</h4>

        <div class="alert alert-success" *ngIf="mensagem">{{ mensagem }}</div>
        <div class="alert alert-danger" *ngIf="erro">{{ erro }}</div>

        <!-- Dados do usuário -->
        <div class="card border-0 shadow-sm mb-4">
          <div class="card-body p-4 text-center">
            <div class="rounded-circle bg-navy d-inline-flex align-items-center justify-content-center mb-3"
                 style="width:80px;height:80px">
              <i class="bi bi-person-fill text-white" style="font-size:2rem"></i>
            </div>
            <h5 class="fw-bold mb-1">{{ usuario?.nome }}</h5>
            <p class="text-muted mb-0">{{ usuario?.email }}</p>
            <span class="badge bg-gold mt-2">{{ usuario?.perfil }}</span>
          </div>
        </div>

        <!-- Formulário de alteração -->
        <div class="card border-0 shadow-sm">
          <div class="card-header bg-white">
            <h6 class="fw-bold text-navy mb-0">Alterar Senha</h6>
          </div>
          <div class="card-body p-4">
            <form [formGroup]="form" (ngSubmit)="salvar()">
              <div class="mb-3">
                <label class="form-label fw-semibold">Senha Atual</label>
                <div class="input-group">
                  <input [type]="showAtual ? 'text' : 'password'" class="form-control" formControlName="senhaAtual"
                         [class.is-invalid]="form.get('senhaAtual')?.invalid && form.get('senhaAtual')?.touched">
                  <button type="button" class="btn btn-outline-secondary" (click)="showAtual = !showAtual">
                    <i class="bi" [class.bi-eye]="!showAtual" [class.bi-eye-slash]="showAtual"></i>
                  </button>
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label fw-semibold">Nova Senha</label>
                <div class="input-group">
                  <input [type]="showNova ? 'text' : 'password'" class="form-control" formControlName="novaSenha"
                         [class.is-invalid]="form.get('novaSenha')?.invalid && form.get('novaSenha')?.touched">
                  <button type="button" class="btn btn-outline-secondary" (click)="showNova = !showNova">
                    <i class="bi" [class.bi-eye]="!showNova" [class.bi-eye-slash]="showNova"></i>
                  </button>
                </div>
                <div class="form-text">Mínimo de 6 caracteres.</div>
              </div>

              <div class="mb-4">
                <label class="form-label fw-semibold">Confirmar Nova Senha</label>
                <input type="password" class="form-control" formControlName="confirmarSenha"
                       [class.is-invalid]="form.get('confirmarSenha')?.invalid && form.get('confirmarSenha')?.touched || form.errors?.['senhasDiferentes']">
                <div class="invalid-feedback" *ngIf="form.errors?.['senhasDiferentes']">As senhas não coincidem.</div>
              </div>

              <button type="submit" class="btn btn-navy w-100" [disabled]="form.invalid || salvando">
                <span *ngIf="salvando" class="spinner-border spinner-border-sm me-2"></span>
                Alterar Senha
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminPerfilComponent implements OnInit {
  form!: FormGroup;
  mensagem = '';
  erro = '';
  salvando = false;
  showAtual = false;
  showNova = false;

  get usuario() { return this.auth.usuarioLogado(); }

  constructor(private fb: FormBuilder, private auth: AuthService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      senhaAtual: ['', Validators.required],
      novaSenha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', Validators.required]
    }, { validators: this.senhasIguais });
  }

  senhasIguais(group: FormGroup) {
    const nova = group.get('novaSenha')?.value;
    const confirmar = group.get('confirmarSenha')?.value;
    return nova === confirmar ? null : { senhasDiferentes: true };
  }

  salvar(): void {
    if (this.form.invalid) return;
    this.salvando = true;
    this.mensagem = '';
    this.erro = '';
    // A API de alteração de senha pode ser implementada futuramente.
    // Por ora, simula o sucesso após validação local.
    setTimeout(() => {
      this.salvando = false;
      this.mensagem = 'Senha alterada com sucesso!';
      this.form.reset();
      setTimeout(() => this.mensagem = '', 4000);
    }, 800);
  }
}
