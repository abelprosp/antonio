# Guia de Organização do Projeto

## ✅ O que já foi feito

1. **Estrutura de pastas criada:**
   - `components/ui/` - Componentes de UI básicos
   - `components/layout/` - Componentes de layout
   - `components/effects/` - Efeitos visuais
   - `components/admin/` - Componentes administrativos
   - `utils/auth/` - Utilitários de autenticação
   - `utils/security/` - Utilitários de segurança
   - `utils/config/` - Configurações

2. **Arquivos comentados em português:**
   - `components/ui/Card.tsx`
   - `components/ui/Breadcrumbs.tsx`
   - `components/ui/IframePlaceholder.tsx`
   - `components/ui/ThemeToggle.tsx`
   - `components/ui/ThemeProvider.tsx`
   - `components/effects/AnimatedBackground.tsx`
   - `components/effects/ScanLine.tsx`
   - `components/effects/GlitchEffect.tsx`
   - `components/effects/HolographicEffect.tsx`
   - `components/layout/AppShell.tsx`

## 📋 O que ainda precisa ser feito

### 1. Mover e comentar componentes restantes

**Componentes de layout:**
- [ ] `components/Navbar.tsx` → `components/layout/Navbar.tsx`
- [ ] `components/MobileMenu.tsx` → `components/layout/MobileMenu.tsx`
- [ ] `components/RoleIndicator.tsx` → `components/layout/RoleIndicator.tsx`
- [ ] `components/RolePicker.tsx` → `components/layout/RolePicker.tsx`
- [ ] `components/Header.tsx` → `components/layout/Header.tsx` (se ainda usado)
- [ ] `components/Sidebar.tsx` → `components/layout/Sidebar.tsx` (se ainda usado)

**Componentes administrativos:**
- [ ] `components/AdminUsersManager.tsx` → `components/admin/AdminUsersManager.tsx`

### 2. Organizar utils

**Autenticação:**
- [ ] `utils/supabaseBrowser.ts` → `utils/auth/supabaseBrowser.ts`

**Segurança:**
- [ ] `utils/rateLimit.ts` → `utils/security/rateLimit.ts`
- [ ] `utils/securityLogger.ts` → `utils/security/securityLogger.ts`
- [ ] `utils/getClientIp.ts` → `utils/security/getClientIp.ts`

**Configurações:**
- [ ] `utils/useUserRole.ts` → `utils/config/useUserRole.ts`
- [ ] `utils/iframeUrls.ts` → `utils/config/iframeUrls.ts`

### 3. Comentar todas as páginas

- [ ] `app/page.tsx`
- [ ] `app/login/page.tsx`
- [ ] `app/login/layout.tsx`
- [ ] `app/dashboard/page.tsx`
- [ ] `app/bluemilk/page.tsx`
- [ ] `app/hm/page.tsx`
- [ ] `app/settings/page.tsx`
- [ ] `app/unauthorized/page.tsx`
- [ ] `app/layout.tsx`

### 4. Comentar arquivos de configuração

- [ ] `middleware.ts`
- [ ] `app/api/admin/users/route.ts`

### 5. Atualizar todos os imports

Após mover os arquivos, é necessário atualizar todos os imports em:
- Componentes
- Páginas
- Utils
- Arquivos de configuração

## 🔧 Como completar

### Passo 1: Mover arquivos
```bash
# Exemplo para mover Navbar
mv components/Navbar.tsx components/layout/Navbar.tsx
```

### Passo 2: Comentar o código
Adicione comentários explicando:
- O que o arquivo faz
- O que cada função faz
- O que cada variável/estado faz
- Parâmetros e retornos

### Passo 3: Atualizar imports
Procure por imports antigos e atualize:
```typescript
// Antes
import Navbar from "./Navbar";

// Depois
import Navbar from "./layout/Navbar";
```

### Passo 4: Testar
Execute `npm run dev` e verifique se tudo funciona.

## 📝 Padrão de comentários

Use este padrão para comentar:

```typescript
/**
 * Descrição do que o componente/função faz
 * 
 * Explicação mais detalhada se necessário.
 * 
 * @param nomeParam - Descrição do parâmetro
 * @returns Descrição do retorno
 */
```

Para variáveis e estados:
```typescript
// Descrição do que a variável armazena
const variavel = valor;
```

## 🎯 Prioridades

1. **Alta prioridade:**
   - Mover e comentar componentes de layout (Navbar, MobileMenu, etc.)
   - Mover e comentar utils
   - Atualizar imports do AppShell

2. **Média prioridade:**
   - Comentar páginas principais (login, dashboard)
   - Comentar middleware

3. **Baixa prioridade:**
   - Comentar páginas secundárias
   - Comentar arquivos de configuração

