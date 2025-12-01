"use client";

import Link from "next/link";

type Crumb = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: Crumb[];
};

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-2 text-sm text-muted"
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <div key={item.label} className="flex items-center gap-2">
            {isLast || !item.href ? (
              <span className="font-semibold text-foreground">{item.label}</span>
            ) : (
              <Link
                href={item.href}
                className="transition hover:text-foreground"
              >
                {item.label}
              </Link>
            )}
            {!isLast ? <span className="text-border">/</span> : null}
          </div>
        );
      })}
    </nav>
  );
}
