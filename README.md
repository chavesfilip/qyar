# Qyar — Cardápio Digital por QR Code

Plataforma simples e elegante para restaurantes criarem e compartilharem seu cardápio digital via QR Code.

## Stack

- **Next.js 15** (App Router) + TypeScript
- **Tailwind CSS** + shadcn/ui
- **Supabase** (Auth, PostgreSQL, Storage, RLS)
- **react-hook-form** + zod
- **sonner** (toasts)
- **qrcode** (geração de QR Code)
- **lucide-react** (ícones)

---

## Setup em 5 passos

### 1. Clone e instale dependências

```bash
git clone <repo>
cd qyar
npm install
```

### 2. Crie o projeto no Supabase

1. Acesse [supabase.com](https://supabase.com) e crie um novo projeto
2. Vá em **Settings → API** e copie a **Project URL** e a **anon/public key**

### 3. Configure as variáveis de ambiente

Copie `.env.local` e preencha:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Execute o schema SQL

1. No painel do Supabase, vá em **SQL Editor**
2. Cole todo o conteúdo do arquivo `supabase/schema.sql`
3. Clique em **Run**

Isso criará:
- Tabelas: `restaurants`, `categories`, `dishes`
- Políticas RLS (segurança por linha)
- Bucket de storage `restaurant-assets` com políticas públicas

### 5. Rode o projeto

```bash
npm run dev
```

Acesse `http://localhost:3000`

---

## Estrutura de pastas

```
qyar/
├── app/
│   ├── (auth)/              # Rotas protegidas (requerem login)
│   │   ├── dashboard/       # Home, QR Code
│   │   │   ├── page.tsx
│   │   │   ├── perfil/
│   │   │   └── qr-code/
│   │   ├── pratos/          # Listagem, criar, editar
│   │   ├── categorias/
│   │   └── layout.tsx       # Sidebar + proteção de rota
│   ├── (public)/
│   │   └── menu/[slug]/     # Cardápio público
│   ├── auth/
│   │   ├── login/
│   │   ├── register/
│   │   ├── reset-password/
│   │   └── update-password/
│   ├── layout.tsx
│   ├── page.tsx             # Landing page
│   └── globals.css
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── auth/                # Formulários de autenticação
│   ├── dashboard/           # Sidebar, forms, tabelas
│   └── menu/                # Header e conteúdo público
├── lib/
│   ├── supabase/            # client.ts, server.ts, middleware.ts
│   └── utils.ts
├── types/
│   └── index.ts             # Restaurant, Category, Dish
├── supabase/
│   └── schema.sql           # Schema completo + RLS + Storage
└── middleware.ts            # Proteção de rotas
```

---

## Rotas

| Rota | Descrição |
|------|-----------|
| `/` | Landing page (marketing) |
| `/auth/login` | Login |
| `/auth/register` | Cadastro |
| `/auth/reset-password` | Recuperação de senha |
| `/dashboard` | Painel principal |
| `/dashboard/perfil` | Editar perfil do restaurante |
| `/pratos` | Listar pratos |
| `/dashboard/pratos/novo` | Criar prato |
| `/dashboard/pratos/editar/[id]` | Editar prato |
| `/categorias` | Gerenciar categorias |
| `/dashboard/qr-code` | Visualizar e baixar QR Code |
| `/menu/[slug]` | **Cardápio público** (sem login) |

---

## Deploy na Vercel

```bash
npx vercel
```

Adicione as variáveis de ambiente no painel da Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_APP_URL` → URL de produção (ex: `https://meurestaurante.vercel.app`)

---

## Funcionalidades do MVP

- ✅ Autenticação completa (login, cadastro, recuperação de senha)
- ✅ Dashboard protegido por RLS
- ✅ Edição de perfil com upload de logo
- ✅ Gerenciamento de categorias (criar, editar, excluir)
- ✅ Gerenciamento de pratos (CRUD completo com imagem)
- ✅ Tags: vegetariano 🌿, vegano 🌱, picante 🔥
- ✅ Toggle de disponibilidade por prato
- ✅ Geração e download de QR Code (PNG + SVG)
- ✅ Cardápio público mobile-first em `/menu/[slug]`
- ✅ Navegação por categorias com scroll suave
