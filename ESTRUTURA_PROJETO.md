# Estrutura do Projeto - Visor Integrado

Este documento explica a organização do projeto e o que cada parte faz.

## 📁 Estrutura de Pastas

```
Projeto-Antonio/
├── app/                          # Páginas e rotas do Next.js
│   ├── api/                      # Rotas de API
│   │   └── admin/                # Rotas administrativas
│   │       └── users/             # Gerenciamento de usuários
│   ├── dashboard/                # Página do dashboard
│   ├── bluemilk/                 # Página da IA BlueMilk
│   ├── hm/                       # Página da IA HM
│   ├── login/                    # Página de login
│   ├── settings/                 # Página de configurações
│   ├── unauthorized/             # Página de acesso negado
│   ├── layout.tsx                # Layout principal da aplicação
│   ├── page.tsx                  # Página inicial
│   └── globals.css               # Estilos globais
│
├── components/                    # Componentes React
│   ├── ui/                       # Componentes de UI básicos
│   │   ├── Card.tsx              # Card reutilizável
│   │   ├── Breadcrumbs.tsx       # Navegação hierárquica
│   │   ├── IframePlaceholder.tsx # Placeholder para iframes
│   │   ├── ThemeToggle.tsx       # Botão de alternar tema
│   │   └── ThemeProvider.tsx     # Provider de tema
│   │
│   ├── layout/                   # Componentes de layout
│   │   ├── AppShell.tsx          # Shell principal da aplicação
│   │   ├── Navbar.tsx           # Barra de navegação (desktop)
│   │   ├── MobileMenu.tsx       # Menu mobile
│   │   ├── RoleIndicator.tsx    # Indicador de perfil do usuário
│   │   └── RolePicker.tsx      # Seletor de perfil
│   │
│   ├── effects/                  # Efeitos visuais
│   │   ├── AnimatedBackground.tsx # Fundo animado
│   │   ├── ScanLine.tsx         # Linha de varredura
│   │   ├── GlitchEffect.tsx     # Efeito de glitch
│   │   └── HolographicEffect.tsx # Efeito holográfico
│   │
│   └── admin/                    # Componentes administrativos
│       └── AdminUsersManager.tsx # Gerenciador de usuários
│
├── utils/                         # Funções utilitárias
│   ├── auth/                     # Autenticação
│   │   └── supabaseBrowser.ts    # Cliente Supabase (browser)
│   │
│   ├── security/                 # Segurança
│   │   ├── rateLimit.ts         # Limite de taxa
│   │   ├── securityLogger.ts    # Logger de segurança
│   │   └── getClientIp.ts       # Obter IP do cliente
│   │
│   └── config/                   # Configurações
│       ├── useUserRole.ts        # Hook para obter role do usuário
│       └── iframeUrls.ts         # URLs dos iframes
│
├── public/                        # Arquivos estáticos
│   └── assets/                   # Imagens e assets
│       └── logo.png              # Logo da aplicação
│
├── middleware.ts                  # Middleware do Next.js (autenticação)
├── tailwind.config.ts             # Configuração do Tailwind CSS
├── tsconfig.json                  # Configuração do TypeScript
└── package.json                   # Dependências do projeto
```

## 🎯 Descrição das Pastas

### `/app`
Contém todas as páginas e rotas da aplicação Next.js. Cada pasta dentro de `app` representa uma rota.

### `/components/ui`
Componentes de interface básicos e reutilizáveis:
- **Card**: Card com estilo padrão
- **Breadcrumbs**: Navegação hierárquica
- **IframePlaceholder**: Área reservada para iframes
- **ThemeToggle/ThemeProvider**: Gerenciamento de tema

### `/components/layout`
Componentes que definem a estrutura da aplicação:
- **AppShell**: Container principal com header e fundo animado
- **Navbar**: Menu de navegação para desktop
- **MobileMenu**: Menu hamburger para mobile
- **RoleIndicator**: Mostra o perfil do usuário logado
- **RolePicker**: Permite escolher o perfil (desenvolvimento)

### `/components/effects`
Efeitos visuais tecnológicos:
- **AnimatedBackground**: Fundo com grid neural, partículas, etc.
- **ScanLine**: Linha de varredura animada
- **GlitchEffect**: Efeito de distorção visual
- **HolographicEffect**: Efeito holográfico

### `/components/admin`
Componentes específicos para administração:
- **AdminUsersManager**: Interface para gerenciar usuários

### `/utils/auth`
Funções relacionadas à autenticação:
- **supabaseBrowser**: Cliente Supabase para uso no browser

### `/utils/security`
Funções de segurança:
- **rateLimit**: Limita requisições por IP
- **securityLogger**: Registra eventos de segurança
- **getClientIp**: Obtém o IP real do cliente

### `/utils/config`
Configurações e hooks:
- **useUserRole**: Hook para obter o role do usuário atual
- **iframeUrls**: URLs configuráveis dos iframes

## 🔐 Sistema de Autenticação

O projeto usa Supabase para autenticação. O middleware (`middleware.ts`) verifica se o usuário está autenticado e tem permissão para acessar cada rota.

## 🎨 Sistema de Temas

O projeto suporta tema claro e escuro, gerenciado pelo `ThemeProvider` e alternado pelo `ThemeToggle`.

## 📝 Como Editar

1. **Para adicionar uma nova página**: Crie uma pasta em `/app` com um arquivo `page.tsx`
2. **Para adicionar um componente**: Coloque na pasta apropriada dentro de `/components`
3. **Para modificar estilos**: Edite `/app/globals.css` ou use classes Tailwind
4. **Para adicionar rotas de API**: Crie em `/app/api`

## 🚀 Comandos

- `npm run dev`: Inicia o servidor de desenvolvimento
- `npm run build`: Cria build de produção
- `npm run start`: Inicia servidor de produção
- `npm run lint`: Verifica erros de código

