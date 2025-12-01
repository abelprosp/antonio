"use client";

import { PropsWithChildren } from "react";

type CardProps = PropsWithChildren<{
  className?: string;
}>;

export default function Card({ children, className = "" }: CardProps) {
  const base =
    "bg-card border border-border/70 shadow-soft dark:shadow-soft-dark rounded-2xl p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-[1px]";

  return <div className={`${base} ${className}`}>{children}</div>;
}
