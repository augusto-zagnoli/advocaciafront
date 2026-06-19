import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SobreDoutoraService, QuemSomosService, ConfiguracaoSiteService } from '../../../core/services/site.service';
import { SobreDoutora, QuemSomos } from '../../../core/models/models';

@Component({
  selector: 'app-sobre',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- HERO -->
    <section class="py-5 bg-navy text-white">
      <div class="container py-4">
        <div class="row align-items-center">
          <div class="col">
            <p class="text-gold fw-semibold mb-2">SOBRE</p>
            <h1 class="fw-bold display-5">{{ nomeDoutora }}</h1>
            <p class="text-white-50 fs-5">Advogada comprometida com a Justiça e os seus direitos.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CONTEÚDO SOBRE A DOUTORA -->
    <section class="py-5">
      <div class="container">
        <div class="row align-items-center g-5">
          <div class="col-lg-5 text-center">
            <div *ngIf="fotoDoutora; else placeholderFoto">
              <img [src]="fotoDoutora" [attr.alt]="nomeDoutora" class="rounded-3 img-fluid shadow border"
                   style="max-width:300px; max-height:350px; object-fit:cover;">
            </div>
            <ng-template #placeholderFoto>
              <div class="rounded-3 bg-light d-inline-flex align-items-center justify-content-center border"
                   style="width:300px; height:350px;">
                <i class="bi bi-person-badge" style="font-size:7rem; color:#c9a064;"></i>
              </div>
            </ng-template>
            <div class="mt-3">
              <span *ngIf="oabNumero" class="badge bg-gold text-white px-3 py-2">{{ oabNumero }}</span>
            </div>
          </div>
          <div class="col-lg-7">
            <ng-container *ngIf="sobreDoutoras.length > 0; else defaultSobre">
              <div *ngFor="let sobre of sobreDoutoras; let i = index" [class.mb-4]="i < sobreDoutoras.length - 1">
                <p class="text-gold fw-semibold mb-2" *ngIf="sobre.subtitulo">{{ sobre.subtitulo }}</p>
                <h2 class="fw-bold text-navy mb-3" *ngIf="sobre.titulo">{{ sobre.titulo }}</h2>
                <p class="text-muted mb-3">{{ sobre.descricao }}</p>
                <img *ngIf="sobre.imagemUrl" [src]="sobre.imagemUrl" [alt]="sobre.titulo"
                     class="img-fluid rounded-3 mb-3" style="max-height:200px; object-fit:cover;">
              </div>
            </ng-container>
            <ng-template #defaultSobre>
              <p class="text-gold fw-semibold mb-2">TRAJETÓRIA PROFISSIONAL</p>
              <h2 class="fw-bold text-navy mb-4">Conectando Direito e Humanidade</h2>
              <p class="text-muted mb-3">
                Com mais de 10 anos de experiência na advocacia, {{ nomeDoutora }} construiu uma trajetória marcada pelo comprometimento com os direitos dos seus clientes.
              </p>
              <p class="text-muted mb-4">
                Sua atuação é pautada em três pilares fundamentais: transparência, ética e resultados.
              </p>
            </ng-template>
            <div class="d-flex gap-3 mt-3">
              <a routerLink="/orcamento" class="btn btn-gold">Solicitar Consulta</a>
              <a routerLink="/contato" class="btn btn-outline-navy">Entrar em Contato</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- QUEM SOMOS -->
    <section class="py-5 bg-light" *ngIf="quemSomos.length > 0">
      <div class="container">
        <div class="text-center mb-5">
          <p class="text-gold fw-semibold">NOSSA HISTÓRIA</p>
          <h2 class="fw-bold text-navy">Quem Somos</h2>
        </div>
        <div class="row g-4">
          <div class="col-md-6" *ngFor="let item of quemSomos">
            <div class="card border-0 shadow-sm h-100">
              <img *ngIf="item.imagemUrl" [src]="item.imagemUrl" [alt]="item.titulo"
                   class="card-img-top" style="height:200px; object-fit:cover;">
              <div class="card-body p-4">
                <h5 class="fw-bold text-navy">{{ item.titulo }}</h5>
                <p class="small text-gold mb-2" *ngIf="item.subtitulo">{{ item.subtitulo }}</p>
                <p class="text-muted mb-0">{{ item.descricao }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- VALORES -->
    <section class="py-5" [class.bg-light]="quemSomos.length === 0">
      <div class="container">
        <div class="text-center mb-5">
          <h2 class="fw-bold text-navy">Valores que Nos Guiam</h2>
        </div>
        <div class="row g-4 text-center">
          <div class="col-md-4">
            <i class="bi bi-shield-check text-gold fs-1 mb-3"></i>
            <h5 class="fw-bold text-navy">Ética</h5>
            <p class="text-muted">Atuação pautada na conduta ética e nos princípios da advocacia responsável.</p>
          </div>
          <div class="col-md-4">
            <i class="bi bi-eye text-gold fs-1 mb-3"></i>
            <h5 class="fw-bold text-navy">Transparência</h5>
            <p class="text-muted">Comunicação clara e honesta com nossos clientes em todas as etapas do processo.</p>
          </div>
          <div class="col-md-4">
            <i class="bi bi-trophy text-gold fs-1 mb-3"></i>
            <h5 class="fw-bold text-navy">Excelência</h5>
            <p class="text-muted">Comprometimento com os melhores resultados e qualidade no atendimento jurídico.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-5 bg-navy text-white text-center">
      <div class="container">
        <h3 class="fw-bold mb-3">Vamos Trabalhar Juntos?</h3>
        <p class="text-white-50 mb-4">Agende sua consulta e conheça como posso ajudar.</p>
        <a routerLink="/orcamento" class="btn btn-gold btn-lg px-5">Agendar Consulta</a>
      </div>
    </section>
  `
})
export class SobreComponent implements OnInit {
  sobreDoutoras: SobreDoutora[] = [];
  quemSomos: QuemSomos[] = [];
  fotoDoutora: string | null = null;
  nomeDoutora = '';
  oabNumero = '';

  constructor(
    private sobreDoutoraService: SobreDoutoraService,
    private quemSomosService: QuemSomosService,
    private configService: ConfiguracaoSiteService
  ) {}

  ngOnInit(): void {
    this.sobreDoutoraService.listar().subscribe({ next: s => this.sobreDoutoras = s, error: () => {} });
    this.quemSomosService.listar().subscribe({ next: q => this.quemSomos = q, error: () => {} });
    this.configService.obterPorChave('foto_doutora').subscribe({
      next: c => { if (c.valor) this.fotoDoutora = c.valor; },
      error: () => {}
    });
    this.configService.obterPorChave('nome_doutora').subscribe({
      next: c => { if (c.valor) this.nomeDoutora = c.valor; },
      error: () => {}
    });
    this.configService.obterPorChave('oab_numero').subscribe({
      next: c => { if (c.valor) this.oabNumero = c.valor; },
      error: () => {}
    });
  }
}
