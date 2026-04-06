# SaasOOH — Frontend (Setdoor)

Interface web da plataforma **Setdoor** — um SaaS voltado para empresas de mídia Out-of-Home (OOH). Dashboard de gestão completo com visão financeira, inventário de painéis, campanhas, clientes e hub administrativo da empresa.

> ⚙️ Backend: [saasooh-backend](https://github.com/leonardondornelles/saasooh-backend)

---

## Screenshots

| Visão Geral | Dashboard Financeiro |
|---|---|
| ![Visão Geral](./screenshots/Visao_Geral.png) | ![Financeiro](./screenshots/Finances_WIP.png) |

| Detalhe do Painel (faces + timeline) | Calendário de Ocupação |
|---|---|
| ![Painel](./screenshots/Panel_OUDOOR_CLIENTS.png) | ![Calendário](./screenshots/Panel_OUDOOR_CALENDAR.png) |

| Gestão de Clientes | Hub da Empresa |
|---|---|
| ![Clientes](./screenshots/clients_Gestao.png) | ![Hub](./screenshots/ADMIN_hub.png) |

---

## Tecnologias

- **Next.js 16** (App Router) + **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- **Recharts** — gráficos e visualizações financeiras
- **Lucide React** — ícones
- **Axios** — comunicação com a API
- **JWT** via cookies (autenticação stateless)

---

## Funcionalidades

### Visão Geral
Página inicial com saudação personalizada por horário e acesso rápido às seções principais: Inventário, Campanhas e Clientes.

### Dashboard Financeiro
Área restrita a perfis `ADMIN` e `FINANCEIRO`:
- KPIs: MRR ativo, ARR projetado, ticket médio, ocupação total, contratos a vencer (30d) e inadimplência
- Gráfico de área: faturamento real vs. projetado mês a mês
- Ranking de executivos por volume de vendas (gráfico de barras horizontal)
- Ocupação por praça com barra de progresso e indicadores por threshold
- Pipeline de contratos (funil de vendas)
- Alertas de contratos vencendo com urgência por cor
- Painel de inadimplência com clientes e valores em aberto

### Inventário de Painéis
- Cadastro de painéis (endereço, cidade, GPS, tipo)
- Listagem em cards com tipo, código e localização
- Página de detalhe com representação visual interativa das faces por tipo (Outdoor com 2 faces, LED com até 5, etc.)
- Clique na face abre sidebar com status (ocupado/disponível/reservado), cliente atual, valor mensal, datas de início/fim e barra de progresso da campanha
- Ações: Nova Reserva e Calendário por face

### Calendário de Ocupação
- Modal de calendário mensal por face
- Dias em vermelho = campanha ativa/reservada; dias em branco = disponível
- Navegação entre meses

### Clientes e Agências
- Cards com nome fantasia, razão social, CNPJ, telefone e email
- Ações: Ver Perfil e Dar Acesso (portal do cliente)
- Busca por nome ou CNPJ

### Hub da Empresa
- Plano SaaS ativo com limite de painéis (BASIC / PRO / ENTERPRISE)
- KPIs: painéis utilizados, MRR total da empresa e tamanho da equipe
- Tabela de membros com role (ADMIN, COMERCIAL, FINANCIAL) e status
- Cadastro de novos funcionários

---

## Estrutura do Projeto

```
src/
├── app/
│   ├── login/              # Tela de login
│   ├── register/           # Registro de novo tenant
│   └── dashboard/
│       ├── page.tsx        # Visão geral
│       ├── finance/        # Dashboard financeiro
│       ├── panels/         # Inventário de painéis
│       ├── panel/[id]/     # Detalhe do painel + faces
│       ├── customers/      # Clientes e agências
│       ├── team/[id]/      # Perfil de colaborador
│       └── company/        # Hub da empresa
├── services/
│   └── api.ts              # Instância Axios configurada
└── middleware.ts            # Proteção de rotas autenticadas
```

---

## Como Rodar Localmente

### Pré-requisitos
- Node.js 18+
- Backend rodando em `http://localhost:8080`

### 1. Clone o repositório
```bash
git clone https://github.com/leonardondornelles/saasooh-frontend.git
cd saasooh-frontend
```

### 2. Instale as dependências
```bash
npm install
# ou
pnpm install
```

### 3. Configure o ambiente

Crie um arquivo `.env.local` na raiz:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### 4. Execute
```bash
npm run dev
```

Acesse `http://localhost:3000`.

---

## Autor

**Leonardo Noronha Dornelles**  
Estudante de Ciência da Computação — PUCRS  
[GitHub](https://github.com/leonardondornelles) · [LinkedIn](https://www.linkedin.com/in/leonardo-noronha-dornelles-3a7151324/)
