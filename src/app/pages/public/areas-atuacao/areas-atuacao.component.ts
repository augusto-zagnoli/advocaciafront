import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AreaAtuacaoService } from '../../../core/services/site.service';
import { AreaAtuacao } from '../../../core/models/models';

@Component({
  selector: 'app-areas-atuacao',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="py-5 bg-navy text-white">
      <div class="container py-4">
        <p class="text-gold fw-semibold mb-2">ESPECIALIDADES</p>
        <h1 class="fw-bold display-5">Áreas de Atuação</h1>
        <p class="text-white-50 fs-5">Expertise jurídica para defender seus direitos.</p>
      </div>
    </section>

    <section class="py-5">
      <div class="container">
        <div class="row g-4">
          <div class="col-md-6 col-lg-4" *ngFor="let area of areas">
            <div class="card h-100 border-0 shadow-sm hover-card">
              <div class="card-body p-4">
                <div class="icon-box bg-gold-light rounded-3 d-inline-flex align-items-center justify-content-center mb-3"
                     style="width:60px; height:60px;">
                  <i class="bi {{ area.icone || 'bi-file-legal' }} text-gold fs-3"></i>
                </div>
                <h5 class="fw-bold text-navy mb-3">{{ area.nome }}</h5>
                <p class="text-muted">{{ area.descricao }}</p>
                <a routerLink="/orcamento" class="btn btn-sm btn-outline-gold mt-2">
                  <i class="bi bi-calendar-check me-1"></i>Consultar
                </a>
              </div>
            </div>
          </div>
        </div>

        <div class="text-center mt-5">
          <div class="card border-0 bg-light p-4 p-md-5">
            <h4 class="fw-bold text-navy mb-3">Não encontrou sua área?</h4>
            <p class="text-muted mb-4">Entre em contato e descubra como podemos ajudar no seu caso específico.</p>
            <div class="d-flex gap-3 justify-content-center">
              <a routerLink="/contato" class="btn btn-navy">
                <i class="bi bi-envelope me-2"></i>Enviar Mensagem
              </a>
              <a href="https://wa.me/5511999990000" target="_blank" class="btn btn-success">
                <i class="bi bi-whatsapp me-2"></i>WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class AreasAtuacaoComponent implements OnInit {
  areas: AreaAtuacao[] = [];

  constructor(private areaService: AreaAtuacaoService) {}

  ngOnInit(): void {
    this.areaService.listar().subscribe({ next: a => this.areas = a, error: () => {} });
  }
}
