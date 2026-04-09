import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Anuncio, CreateAnuncio, PagedResult } from '../models/models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AnuncioService {
  private readonly API = `${environment.apiUrl}/anuncios`;

  constructor(private http: HttpClient) {}

  listarPublico(posicao?: string): Observable<Anuncio[]> {
    let params = new HttpParams();
    if (posicao) params = params.set('posicao', posicao);
    return this.http.get<Anuncio[]>(`${this.API}/publico`, { params });
  }

  listar(pagina = 1, tamanho = 10, posicao?: string, ativo?: boolean): Observable<PagedResult<Anuncio>> {
    let params = new HttpParams().set('pagina', pagina).set('tamanho', tamanho);
    if (posicao) params = params.set('posicao', posicao);
    if (ativo !== undefined) params = params.set('ativo', ativo);
    return this.http.get<PagedResult<Anuncio>>(this.API, { params });
  }

  obterPorId(id: number): Observable<Anuncio> {
    return this.http.get<Anuncio>(`${this.API}/${id}`);
  }

  criar(dto: CreateAnuncio): Observable<Anuncio> {
    return this.http.post<Anuncio>(this.API, dto);
  }

  atualizar(id: number, dto: CreateAnuncio): Observable<Anuncio> {
    return this.http.put<Anuncio>(`${this.API}/${id}`, dto);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}
