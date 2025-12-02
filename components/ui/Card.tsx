"use client";

import { PropsWithChildren } from "react";

/**
 * Props do componente Card
 */
type CardProps = PropsWithChildren<{
  className?: string; // Classes CSS adicionais opcionais
}>;

/**
 * Componente Card - Card reutilizável com estilo padrão
 * 
 * Este componente cria um card com bordas arredondadas, sombra e efeito hover.
 * Pode receber classes CSS adicionais para customização.
 * 
 * @param children - Conteúdo que será renderizado dentro do card
 * @param className - Classes CSS opcionais para customização adicional
 * @returns Componente de card estilizado
 */
export default function Card({ children, className = "" }: CardProps) {
  // Classes base do card: fundo, borda, sombra, bordas arredondadas, padding e transições
  const base =
    "bg-card border border-border/70 shadow-soft dark:shadow-soft-dark rounded-2xl p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-[1px]";

  return <div className={`${base} ${className}`}>{children}</div>;
}
