import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { OrcamentoService } from '../../../core/services/orcamento.service';
import { AreaAtuacaoService } from '../../../core/services/site.service';
import { AreaAtuacao } from '../../../core/models/models';

@Component({
  selector: 'app-orcamento',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="py-5 bg-navy text-white">
      <div class="container py-4">
        <p class="text-gold fw-semibold mb-2">ORÇAMENTO</p>
        <h1 class="fw-bold display-5">Solicitar Orçamento</h1>
        <p class="text-white-50 fs-5">Preencha o formulário e receba uma análise do seu caso.</p>
      </div>
    </section>

    <section class="py-5">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-8">
            <div class="card border-0 shadow-sm p-4 p-md-5">
              <div class="text-center mb-4">
                <div class="icon-box bg-gold-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                     style="width:70px; height:70px;">
                  <i class="bi bi-file-earmark-text text-gold fs-3"></i>
                </div>
                <h4 class="fw-bold text-navy">Solicite sua Consulta</h4>
                <p class="text-muted">Análise inicial gratuita. Responderemos em até 24 horas úteis.</p>
              </div>

              <div class="alert alert-success" *ngIf="sucesso">
                <i class="bi bi-check-circle-fill me-2"></i>
                <strong>Solicitação enviada!</strong> Entraremos em contato em breve para confirmar os detalhes.
              </div>
              <div class="alert alert-danger" *ngIf="erro">
                <i class="bi bi-exclamation-triangle me-2"></i>{{ erro }}
              </div>

              <form [formGroup]="form" (ngSubmit)="solicitar()">
                <div class="row g-3 mb-3">
                  <div class="col-md-6">
                    <label class="form-label fw-semibold">Nome completo *</label>
                    <input type="text" class="form-control" formControlName="nome"
                           [class.is-invalid]="f['nome'].touched && f['nome'].invalid" placeholder="Seu nome">
                    <div class="invalid-feedback">Nome é obrigatório</div>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-semibold">Telefone</label>
                    <input type="tel" class="form-control" formControlName="telefone" placeholder="(11) 99999-0000">
                  </div>
                </div>
                <div class="mb-3">
                  <label class="form-label fw-semibold">E-mail *</label>
                  <input type="email" class="form-control" formControlName="email"
                         [class.is-invalid]="f['email'].touched && f['email'].invalid" placeholder="seu@email.com">
                  <div class="invalid-feedback">E-mail válido é obrigatório</div>
                </div>
                <div class="mb-3">
                  <label class="form-label fw-semibold">Área de Atuação *</label>
                  <select class="form-select" formControlName="areaAtuacao"
                          [class.is-invalid]="f['areaAtuacao'].touched && f['areaAtuacao'].invalid">
                    <option value="">Selecione a área do seu caso</option>
                    <option *ngFor="let area of areas" [value]="area.nome">{{ area.nome }}</option>
                    <option value="Outro">Outro</option>
                  </select>
                  <div class="invalid-feedback">Selecione a área de atuação</div>
                </div>
                <div class="mb-4">
                  <label class="form-label fw-semibold">Descreva seu caso *</label>
                  <textarea class="form-control" formControlName="descricao" rows="6"
                            [class.is-invalid]="f['descricao'].touched && f['descricao'].invalid"
                            placeholder="Descreva seu caso com detalhes para que possamos analisá-lo adequadamente..."></textarea>
                  <div class="invalid-feedback">Descreva seu caso com pelo menos 20 caracteres</div>
                  <div class="form-text">Quanto mais detalhes, mais precisa será nossa análise.</div>
                </div>

                <div class="alert alert-info d-flex gap-2 mb-4">
                  <i class="bi bi-info-circle-fill mt-1"></i>
                  <div class="small">
                    <strong>Sigilo garantido:</strong> Todas as informações são tratadas com total confidencialidade e sigilo profissional.
                  </div>
                </div>

                <button type="submit" class="btn btn-gold btn-lg w-100" [disabled]="enviando">
                  <span *ngIf="enviando" class="spinner-border spinner-border-sm me-2"></span>
                  <i class="bi bi-send me-2" *ngIf="!enviando"></i>
                  {{ enviando ? 'Enviando...' : 'Solicitar Orçamento' }}
                </button>
              </form>
            </div>

            <!-- GARANTIAS -->
            <div class="row g-3 mt-4 text-center">
              <div class="col-md-4">
                <div class="card border-0 bg-light p-3">
                  <i class="bi bi-shield-lock text-gold fs-4 mb-2"></i>
                  <small class="fw-semibold">100% Confidencial</small>
                </div>
              </div>
              <div class="col-md-4">
                <div class="card border-0 bg-light p-3">
                  <i class="bi bi-clock text-gold fs-4 mb-2"></i>
                  <small class="fw-semibold">Resposta em 24h</small>
                </div>
              </div>
              <div class="col-md-4">
                <div class="card border-0 bg-light p-3">
                  <i class="bi bi-chat-dots text-gold fs-4 mb-2"></i>
                  <small class="fw-semibold">Análise Gratuita</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class OrcamentoComponent implements OnInit {
  form;
  areas: AreaAtuacao[] = [];
  enviando = false;
  sucesso = false;
  erro = '';

  constructor(
    private fb: FormBuilder,
    private orcamentoService: OrcamentoService,
    private areaService: AreaAtuacaoService
  ) {
    this.form = this.fb.group({
      nome: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telefone: [''],
      areaAtuacao: ['', [Validators.required]],
      descricao: ['', [Validators.required, Validators.minLength(20)]]
    });
  }

  get f() { return this.form.controls; }

  ngOnInit(): void {
    this.areaService.listar().subscribe({ next: a => this.areas = a, error: () => {} });
  }

  solicitar(): void {
    this.sucesso = false;
    this.erro = '';
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.enviando = true;
    this.orcamentoService.solicitar(this.form.value as any).subscribe({
      next: () => {
        this.sucesso = true;
        this.form.reset();
        this.enviando = false;
        window.scrollTo(0, 0);
      },
      error: () => {
        this.erro = 'Erro ao enviar. Tente novamente ou nos contate por WhatsApp.';
        this.enviando = false;
      }
    });
  }
}
