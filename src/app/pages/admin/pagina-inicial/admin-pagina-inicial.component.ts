import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { AnuncioService } from '../../../core/services/anuncio.service';
import { ConfiguracaoSiteService } from '../../../core/services/site.service';
import { Anuncio } from '../../../core/models/models';

@Component({
  selector: 'app-admin-pagina-inicial',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div>
      <div class="mb-4">
        <h4 class="fw-bold text-navy mb-1">Página Inicial</h4>
        <p class="text-muted mb-0">Gerencie o conteúdo do banner principal e as estatísticas exibidas na home</p>
      </div>

      <div class="alert alert-success alert-dismissible" *ngIf="mensagem">
        <i class="bi bi-check-circle me-2"></i>{{ mensagem }}
        <button type="button" class="btn-close" (click)="mensagem=''"></button>
      </div>
      <div class="alert alert-danger alert-dismissible" *ngIf="erro">
        <i class="bi bi-exclamation-triangle me-2"></i>{{ erro }}
        <button type="button" class="btn-close" (click)="erro=''"></button>
      </div>

      <!-- BANNER PRINCIPAL -->
      <div class="card border-0 shadow-sm mb-4">
        <div class="card-header bg-white border-bottom d-flex align-items-center gap-2">
          <i class="bi bi-layout-text-window text-gold fs-5"></i>
          <h6 class="fw-bold text-navy mb-0">Texto do Banner Principal</h6>
        </div>
        <div class="card-body p-4">
          <div class="alert alert-info py-2 mb-3" *ngIf="carregandoBanner">
            <span class="spinner-border spinner-border-sm me-2"></span>Carregando dados do banner...
          </div>
          <form [formGroup]="bannerForm" (ngSubmit)="salvarBanner()">
            <div class="row g-3">
              <div class="col-12">
                <label class="form-label fw-semibold">Título Principal *</label>
                <input type="text" class="form-control" formControlName="titulo"
                       placeholder="Ex: Seu Direito, Nossa Missão"
                       [class.is-invalid]="bf['titulo'].touched && bf['titulo'].invalid">
                <div class="invalid-feedback">Título é obrigatório</div>
              </div>
              <div class="col-12">
                <label class="form-label fw-semibold">Subtítulo</label>
                <input type="text" class="form-control" formControlName="subtitulo"
                       placeholder="Ex: Advocacia com compromisso, ética e excelência">
              </div>
              <div class="col-12">
                <label class="form-label fw-semibold">Descrição</label>
                <textarea class="form-control" formControlName="descricao" rows="3"
                          placeholder="Ex: Defendemos seus interesses com dedicação e profissionalismo."></textarea>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold">Texto do Botão</label>
                <input type="text" class="form-control" formControlName="textoBotao"
                       placeholder="Ex: Agendar Consulta">
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold">Link do Botão</label>
                <input type="text" class="form-control" formControlName="linkDestino"
                       placeholder="Ex: /orcamento">
              </div>
            </div>
            <div class="mt-3">
              <button type="submit" class="btn btn-gold" [disabled]="salvandoBanner">
                <span *ngIf="salvandoBanner" class="spinner-border spinner-border-sm me-1"></span>
                {{ salvandoBanner ? 'Salvando...' : 'Salvar Banner' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- ESTATÍSTICAS -->
      <div class="card border-0 shadow-sm mb-4">
        <div class="card-header bg-white border-bottom d-flex align-items-center gap-2">
          <i class="bi bi-bar-chart text-gold fs-5"></i>
          <h6 class="fw-bold text-navy mb-0">Estatísticas</h6>
        </div>
        <div class="card-body p-4">
          <p class="text-muted small mb-4">
            <i class="bi bi-info-circle me-1"></i>
            Exibidas abaixo dos botões no banner principal. Você pode personalizar o valor e o rótulo de cada uma.
          </p>
          <form [formGroup]="statsForm" (ngSubmit)="salvarStats()">
            <div class="row g-3 mb-3">
              <div class="col-12"><p class="fw-semibold text-navy mb-0">Estatística 1</p></div>
              <div class="col-md-4">
                <label class="form-label">Valor *</label>
                <input type="text" class="form-control" formControlName="stat1Valor"
                       placeholder="Ex: 10+"
                       [class.is-invalid]="sf['stat1Valor'].touched && sf['stat1Valor'].invalid">
                <div class="invalid-feedback">Obrigatório</div>
              </div>
              <div class="col-md-8">
                <label class="form-label">Rótulo *</label>
                <input type="text" class="form-control" formControlName="stat1Label"
                       placeholder="Ex: Anos de Experiência"
                       [class.is-invalid]="sf['stat1Label'].touched && sf['stat1Label'].invalid">
                <div class="invalid-feedback">Obrigatório</div>
              </div>

              <div class="col-12 border-top pt-3"><p class="fw-semibold text-navy mb-0">Estatística 2</p></div>
              <div class="col-md-4">
                <label class="form-label">Valor *</label>
                <input type="text" class="form-control" formControlName="stat2Valor"
                       placeholder="Ex: 500+"
                       [class.is-invalid]="sf['stat2Valor'].touched && sf['stat2Valor'].invalid">
                <div class="invalid-feedback">Obrigatório</div>
              </div>
              <div class="col-md-8">
                <label class="form-label">Rótulo *</label>
                <input type="text" class="form-control" formControlName="stat2Label"
                       placeholder="Ex: Casos Resolvidos"
                       [class.is-invalid]="sf['stat2Label'].touched && sf['stat2Label'].invalid">
                <div class="invalid-feedback">Obrigatório</div>
              </div>

              <div class="col-12 border-top pt-3"><p class="fw-semibold text-navy mb-0">Estatística 3</p></div>
              <div class="col-md-4">
                <label class="form-label">Valor *</label>
                <input type="text" class="form-control" formControlName="stat3Valor"
                       placeholder="Ex: 98%"
                       [class.is-invalid]="sf['stat3Valor'].touched && sf['stat3Valor'].invalid">
                <div class="invalid-feedback">Obrigatório</div>
              </div>
              <div class="col-md-8">
                <label class="form-label">Rótulo *</label>
                <input type="text" class="form-control" formControlName="stat3Label"
                       placeholder="Ex: Clientes Satisfeitos"
                       [class.is-invalid]="sf['stat3Label'].touched && sf['stat3Label'].invalid">
                <div class="invalid-feedback">Obrigatório</div>
              </div>
            </div>
            <button type="submit" class="btn btn-gold" [disabled]="salvandoStats">
              <span *ngIf="salvandoStats" class="spinner-border spinner-border-sm me-1"></span>
              {{ salvandoStats ? 'Salvando...' : 'Salvar Estatísticas' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  `
})
export class AdminPaginaInicialComponent implements OnInit {
  carregandoBanner = false;
  salvandoBanner = false;
  salvandoStats = false;
  mensagem = '';
  erro = '';
  private bannerAtual: Anuncio | null = null;

  bannerForm;
  statsForm;

  get bf() { return this.bannerForm.controls; }
  get sf() { return this.statsForm.controls; }

  constructor(
    private fb: FormBuilder,
    private anuncioService: AnuncioService,
    private configService: ConfiguracaoSiteService
  ) {
    this.bannerForm = this.fb.group({
      titulo: ['', Validators.required],
      subtitulo: [''],
      descricao: [''],
      textoBotao: [''],
      linkDestino: ['']
    });

    this.statsForm = this.fb.group({
      stat1Valor: ['', Validators.required],
      stat1Label: ['', Validators.required],
      stat2Valor: ['', Validators.required],
      stat2Label: ['', Validators.required],
      stat3Valor: ['', Validators.required],
      stat3Label: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.carregarBanner();
    this.carregarStats();
  }

  private carregarBanner(): void {
    this.carregandoBanner = true;
    this.anuncioService.listar(1, 10, 'banner_principal').subscribe({
      next: r => {
        this.bannerAtual = r.items[0] || null;
        if (this.bannerAtual) {
          this.bannerForm.patchValue({
            titulo: this.bannerAtual.titulo,
            subtitulo: this.bannerAtual.subtitulo || '',
            descricao: this.bannerAtual.descricao || '',
            textoBotao: this.bannerAtual.textoBotao || '',
            linkDestino: this.bannerAtual.linkDestino || '',
          });
        }
        this.carregandoBanner = false;
      },
      error: () => this.carregandoBanner = false
    });
  }

  private carregarStats(): void {
    this.configService.obterPorChave('hero_stats').subscribe({
      next: c => {
        try {
          const parsed = JSON.parse(c.valor) as { valor: string; label: string }[];
          if (Array.isArray(parsed) && parsed.length >= 3) {
            this.statsForm.patchValue({
              stat1Valor: parsed[0].valor, stat1Label: parsed[0].label,
              stat2Valor: parsed[1].valor, stat2Label: parsed[1].label,
              stat3Valor: parsed[2].valor, stat3Label: parsed[2].label,
            });
          }
        } catch { }
      },
      error: () => {}
    });
  }

  salvarBanner(): void {
    if (this.bannerForm.invalid) { this.bannerForm.markAllAsTouched(); return; }
    this.salvandoBanner = true;

    const v = this.bannerForm.value;
    const dto = {
      titulo: v.titulo!, subtitulo: v.subtitulo || '',
      descricao: v.descricao || '', textoBotao: v.textoBotao || '',
      linkDestino: v.linkDestino || '', posicao: 'banner_principal',
      ativo: true, ordem: 1
    };

    const obs = this.bannerAtual
      ? this.anuncioService.atualizar(this.bannerAtual.id, dto)
      : this.anuncioService.criar(dto);

    obs.subscribe({
      next: item => {
        this.bannerAtual = item;
        this.mensagem = 'Banner atualizado com sucesso!';
        this.salvandoBanner = false;
      },
      error: (err: HttpErrorResponse) => {
        this.erro = err.error?.message || 'Erro ao salvar o banner.';
        this.salvandoBanner = false;
      }
    });
  }

  salvarStats(): void {
    if (this.statsForm.invalid) { this.statsForm.markAllAsTouched(); return; }
    this.salvandoStats = true;

    const v = this.statsForm.value;
    const stats = [
      { valor: v.stat1Valor!, label: v.stat1Label! },
      { valor: v.stat2Valor!, label: v.stat2Label! },
      { valor: v.stat3Valor!, label: v.stat3Label! },
    ];

    this.configService.salvar({
      chave: 'hero_stats',
      valor: JSON.stringify(stats),
      descricao: 'Estatísticas do banner hero'
    }).subscribe({
      next: () => {
        this.mensagem = 'Estatísticas atualizadas com sucesso!';
        this.salvandoStats = false;
      },
      error: (err: HttpErrorResponse) => {
        this.erro = err.error?.message || 'Erro ao salvar as estatísticas.';
        this.salvandoStats = false;
      }
    });
  }
}
