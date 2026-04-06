# SaasOOH — Frontend

Interface web de uma plataforma SaaS para empresas de mídia Out-of-Home (OOH). Oferece um dashboard de gestão completo com visão financeira, controle de inventário de painéis, campanhas, clientes e equipe.

> ⚙️ Backend: [saasooh-backend](https://github.com/leonardondornelles/saasooh-backend)

---

## Tecnologias

- **Next.js 16** (App Router) + **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- **Recharts** — gráficos e visualizações
- **Lucide React** — ícones
- **Axios** — comunicação com a API
- **JWT** via cookies (autenticação stateless)

---

## Funcionalidades

### Dashboard Financeiro
Área restrita a perfis `ADMIN` e `FINANCEIRO`, com:
- KPIs: MRR atual, ARR projetado, ticket médio, ocupação total, contratos a vencer e inadimplência
- Gráfico de área: evolução do faturamento real vs. projetado
- Ranking de executivos por volume de vendas (gráfico de barras horizontal)
- Ocupação por praça com barra de progresso e indicadores de cor
- Pipeline de contratos (funil de vendas)
- Alertas de contratos vencendo nos próximos 30 dias
- Painel de inadimplência com valor total em aberto

### Gestão de Painéis
- Listagem do inventário com tipo, cidade, endereço e status
- Página de detalhe por painel com suas faces
- Suporte a tipos: Outdoor, Front Light, Triedro, LED, Empena, Rodoviário

### Campanhas, Clientes e Equipe
- Páginas dedicadas para gestão de campanhas, clientes/agências e time comercial
- Controle de acesso baseado em role do usuário autenticado

### Autenticação
- Tela de login e registro
- Middleware de proteção de rotas
- Integração com JWT retornado pelo backend

---

## Estrutura do Projeto

```
src/
├── app/
│   ├── login/              # Tela de login
│   ├── register/           # Registro de novo tenant
│   └── dashboard/
│       ├── page.tsx        # Visão geral (quick links)
│       ├── finance/        # Dashboard financeiro
│       ├── panels/         # Inventário de painéis
│       ├── panel/[id]/     # Detalhe do painel
│       ├── customers/      # Clientes e agências
│       ├── team/[id]/      # Perfil de colaborador
│       └── company/        # Configurações da empresa
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

### 4. Execute em modo de desenvolvimento
```bash
npm run dev
```

Acesse `http://localhost:3000`.

---

## Autor

**Leonardo Noronha Dornelles**  
Estudante de Ciência da Computação  
[GitHub](https://github.com/leonardondornelles)
