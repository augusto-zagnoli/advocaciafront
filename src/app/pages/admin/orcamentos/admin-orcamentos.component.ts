import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrcamentoService } from '../../../core/services/orcamento.service';
import { Orcamento, PagedResult } from '../../../core/models/models';

@Component({
  selector: 'app-admin-orcamentos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div>
      <div class="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 class="fw-bold text-navy mb-1">Orçamentos</h4>
          <p class="text-muted mb-0">Solicitações de orçamento recebidas</p>
        </div>
        <select class="form-select form-select-sm" [(ngModel)]="filtroStatus" (change)="filtrar()" style="width:auto;">
          <option value="">Todos os status</option>
          <option value="pendente">Pendente</option>
          <option value="em_analise">Em análise</option>
          <option value="respondido">Respondido</option>
          <option value="fechado">Fechado</option>
        </select>
      </div>

      <div class="alert alert-success alert-dismissible" *ngIf="mensagem">
        {{ mensagem }}
        <button class="btn-close" (click)="mensagem=''"></button>
      </div>

      <!-- DETALHE -->
      <div class="card border-0 shadow-sm mb-4" *ngIf="selecionado">
        <div class="card-header bg-white d-flex align-items-center justify-content-between">
          <h6 class="fw-bold text-navy mb-0">
            <i class="bi bi-file-earmark-text me-2 text-gold"></i>Orçamento de {{ selecionado.nome }}
          </h6>
          <button class="btn btn-sm btn-outline-secondary" (click)="selecionado = null">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <div class="card-body p-4">
          <div class="row g-3 mb-3">
            <div class="col-md-4"><strong>Nome:</strong> {{ selecionado.nome }}</div>
            <div class="col-md-4"><strong>E-mail:</strong> {{ selecionado.email }}</div>
            <div class="col-md-4"><strong>Telefone:</strong> {{ selecionado.telefone || 'Não informado' }}</div>
          </div>
          <div class="row g-3 mb-3">
            <div class="col-md-6">
              <strong>Área de Atuação:</strong>
              <span class="badge bg-navy ms-2">{{ selecionado.areaAtuacao }}</span>
            </div>
            <div class="col-md-6">
              <strong>Status:</strong>
              <span class="badge ms-2" [ngClass]="getBadgeClass(selecionado.status)">{{ selecionado.status }}</span>
            </div>
          </div>
          <div class="bg-light p-3 rounded mb-3">
            <strong>Descrição do caso:</strong>
            <p class="mb-0 mt-2">{{ selecionado.descricao }}</p>
          </div>
          <div class="mb-3">
            <strong>Recebido em:</strong> {{ selecionado.criadoEm | date:'dd/MM/yyyy HH:mm' }}
          </div>
          <div class="d-flex gap-2 flex-wrap">
            <button class="btn btn-sm btn-outline-warning" (click)="alterarStatus(selecionado, 'em_analise', true)">
              <i class="bi bi-clock me-1"></i>Em Análise
            </button>
            <button class="btn btn-sm btn-outline-primary" (click)="alterarStatus(selecionado, 'respondido', true)">
              <i class="bi bi-check2-circle me-1"></i>Respondido
            </button>
            <button class="btn btn-sm btn-outline-secondary" (click)="alterarStatus(selecionado, 'fechado', true)">
              <i class="bi bi-lock me-1"></i>Fechar
            </button>
            <a [href]="'mailto:' + selecionado.email + '?subject=Re: Orçamento - ' + selecionado.areaAtuacao" class="btn btn-sm btn-outline-info">
              <i class="bi bi-reply me-1"></i>Responder por E-mail
            </a>
          </div>
        </div>
      </div>

      <!-- TABELA -->
      <div class="card border-0 shadow-sm">
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover mb-0 align-middle">
              <thead class="table-light">
                <tr>
                  <th></th>
                  <th>Nome</th>
                  <th>Área</th>
                  <th>Descrição</th>
                  <th>Status</th>
                  <th>Data</th>
                  <th class="text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngIf="carregando">
                  <td colspan="7" class="text-center py-4">
                    <span class="spinner-border spinner-border-sm me-2"></span>Carregando...
                  </td>
                </tr>
                <tr *ngIf="!carregando && (result?.items?.length ?? 0) === 0">
                  <td colspan="7" class="text-center py-4 text-muted">Nenhum orçamento encontrado.</td>
                </tr>
                <tr *ngFor="let o of result?.items" [class.table-light]="o.lido" (click)="selecionar(o)" style="cursor:pointer">
                  <td>
                    <i class="bi bi-circle-fill small" [class.text-gold]="!o.lido" [class.text-muted]="o.lido"></i>
                  </td>
                  <td><div class="fw-semibold" [class.text-muted]="o.lido">{{ o.nome }}</div></td>
                  <td><span class="badge bg-navy">{{ o.areaAtuacao }}</span></td>
                  <td class="small text-muted" style="max-width:200px;">
                    <div class="text-truncate">{{ o.descricao }}</div>
                  </td>
                  <td>
                    <span class="badge" [ngClass]="getBadgeClass(o.status)">{{ o.status }}</span>
                  </td>
                  <td class="small text-muted">{{ o.criadoEm | date:'dd/MM/yyyy' }}</td>
                  <td class="text-center" (click)="$event.stopPropagation()">
                    <button class="btn btn-sm btn-outline-danger" (click)="deletar(o.id)" title="Excluir">
                      <i class="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="d-flex align-items-center justify-content-between p-3 border-top" *ngIf="result && result.totalPaginas > 1">
            <small class="text-muted">{{ result.total }} registros</small>
            <div class="d-flex gap-1">
              <button class="btn btn-sm btn-outline-secondary" [disabled]="pagina === 1" (click)="paginar(pagina - 1)">
                <i class="bi bi-chevron-left"></i>
              </button>
              <button class="btn btn-sm btn-outline-secondary" [disabled]="pagina >= result.totalPaginas" (click)="paginar(pagina + 1)">
                <i class="bi bi-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminOrcamentosComponent implements OnInit {
  result: PagedResult<Orcamento> | null = null;
  selecionado: Orcamento | null = null;
  carregando = false;
  mensagem = '';
  pagina = 1;
  filtroStatus = '';

  constructor(private service: OrcamentoService) {}

  ngOnInit(): void { this.carregar(); }

  carregar(): void {
    this.carregando = true;
    this.service.listar(this.pagina, 15, this.filtroStatus || undefined).subscribe({
      next: r => { this.result = r; this.carregando = false; },
      error: () => this.carregando = false
    });
  }

  filtrar(): void { this.pagina = 1; this.carregar(); }

  selecionar(o: Orcamento): void {
    this.selecionado = o;
    if (!o.lido) this.alterarStatus(o, o.status, true);
  }

  alterarStatus(o: Orcamento, status: string, lido: boolean): void {
    this.service.atualizarStatus(o.id, status, lido).subscribe({
      next: atualizado => {
        if (this.selecionado?.id === o.id) this.selecionado = atualizado;
        this.mensagem = 'Status atualizado!';
        this.carregar();
        setTimeout(() => this.mensagem = '', 3000);
      },
      error: () => {}
    });
  }

  deletar(id: number): void {
    if (confirm('Deseja excluir este orçamento?')) {
      this.service.deletar(id).subscribe({
        next: () => { this.mensagem = 'Orçamento excluído.'; this.carregar(); },
        error: () => {}
      });
    }
  }

  paginar(p: number): void { this.pagina = p; this.carregar(); }

  getBadgeClass(status: string): string {
    const map: Record<string, string> = {
      pendente: 'bg-warning text-dark',
      em_analise: 'bg-info text-white',
      respondido: 'bg-success',
      fechado: 'bg-secondary'
    };
    return map[status] || 'bg-secondary';
  }
}
