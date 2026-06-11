import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ImagemHeroService } from '../../../core/services/site.service';
import { ImagemHero, CreateImagemHero } from '../../../core/models/models';

@Component({
  selector: 'app-admin-imagem-hero',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <div class="mb-4">
        <h4 class="fw-bold text-navy mb-1">Imagem do Destaque (Home)</h4>
        <p class="text-muted mb-0">Gerencie a imagem exibida no componente circular da página inicial</p>
      </div>

      <div class="alert alert-success alert-dismissible" *ngIf="mensagem">
        <i class="bi bi-check-circle me-2"></i>{{ mensagem }}
        <button type="button" class="btn-close" (click)="mensagem=''"></button>
      </div>

      <div class="alert alert-danger alert-dismissible" *ngIf="erro">
        <i class="bi bi-exclamation-triangle me-2"></i>{{ erro }}
        <button type="button" class="btn-close" (click)="erro=''"></button>
      </div>

      <div class="card border-0 shadow-sm mb-4">
        <div class="card-header bg-white border-bottom">
          <h6 class="fw-bold text-navy mb-0"><i class="bi bi-image me-2"></i>Imagem em Destaque</h6>
        </div>
        <div class="card-body p-4">
          <div class="row align-items-center g-3">
            <div class="col-md-3 text-center">
              <div class="rounded-circle d-inline-flex align-items-center justify-content-center overflow-hidden border"
                   style="width:140px; height:140px; background:#f8f9fa;">
                <img *ngIf="preview" [src]="preview" alt="Imagem em Destaque"
                     style="width:100%; height:100%; object-fit:cover;">
                <i *ngIf="!preview" class="bi bi-balance-scale" style="font-size:4rem; color:#c9a064;"></i>
              </div>
            </div>
            <div class="col-md-9">
              <label class="form-label fw-semibold">Imagem</label>
              <input type="file" class="form-control" accept="image/*" (change)="onImagemSelecionada($event)">
              <small class="text-muted d-block mt-1">Formatos aceitos: JPG, PNG ou WEBP — tamanho máximo de 8MB. A imagem será redimensionada automaticamente.</small>
              <div class="text-danger small mt-1" *ngIf="erroImagem">{{ erroImagem }}</div>
              <div class="mt-3">
                <button type="button" class="btn btn-gold" [disabled]="salvando || !imagemAlterada" (click)="salvar()">
                  <span *ngIf="salvando" class="spinner-border spinner-border-sm me-1"></span>
                  {{ salvando ? 'Salvando...' : 'Salvar Imagem' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminImagemHeroComponent implements OnInit {
  carregando = false;
  salvando = false;
  mensagem = '';
  erro = '';
  preview = '';
  imagemAlterada = false;
  erroImagem = '';
  imagemAtual: ImagemHero | null = null;

  private readonly MAX_IMAGEM_BYTES = 8 * 1024 * 1024;
  private readonly MAX_IMAGEM_DIMENSAO = 800;

  constructor(private service: ImagemHeroService) {}

  ngOnInit(): void { this.carregar(); }

  carregar(): void {
    this.carregando = true;
    this.service.listarTodos().subscribe({
      next: items => {
        this.imagemAtual = items[0] || null;
        this.preview = this.imagemAtual?.imagemUrl || '';
        this.imagemAlterada = false;
        this.carregando = false;
      },
      error: () => this.carregando = false
    });
  }

  async onImagemSelecionada(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.erroImagem = '';

    if (!file.type.startsWith('image/')) {
      this.erroImagem = 'Selecione um arquivo de imagem válido.';
      input.value = '';
      return;
    }
    if (file.size > this.MAX_IMAGEM_BYTES) {
      this.erroImagem = 'A imagem deve ter no máximo 8MB.';
      input.value = '';
      return;
    }

    try {
      this.preview = await this.redimensionarImagem(file);
      this.imagemAlterada = true;
    } catch {
      this.erroImagem = 'Não foi possível processar a imagem selecionada.';
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
          if (width > this.MAX_IMAGEM_DIMENSAO || height > this.MAX_IMAGEM_DIMENSAO) {
            if (width > height) {
              height = Math.round(height * (this.MAX_IMAGEM_DIMENSAO / width));
              width = this.MAX_IMAGEM_DIMENSAO;
            } else {
              width = Math.round(width * (this.MAX_IMAGEM_DIMENSAO / height));
              height = this.MAX_IMAGEM_DIMENSAO;
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

  salvar(): void {
    this.salvando = true;
    const dto: CreateImagemHero = {
      imagemUrl: this.preview,
      ativo: true
    };
    const request = this.imagemAtual
      ? this.service.atualizar(this.imagemAtual.id, dto)
      : this.service.criar(dto);

    request.subscribe({
      next: item => {
        this.imagemAtual = item;
        this.mensagem = 'Imagem atualizada com sucesso!';
        this.imagemAlterada = false;
        this.salvando = false;
      },
      error: (err: HttpErrorResponse) => {
        this.erro = err.error?.message || 'Erro ao salvar a imagem.';
        this.salvando = false;
      }
    });
  }
}
