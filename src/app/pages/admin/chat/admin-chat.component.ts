import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../../core/services/chat.service';
import { Conversa, MensagemChat } from '../../../core/models/models';

@Component({
  selector: 'app-admin-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styles: [`
    .chat-list { height: calc(100vh - 280px); overflow-y: auto; }
    .chat-messages { height: calc(100vh - 370px); overflow-y: auto; display: flex; flex-direction: column; gap: .5rem; }
    .bubble { max-width: 75%; padding: .6rem 1rem; border-radius: 1rem; word-break: break-word; }
    .bubble-admin { background: #1b2a4a; color: #fff; border-bottom-right-radius: .25rem; align-self: flex-end; }
    .bubble-cliente { background: #f0f0f0; color: #333; border-bottom-left-radius: .25rem; align-self: flex-start; }
    .conversa-item { cursor: pointer; border-left: 3px solid transparent; }
    .conversa-item.active { border-left-color: #c9a064; background: #faf8f4; }
    .conversa-item:hover { background: #f8f8f8; }
  `],
  template: `
    <div>
      <div class="d-flex align-items-center mb-4">
        <div>
          <h4 class="fw-bold text-navy mb-1">Chat</h4>
          <p class="text-muted mb-0">Atendimento em tempo real</p>
        </div>
      </div>

      <div class="row g-3" style="height: calc(100vh - 240px);">
        <!-- LISTA DE CONVERSAS -->
        <div class="col-md-4">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-header bg-white">
              <div class="d-flex gap-1">
                <button class="btn btn-sm flex-fill" [class.btn-navy]="filtro===''" [class.btn-outline-secondary]="filtro!==''" (click)="setFiltro('')">Todas</button>
                <button class="btn btn-sm flex-fill" [class.btn-navy]="filtro==='aberta'" [class.btn-outline-secondary]="filtro!=='aberta'" (click)="setFiltro('aberta')">Abertas</button>
                <button class="btn btn-sm flex-fill" [class.btn-navy]="filtro==='em_atendimento'" [class.btn-outline-secondary]="filtro!=='em_atendimento'" (click)="setFiltro('em_atendimento')">Em atend.</button>
              </div>
            </div>
            <div class="card-body p-0 chat-list">
              <div *ngIf="carregandoLista" class="text-center py-4">
                <span class="spinner-border spinner-border-sm me-2"></span>
              </div>
              <div *ngIf="!carregandoLista && conversas.length === 0" class="text-center py-4 text-muted small">
                Nenhuma conversa.
              </div>
              <div *ngFor="let c of conversas"
                   class="conversa-item p-3 border-bottom"
                   [class.active]="conversaAtiva?.id === c.id"
                   (click)="abrirConversa(c)">
                <div class="d-flex align-items-center justify-content-between">
                  <div class="fw-semibold small">{{ c.nomeCliente }}</div>
                  <span class="badge" [ngClass]="getBadgeClass(c.status)" style="font-size:.65rem">{{ c.status }}</span>
                </div>
                <div class="small text-muted text-truncate">{{ c.emailCliente }}</div>
                <div class="small text-muted mt-1">{{ c.criadoEm | date:'dd/MM HH:mm' }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- JANELA DO CHAT -->
        <div class="col-md-8">
          <div class="card border-0 shadow-sm h-100 d-flex flex-column">
            <ng-container *ngIf="!conversaAtiva">
              <div class="card-body d-flex align-items-center justify-content-center flex-column text-muted">
                <i class="bi bi-chat-dots" style="font-size:3rem"></i>
                <p class="mt-3">Selecione uma conversa para visualizar as mensagens</p>
              </div>
            </ng-container>

            <ng-container *ngIf="conversaAtiva">
              <!-- HEADER CONVERSA -->
              <div class="card-header bg-white d-flex align-items-center justify-content-between">
                <div>
                  <div class="fw-bold">{{ conversaAtiva.nomeCliente }}</div>
                  <div class="small text-muted">{{ conversaAtiva.emailCliente }}</div>
                </div>
                <div class="d-flex gap-2">
                  <button class="btn btn-sm btn-outline-warning" *ngIf="conversaAtiva.status !== 'em_atendimento'" (click)="mudarStatus('em_atendimento')">
                    Em Atendimento
                  </button>
                  <button class="btn btn-sm btn-outline-success" *ngIf="conversaAtiva.status !== 'finalizada'" (click)="mudarStatus('finalizada')">
                    Finalizar
                  </button>
                </div>
              </div>

              <!-- MENSAGENS -->
              <div class="card-body p-3 chat-messages" #messagesContainer>
                <div *ngIf="carregandoMensagens" class="text-center w-100">
                  <span class="spinner-border spinner-border-sm"></span>
                </div>
                <ng-container *ngFor="let m of mensagens">
                  <div class="d-flex" [class.justify-content-end]="m.remetente === 'admin'" [class.justify-content-start]="m.remetente === 'cliente'">
                    <div class="bubble" [class.bubble-admin]="m.remetente === 'admin'" [class.bubble-cliente]="m.remetente === 'cliente'">
                      <div>{{ m.texto }}</div>
                      <div class="small mt-1" style="opacity:.65;font-size:.7rem">{{ m.criadoEm | date:'HH:mm' }}</div>
                    </div>
                  </div>
                </ng-container>
                <div *ngIf="!carregandoMensagens && mensagens.length === 0" class="text-center text-muted w-100 small">
                  Nenhuma mensagem ainda.
                </div>
              </div>

              <!-- INPUT DE RESPOSTA -->
              <div class="card-footer bg-white p-3" *ngIf="conversaAtiva.status !== 'finalizada'">
                <div class="input-group">
                  <input type="text" class="form-control" placeholder="Digite sua resposta..."
                         [(ngModel)]="textoResposta"
                         (keydown.enter)="enviarMensagem()"
                         [disabled]="enviando">
                  <button class="btn btn-navy" (click)="enviarMensagem()" [disabled]="enviando || !textoResposta.trim()">
                    <i class="bi bi-send-fill"></i>
                  </button>
                </div>
              </div>
              <div class="card-footer bg-white p-3 text-center text-muted small" *ngIf="conversaAtiva.status === 'finalizada'">
                <i class="bi bi-lock me-1"></i>Conversa finalizada
              </div>
            </ng-container>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  conversas: Conversa[] = [];
  conversaAtiva: Conversa | null = null;
  mensagens: MensagemChat[] = [];
  textoResposta = '';
  filtro = '';
  carregandoLista = false;
  carregandoMensagens = false;
  enviando = false;
  private scrollBottom = false;
  private intervalId: ReturnType<typeof setInterval> | null = null;

  constructor(private service: ChatService) {}

  ngOnInit(): void {
    this.carregarConversas();
    this.intervalId = setInterval(() => {
      this.carregarConversas(true);
      if (this.conversaAtiva) this.carregarMensagens(this.conversaAtiva.id, true);
    }, 8000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  ngAfterViewChecked(): void {
    if (this.scrollBottom && this.messagesContainer) {
      const el = this.messagesContainer.nativeElement;
      el.scrollTop = el.scrollHeight;
      this.scrollBottom = false;
    }
  }

  setFiltro(f: string): void { this.filtro = f; this.carregarConversas(); }

  carregarConversas(silencioso = false): void {
    if (!silencioso) this.carregandoLista = true;
    this.service.listarConversas(1, 50, this.filtro || undefined).subscribe({
      next: r => { this.conversas = r.items; this.carregandoLista = false; },
      error: () => this.carregandoLista = false
    });
  }

  abrirConversa(c: Conversa): void {
    this.conversaAtiva = c;
    this.mensagens = [];
    this.carregarMensagens(c.id);
  }

  carregarMensagens(id: number, silencioso = false): void {
    if (!silencioso) this.carregandoMensagens = true;
    this.service.getMensagens(id).subscribe({
      next: msgs => {
        const houveMudanca = msgs.length !== this.mensagens.length;
        this.mensagens = msgs;
        this.carregandoMensagens = false;
        if (houveMudanca) this.scrollBottom = true;
      },
      error: () => this.carregandoMensagens = false
    });
  }

  enviarMensagem(): void {
    if (!this.conversaAtiva || !this.textoResposta.trim()) return;
    this.enviando = true;
    this.service.responder(this.conversaAtiva.id, { texto: this.textoResposta.trim(), remetente: 'admin' }).subscribe({
      next: msg => {
        this.mensagens.push(msg);
        this.textoResposta = '';
        this.enviando = false;
        this.scrollBottom = true;
      },
      error: () => this.enviando = false
    });
  }

  mudarStatus(status: string): void {
    if (!this.conversaAtiva) return;
    this.service.atualizarStatus(this.conversaAtiva.id, status).subscribe({
      next: conv => {
        this.conversaAtiva = conv;
        this.carregarConversas(true);
      },
      error: () => {}
    });
  }

  getBadgeClass(status: string): string {
    const map: Record<string, string> = {
      aberta: 'bg-warning text-dark',
      em_atendimento: 'bg-info',
      finalizada: 'bg-secondary'
    };
    return map[status] || 'bg-secondary';
  }
}
