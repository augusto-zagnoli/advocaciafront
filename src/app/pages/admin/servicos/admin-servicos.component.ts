import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ServicoService } from '../../../core/services/site.service';
import { Servico, CreateServico } from '../../../core/models/models';

@Component({
  selector: 'app-admin-servicos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div>
      <div class="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 class="fw-bold text-navy mb-1">Serviços</h4>
          <p class="text-muted mb-0">Gerencie os serviços de advocacia e consultoria</p>
        </div>
        <button class="btn btn-gold" (click)="novo()">
          <i class="bi bi-plus-circle me-2"></i>Novo Serviço
        </button>
      </div>

      <div class="alert alert-success alert-dismissible" *ngIf="mensagem">
        <i class="bi bi-check-circle me-2"></i>{{ mensagem }}
        <button type="button" class="btn-close" (click)="mensagem=''"></button>
      </div>

      <!-- FORMULÁRIO -->
      <div class="card border-0 shadow-sm mb-4" *ngIf="mostrarForm">
        <div class="card-header bg-white border-bottom">
          <h6 class="fw-bold text-navy mb-0">{{ editandoId ? 'Editar' : 'Novo' }} Serviço</h6>
        </div>
        <div class="card-body p-4">
          <form [formGroup]="form" (ngSubmit)="salvar()">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label fw-semibold">Título *</label>
                <input type="text" class="form-control" formControlName="titulo"
                       [class.is-invalid]="f['titulo'].touched && f['titulo'].invalid">
                <div class="invalid-feedback">Título é obrigatório</div>
              </div>
              <div class="col-md-3">
                <label class="form-label fw-semibold">Ícone</label>
                <div class="dropdown">
                  <button class="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-between" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <span>
                      <i class="bi {{ f['icone'].value || 'bi-question-circle' }} me-2 text-gold fs-5"></i>
                      {{ f['icone'].value || 'Selecionar ícone' }}
                    </span>
                    <i class="bi bi-chevron-down small"></i>
                  </button>
                  <ul class="dropdown-menu w-100 p-2" style="max-height: 320px; overflow-y: auto;">
                    <li>
                      <button type="button" class="dropdown-item d-flex align-items-center gap-2" (click)="selecionarIcone('')">
                        <i class="bi bi-slash-circle fs-5 text-muted"></i>
                        <span class="small">Sem ícone</span>
                      </button>
                    </li>
                    <li><hr class="dropdown-divider"></li>
                    <li *ngFor="let ic of iconesDisponiveis">
                      <button type="button" class="dropdown-item d-flex align-items-center gap-2"
                              [class.active]="f['icone'].value === ic"
                              (click)="selecionarIcone(ic)">
                        <i class="bi {{ ic }} fs-5 text-gold"></i>
                        <span class="small">{{ ic }}</span>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="col-md-3">
                <label class="form-label fw-semibold">Subtítulo</label>
                <input type="text" class="form-control" formControlName="subtitulo">
              </div>
              <div class="col-12">
                <label class="form-label fw-semibold">Descrição *</label>
                <textarea class="form-control" formControlName="descricao" rows="4"
                          [class.is-invalid]="f['descricao'].touched && f['descricao'].invalid"></textarea>
                <div class="invalid-feedback">Descrição é obrigatória</div>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold">URL da Imagem</label>
                <input type="text" class="form-control" formControlName="imagemUrl">
              </div>
              <div class="col-md-3">
                <label class="form-label fw-semibold">Ordem</label>
                <input type="number" class="form-control" formControlName="ordem">
              </div>
              <div class="col-md-3 d-flex align-items-end">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" formControlName="ativo" id="ativoServ">
                  <label class="form-check-label fw-semibold" for="ativoServ">Ativo</label>
                </div>
              </div>
            </div>
            <div class="d-flex gap-2 mt-3">
              <button type="submit" class="btn btn-gold" [disabled]="salvando">
                <span *ngIf="salvando" class="spinner-border spinner-border-sm me-2"></span>
                {{ salvando ? 'Salvando...' : 'Salvar' }}
              </button>
              <button type="button" class="btn btn-outline-secondary" (click)="cancelar()">Cancelar</button>
            </div>
          </form>
        </div>
      </div>

      <!-- LISTA -->
      <div class="card border-0 shadow-sm">
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover mb-0 align-middle">
              <thead class="table-light">
                <tr>
                  <th>Ícone</th>
                  <th>Título</th>
                  <th>Ordem</th>
                  <th>Status</th>
                  <th>Criado em</th>
                  <th class="text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngIf="carregando">
                  <td colspan="6" class="text-center py-4">
                    <span class="spinner-border spinner-border-sm me-2"></span>Carregando...
                  </td>
                </tr>
                <tr *ngIf="!carregando && items.length === 0">
                  <td colspan="6" class="text-center py-4 text-muted">Nenhum serviço cadastrado.</td>
                </tr>
                <tr *ngFor="let item of items">
                  <td><i class="bi {{ item.icone || 'bi-briefcase' }} text-gold fs-5"></i></td>
                  <td>
                    <div class="fw-semibold">{{ item.titulo }}</div>
                    <div class="small text-muted text-truncate" style="max-width:300px">{{ item.descricao }}</div>
                  </td>
                  <td>{{ item.ordem }}</td>
                  <td>
                    <span class="badge" [class.bg-success]="item.ativo" [class.bg-secondary]="!item.ativo">
                      {{ item.ativo ? 'Ativo' : 'Inativo' }}
                    </span>
                  </td>
                  <td class="small text-muted">{{ item.criadoEm | date:'dd/MM/yyyy' }}</td>
                  <td class="text-center">
                    <button class="btn btn-sm btn-outline-primary me-1" (click)="editar(item)" title="Editar">
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" (click)="confirmarDeletar(item.id)" title="Excluir">
                      <i class="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminServicosComponent implements OnInit {
  items: Servico[] = [];
  carregando = false;
  salvando = false;
  mostrarForm = false;
  editandoId: number | null = null;
  mensagem = '';
  form;

  readonly iconesDisponiveis: string[] = [
    'bi-people-fill', 'bi-briefcase-fill', 'bi-file-earmark-text-fill', 'bi-shield-check',
    'bi-house-fill', 'bi-bag-check-fill', 'bi-bank', 'bi-bank2', 'bi-building', 'bi-buildings-fill',
    'bi-cash-coin', 'bi-graph-up-arrow', 'bi-journal-text', 'bi-clipboard-check', 'bi-award-fill',
    'bi-globe', 'bi-heart-pulse', 'bi-car-front-fill', 'bi-file-earmark-lock-fill', 'bi-bookmark-check-fill',
    'bi-person-badge-fill', 'bi-person-vcard-fill', 'bi-hammer', 'bi-file-earmark-medical', 'bi-prescription2',
    'bi-folder2-open', 'bi-archive-fill', 'bi-calendar-check-fill', 'bi-chat-left-text-fill',
    'bi-megaphone-fill', 'bi-patch-check-fill', 'bi-vector-pen', 'bi-lightbulb', 'bi-gear-fill'
  ];

  constructor(private fb: FormBuilder, private service: ServicoService) {
    this.form = this.fb.group({
      titulo: ['', Validators.required],
      subtitulo: [''],
      descricao: ['', Validators.required],
      icone: [''],
      imagemUrl: [''],
      ordem: [0],
      ativo: [true]
    });
  }

  get f() { return this.form.controls; }

  selecionarIcone(icone: string): void {
    this.form.get('icone')?.setValue(icone);
  }

  ngOnInit(): void { this.carregar(); }

  carregar(): void {
    this.carregando = true;
    this.service.listarTodos().subscribe({
      next: r => { this.items = r; this.carregando = false; },
      error: () => this.carregando = false
    });
  }

  novo(): void {
    this.form.reset({ ativo: true, ordem: 0 });
    this.editandoId = null;
    this.mostrarForm = true;
  }

  editar(item: Servico): void {
    this.editandoId = item.id;
    this.form.patchValue({
      titulo: item.titulo, subtitulo: item.subtitulo, descricao: item.descricao,
      icone: item.icone, imagemUrl: item.imagemUrl, ordem: item.ordem, ativo: item.ativo
    });
    this.mostrarForm = true;
    window.scrollTo(0, 0);
  }

  salvar(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.salvando = true;
    const dto = this.form.value as CreateServico;
    const obs = this.editandoId
      ? this.service.atualizar(this.editandoId, dto)
      : this.service.criar(dto);
    obs.subscribe({
      next: () => {
        this.mensagem = this.editandoId ? 'Serviço atualizado!' : 'Serviço criado!';
        this.cancelar();
        this.carregar();
        this.salvando = false;
      },
      error: () => this.salvando = false
    });
  }

  cancelar(): void {
    this.mostrarForm = false;
    this.editandoId = null;
    this.form.reset({ ativo: true, ordem: 0 });
  }

  confirmarDeletar(id: number): void {
    if (confirm('Deseja excluir este serviço?')) {
      this.service.deletar(id).subscribe({
        next: () => { this.mensagem = 'Serviço excluído.'; this.carregar(); },
        error: () => {}
      });
    }
  }
}
