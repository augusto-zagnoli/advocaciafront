import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Conversa, IniciarConversa, EnviarMensagem, MensagemChat, PagedResult
} from '../models/models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private readonly API = `${environment.apiUrl}/chat`;

  constructor(private http: HttpClient) {}

  iniciarConversa(dto: IniciarConversa): Observable<Conversa> {
    return this.http.post<Conversa>(`${this.API}/iniciar`, dto);
  }

  enviarMensagemCliente(conversaId: number, dto: EnviarMensagem): Observable<MensagemChat> {
    return this.http.post<MensagemChat>(`${this.API}/${conversaId}/mensagens`, dto);
  }

  listarConversas(pagina = 1, tamanho = 10, status?: string): Observable<PagedResult<Conversa>> {
    let params = new HttpParams().set('pagina', pagina).set('tamanho', tamanho);
    if (status) params = params.set('status', status);
    return this.http.get<PagedResult<Conversa>>(this.API, { params });
  }

  obterConversa(id: number): Observable<Conversa> {
    return this.http.get<Conversa>(`${this.API}/${id}`);
  }

  getMensagens(conversaId: number): Observable<MensagemChat[]> {
    return this.http.get<MensagemChat[]>(`${this.API}/${conversaId}/mensagens`);
  }

  responder(conversaId: number, dto: EnviarMensagem): Observable<MensagemChat> {
    return this.http.post<MensagemChat>(`${this.API}/${conversaId}/responder`, dto);
  }

  atualizarStatus(id: number, status: string): Observable<Conversa> {
    return this.http.patch<Conversa>(`${this.API}/${id}/status`, { status });
  }
}
