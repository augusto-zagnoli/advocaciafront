import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AreaAtuacao, CreateAreaAtuacao, Depoimento, CreateDepoimento, QuemSomos, CreateQuemSomos, SobreDoutora, CreateSobreDoutora, Servico, CreateServico, ConfiguracaoSite, CreateConfiguracaoSite } from '../models/models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AreaAtuacaoService {
  private readonly API = `${environment.apiUrl}/areasatuacao`;

  constructor(private http: HttpClient) {}

  listar(ativo = true): Observable<AreaAtuacao[]> {
    return this.http.get<AreaAtuacao[]>(`${this.API}?ativo=${ativo}`);
  }

  listarTodas(ativo?: boolean): Observable<AreaAtuacao[]> {
    let params = new HttpParams();
    if (ativo !== undefined) params = params.set('ativo', ativo);
    return this.http.get<AreaAtuacao[]>(this.API, { params });
  }

  obterPorId(id: number): Observable<AreaAtuacao> {
    return this.http.get<AreaAtuacao>(`${this.API}/${id}`);
  }

  criar(dto: CreateAreaAtuacao): Observable<AreaAtuacao> {
    return this.http.post<AreaAtuacao>(this.API, dto);
  }

  atualizar(id: number, dto: CreateAreaAtuacao): Observable<AreaAtuacao> {
    return this.http.put<AreaAtuacao>(`${this.API}/${id}`, dto);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}

@Injectable({ providedIn: 'root' })
export class DepoimentoService {
  private readonly API = `${environment.apiUrl}/depoimentos`;

  constructor(private http: HttpClient) {}

  listar(ativo = true): Observable<Depoimento[]> {
    return this.http.get<Depoimento[]>(`${this.API}?ativo=${ativo}`);
  }

  listarTodos(ativo?: boolean): Observable<Depoimento[]> {
    let params = new HttpParams();
    if (ativo !== undefined) params = params.set('ativo', ativo);
    return this.http.get<Depoimento[]>(this.API, { params });
  }

  obterPorId(id: number): Observable<Depoimento> {
    return this.http.get<Depoimento>(`${this.API}/${id}`);
  }

  criar(dto: CreateDepoimento): Observable<Depoimento> {
    return this.http.post<Depoimento>(this.API, dto);
  }

  atualizar(id: number, dto: CreateDepoimento): Observable<Depoimento> {
    return this.http.put<Depoimento>(`${this.API}/${id}`, dto);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}

@Injectable({ providedIn: 'root' })
export class QuemSomosService {
  private readonly API = `${environment.apiUrl}/quemsomos`;

  constructor(private http: HttpClient) {}

  listar(ativo = true): Observable<QuemSomos[]> {
    return this.http.get<QuemSomos[]>(`${this.API}?ativo=${ativo}`);
  }

  listarTodos(ativo?: boolean): Observable<QuemSomos[]> {
    let params = new HttpParams();
    if (ativo !== undefined) params = params.set('ativo', ativo);
    return this.http.get<QuemSomos[]>(this.API, { params });
  }

  obterPorId(id: number): Observable<QuemSomos> {
    return this.http.get<QuemSomos>(`${this.API}/${id}`);
  }

  criar(dto: CreateQuemSomos): Observable<QuemSomos> {
    return this.http.post<QuemSomos>(this.API, dto);
  }

  atualizar(id: number, dto: CreateQuemSomos): Observable<QuemSomos> {
    return this.http.put<QuemSomos>(`${this.API}/${id}`, dto);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}

@Injectable({ providedIn: 'root' })
export class SobreDoutoraService {
  private readonly API = `${environment.apiUrl}/sobredoutora`;

  constructor(private http: HttpClient) {}

  listar(ativo = true): Observable<SobreDoutora[]> {
    return this.http.get<SobreDoutora[]>(`${this.API}?ativo=${ativo}`);
  }

  listarTodos(ativo?: boolean): Observable<SobreDoutora[]> {
    let params = new HttpParams();
    if (ativo !== undefined) params = params.set('ativo', ativo);
    return this.http.get<SobreDoutora[]>(this.API, { params });
  }

  obterPorId(id: number): Observable<SobreDoutora> {
    return this.http.get<SobreDoutora>(`${this.API}/${id}`);
  }

  criar(dto: CreateSobreDoutora): Observable<SobreDoutora> {
    return this.http.post<SobreDoutora>(this.API, dto);
  }

  atualizar(id: number, dto: CreateSobreDoutora): Observable<SobreDoutora> {
    return this.http.put<SobreDoutora>(`${this.API}/${id}`, dto);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}

@Injectable({ providedIn: 'root' })
export class ServicoService {
  private readonly API = `${environment.apiUrl}/servicos`;

  constructor(private http: HttpClient) {}

  listar(ativo = true): Observable<Servico[]> {
    return this.http.get<Servico[]>(`${this.API}?ativo=${ativo}`);
  }

  listarTodos(ativo?: boolean): Observable<Servico[]> {
    let params = new HttpParams();
    if (ativo !== undefined) params = params.set('ativo', ativo);
    return this.http.get<Servico[]>(this.API, { params });
  }

  obterPorId(id: number): Observable<Servico> {
    return this.http.get<Servico>(`${this.API}/${id}`);
  }

  criar(dto: CreateServico): Observable<Servico> {
    return this.http.post<Servico>(this.API, dto);
  }

  atualizar(id: number, dto: CreateServico): Observable<Servico> {
    return this.http.put<Servico>(`${this.API}/${id}`, dto);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}

@Injectable({ providedIn: 'root' })
export class ConfiguracaoSiteService {
  private readonly API = `${environment.apiUrl}/configuracoesSite`;

  constructor(private http: HttpClient) {}

  listar(): Observable<ConfiguracaoSite[]> {
    return this.http.get<ConfiguracaoSite[]>(this.API);
  }

  obterPorChave(chave: string): Observable<ConfiguracaoSite> {
    return this.http.get<ConfiguracaoSite>(`${this.API}/chave/${chave}`);
  }

  salvar(dto: CreateConfiguracaoSite): Observable<ConfiguracaoSite> {
    return this.http.post<ConfiguracaoSite>(this.API, dto);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}
