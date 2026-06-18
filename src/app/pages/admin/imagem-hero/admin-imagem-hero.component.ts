import { Component, NgZone, OnInit } from '@angular/core';
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
          <div class="row g-4 align-items-start">

            <!-- Prévia circular com drag -->
            <div class="col-md-4 text-center">
              <p class="small fw-semibold text-muted mb-2">PRÉVIA — {{ imagemExibida ? 'arraste para posicionar' : 'nenhuma imagem' }}</p>

              <div class="rounded-circle overflow-hidden mx-auto border border-2"
                   style="width:200px; height:200px; border-color:#c9a064 !important; background:#f0ede8;"
                   [style.cursor]="imagemExibida ? (isDragging ? 'grabbing' : 'grab') : 'default'"
                   (mousedown)="iniciarArrastar($event)">
                <img *ngIf="imagemExibida"
                     [src]="imagemExibida"
                     draggable="false"
                     style="width:100%; height:100%; object-fit:cover; display:block; pointer-events:none; user-select:none;"
                     [style.object-position]="posicaoCss">
                <div *ngIf="!imagemExibida"
                     class="w-100 h-100 d-flex align-items-center justify-content-center">
                  <i class="bi bi-balance-scale" style="font-size:4rem; color:#c9a064;"></i>
                </div>
              </div>

              <div *ngIf="imagemExibida" class="mt-3 d-flex gap-2 justify-content-center">
                <button type="button" class="btn btn-sm btn-outline-secondary" (click)="centralizar()" title="Centralizar imagem">
                  <i class="bi bi-arrows-fullscreen me-1"></i>Centralizar
                </button>
              </div>
              <p *ngIf="imagemExibida" class="small text-muted mt-2 mb-0">
                <i class="bi bi-info-circle me-1"></i>Arraste dentro do círculo para reposicionar
              </p>
            </div>

            <!-- Controles -->
            <div class="col-md-8">
              <div class="mb-4">
                <label class="form-label fw-semibold">Trocar imagem (opcional)</label>
                <input type="file" class="form-control" accept="image/*" (change)="onImagemSelecionada($event)" #fileInput>
                <small class="text-muted d-block mt-1">
                  Formatos aceitos: JPG, PNG ou WEBP — máximo 8MB.<br>
                  Se apenas quiser reposicionar, arraste no círculo sem precisar trocar a imagem.
                </small>
                <div class="text-danger small mt-1" *ngIf="erroImagem">{{ erroImagem }}</div>
              </div>

              <div class="d-flex gap-2 flex-wrap align-items-center">
                <button type="button" class="btn btn-gold"
                        [disabled]="salvando || (!imagemAlterada && !posicaoAlterada)"
                        (click)="salvar()">
                  <span *ngIf="salvando" class="spinner-border spinner-border-sm me-1"></span>
                  {{ salvando ? 'Salvando...' : 'Salvar' }}
                </button>
                <button *ngIf="imagemAlterada" type="button" class="btn btn-outline-secondary" (click)="cancelarNovaImagem(fileInput)">
                  Cancelar nova imagem
                </button>
              </div>

              <div *ngIf="!imagemAtual && !imagemExibida" class="mt-3">
                <div class="alert alert-info mb-0">
                  <i class="bi bi-info-circle me-2"></i>Nenhuma imagem cadastrada. Selecione uma imagem para começar.
                </div>
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
  erroImagem = '';
  imagemAtual: ImagemHero | null = null;

  imagemExibida = '';
  posX = 50;
  posY = 50;
  isDragging = false;
  imagemAlterada = false;
  posicaoAlterada = false;
  private novaImagemBase64 = '';

  private readonly MAX_BYTES = 8 * 1024 * 1024;

  get posicaoCss(): string {
    return `${this.posX.toFixed(1)}% ${this.posY.toFixed(1)}%`;
  }

  constructor(
    private service: ImagemHeroService,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void { this.carregar(); }

  carregar(): void {
    this.carregando = true;
    this.service.listarTodos().subscribe({
      next: items => {
        this.imagemAtual = items[0] || null;
        if (this.imagemAtual) {
          this.imagemExibida = this.imagemAtual.imagemUrl;
          const pos = this.parsearPosicao(this.imagemAtual.objectPosition);
          this.posX = pos.x;
          this.posY = pos.y;
        }
        this.imagemAlterada = false;
        this.posicaoAlterada = false;
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
    if (file.size > this.MAX_BYTES) {
      this.erroImagem = 'A imagem deve ter no máximo 8MB.';
      input.value = '';
      return;
    }

    try {
      this.novaImagemBase64 = await this.lerArquivo(file);
      this.imagemExibida = this.novaImagemBase64;
      this.posX = 50;
      this.posY = 50;
      this.imagemAlterada = true;
      this.posicaoAlterada = false;
    } catch {
      this.erroImagem = 'Não foi possível processar a imagem selecionada.';
      input.value = '';
    }
  }

  cancelarNovaImagem(input: HTMLInputElement): void {
    input.value = '';
    this.novaImagemBase64 = '';
    this.imagemAlterada = false;
    if (this.imagemAtual) {
      this.imagemExibida = this.imagemAtual.imagemUrl;
      const pos = this.parsearPosicao(this.imagemAtual.objectPosition);
      this.posX = pos.x;
      this.posY = pos.y;
    } else {
      this.imagemExibida = '';
    }
    this.posicaoAlterada = false;
  }

  iniciarArrastar(event: MouseEvent): void {
    if (!this.imagemExibida) return;
    event.preventDefault();

    this.isDragging = true;
    let lastX = event.clientX;
    let lastY = event.clientY;

    const onMove = (e: MouseEvent) => {
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      this.ngZone.run(() => {
        this.posX = Math.max(0, Math.min(100, this.posX - dx * 0.5));
        this.posY = Math.max(0, Math.min(100, this.posY - dy * 0.5));
        this.posicaoAlterada = true;
      });
    };

    const onUp = () => {
      this.isDragging = false;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }

  centralizar(): void {
    this.posX = 50;
    this.posY = 50;
    this.posicaoAlterada = true;
  }

  salvar(): void {
    if (!this.imagemExibida) return;
    this.salvando = true;

    const imagemUrl = this.imagemAlterada ? this.novaImagemBase64 : this.imagemAtual!.imagemUrl;
    const dto: CreateImagemHero = {
      imagemUrl,
      objectPosition: this.posicaoCss,
      ativo: true
    };

    const request = this.imagemAtual
      ? this.service.atualizar(this.imagemAtual.id, dto)
      : this.service.criar(dto);

    request.subscribe({
      next: item => {
        this.imagemAtual = item;
        this.imagemExibida = item.imagemUrl;
        this.novaImagemBase64 = '';
        this.imagemAlterada = false;
        this.posicaoAlterada = false;
        this.mensagem = 'Imagem atualizada com sucesso!';
        this.salvando = false;
      },
      error: (err: HttpErrorResponse) => {
        this.erro = err.error?.message || 'Erro ao salvar a imagem.';
        this.salvando = false;
      }
    });
  }

  private lerArquivo(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Falha ao ler arquivo'));
      reader.readAsDataURL(file);
    });
  }

  private parsearPosicao(pos?: string): { x: number; y: number } {
    if (!pos) return { x: 50, y: 50 };
    const parts = pos.split(' ');
    return {
      x: parseFloat(parts[0]) ?? 50,
      y: parseFloat(parts[1]) ?? 50
    };
  }
}
