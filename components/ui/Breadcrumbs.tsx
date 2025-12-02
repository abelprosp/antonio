"use client";

import Link from "next/link";

/**
 * Tipo que representa um item do breadcrumb
 */
type Crumb = {
  label: string; // Texto exibido no breadcrumb
  href?: string; // URL opcional (se não tiver, será apenas texto)
};

/**
 * Props do componente Breadcrumbs
 */
type BreadcrumbsProps = {
  items: Crumb[]; // Array de itens do breadcrumb
};

/**
 * Componente Breadcrumbs - Navegação hierárquica (migalhas de pão)
 * 
 * Exibe uma navegação hierárquica mostrando o caminho atual na aplicação.
 * O último item não é clicável e aparece em negrito.
 * 
 * @param items - Array de itens do breadcrumb
 * @returns Componente de navegação hierárquica
 */
export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb" // Acessibilidade: indica que é um breadcrumb
      className="flex items-center gap-2 text-sm text-muted"
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1; // Verifica se é o último item
        
        return (
          <div key={item.label} className="flex items-center gap-2">
            {/* Se for o último item ou não tiver href, exibe como texto simples */}
            {isLast || !item.href ? (
              <span className="font-semibold text-foreground">{item.label}</span>
            ) : (
              // Se não for o último e tiver href, exibe como link
              <Link
                href={item.href}
                className="transition hover:text-foreground"
              >
                {item.label}
              </Link>
            )}
            {/* Adiciona separador "/" entre os itens, exceto no último */}
            {!isLast ? <span className="text-border">/</span> : null}
          </div>
        );
      })}
    </nav>
  );
}
