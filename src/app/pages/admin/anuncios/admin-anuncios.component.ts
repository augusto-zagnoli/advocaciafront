import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AnuncioService } from '../../../core/services/anuncio.service';
import { Anuncio, CreateAnuncio, PagedResult } from '../../../core/models/models';

@Component({
  selector: 'app-admin-anuncios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div>
      <div class="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 class="fw-bold text-navy mb-1">Anúncios</h4>
          <p class="text-muted mb-0">Gerencie os banners e conteúdos do site</p>
        </div>
        <button class="btn btn-gold" (click)="novoAnuncio()">
          <i class="bi bi-plus-circle me-2"></i>Novo Anúncio
        </button>
      </div>

      <!-- ALERTA -->
      <div class="alert alert-success alert-dismissible" *ngIf="mensagem">
        <i class="bi bi-check-circle me-2"></i>{{ mensagem }}
        <button type="button" class="btn-close" (click)="mensagem=''"></button>
      </div>

      <!-- FORMULÁRIO -->
      <div class="card border-0 shadow-sm mb-4" *ngIf="mostrarForm">
        <div class="card-header bg-white border-bottom">
          <h6 class="fw-bold text-navy mb-0">{{ editandoId ? 'Editar Anúncio' : 'Novo Anúncio' }}</h6>
        </div>
        <div class="card-body p-4">
          <form [formGroup]="form" (ngSubmit)="salvar()">
            <div class="row g-3">
              <div class="col-md-8">
                <label class="form-label fw-semibold">Título *</label>
                <input type="text" class="form-control" formControlName="titulo"
                       [class.is-invalid]="f['titulo'].touched && f['titulo'].invalid">
                <div class="invalid-feedback">Título é obrigatório</div>
              </div>
              <div class="col-md-4">
                <label class="form-label fw-semibold">Posição</label>
                <select class="form-select" formControlName="posicao">
                  <option value="banner_principal">Banner Principal</option>
                  <option value="destaque">Destaque</option>
                  <option value="sidebar">Barra Lateral</option>
                  <option value="rodape">Rodapé</option>
                  <option value="home">Home Geral</option>
                </select>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold">Subtítulo</label>
                <input type="text" class="form-control" formControlName="subtitulo">
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold">Texto do Botão</label>
                <input type="text" class="form-control" formControlName="textoBotao">
              </div>
              <div class="col-12">
                <label class="form-label fw-semibold">Descrição</label>
                <textarea class="form-control" formControlName="descricao" rows="3"></textarea>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold">URL da Imagem</label>
                <input type="text" class="form-control" formControlName="imagemUrl">
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold">Link de Destino</label>
                <input type="text" class="form-control" formControlName="linkDestino">
              </div>
              <div class="col-md-3">
                <label class="form-label fw-semibold">Ordem</label>
                <input type="number" class="form-control" formControlName="ordem">
              </div>
              <div class="col-md-3">
                <label class="form-label fw-semibold">Data Início</label>
                <input type="date" class="form-control" formControlName="dataInicio">
              </div>
              <div class="col-md-3">
                <label class="form-label fw-semibold">Data Fim</label>
                <input type="date" class="form-control" formControlName="dataFim">
              </div>
              <div class="col-md-3 d-flex align-items-end">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" formControlName="ativo" id="ativo">
                  <label class="form-check-label fw-semibold" for="ativo">Ativo</label>
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
                  <th>Título</th>
                  <th>Posição</th>
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
                <tr *ngIf="!carregando && (!result || result.items.length === 0)">
                  <td colspan="6" class="text-center py-4 text-muted">Nenhum anúncio cadastrado.</td>
                </tr>
                <tr *ngFor="let a of result?.items">
                  <td>
                    <div class="fw-semibold">{{ a.titulo }}</div>
                    <div class="small text-muted">{{ a.subtitulo }}</div>
                  </td>
                  <td><span class="badge bg-light text-dark">{{ a.posicao }}</span></td>
                  <td>{{ a.ordem }}</td>
                  <td>
                    <span class="badge" [class.bg-success]="a.ativo" [class.bg-secondary]="!a.ativo">
                      {{ a.ativo ? 'Ativo' : 'Inativo' }}
                    </span>
                  </td>
                  <td class="small text-muted">{{ a.criadoEm | date:'dd/MM/yyyy' }}</td>
                  <td class="text-center">
                    <button class="btn btn-sm btn-outline-primary me-1" (click)="editar(a)" title="Editar">
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" (click)="confirmarDeletar(a.id)" title="Excluir">
                      <i class="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- PAGINAÇÃO -->
          <div class="d-flex align-items-center justify-content-between p-3 border-top" *ngIf="result && result.totalPaginas > 1">
            <small class="text-muted">{{ result.total }} registros | Página {{ result.pagina }} de {{ result.totalPaginas }}</small>
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
export class AdminAnunciosComponent implements OnInit {
  result: PagedResult<Anuncio> | null = null;
  carregando = false;
  salvando = false;
  mostrarForm = false;
  editandoId: number | null = null;
  pagina = 1;
  mensagem = '';
  form;

  constructor(private fb: FormBuilder, private service: AnuncioService) {
    this.form = this.fb.group({
      titulo: ['', Validators.required],
      subtitulo: [''],
      descricao: [''],
      imagemUrl: [''],
      linkDestino: [''],
      textoBotao: [''],
      posicao: ['home'],
      ativo: [true],
      ordem: [0],
      dataInicio: [''],
      dataFim: ['']
    });
  }

  get f() { return this.form.controls; }

  ngOnInit(): void { this.carregar(); }

  carregar(): void {
    this.carregando = true;
    this.service.listar(this.pagina, 10).subscribe({
      next: r => { this.result = r; this.carregando = false; },
      error: () => this.carregando = false
    });
  }

  novoAnuncio(): void {
    this.form.reset({ ativo: true, ordem: 0, posicao: 'home' });
    this.editandoId = null;
    this.mostrarForm = true;
  }

  editar(a: Anuncio): void {
    this.editandoId = a.id;
    this.form.patchValue({
      titulo: a.titulo, subtitulo: a.subtitulo, descricao: a.descricao,
      imagemUrl: a.imagemUrl, linkDestino: a.linkDestino, textoBotao: a.textoBotao,
      posicao: a.posicao, ativo: a.ativo, ordem: a.ordem,
      dataInicio: a.dataInicio?.substring(0, 10),
      dataFim: a.dataFim?.substring(0, 10)
    });
    this.mostrarForm = true;
    window.scrollTo(0, 0);
  }

  salvar(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.salvando = true;
    const dto = this.form.value as CreateAnuncio;
    const obs = this.editandoId
      ? this.service.atualizar(this.editandoId, dto)
      : this.service.criar(dto);
    obs.subscribe({
      next: () => {
        this.mensagem = this.editandoId ? 'Anúncio atualizado com sucesso!' : 'Anúncio criado com sucesso!';
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
    this.form.reset({ ativo: true, ordem: 0, posicao: 'home' });
  }

  confirmarDeletar(id: number): void {
    if (confirm('Deseja excluir este anúncio?')) {
      this.service.deletar(id).subscribe({
        next: () => { this.mensagem = 'Anúncio excluído.'; this.carregar(); },
        error: () => {}
      });
    }
  }

  paginar(p: number): void { this.pagina = p; this.carregar(); }
}
