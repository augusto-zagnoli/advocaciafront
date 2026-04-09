import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contato, CreateContato, PagedResult } from '../models/models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ContatoService {
  private readonly API = `${environment.apiUrl}/contatos`;

  constructor(private http: HttpClient) {}

  enviar(dto: CreateContato): Observable<any> {
    return this.http.post(this.API, dto);
  }

  listar(pagina = 1, tamanho = 10, status?: string, lido?: boolean): Observable<PagedResult<Contato>> {
    let params = new HttpParams().set('pagina', pagina).set('tamanho', tamanho);
    if (status) params = params.set('status', status);
    if (lido !== undefined) params = params.set('lido', lido);
    return this.http.get<PagedResult<Contato>>(this.API, { params });
  }

  obterPorId(id: number): Observable<Contato> {
    return this.http.get<Contato>(`${this.API}/${id}`);
  }

  atualizarStatus(id: number, status: string, lido: boolean): Observable<Contato> {
    return this.http.patch<Contato>(`${this.API}/${id}/status`, { status, lido });
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }

  contarNaoLidos(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.API}/nao-lidos/count`);
  }
}
