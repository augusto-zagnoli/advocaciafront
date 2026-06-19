import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ConfiguracaoSiteService } from '../../core/services/site.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="d-flex" style="min-height: 100vh;">
      <!-- SIDEBAR -->
      <nav class="sidebar bg-navy text-white d-flex flex-column" [class.collapsed]="sidebarCollapsed()">
        <div class="sidebar-header p-3 d-flex align-items-center justify-content-between border-bottom border-secondary">
          <div class="d-flex align-items-center gap-2" *ngIf="!sidebarCollapsed()">
            <i class="bi bi-balance-scale text-gold fs-5"></i>
            <span class="fw-bold small">Painel Admin</span>
          </div>
          <button class="btn btn-sm btn-outline-secondary border-0" (click)="toggleSidebar()">
            <i class="bi" [class.bi-list]="sidebarCollapsed()" [class.bi-x-lg]="!sidebarCollapsed()"></i>
          </button>
        </div>

        <ul class="nav flex-column mt-2 flex-grow-1">
          <li class="nav-item">
            <a class="nav-link text-white-50 d-flex align-items-center gap-2 px-3 py-2"
               routerLink="/admin/dashboard" routerLinkActive="active">
              <i class="bi bi-speedometer2 fs-5"></i>
              <span *ngIf="!sidebarCollapsed()">Dashboard</span>
            </a>
          </li>

          <li class="nav-item">
            <a class="nav-link text-white-50 d-flex align-items-center justify-content-between gap-2 px-3 py-2"
               role="button" (click)="toggleCadastros()">
              <span class="d-flex align-items-center gap-2">
                <i class="bi bi-folder2-open fs-5"></i>
                <span *ngIf="!sidebarCollapsed()">Cadastros</span>
              </span>
              <i class="bi fs-6" *ngIf="!sidebarCollapsed()"
                 [class.bi-chevron-down]="cadastrosExpanded()"
                 [class.bi-chevron-right]="!cadastrosExpanded()"></i>
            </a>
          </li>
          <ng-container *ngIf="sidebarCollapsed() || cadastrosExpanded()">
            <li class="nav-item">
              <a class="nav-link text-white-50 d-flex align-items-center gap-2 py-2"
                 [class.px-3]="sidebarCollapsed()" [class.ps-4]="!sidebarCollapsed()" [class.pe-3]="!sidebarCollapsed()"
                 routerLink="/admin/pagina-inicial" routerLinkActive="active">
                <i class="bi bi-house-door fs-5"></i>
                <span *ngIf="!sidebarCollapsed()">Página Inicial</span>
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link text-white-50 d-flex align-items-center gap-2 py-2"
                 [class.px-3]="sidebarCollapsed()" [class.ps-4]="!sidebarCollapsed()" [class.pe-3]="!sidebarCollapsed()"
                 routerLink="/admin/anuncios" routerLinkActive="active">
                <i class="bi bi-megaphone fs-5"></i>
                <span *ngIf="!sidebarCollapsed()">Anúncios</span>
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link text-white-50 d-flex align-items-center gap-2 py-2"
                 [class.px-3]="sidebarCollapsed()" [class.ps-4]="!sidebarCollapsed()" [class.pe-3]="!sidebarCollapsed()"
                 routerLink="/admin/areas-atuacao" routerLinkActive="active">
                <i class="bi bi-briefcase fs-5"></i>
                <span *ngIf="!sidebarCollapsed()">Áreas de Atuação</span>
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link text-white-50 d-flex align-items-center gap-2 py-2"
                 [class.px-3]="sidebarCollapsed()" [class.ps-4]="!sidebarCollapsed()" [class.pe-3]="!sidebarCollapsed()"
                 routerLink="/admin/servicos" routerLinkActive="active">
                <i class="bi bi-gear fs-5"></i>
                <span *ngIf="!sidebarCollapsed()">Serviços</span>
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link text-white-50 d-flex align-items-center gap-2 py-2"
                 [class.px-3]="sidebarCollapsed()" [class.ps-4]="!sidebarCollapsed()" [class.pe-3]="!sidebarCollapsed()"
                 routerLink="/admin/quem-somos" routerLinkActive="active">
                <i class="bi bi-people fs-5"></i>
                <span *ngIf="!sidebarCollapsed()">Quem Somos</span>
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link text-white-50 d-flex align-items-center gap-2 py-2"
                 [class.px-3]="sidebarCollapsed()" [class.ps-4]="!sidebarCollapsed()" [class.pe-3]="!sidebarCollapsed()"
                 routerLink="/admin/sobre-doutora" routerLinkActive="active">
                <i class="bi bi-person-badge fs-5"></i>
                <span *ngIf="!sidebarCollapsed()">Sobre a Doutora</span>
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link text-white-50 d-flex align-items-center gap-2 py-2"
                 [class.px-3]="sidebarCollapsed()" [class.ps-4]="!sidebarCollapsed()" [class.pe-3]="!sidebarCollapsed()"
                 routerLink="/admin/depoimentos" routerLinkActive="active">
                <i class="bi bi-chat-quote fs-5"></i>
                <span *ngIf="!sidebarCollapsed()">Depoimentos</span>
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link text-white-50 d-flex align-items-center gap-2 py-2"
                 [class.px-3]="sidebarCollapsed()" [class.ps-4]="!sidebarCollapsed()" [class.pe-3]="!sidebarCollapsed()"
                 routerLink="/admin/configuracoes" routerLinkActive="active">
                <i class="bi bi-sliders fs-5"></i>
                <span *ngIf="!sidebarCollapsed()">Configurações</span>
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link text-white-50 d-flex align-items-center gap-2 py-2"
                 [class.px-3]="sidebarCollapsed()" [class.ps-4]="!sidebarCollapsed()" [class.pe-3]="!sidebarCollapsed()"
                 routerLink="/admin/imagem-hero" routerLinkActive="active">
                <i class="bi bi-image fs-5"></i>
                <span *ngIf="!sidebarCollapsed()">Imagem Destaque</span>
              </a>
            </li>
          </ng-container>

          <li class="nav-item px-3 mt-3 mb-1" *ngIf="!sidebarCollapsed()">
            <small class="text-white-50 fw-semibold text-uppercase" style="font-size:.65rem; letter-spacing:1px;">Atendimento</small>
          </li>
          <li class="nav-item">
            <a class="nav-link text-white-50 d-flex align-items-center gap-2 px-3 py-2"
               routerLink="/admin/contatos" routerLinkActive="active">
              <i class="bi bi-envelope fs-5"></i>
              <span *ngIf="!sidebarCollapsed()">Contatos</span>
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link text-white-50 d-flex align-items-center gap-2 px-3 py-2"
               routerLink="/admin/orcamentos" routerLinkActive="active">
              <i class="bi bi-file-text fs-5"></i>
              <span *ngIf="!sidebarCollapsed()">Orçamentos</span>
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link text-white-50 d-flex align-items-center gap-2 px-3 py-2"
               routerLink="/admin/chat" routerLinkActive="active">
              <i class="bi bi-chat-dots fs-5"></i>
              <span *ngIf="!sidebarCollapsed()">Chat</span>
            </a>
          </li>

          <li class="nav-item px-3 mt-3 mb-1" *ngIf="!sidebarCollapsed()">
            <small class="text-white-50 fw-semibold text-uppercase" style="font-size:.65rem; letter-spacing:1px;">Conta</small>
          </li>
          <li class="nav-item">
            <a class="nav-link text-white-50 d-flex align-items-center gap-2 px-3 py-2"
               routerLink="/admin/perfil" routerLinkActive="active">
              <i class="bi bi-person-circle fs-5"></i>
              <span *ngIf="!sidebarCollapsed()">Perfil</span>
            </a>
          </li>
        </ul>

        <div class="p-3 border-top border-secondary">
          <div class="d-flex align-items-center gap-2 mb-2" *ngIf="!sidebarCollapsed()">
            <i class="bi bi-person-circle text-gold fs-5"></i>
            <div class="small">
              <div class="fw-bold">{{ auth.usuarioLogado()?.nome }}</div>
              <div class="text-white-50">{{ auth.usuarioLogado()?.perfil }}</div>
            </div>
          </div>
          <button class="btn btn-sm btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-1"
                  (click)="auth.logout()">
            <i class="bi bi-box-arrow-right"></i>
            <span *ngIf="!sidebarCollapsed()">Sair</span>
          </button>
        </div>
      </nav>

      <!-- CONTEÚDO PRINCIPAL -->
      <div class="flex-grow-1 d-flex flex-column" style="background:#f4f6f9; min-width:0;">
        <header class="bg-white border-bottom px-4 py-3 d-flex align-items-center justify-content-between shadow-sm">
          <h6 class="mb-0 fw-bold text-navy">Sistema de Gestão — {{ nomeEscritorio }}</h6>
          <div class="d-flex align-items-center gap-3">
            <a routerLink="/" target="_blank" class="btn btn-sm btn-outline-secondary">
              <i class="bi bi-globe"></i> Ver Site
            </a>
            <div class="d-flex align-items-center gap-2">
              <i class="bi bi-person-circle text-gold fs-5"></i>
              <span class="small fw-bold">{{ auth.usuarioLogado()?.nome }}</span>
            </div>
          </div>
        </header>
        <main class="p-4 flex-grow-1 overflow-auto">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styles: [`
    .sidebar { width: 240px; min-height: 100vh; transition: width 0.2s; position: sticky; top: 0; height: 100vh; overflow-y: auto; }
    .sidebar.collapsed { width: 60px; }
    .sidebar .nav-link:hover, .sidebar .nav-link.active { background: rgba(255,255,255,0.1); color: #fff !important; border-radius: 6px; }
    .sidebar .nav-link.active { color: #c9a064 !important; }
  `]
})
export class AdminLayoutComponent implements OnInit {
  sidebarCollapsed = signal(false);
  cadastrosExpanded = signal(true);
  nomeEscritorio = '';

  constructor(public auth: AuthService, private configService: ConfiguracaoSiteService) {}

  ngOnInit(): void {
    this.configService.obterPorChave('nome_doutora').subscribe({
      next: c => { if (c.valor) this.nomeEscritorio = c.valor; },
      error: () => {}
    });
  }

  toggleSidebar() { this.sidebarCollapsed.update(v => !v); }
  toggleCadastros() { this.cadastrosExpanded.update(v => !v); }
}
