import { Component, OnInit, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ConfiguracaoSiteService } from '../../core/services/site.service';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  template: `
    <!-- NAVBAR -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-navy fixed-top shadow">
      <div class="container">
        <a class="navbar-brand d-flex align-items-center gap-2" routerLink="/">
          <i class="bi bi-balance-scale text-gold fs-4"></i>
          <div>
            <div class="fw-bold lh-1">{{ nomeDoutora }}</div>
            <div class="small lh-1 opacity-75">{{ subtituloEscritorio }}</div>
          </div>
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMain">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarMain">
          <ul class="navbar-nav ms-auto gap-lg-1">
            <li class="nav-item"><a class="nav-link" routerLink="/">Início</a></li>
            <li class="nav-item"><a class="nav-link" routerLink="/sobre">Sobre</a></li>
            <li class="nav-item"><a class="nav-link" routerLink="/areas-atuacao">Áreas de Atuação</a></li>
            <li class="nav-item"><a class="nav-link" routerLink="/contato">Contato</a></li>
            <li class="nav-item ms-lg-2">
              <a class="btn btn-gold btn-sm px-3" routerLink="/orcamento">Solicitar Orçamento</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- CONTEÚDO -->
    <main style="padding-top: 80px;">
      <router-outlet />
    </main>

    <!-- FOOTER -->
    <footer class="bg-navy text-white pt-5 pb-3 mt-5">
      <div class="container">
        <div class="row g-4">
          <div class="col-md-4">
            <div class="d-flex align-items-center gap-2 mb-3">
              <i class="bi bi-balance-scale text-gold fs-4"></i>
              <div>
                <div class="fw-bold">{{ nomeDoutora }}</div>
                <div class="small opacity-75">{{ subtituloEscritorio }}</div>
              </div>
            </div>
            <p class="small opacity-75">Comprometida com a defesa dos seus direitos com ética, profissionalismo e dedicação.</p>
            <div class="d-flex gap-3 mt-3">
              <a href="#" class="text-gold fs-5"><i class="bi bi-instagram"></i></a>
              <a href="#" class="text-gold fs-5"><i class="bi bi-facebook"></i></a>
              <a href="#" class="text-gold fs-5"><i class="bi bi-linkedin"></i></a>
            </div>
          </div>
          <div class="col-md-4">
            <h6 class="fw-bold text-gold mb-3">Links Rápidos</h6>
            <ul class="list-unstyled small">
              <li class="mb-2"><a routerLink="/" class="text-white-50 text-decoration-none">Início</a></li>
              <li class="mb-2"><a routerLink="/sobre" class="text-white-50 text-decoration-none">Sobre</a></li>
              <li class="mb-2"><a routerLink="/areas-atuacao" class="text-white-50 text-decoration-none">Áreas de Atuação</a></li>
              <li class="mb-2"><a routerLink="/contato" class="text-white-50 text-decoration-none">Contato</a></li>
              <li class="mb-2"><a routerLink="/orcamento" class="text-white-50 text-decoration-none">Solicitar Orçamento</a></li>
            </ul>
          </div>
          <div class="col-md-4">
            <h6 class="fw-bold text-gold mb-3">Contato</h6>
            <ul class="list-unstyled small">
              <li class="mb-2 d-flex align-items-center gap-2">
                <i class="bi bi-geo-alt text-gold"></i>
                <span class="text-white-50">Rua da Advocacia, 123 - Centro</span>
              </li>
              <li class="mb-2 d-flex align-items-center gap-2">
                <i class="bi bi-telephone text-gold"></i>
                <span class="text-white-50">(11) 99999-0000</span>
              </li>
              <li class="mb-2 d-flex align-items-center gap-2">
                <i class="bi bi-envelope text-gold"></i>
                <span class="text-white-50">contato&#64;advocaciagabriela.com.br</span>
              </li>
              <li class="mb-2 d-flex align-items-center gap-2">
                <i class="bi bi-clock text-gold"></i>
                <span class="text-white-50">Seg-Sex: 8h às 18h</span>
              </li>
            </ul>
          </div>
        </div>
        <hr class="border-secondary mt-4">
        <div class="text-center small text-white-50">
          <p class="mb-0">© {{ anoAtual }} {{ nomeDoutora }} — {{ subtituloEscritorio }}. Todos os direitos reservados.</p>
          <p class="mb-0 mt-1" *ngIf="oabNumero">{{ oabNumero }}</p>
          <p class="mb-0 mt-2">
            <a routerLink="/admin/login" class="text-white-50" style="font-size:.75rem; opacity:.5; text-decoration:none;">
              <i class="bi bi-lock me-1"></i>Área Restrita
            </a>
          </p>
        </div>
      </div>
    </footer>

    <!-- BOTÃO WHATSAPP -->
    <a [href]="'https://wa.me/' + whatsappNumero + '?text=Olá! Encontrei seu site e gostaria de mais informações.'"
       target="_blank" rel="noopener" class="whatsapp-btn" title="Fale conosco no WhatsApp">
      <i class="bi bi-whatsapp"></i>
    </a>
  `
})
export class PublicLayoutComponent implements OnInit {
  whatsappNumero = '5511999990000';
  nomeDoutora = '';
  subtituloEscritorio = '';
  oabNumero = '';
  anoAtual = new Date().getFullYear();

  constructor(private configService: ConfiguracaoSiteService) {}

  ngOnInit(): void {
    this.configService.obterPorChave('telefone_whatsapp').subscribe({
      next: c => { if (c.valor) this.whatsappNumero = c.valor; },
      error: () => {}
    });
    this.configService.obterPorChave('nome_doutora').subscribe({
      next: c => { if (c.valor) this.nomeDoutora = c.valor; },
      error: () => {}
    });
    this.configService.obterPorChave('subtitulo_escritorio').subscribe({
      next: c => { if (c.valor) this.subtituloEscritorio = c.valor; },
      error: () => {}
    });
    this.configService.obterPorChave('oab_numero').subscribe({
      next: c => { if (c.valor) this.oabNumero = c.valor; },
      error: () => {}
    });
  }
}
