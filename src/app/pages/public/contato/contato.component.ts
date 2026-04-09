import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ContatoService } from '../../../core/services/contato.service';

@Component({
  selector: 'app-contato',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="py-5 bg-navy text-white">
      <div class="container py-4">
        <p class="text-gold fw-semibold mb-2">FALE CONOSCO</p>
        <h1 class="fw-bold display-5">Entre em Contato</h1>
        <p class="text-white-50 fs-5">Estamos prontos para atender você.</p>
      </div>
    </section>

    <section class="py-5">
      <div class="container">
        <div class="row g-5">
          <!-- FORMULÁRIO -->
          <div class="col-lg-7">
            <div class="card border-0 shadow-sm p-4 p-md-5">
              <h4 class="fw-bold text-navy mb-4">Envie sua Mensagem</h4>

              <div class="alert alert-success" *ngIf="sucesso">
                <i class="bi bi-check-circle-fill me-2"></i>
                Mensagem enviada com sucesso! Retornaremos em breve.
              </div>
              <div class="alert alert-danger" *ngIf="erro">
                <i class="bi bi-exclamation-triangle me-2"></i>{{ erro }}
              </div>

              <form [formGroup]="form" (ngSubmit)="enviar()">
                <div class="mb-3">
                  <label class="form-label fw-semibold">Nome completo *</label>
                  <input type="text" class="form-control" formControlName="nome"
                         [class.is-invalid]="f['nome'].touched && f['nome'].invalid" placeholder="Seu nome">
                  <div class="invalid-feedback">Nome é obrigatório</div>
                </div>
                <div class="row g-3 mb-3">
                  <div class="col-md-6">
                    <label class="form-label fw-semibold">E-mail *</label>
                    <input type="email" class="form-control" formControlName="email"
                           [class.is-invalid]="f['email'].touched && f['email'].invalid" placeholder="seu@email.com">
                    <div class="invalid-feedback">E-mail válido é obrigatório</div>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-semibold">Telefone</label>
                    <input type="tel" class="form-control" formControlName="telefone" placeholder="(11) 99999-0000">
                  </div>
                </div>
                <div class="mb-4">
                  <label class="form-label fw-semibold">Mensagem *</label>
                  <textarea class="form-control" formControlName="mensagem" rows="5"
                            [class.is-invalid]="f['mensagem'].touched && f['mensagem'].invalid"
                            placeholder="Como podemos ajudar?"></textarea>
                  <div class="invalid-feedback">Mensagem é obrigatória (mínimo 10 caracteres)</div>
                </div>
                <button type="submit" class="btn btn-gold btn-lg w-100" [disabled]="enviando">
                  <span *ngIf="enviando" class="spinner-border spinner-border-sm me-2"></span>
                  <i class="bi bi-send me-2" *ngIf="!enviando"></i>
                  {{ enviando ? 'Enviando...' : 'Enviar Mensagem' }}
                </button>
              </form>
            </div>
          </div>

          <!-- INFORMAÇÕES -->
          <div class="col-lg-5">
            <h4 class="fw-bold text-navy mb-4">Informações de Contato</h4>
            <div class="d-flex flex-column gap-4">
              <div class="d-flex gap-3">
                <div class="flex-shrink-0 icon-box bg-gold-light rounded-3 d-flex align-items-center justify-content-center" style="width:50px; height:50px;">
                  <i class="bi bi-geo-alt text-gold fs-5"></i>
                </div>
                <div>
                  <h6 class="fw-bold text-navy">Endereço</h6>
                  <p class="text-muted mb-0">Rua da Advocacia, 123 - Sala 45<br>Centro, São Paulo - SP</p>
                </div>
              </div>
              <div class="d-flex gap-3">
                <div class="flex-shrink-0 icon-box bg-gold-light rounded-3 d-flex align-items-center justify-content-center" style="width:50px; height:50px;">
                  <i class="bi bi-telephone text-gold fs-5"></i>
                </div>
                <div>
                  <h6 class="fw-bold text-navy">Telefone / WhatsApp</h6>
                  <p class="text-muted mb-0">(11) 99999-0000</p>
                </div>
              </div>
              <div class="d-flex gap-3">
                <div class="flex-shrink-0 icon-box bg-gold-light rounded-3 d-flex align-items-center justify-content-center" style="width:50px; height:50px;">
                  <i class="bi bi-envelope text-gold fs-5"></i>
                </div>
                <div>
                  <h6 class="fw-bold text-navy">E-mail</h6>
                  <p class="text-muted mb-0">contato&#64;advocaciagabriela.com.br</p>
                </div>
              </div>
              <div class="d-flex gap-3">
                <div class="flex-shrink-0 icon-box bg-gold-light rounded-3 d-flex align-items-center justify-content-center" style="width:50px; height:50px;">
                  <i class="bi bi-clock text-gold fs-5"></i>
                </div>
                <div>
                  <h6 class="fw-bold text-navy">Horário de Atendimento</h6>
                  <p class="text-muted mb-0">Segunda à Sexta: 8h às 18h<br>Sábado: 9h às 12h</p>
                </div>
              </div>
            </div>

            <a href="https://wa.me/5511999990000?text=Olá! Gostaria de mais informações."
               target="_blank" class="btn btn-success w-100 mt-4 btn-lg">
              <i class="bi bi-whatsapp me-2"></i>Chamar no WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  `
})
export class ContatoComponent {
  form;
  enviando = false;
  sucesso = false;
  erro = '';

  constructor(private fb: FormBuilder, private contatoService: ContatoService) {
    this.form = this.fb.group({
      nome: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telefone: [''],
      mensagem: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  get f() { return this.form.controls; }

  enviar(): void {
    this.sucesso = false;
    this.erro = '';
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.enviando = true;
    this.contatoService.enviar(this.form.value as any).subscribe({
      next: () => {
        this.sucesso = true;
        this.form.reset();
        this.enviando = false;
      },
      error: () => {
        this.erro = 'Erro ao enviar. Tente novamente ou nos contate por WhatsApp.';
        this.enviando = false;
      }
    });
  }
}
