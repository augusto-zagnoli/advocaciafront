import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { SobreDoutoraService } from '../../../core/services/site.service';
import { SobreDoutora, CreateSobreDoutora } from '../../../core/models/models';

@Component({
  selector: 'app-admin-sobre-doutora',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div>
      <div class="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 class="fw-bold text-navy mb-1">Sobre a Doutora</h4>
          <p class="text-muted mb-0">Gerencie o conteúdo sobre a Dra. Gabriela</p>
        </div>
        <button class="btn btn-gold" (click)="novo()">
          <i class="bi bi-plus-circle me-2"></i>Novo Conteúdo
        </button>
      </div>

      <div class="alert alert-success alert-dismissible" *ngIf="mensagem">
        <i class="bi bi-check-circle me-2"></i>{{ mensagem }}
        <button type="button" class="btn-close" (click)="mensagem=''"></button>
      </div>

      <!-- FORMULÁRIO -->
      <div class="card border-0 shadow-sm mb-4" *ngIf="mostrarForm">
        <div class="card-header bg-white border-bottom">
          <h6 class="fw-bold text-navy mb-0">{{ editandoId ? 'Editar' : 'Novo' }} Conteúdo</h6>
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
              <div class="col-md-6">
                <label class="form-label fw-semibold">Subtítulo</label>
                <input type="text" class="form-control" formControlName="subtitulo">
              </div>
              <div class="col-12">
                <label class="form-label fw-semibold">Descrição *</label>
                <textarea class="form-control" formControlName="descricao" rows="6"
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
                  <input class="form-check-input" type="checkbox" formControlName="ativo" id="ativoSD">
                  <label class="form-check-label fw-semibold" for="ativoSD">Ativo</label>
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
                  <th>Ordem</th>
                  <th>Status</th>
                  <th>Criado em</th>
                  <th class="text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngIf="carregando">
                  <td colspan="5" class="text-center py-4">
                    <span class="spinner-border spinner-border-sm me-2"></span>Carregando...
                  </td>
                </tr>
                <tr *ngIf="!carregando && items.length === 0">
                  <td colspan="5" class="text-center py-4 text-muted">Nenhum conteúdo cadastrado.</td>
                </tr>
                <tr *ngFor="let item of items">
                  <td>
                    <div class="fw-semibold">{{ item.titulo }}</div>
                    <div class="small text-muted">{{ item.subtitulo }}</div>
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
export class AdminSobreDoutoraComponent implements OnInit {
  items: SobreDoutora[] = [];
  carregando = false;
  salvando = false;
  mostrarForm = false;
  editandoId: number | null = null;
  mensagem = '';
  form;

  constructor(private fb: FormBuilder, private service: SobreDoutoraService) {
    this.form = this.fb.group({
      titulo: ['', Validators.required],
      subtitulo: [''],
      descricao: ['', Validators.required],
      imagemUrl: [''],
      ordem: [0],
      ativo: [true]
    });
  }

  get f() { return this.form.controls; }

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

  editar(item: SobreDoutora): void {
    this.editandoId = item.id;
    this.form.patchValue({
      titulo: item.titulo, subtitulo: item.subtitulo, descricao: item.descricao,
      imagemUrl: item.imagemUrl, ordem: item.ordem, ativo: item.ativo
    });
    this.mostrarForm = true;
    window.scrollTo(0, 0);
  }

  salvar(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.salvando = true;
    const dto = this.form.value as CreateSobreDoutora;
    const obs = this.editandoId
      ? this.service.atualizar(this.editandoId, dto)
      : this.service.criar(dto);
    obs.subscribe({
      next: () => {
        this.mensagem = this.editandoId ? 'Conteúdo atualizado!' : 'Conteúdo criado!';
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
    if (confirm('Deseja excluir este conteúdo?')) {
      this.service.deletar(id).subscribe({
        next: () => { this.mensagem = 'Conteúdo excluído.'; this.carregar(); },
        error: () => {}
      });
    }
  }
}
