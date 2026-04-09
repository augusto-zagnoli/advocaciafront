import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sobre',
  standalone: true,
  imports: [RouterLink],
  template: `
    <!-- HERO -->
    <section class="py-5 bg-navy text-white">
      <div class="container py-4">
        <div class="row align-items-center">
          <div class="col">
            <p class="text-gold fw-semibold mb-2">SOBRE</p>
            <h1 class="fw-bold display-5">Dra. Gabriela</h1>
            <p class="text-white-50 fs-5">Advogada comprometida com a Justiça e os seus direitos.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CONTEÚDO -->
    <section class="py-5">
      <div class="container">
        <div class="row align-items-center g-5">
          <div class="col-lg-5 text-center">
            <div class="rounded-3 bg-light d-inline-flex align-items-center justify-content-center border"
                 style="width:300px; height:350px;">
              <i class="bi bi-person-badge" style="font-size:7rem; color:#c9a064;"></i>
            </div>
            <div class="mt-3">
              <span class="badge bg-gold text-white px-3 py-2">OAB/XX 000.000</span>
            </div>
          </div>
          <div class="col-lg-7">
            <p class="text-gold fw-semibold mb-2">TRAJETÓRIA PROFISSIONAL</p>
            <h2 class="fw-bold text-navy mb-4">Conectando Direito e Humanidade</h2>
            <p class="text-muted mb-3">
              Com mais de 10 anos de experiência na advocacia, a Dra. Gabriela construiu uma trajetória marcada pelo comprometimento com os direitos dos seus clientes. Formada em Direito pela Universidade de São Paulo, realizou especializações nas principais áreas de atuação.
            </p>
            <p class="text-muted mb-4">
              Sua atuação é pautada em três pilares fundamentais: transparência, ética e resultados. Cada cliente é atendido com dedicação intensiva, pois acredita que por trás de cada processo há uma história e um direito a ser defendido.
            </p>
            <div class="row g-3 mb-4">
              <div class="col-6">
                <div class="d-flex align-items-center gap-2">
                  <i class="bi bi-check-circle-fill text-gold"></i>
                  <span>Graduada em Direito - USP</span>
                </div>
              </div>
              <div class="col-6">
                <div class="d-flex align-items-center gap-2">
                  <i class="bi bi-check-circle-fill text-gold"></i>
                  <span>Pós-graduada em Direito Civil</span>
                </div>
              </div>
              <div class="col-6">
                <div class="d-flex align-items-center gap-2">
                  <i class="bi bi-check-circle-fill text-gold"></i>
                  <span>Especialista em Família</span>
                </div>
              </div>
              <div class="col-6">
                <div class="d-flex align-items-center gap-2">
                  <i class="bi bi-check-circle-fill text-gold"></i>
                  <span>Especialista em Trabalhista</span>
                </div>
              </div>
              <div class="col-6">
                <div class="d-flex align-items-center gap-2">
                  <i class="bi bi-check-circle-fill text-gold"></i>
                  <span>Membro da OAB-SP</span>
                </div>
              </div>
              <div class="col-6">
                <div class="d-flex align-items-center gap-2">
                  <i class="bi bi-check-circle-fill text-gold"></i>
                  <span>10+ anos de experiência</span>
                </div>
              </div>
            </div>
            <div class="d-flex gap-3">
              <a routerLink="/orcamento" class="btn btn-gold">Solicitar Consulta</a>
              <a routerLink="/contato" class="btn btn-outline-navy">Entrar em Contato</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- VALORES -->
    <section class="py-5 bg-light">
      <div class="container">
        <div class="text-center mb-5">
          <h2 class="fw-bold text-navy">Valores que Nos Guiam</h2>
        </div>
        <div class="row g-4 text-center">
          <div class="col-md-4">
            <i class="bi bi-shield-check text-gold fs-1 mb-3"></i>
            <h5 class="fw-bold text-navy">Ética</h5>
            <p class="text-muted">Atuação pautada na conduta ética e nos princípios da advocacia responsável.</p>
          </div>
          <div class="col-md-4">
            <i class="bi bi-eye text-gold fs-1 mb-3"></i>
            <h5 class="fw-bold text-navy">Transparência</h5>
            <p class="text-muted">Comunicação clara e honesta com nossos clientes em todas as etapas do processo.</p>
          </div>
          <div class="col-md-4">
            <i class="bi bi-trophy text-gold fs-1 mb-3"></i>
            <h5 class="fw-bold text-navy">Excelência</h5>
            <p class="text-muted">Comprometimento com os melhores resultados e qualidade no atendimento jurídico.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-5 bg-navy text-white text-center">
      <div class="container">
        <h3 class="fw-bold mb-3">Vamos Trabalhar Juntos?</h3>
        <p class="text-white-50 mb-4">Agende sua consulta e conheça como posso ajudar.</p>
        <a routerLink="/orcamento" class="btn btn-gold btn-lg px-5">Agendar Consulta</a>
      </div>
    </section>
  `
})
export class SobreComponent {}
