"use client";

import { ReactNode } from "react";

/**
 * Props do componente HolographicEffect
 */
interface HolographicEffectProps {
  children: ReactNode; // Conteúdo que receberá o efeito holográfico
  className?: string; // Classes CSS adicionais
}

/**
 * Componente HolographicEffect - Efeito visual holográfico
 * 
 * Aplica um efeito de brilho holográfico com gradiente animado,
 * criando uma aparência futurística e tecnológica.
 * O gradiente se move continuamente para criar o efeito de "holograma".
 * 
 * @param children - Conteúdo que receberá o efeito
 * @param className - Classes CSS adicionais
 * @returns Componente com efeito holográfico aplicado
 */
export default function HolographicEffect({ children, className = "" }: HolographicEffectProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Camada de efeito holográfico com gradiente animado */}
      <div className="absolute inset-0 opacity-30" style={{
        background: `linear-gradient(
          135deg,
          rgba(6, 182, 212, 0.1) 0%,
          rgba(59, 130, 246, 0.1) 25%,
          rgba(147, 51, 234, 0.1) 50%,
          rgba(59, 130, 246, 0.1) 75%,
          rgba(6, 182, 212, 0.1) 100%
        )`,
        backgroundSize: "200% 200%", // Tamanho maior para permitir animação
        animation: "holographic 4s ease-in-out infinite", // Animação contínua
        borderRadius: "inherit", // Herda o border-radius do elemento pai
      }} />
      
      {/* Conteúdo original acima do efeito */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
