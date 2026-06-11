import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
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

      <div class="alert alert-danger alert-dismissible" *ngIf="erro">
        <i class="bi bi-exclamation-triangle me-2"></i>{{ erro }}
        <button type="button" class="btn-close" (click)="erro=''"></button>
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
                <img *ngIf="previewFoto" [src]="previewFoto" alt="Foto da Doutora"
                     style="width:100%; height:100%; object-fit:cover;">
                <i *ngIf="!previewFoto" class="bi bi-person-badge" style="font-size:4rem; color:#c9a064;"></i>
              </div>
            </div>
            <div class="col-md-9">
              <label class="form-label fw-semibold">Foto</label>
              <input type="file" class="form-control" accept="image/*" (change)="onFotoSelecionada($event)">
              <small class="text-muted d-block mt-1">Formatos aceitos: JPG, PNG ou WEBP — tamanho máximo de 8MB. A imagem será redimensionada automaticamente.</small>
              <div class="text-danger small mt-1" *ngIf="erroFoto">{{ erroFoto }}</div>
              <div class="mt-3">
                <button type="button" class="btn btn-gold" [disabled]="salvandoFoto || !fotoAlterada" (click)="salvarFoto()">
                  <span *ngIf="salvandoFoto" class="spinner-border spinner-border-sm me-1"></span>
                  {{ salvandoFoto ? 'Salvando...' : 'Salvar Foto' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- WHATSAPP -->
      <div class="card border-0 shadow-sm mb-4">
        <div class="card-header bg-white border-bottom">
          <h6 class="fw-bold text-navy mb-0"><i class="bi bi-whatsapp me-2"></i>Número do WhatsApp</h6>
        </div>
        <div class="card-body p-4">
          <div class="row align-items-end g-3">
            <div class="col-md-6">
              <label class="form-label fw-semibold">Número (DDI + DDD + número, somente dígitos)</label>
              <input type="text" class="form-control" [value]="whatsapp" (input)="onWhatsappInput($event)"
                     placeholder="Ex: 5511999990000" maxlength="15">
              <small class="text-muted d-block mt-1">Esse número será usado nos botões de WhatsApp do site. Ex: 55 (Brasil) + 11 (DDD) + 999990000.</small>
              <div class="text-danger small mt-1" *ngIf="erroWhatsapp">{{ erroWhatsapp }}</div>
            </div>
            <div class="col-md-6">
              <button type="button" class="btn btn-gold" [disabled]="salvandoWhatsapp || !whatsappAlterado" (click)="salvarWhatsapp()">
                <span *ngIf="salvandoWhatsapp" class="spinner-border spinner-border-sm me-1"></span>
                {{ salvandoWhatsapp ? 'Salvando...' : 'Salvar Número' }}
              </button>
              <a *ngIf="whatsapp" [href]="'https://wa.me/' + whatsapp" target="_blank" rel="noopener" class="btn btn-outline-success ms-2">
                <i class="bi bi-whatsapp me-1"></i>Testar
              </a>
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
                <tr *ngIf="!carregando && configuracoesExibidas.length === 0">
                  <td colspan="5" class="text-center py-4 text-muted">Nenhuma configuração cadastrada.</td>
                </tr>
                <tr *ngFor="let cfg of configuracoesExibidas">
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
  erro = '';
  fotoDoutora = '';
  previewFoto = '';
  fotoAlterada = false;
  erroFoto = '';

  salvandoWhatsapp = false;
  whatsapp = '';
  whatsappOriginal = '';
  whatsappAlterado = false;
  erroWhatsapp = '';

  private readonly MAX_FOTO_BYTES = 8 * 1024 * 1024;
  private readonly MAX_FOTO_DIMENSAO = 800;

  configForm;

  get configuracoesExibidas(): ConfiguracaoSite[] {
    return this.configuracoes.filter(c => c.chave !== 'foto_doutora' && c.chave !== 'telefone_whatsapp');
  }

  constructor(private fb: FormBuilder, private service: ConfiguracaoSiteService) {
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
        this.previewFoto = this.fotoDoutora;
        this.fotoAlterada = false;
        const wpp = items.find(c => c.chave === 'telefone_whatsapp');
        this.whatsapp = wpp?.valor || '';
        this.whatsappOriginal = this.whatsapp;
        this.whatsappAlterado = false;
        this.carregando = false;
      },
      error: () => this.carregando = false
    });
  }

  async onFotoSelecionada(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.erroFoto = '';

    if (!file.type.startsWith('image/')) {
      this.erroFoto = 'Selecione um arquivo de imagem válido.';
      input.value = '';
      return;
    }
    if (file.size > this.MAX_FOTO_BYTES) {
      this.erroFoto = 'A imagem deve ter no máximo 8MB.';
      input.value = '';
      return;
    }

    try {
      this.previewFoto = await this.redimensionarImagem(file);
      this.fotoAlterada = true;
    } catch {
      this.erroFoto = 'Não foi possível processar a imagem selecionada.';
      input.value = '';
    }
  }

  private redimensionarImagem(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          let { width, height } = img;
          if (width > this.MAX_FOTO_DIMENSAO || height > this.MAX_FOTO_DIMENSAO) {
            if (width > height) {
              height = Math.round(height * (this.MAX_FOTO_DIMENSAO / width));
              width = this.MAX_FOTO_DIMENSAO;
            } else {
              width = Math.round(width * (this.MAX_FOTO_DIMENSAO / height));
              height = this.MAX_FOTO_DIMENSAO;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) { reject(new Error('Canvas não suportado')); return; }
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.85));
        };
        img.onerror = () => reject(new Error('Falha ao carregar imagem'));
        img.src = reader.result as string;
      };
      reader.onerror = () => reject(new Error('Falha ao ler arquivo'));
      reader.readAsDataURL(file);
    });
  }

  salvarFoto(): void {
    this.salvandoFoto = true;
    const dto: CreateConfiguracaoSite = {
      chave: 'foto_doutora',
      valor: this.previewFoto,
      descricao: 'Foto principal da Dra. Gabriela'
    };
    this.service.salvar(dto).subscribe({
      next: () => {
        this.mensagem = 'Foto atualizada com sucesso!';
        this.fotoDoutora = this.previewFoto;
        this.fotoAlterada = false;
        this.salvandoFoto = false;
      },
      error: (err: HttpErrorResponse) => {
        this.erro = err.error?.message || 'Erro ao salvar a foto.';
        this.salvandoFoto = false;
      }
    });
  }

  onWhatsappInput(event: Event): void {
    const valor = (event.target as HTMLInputElement).value.replace(/\D/g, '');
    this.whatsapp = valor;
    this.whatsappAlterado = this.whatsapp !== this.whatsappOriginal;
    this.erroWhatsapp = '';
  }

  salvarWhatsapp(): void {
    if (!/^\d{10,15}$/.test(this.whatsapp)) {
      this.erroWhatsapp = 'Informe um número válido com DDI + DDD + número (10 a 15 dígitos).';
      return;
    }
    this.salvandoWhatsapp = true;
    const dto: CreateConfiguracaoSite = {
      chave: 'telefone_whatsapp',
      valor: this.whatsapp,
      descricao: 'Número do WhatsApp para contato'
    };
    this.service.salvar(dto).subscribe({
      next: () => {
        this.mensagem = 'Número do WhatsApp atualizado com sucesso!';
        this.whatsappOriginal = this.whatsapp;
        this.whatsappAlterado = false;
        this.salvandoWhatsapp = false;
      },
      error: (err: HttpErrorResponse) => {
        this.erro = err.error?.message || 'Erro ao salvar o número do WhatsApp.';
        this.salvandoWhatsapp = false;
      }
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
      error: (err: HttpErrorResponse) => {
        this.erro = err.error?.message || 'Erro ao salvar a configuração.';
        this.salvandoConfig = false;
      }
    });
  }

  confirmarDeletar(id: number): void {
    if (confirm('Deseja excluir esta configuração?')) {
      this.service.deletar(id).subscribe({
        next: () => { this.mensagem = 'Configuração excluída.'; this.carregar(); },
        error: (err: HttpErrorResponse) => {
          this.erro = err.error?.message || 'Erro ao excluir a configuração.';
        }
      });
    }
  }
}
