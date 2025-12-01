# Guia de Segurança

Este documento descreve as medidas de segurança implementadas no projeto.

## Headers de Segurança

O projeto utiliza os seguintes headers de segurança configurados em `next.config.js`:

- **Strict-Transport-Security (HSTS)**: Força conexões HTTPS por 2 anos
- **X-Frame-Options**: Previne clickjacking (SAMEORIGIN)
- **X-Content-Type-Options**: Previne MIME type sniffing
- **X-XSS-Protection**: Proteção básica contra XSS
- **Referrer-Policy**: Controla informações de referrer
- **Permissions-Policy**: Restringe acesso a recursos sensíveis
- **Content-Security-Policy (CSP)**: Política de segurança de conteúdo

## HTTPS

### Requisitos de Produção

**IMPORTANTE**: Em produção, o sistema DEVE ser executado exclusivamente via HTTPS.

### Configuração

1. **Vercel/Netlify**: Configurado automaticamente
2. **Servidor próprio**: Configure um reverse proxy (Nginx/Apache) com certificado SSL
3. **Docker**: Use um proxy reverso com SSL

### Verificação

O header `Strict-Transport-Security` garante que navegadores modernos sempre usem HTTPS após a primeira conexão.

## Rate Limiting

### Rotas de API Administrativas

- **Limite**: 5 requisições por minuto por IP
- **Headers de resposta**:
  - `X-RateLimit-Limit`: Limite máximo
  - `X-RateLimit-Remaining`: Requisições restantes
  - `X-RateLimit-Reset`: Timestamp de reset
  - `Retry-After`: Segundos até poder tentar novamente (quando bloqueado)

### Implementação

O rate limiting é implementado em memória. Para ambientes distribuídos (múltiplos servidores), considere usar Redis.

## Logging de Segurança

Todas as operações administrativas são registradas:

- Criação de usuários
- Atualização de usuários
- Tentativas de acesso não autorizado
- Excesso de rate limit
- Erros de autenticação

### Logs Incluem

- Timestamp
- Nível (info/warn/error)
- Evento
- ID do usuário (quando aplicável)
- IP do cliente
- Detalhes adicionais

### Em Produção

Configure um serviço de logging centralizado (ex: Datadog, LogRocket, Sentry) para coletar e analisar os logs.

## Validação de Entrada

### Email

- Formato válido (regex)
- Máximo de 255 caracteres
- Normalização (trim + lowercase)

### Senha

- Mínimo: 8 caracteres
- Máximo: 128 caracteres
- **Nota**: Considere adicionar requisitos de complexidade (maiúsculas, números, símbolos)

### Nomes

- Sanitização de caracteres perigosos (`<>\"'`)
- Máximo de 100 caracteres
- Trim de espaços

### IDs

- Validação de tipo e tamanho
- Máximo de 100 caracteres

## Prevenção de Open Redirect

Todas as URLs de redirecionamento são validadas:

- Deve começar com `/`
- Não pode conter protocolos (`http://`, `https://`, `javascript:`, etc)
- Deve estar na lista de paths permitidos

## Autenticação e Autorização

### Middleware

- Verifica autenticação em todas as rotas protegidas
- Valida roles antes de permitir acesso
- Redireciona usuários não autenticados para `/login`

### Rotas de API

- Verificação de admin em todas as operações administrativas
- Uso de service role key apenas no servidor
- Validação de roles antes de operações sensíveis

## CORS

Atualmente, o sistema não expõe APIs públicas que requerem CORS. Se necessário no futuro:

1. Configure CORS no `next.config.js` ou middleware
2. Use whitelist de origens permitidas
3. Não use `Access-Control-Allow-Origin: *` em produção

## Variáveis de Ambiente

### Arquivos Protegidos

O `.gitignore` protege:
- `.env*.local`
- `.env`
- Arquivos de configuração sensíveis

### Variáveis Necessárias

- `NEXT_PUBLIC_SUPABASE_URL`: URL do projeto Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Chave pública do Supabase
- `SUPABASE_SERVICE_ROLE_KEY`: Chave de serviço (NUNCA exponha no cliente)

## Recomendações Adicionais

1. **Backup**: Configure backups regulares do banco de dados
2. **Monitoramento**: Configure alertas para eventos de segurança
3. **Atualizações**: Mantenha dependências atualizadas
4. **Auditoria**: Revise logs regularmente
5. **Testes**: Execute testes de penetração periodicamente

## Contato

Para reportar vulnerabilidades de segurança, entre em contato com a equipe de desenvolvimento.

