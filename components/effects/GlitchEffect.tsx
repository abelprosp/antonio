"use client";

import { ReactNode } from "react";

/**
 * Props do componente GlitchEffect
 */
interface GlitchEffectProps {
  children: ReactNode; // Conteúdo que receberá o efeito de glitch
  active?: boolean; // Se o efeito está ativo ou não
  className?: string; // Classes CSS adicionais
}

/**
 * Componente GlitchEffect - Efeito visual de glitch (distorção)
 * 
 * Aplica um efeito de glitch visual quando ativo, criando uma distorção
 * com cores vermelhas e cian, simulando um erro de renderização.
 * Útil para destacar erros ou criar efeitos visuais tecnológicos.
 * 
 * @param children - Conteúdo que receberá o efeito
 * @param active - Se o efeito está ativo (padrão: false)
 * @param className - Classes CSS adicionais
 * @returns Componente com efeito de glitch aplicado
 */
export default function GlitchEffect({ children, active = false, className = "" }: GlitchEffectProps) {
  return (
    <div className={`relative ${className} ${active ? "glitch-active" : ""}`}>
      {/* Conteúdo original */}
      {children}
      
      {/* Efeitos de glitch sobrepostos (apenas quando ativo) */}
      {active && (
        <>
          {/* Camada de glitch vermelha (parte superior) */}
          <div className="absolute inset-0 opacity-80 mix-blend-screen" style={{
            clipPath: "inset(40% 0 61% 0)", // Recorta apenas uma parte
            transform: "translate(-2px, 0)", // Desloca para a esquerda
            background: "linear-gradient(90deg, transparent, rgba(255, 0, 0, 0.5), transparent)",
            animation: "glitch-1 0.3s infinite", // Animação de movimento
          }} />
          
          {/* Camada de glitch cian (parte inferior) */}
          <div className="absolute inset-0 opacity-80 mix-blend-screen" style={{
            clipPath: "inset(61% 0 40% 0)", // Recorta outra parte
            transform: "translate(2px, 0)", // Desloca para a direita
            background: "linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.5), transparent)",
            animation: "glitch-2 0.3s infinite", // Animação de movimento
          }} />
        </>
      )}
    </div>
  );
}
