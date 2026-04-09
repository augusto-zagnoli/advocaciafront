import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AreaAtuacao, Depoimento } from '../models/models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AreaAtuacaoService {
  private readonly API = `${environment.apiUrl}/areasatuacao`;

  constructor(private http: HttpClient) {}

  listar(ativo = true): Observable<AreaAtuacao[]> {
    return this.http.get<AreaAtuacao[]>(`${this.API}?ativo=${ativo}`);
  }
}

@Injectable({ providedIn: 'root' })
export class DepoimentoService {
  private readonly API = `${environment.apiUrl}/depoimentos`;

  constructor(private http: HttpClient) {}

  listar(ativo = true): Observable<Depoimento[]> {
    return this.http.get<Depoimento[]>(`${this.API}?ativo=${ativo}`);
  }
}
