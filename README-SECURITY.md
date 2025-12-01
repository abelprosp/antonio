# Checklist de Segurança para Deploy

Antes de fazer deploy em produção, verifique:

## ✅ Configuração de Ambiente

- [ ] Todas as variáveis de ambiente estão configuradas
- [ ] `SUPABASE_SERVICE_ROLE_KEY` está protegida (nunca no cliente)
- [ ] Arquivos `.env` não estão no repositório (verificar `.gitignore`)

## ✅ HTTPS

- [ ] Aplicação está configurada para usar HTTPS exclusivamente
- [ ] Certificado SSL válido configurado
- [ ] Header `Strict-Transport-Security` está ativo

## ✅ Headers de Segurança

- [ ] Headers de segurança configurados em `next.config.js`
- [ ] CSP (Content Security Policy) configurado adequadamente
- [ ] Headers de segurança testados (use https://securityheaders.com)

## ✅ Rate Limiting

- [ ] Rate limiting ativo nas rotas de API
- [ ] Limites configurados adequadamente
- [ ] Para ambientes distribuídos, considerar Redis para rate limiting

## ✅ Logging

- [ ] Logging de segurança configurado
- [ ] Logs sendo coletados e monitorados
- [ ] Alertas configurados para eventos críticos

## ✅ Validação

- [ ] Todas as entradas de usuário são validadas
- [ ] Sanitização de dados implementada
- [ ] Prevenção de open redirect ativa

## ✅ Autenticação

- [ ] Middleware de autenticação funcionando
- [ ] Verificação de roles implementada
- [ ] Rotas protegidas adequadamente

## ✅ Backup e Recuperação

- [ ] Backup do banco de dados configurado
- [ ] Plano de recuperação de desastres documentado
- [ ] Testes de restauração realizados

## ✅ Monitoramento

- [ ] Sistema de monitoramento configurado
- [ ] Alertas para eventos de segurança
- [ ] Dashboard de métricas de segurança

## ✅ Atualizações

- [ ] Dependências atualizadas
- [ ] Vulnerabilidades conhecidas corrigidas
- [ ] Plano de atualização regular estabelecido

## ✅ Testes

- [ ] Testes de segurança realizados
- [ ] Testes de penetração considerados
- [ ] Vulnerabilidades conhecidas verificadas

## Recursos Úteis

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security Best Practices](https://nextjs.org/docs/going-to-production#security)
- [Security Headers Checker](https://securityheaders.com)

