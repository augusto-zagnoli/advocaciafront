import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AnuncioService } from '../../../core/services/anuncio.service';
import { AreaAtuacaoService, DepoimentoService } from '../../../core/services/site.service';
import { Anuncio, AreaAtuacao, Depoimento } from '../../../core/models/models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- HERO/BANNER PRINCIPAL -->
    <section class="hero-section d-flex align-items-center" style="min-height: 90vh; background: linear-gradient(135deg, #1b2a4a 0%, #243557 60%, #1b2a4a 100%);">
      <div class="container">
        <div class="row align-items-center g-5">
          <div class="col-lg-7">
            <div *ngIf="bannerPrincipal; else defaultHero">
              <p class="text-gold fw-semibold mb-2 letter-spacing">ADVOCACIA & CONSULTORIA JURÍDICA</p>
              <h1 class="display-4 fw-bold text-white mb-3">{{ bannerPrincipal.titulo }}</h1>
              <p class="text-white-50 fs-5 mb-4">{{ bannerPrincipal.subtitulo }}</p>
              <p class="text-white-50 mb-4">{{ bannerPrincipal.descricao }}</p>
              <div class="d-flex gap-3 flex-wrap">
                <a [routerLink]="bannerPrincipal.linkDestino || '/orcamento'" class="btn btn-gold btn-lg px-4">
                  {{ bannerPrincipal.textoBotao || 'Solicitar Orçamento' }}
                  <i class="bi bi-arrow-right ms-2"></i>
                </a>
                <a routerLink="/contato" class="btn btn-outline-light btn-lg px-4">
                  <i class="bi bi-telephone me-2"></i>Entrar em Contato
                </a>
              </div>
            </div>
            <ng-template #defaultHero>
              <p class="text-gold fw-semibold mb-2">ADVOCACIA & CONSULTORIA JURÍDICA</p>
              <h1 class="display-4 fw-bold text-white mb-3">Seu Direito, Nossa Missão</h1>
              <p class="text-white-50 fs-5 mb-4">Defendemos seus interesses com compromisso, ética e excelência jurídica.</p>
              <div class="d-flex gap-3 flex-wrap">
                <a routerLink="/orcamento" class="btn btn-gold btn-lg px-4">
                  Solicitar Orçamento <i class="bi bi-arrow-right ms-2"></i>
                </a>
                <a routerLink="/contato" class="btn btn-outline-light btn-lg px-4">
                  <i class="bi bi-telephone me-2"></i>Entrar em Contato
                </a>
              </div>
            </ng-template>

            <div class="row g-3 mt-4">
              <div class="col-4 text-center">
                <div class="text-gold display-6 fw-bold">10+</div>
                <div class="text-white-50 small">Anos de Experiência</div>
              </div>
              <div class="col-4 text-center">
                <div class="text-gold display-6 fw-bold">500+</div>
                <div class="text-white-50 small">Casos Resolvidos</div>
              </div>
              <div class="col-4 text-center">
                <div class="text-gold display-6 fw-bold">98%</div>
                <div class="text-white-50 small">Clientes Satisfeitos</div>
              </div>
            </div>
          </div>
          <div class="col-lg-5 text-center">
            <div class="hero-image-placeholder rounded-circle d-inline-flex align-items-center justify-content-center"
                 style="width:300px; height:300px; background: rgba(201,160,100,0.15); border: 3px solid rgba(201,160,100,0.3);">
              <i class="bi bi-balance-scale" style="font-size:8rem; color: rgba(201,160,100,0.6);"></i>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- DIFERENCIAIS -->
    <section class="py-5 bg-light">
      <div class="container">
        <div class="row g-4 text-center">
          <div class="col-md-3">
            <div class="card border-0 shadow-sm h-100 p-4">
              <i class="bi bi-shield-check text-gold fs-2 mb-3"></i>
              <h6 class="fw-bold">Ética e Transparência</h6>
              <p class="small text-muted mb-0">Atuação pautada em valores sólidos e comunicação clara.</p>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card border-0 shadow-sm h-100 p-4">
              <i class="bi bi-award text-gold fs-2 mb-3"></i>
              <h6 class="fw-bold">Experiência Comprovada</h6>
              <p class="small text-muted mb-0">Mais de uma década defendendo direitos com excelência.</p>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card border-0 shadow-sm h-100 p-4">
              <i class="bi bi-person-heart text-gold fs-2 mb-3"></i>
              <h6 class="fw-bold">Atendimento Humanizado</h6>
              <p class="small text-muted mb-0">Cada caso tratado com atenção individual e empatia.</p>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card border-0 shadow-sm h-100 p-4">
              <i class="bi bi-clock-history text-gold fs-2 mb-3"></i>
              <h6 class="fw-bold">Agilidade nos Processos</h6>
              <p class="small text-muted mb-0">Acompanhamento constante para resultados mais rápidos.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ANÚNCIO DESTAQUE -->
    <section class="py-5 bg-gold-light" *ngIf="anuncioDestaque">
      <div class="container">
        <div class="card border-0 shadow p-4 p-md-5 bg-navy text-white">
          <div class="row align-items-center g-4">
            <div class="col-md-8">
              <p class="text-gold fw-semibold mb-1">OFERTA ESPECIAL</p>
              <h3 class="fw-bold">{{ anuncioDestaque.titulo }}</h3>
              <p class="text-white-50 mb-0">{{ anuncioDestaque.descricao }}</p>
            </div>
            <div class="col-md-4 text-md-end">
              <a [routerLink]="anuncioDestaque.linkDestino || '/contato'" class="btn btn-gold btn-lg">
                {{ anuncioDestaque.textoBotao || 'Saiba Mais' }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ÁREAS DE ATUAÇÃO -->
    <section class="py-5">
      <div class="container">
        <div class="text-center mb-5">
          <p class="text-gold fw-semibold">EXPERTISE JURÍDICA</p>
          <h2 class="fw-bold text-navy">Áreas de Atuação</h2>
          <p class="text-muted">Oferecemos suporte especializado nas principais áreas do direito.</p>
        </div>
        <div class="row g-4">
          <div class="col-md-6 col-lg-4" *ngFor="let area of areasAtuacao">
            <div class="card h-100 border-0 shadow-sm hover-card">
              <div class="card-body p-4">
                <div class="icon-box bg-gold-light rounded-3 d-inline-flex align-items-center justify-content-center mb-3"
                     style="width:55px; height:55px;">
                  <i class="bi {{ area.icone || 'bi-file-legal' }} text-gold fs-4"></i>
                </div>
                <h6 class="fw-bold text-navy">{{ area.nome }}</h6>
                <p class="small text-muted mb-3">{{ area.descricao }}</p>
                <a routerLink="/areas-atuacao" class="small text-gold fw-semibold text-decoration-none">
                  Saiba mais <i class="bi bi-arrow-right"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div class="text-center mt-4">
          <a routerLink="/areas-atuacao" class="btn btn-outline-navy btn-lg">
            Ver Todas as Áreas <i class="bi bi-arrow-right ms-1"></i>
          </a>
        </div>
      </div>
    </section>

    <!-- SOBRE RÁPIDO -->
    <section class="py-5 bg-light">
      <div class="container">
        <div class="row align-items-center g-5">
          <div class="col-lg-5 text-center">
            <div class="rounded-3 bg-navy d-inline-flex align-items-center justify-content-center"
                 style="width:280px; height:320px;">
              <i class="bi bi-person-badge" style="font-size:7rem; color: rgba(201,160,100,0.7);"></i>
            </div>
          </div>
          <div class="col-lg-7">
            <p class="text-gold fw-semibold mb-2">QUEM SOU EU</p>
            <h2 class="fw-bold text-navy mb-3">Dra. Gabriela</h2>
            <p class="text-muted mb-3">Advogada com mais de 10 anos de experiência, especialista em diversas áreas do direito. Atuo com dedicação, comprometimento e transparência para garantir os melhores resultados para meus clientes.</p>
            <p class="text-muted mb-4">Formada em Direito, com pós-graduação e especializações, sou comprometida com a excelência jurídica e o atendimento humanizado.</p>
            <div class="d-flex gap-3 flex-wrap mb-4">
              <div class="d-flex align-items-center gap-2">
                <i class="bi bi-check-circle-fill text-gold"></i>
                <span class="small">Pós-graduada em Direito Civil</span>
              </div>
              <div class="d-flex align-items-center gap-2">
                <i class="bi bi-check-circle-fill text-gold"></i>
                <span class="small">Membro da OAB</span>
              </div>
              <div class="d-flex align-items-center gap-2">
                <i class="bi bi-check-circle-fill text-gold"></i>
                <span class="small">500+ casos concluídos</span>
              </div>
            </div>
            <a routerLink="/sobre" class="btn btn-navy">
              Conhecer Minha História <i class="bi bi-arrow-right ms-1"></i>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- DEPOIMENTOS -->
    <section class="py-5 bg-navy" *ngIf="depoimentos.length > 0">
      <div class="container">
        <div class="text-center mb-5">
          <p class="text-gold fw-semibold">CLIENTES</p>
          <h2 class="fw-bold text-white">O Que Dizem Sobre Nós</h2>
        </div>
        <div class="row g-4">
          <div class="col-md-4" *ngFor="let dep of depoimentos">
            <div class="card border-0 bg-white bg-opacity-10 text-white h-100 p-4">
              <div class="d-flex mb-3">
                <i class="bi bi-star-fill text-gold" *ngFor="let s of getStars(dep.avaliacao)"></i>
              </div>
              <p class="fst-italic text-white-75 mb-3">"{{ dep.texto }}"</p>
              <div class="mt-auto">
                <div class="fw-bold">{{ dep.nome }}</div>
                <div class="small text-white-50">{{ dep.cargo }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA FINAL -->
    <section class="py-5 bg-gold">
      <div class="container text-center">
        <h2 class="fw-bold text-white mb-3">Pronto para Defender Seus Direitos?</h2>
        <p class="text-white-75 mb-4 fs-5">Entre em contato hoje mesmo e agende sua consulta inicial.</p>
        <div class="d-flex gap-3 justify-content-center flex-wrap">
          <a routerLink="/orcamento" class="btn btn-white btn-lg px-4 fw-semibold text-gold">
            <i class="bi bi-file-text me-2"></i>Solicitar Orçamento
          </a>
          <a routerLink="/contato" class="btn btn-outline-white btn-lg px-4">
            <i class="bi bi-telephone me-2"></i>Entrar em Contato
          </a>
        </div>
      </div>
    </section>
  `
})
export class HomeComponent implements OnInit {
  bannerPrincipal: Anuncio | null = null;
  anuncioDestaque: Anuncio | null = null;
  areasAtuacao: AreaAtuacao[] = [];
  depoimentos: Depoimento[] = [];

  constructor(
    private anuncioService: AnuncioService,
    private areaService: AreaAtuacaoService,
    private depoimentoService: DepoimentoService
  ) {}

  ngOnInit(): void {
    this.anuncioService.listarPublico('banner_principal').subscribe({
      next: a => { if (a.length > 0) this.bannerPrincipal = a[0]; },
      error: () => {}
    });
    this.anuncioService.listarPublico('destaque').subscribe({
      next: a => { if (a.length > 0) this.anuncioDestaque = a[0]; },
      error: () => {}
    });
    this.areaService.listar().subscribe({ next: a => this.areasAtuacao = a, error: () => {} });
    this.depoimentoService.listar().subscribe({ next: d => this.depoimentos = d, error: () => {} });
  }

  getStars(avaliacao: number): number[] {
    return Array.from({ length: avaliacao }, (_, i) => i);
  }
}
