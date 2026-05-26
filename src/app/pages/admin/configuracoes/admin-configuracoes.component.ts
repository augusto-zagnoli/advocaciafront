import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ConfiguracaoSiteService } from '../../../core/services/site.service';
import { ConfiguracaoSite, CreateConfiguracaoSite } from '../../../core/models/models';

@Component({
  selector: 'app-admin-configuracoes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div>
      <div class="mb-4">
        <h4 class="fw-bold text-navy mb-1">Configurações do Site</h4>
        <p class="text-muted mb-0">Gerencie configurações gerais como foto da doutora, contatos e dados globais</p>
      </div>

      <div class="alert alert-success alert-dismissible" *ngIf="mensagem">
        <i class="bi bi-check-circle me-2"></i>{{ mensagem }}
        <button type="button" class="btn-close" (click)="mensagem=''"></button>
      </div>

      <!-- FOTO DA DOUTORA -->
      <div class="card border-0 shadow-sm mb-4">
        <div class="card-header bg-white border-bottom">
          <h6 class="fw-bold text-navy mb-0"><i class="bi bi-person-badge me-2"></i>Foto da Doutora Gabriela</h6>
        </div>
        <div class="card-body p-4">
          <div class="row align-items-center g-3">
            <div class="col-md-3 text-center">
              <div class="rounded-circle d-inline-flex align-items-center justify-content-center overflow-hidden border"
                   style="width:140px; height:140px; background:#f8f9fa;">
                <img *ngIf="fotoDoutora" [src]="fotoDoutora" alt="Foto da Doutora"
                     style="width:100%; height:100%; object-fit:cover;">
                <i *ngIf="!fotoDoutora" class="bi bi-person-badge" style="font-size:4rem; color:#c9a064;"></i>
              </div>
            </div>
            <div class="col-md-9">
              <form [formGroup]="fotoForm" (ngSubmit)="salvarFoto()">
                <label class="form-label fw-semibold">URL da Foto</label>
                <div class="input-group">
                  <input type="text" class="form-control" formControlName="valor" placeholder="https://exemplo.com/foto.jpg">
                  <button type="submit" class="btn btn-gold" [disabled]="salvandoFoto">
                    <span *ngIf="salvandoFoto" class="spinner-border spinner-border-sm me-1"></span>
                    {{ salvandoFoto ? 'Salvando...' : 'Salvar Foto' }}
                  </button>
                </div>
                <small class="text-muted">Insira a URL de uma imagem hospedada externamente</small>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- OUTRAS CONFIGURAÇÕES -->
      <div class="card border-0 shadow-sm mb-4">
        <div class="card-header bg-white border-bottom d-flex align-items-center justify-content-between">
          <h6 class="fw-bold text-navy mb-0"><i class="bi bi-gear me-2"></i>Configurações Gerais</h6>
          <button class="btn btn-sm btn-gold" (click)="novaConfig()">
            <i class="bi bi-plus-circle me-1"></i>Nova Configuração
          </button>
        </div>
        <div class="card-body p-4" *ngIf="mostrarFormConfig">
          <form [formGroup]="configForm" (ngSubmit)="salvarConfig()">
            <div class="row g-3">
              <div class="col-md-4">
                <label class="form-label fw-semibold">Chave *</label>
                <input type="text" class="form-control" formControlName="chave"
                       [class.is-invalid]="configForm.get('chave')?.touched && configForm.get('chave')?.invalid">
                <div class="invalid-feedback">Chave é obrigatória</div>
              </div>
              <div class="col-md-4">
                <label class="form-label fw-semibold">Valor *</label>
                <input type="text" class="form-control" formControlName="valor"
                       [class.is-invalid]="configForm.get('valor')?.touched && configForm.get('valor')?.invalid">
                <div class="invalid-feedback">Valor é obrigatório</div>
              </div>
              <div class="col-md-4">
                <label class="form-label fw-semibold">Descrição</label>
                <input type="text" class="form-control" formControlName="descricao">
              </div>
            </div>
            <div class="d-flex gap-2 mt-3">
              <button type="submit" class="btn btn-gold" [disabled]="salvandoConfig">
                <span *ngIf="salvandoConfig" class="spinner-border spinner-border-sm me-1"></span>
                {{ salvandoConfig ? 'Salvando...' : 'Salvar' }}
              </button>
              <button type="button" class="btn btn-outline-secondary" (click)="mostrarFormConfig=false">Cancelar</button>
            </div>
          </form>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover mb-0 align-middle">
              <thead class="table-light">
                <tr>
                  <th>Chave</th>
                  <th>Valor</th>
                  <th>Descrição</th>
                  <th>Atualizado</th>
                  <th class="text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngIf="carregando">
                  <td colspan="5" class="text-center py-4">
                    <span class="spinner-border spinner-border-sm me-2"></span>Carregando...
                  </td>
                </tr>
                <tr *ngIf="!carregando && configuracoes.length === 0">
                  <td colspan="5" class="text-center py-4 text-muted">Nenhuma configuração cadastrada.</td>
                </tr>
                <tr *ngFor="let cfg of configuracoes">
                  <td><code>{{ cfg.chave }}</code></td>
                  <td class="text-truncate" style="max-width: 250px;">{{ cfg.valor }}</td>
                  <td class="small text-muted">{{ cfg.descricao }}</td>
                  <td class="small text-muted">{{ cfg.atualizadoEm | date:'dd/MM/yyyy HH:mm' }}</td>
                  <td class="text-center">
                    <button class="btn btn-sm btn-outline-primary me-1" (click)="editarConfig(cfg)" title="Editar">
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" (click)="confirmarDeletar(cfg.id)" title="Excluir">
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
export class AdminConfiguracoesComponent implements OnInit {
  configuracoes: ConfiguracaoSite[] = [];
  carregando = false;
  salvandoFoto = false;
  salvandoConfig = false;
  mostrarFormConfig = false;
  mensagem = '';
  fotoDoutora = '';

  fotoForm;
  configForm;

  constructor(private fb: FormBuilder, private service: ConfiguracaoSiteService) {
    this.fotoForm = this.fb.group({ valor: [''] });
    this.configForm = this.fb.group({
      chave: ['', Validators.required],
      valor: ['', Validators.required],
      descricao: ['']
    });
  }

  ngOnInit(): void { this.carregar(); }

  carregar(): void {
    this.carregando = true;
    this.service.listar().subscribe({
      next: items => {
        this.configuracoes = items;
        const foto = items.find(c => c.chave === 'foto_doutora');
        this.fotoDoutora = foto?.valor || '';
        this.fotoForm.patchValue({ valor: this.fotoDoutora });
        this.carregando = false;
      },
      error: () => this.carregando = false
    });
  }

  salvarFoto(): void {
    this.salvandoFoto = true;
    const dto: CreateConfiguracaoSite = {
      chave: 'foto_doutora',
      valor: this.fotoForm.value.valor || '',
      descricao: 'URL da foto principal da Dra. Gabriela'
    };
    this.service.salvar(dto).subscribe({
      next: () => {
        this.mensagem = 'Foto atualizada com sucesso!';
        this.fotoDoutora = dto.valor;
        this.carregar();
        this.salvandoFoto = false;
      },
      error: () => this.salvandoFoto = false
    });
  }

  novaConfig(): void {
    this.configForm.reset();
    this.mostrarFormConfig = true;
  }

  editarConfig(cfg: ConfiguracaoSite): void {
    this.configForm.patchValue({ chave: cfg.chave, valor: cfg.valor, descricao: cfg.descricao });
    this.mostrarFormConfig = true;
    window.scrollTo(0, 0);
  }

  salvarConfig(): void {
    if (this.configForm.invalid) { this.configForm.markAllAsTouched(); return; }
    this.salvandoConfig = true;
    const dto = this.configForm.value as CreateConfiguracaoSite;
    this.service.salvar(dto).subscribe({
      next: () => {
        this.mensagem = 'Configuração salva!';
        this.mostrarFormConfig = false;
        this.configForm.reset();
        this.carregar();
        this.salvandoConfig = false;
      },
      error: () => this.salvandoConfig = false
    });
  }

  confirmarDeletar(id: number): void {
    if (confirm('Deseja excluir esta configuração?')) {
      this.service.deletar(id).subscribe({
        next: () => { this.mensagem = 'Configuração excluída.'; this.carregar(); },
        error: () => {}
      });
    }
  }
}
