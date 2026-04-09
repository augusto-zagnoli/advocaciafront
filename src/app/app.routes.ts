import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';

import { HomeComponent } from './pages/public/home/home.component';
import { SobreComponent } from './pages/public/sobre/sobre.component';
import { AreasAtuacaoComponent } from './pages/public/areas-atuacao/areas-atuacao.component';
import { ContatoComponent } from './pages/public/contato/contato.component';
import { OrcamentoComponent } from './pages/public/orcamento/orcamento.component';

import { LoginComponent } from './pages/admin/login/login.component';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { AdminAnunciosComponent } from './pages/admin/anuncios/admin-anuncios.component';
import { AdminContatosComponent } from './pages/admin/contatos/admin-contatos.component';
import { AdminOrcamentosComponent } from './pages/admin/orcamentos/admin-orcamentos.component';
import { AdminChatComponent } from './pages/admin/chat/admin-chat.component';
import { AdminPerfilComponent } from './pages/admin/perfil/admin-perfil.component';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'sobre', component: SobreComponent },
      { path: 'areas-atuacao', component: AreasAtuacaoComponent },
      { path: 'contato', component: ContatoComponent },
      { path: 'orcamento', component: OrcamentoComponent },
    ]
  },
  { path: 'admin/login', component: LoginComponent },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'anuncios', component: AdminAnunciosComponent },
      { path: 'contatos', component: AdminContatosComponent },
      { path: 'orcamentos', component: AdminOrcamentosComponent },
      { path: 'chat', component: AdminChatComponent },
      { path: 'perfil', component: AdminPerfilComponent },
    ]
  },
  { path: '**', redirectTo: '' }
];
