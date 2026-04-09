import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ContatoService } from '../../../core/services/contato.service';
import { OrcamentoService } from '../../../core/services/orcamento.service';
import { ChatService } from '../../../core/services/chat.service';
import { AnuncioService } from '../../../core/services/anuncio.service';

interface DashboardCard {
  titulo: string;
  valor: number | string;
  icone: string;
  cor: string;
  link: string;
  desc?: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div>
      <div class="mb-4">
        <h4 class="fw-bold text-navy mb-1">Dashboard</h4>
        <p class="text-muted mb-0">Bem-vinda ao painel de gestão, Dra. Gabriela.</p>
      </div>

      <!-- CARDS RESUMO -->
      <div class="row g-3 mb-4">
        <div class="col-sm-6 col-xl-3" *ngFor="let card of cards">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body d-flex align-items-center gap-3">
              <div class="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                   [style.background]="card.cor + '20'" style="width:55px;height:55px;">
                <i class="bi {{ card.icone }} fs-4" [style.color]="card.cor"></i>
              </div>
              <div>
                <div class="text-muted small">{{ card.titulo }}</div>
                <div class="fw-bold fs-4" [style.color]="card.cor">{{ card.valor }}</div>
                <div class="small text-muted">{{ card.desc }}</div>
              </div>
            </div>
            <a [routerLink]="card.link" class="card-footer text-decoration-none text-muted small d-flex align-items-center justify-content-between">
              <span>Ver detalhes</span>
              <i class="bi bi-arrow-right"></i>
            </a>
          </div>
        </div>
      </div>

      <!-- ATALHOS -->
      <div class="row g-3">
        <div class="col-md-6">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-header bg-white border-bottom">
              <h6 class="fw-bold text-navy mb-0">Ações Rápidas</h6>
            </div>
            <div class="card-body">
              <div class="d-flex flex-column gap-2">
                <a routerLink="/admin/anuncios/novo" class="btn btn-outline-primary d-flex align-items-center gap-2">
                  <i class="bi bi-plus-circle"></i> Novo Anúncio
                </a>
                <a routerLink="/admin/contatos" class="btn btn-outline-warning d-flex align-items-center gap-2">
                  <i class="bi bi-envelope-open"></i> Ver Contatos não lidos
                </a>
                <a routerLink="/admin/orcamentos" class="btn btn-outline-info d-flex align-items-center gap-2">
                  <i class="bi bi-file-earmark-check"></i> Ver Orçamentos pendentes
                </a>
                <a routerLink="/admin/chat" class="btn btn-outline-success d-flex align-items-center gap-2">
                  <i class="bi bi-chat-dots"></i> Acessar Chat
                </a>
                <a routerLink="/" target="_blank" class="btn btn-outline-secondary d-flex align-items-center gap-2">
                  <i class="bi bi-globe"></i> Visualizar Site
                </a>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-6">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-header bg-white border-bottom">
              <h6 class="fw-bold text-navy mb-0">Informações do Sistema</h6>
            </div>
            <div class="card-body">
              <ul class="list-unstyled mb-0">
                <li class="d-flex align-items-center gap-2 mb-3 pb-3 border-bottom">
                  <i class="bi bi-circle-fill text-success small"></i>
                  <span class="small">Sistema online e funcionando</span>
                </li>
                <li class="d-flex align-items-center gap-2 mb-3 pb-3 border-bottom">
                  <i class="bi bi-calendar text-gold small"></i>
                  <span class="small">Data atual: {{ hoje | date:'dd/MM/yyyy' }}</span>
                </li>
                <li class="d-flex align-items-center gap-2 mb-3 pb-3 border-bottom">
                  <i class="bi bi-shield-check text-primary small"></i>
                  <span class="small">Sessão autenticada com JWT</span>
                </li>
                <li class="d-flex align-items-center gap-2">
                  <i class="bi bi-database text-info small"></i>
                  <span class="small">Banco de dados MySQL conectado</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  hoje = new Date();
  cards: DashboardCard[] = [
    { titulo: 'Contatos', valor: '...', icone: 'bi-envelope', cor: '#c9a064', link: '/admin/contatos', desc: 'Mensagens recebidas' },
    { titulo: 'Orçamentos', valor: '...', icone: 'bi-file-text', cor: '#1b2a4a', link: '/admin/orcamentos', desc: 'Solicitações' },
    { titulo: 'Conversas', valor: '...', icone: 'bi-chat-dots', cor: '#198754', link: '/admin/chat', desc: 'Chats ativos' },
    { titulo: 'Anúncios', valor: '...', icone: 'bi-megaphone', cor: '#0d6efd', link: '/admin/anuncios', desc: 'Publicações ativas' },
  ];

  constructor(
    private contatoService: ContatoService,
    private orcamentoService: OrcamentoService,
    private chatService: ChatService,
    private anuncioService: AnuncioService
  ) {}

  ngOnInit(): void {
    this.contatoService.listar(1, 1).subscribe({
      next: r => this.cards[0].valor = r.total,
      error: () => this.cards[0].valor = 0
    });
    this.orcamentoService.listar(1, 1).subscribe({
      next: r => this.cards[1].valor = r.total,
      error: () => this.cards[1].valor = 0
    });
    this.chatService.listarConversas(1, 1).subscribe({
      next: r => this.cards[2].valor = r.total,
      error: () => this.cards[2].valor = 0
    });
    this.anuncioService.listar(1, 100, undefined, true).subscribe({
      next: r => this.cards[3].valor = r.total,
      error: () => this.cards[3].valor = 0
    });
  }
}
