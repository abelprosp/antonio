"use client";

import { useMemo } from "react";

// Função para gerar valores aleatórios determinísticos baseados em índice
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export default function AnimatedBackground() {
  // Gerar partículas com valores fixos baseados em índice
  const particles = useMemo(() => {
    return Array.from({ length: 50 }).map((_, i) => {
      const seed = i * 0.1;
      return {
        id: i,
        size: seededRandom(seed) * 4 + 2,
        left: seededRandom(seed + 1) * 100,
        top: seededRandom(seed + 2) * 100,
        duration: seededRandom(seed + 3) * 20 + 15,
        delay: seededRandom(seed + 4) * 5,
      };
    });
  }, []);

  // Gerar linhas de conexão com valores fixos
  const lines = useMemo(() => {
    return Array.from({ length: 8 }).map((_, i) => {
      const seed = i * 0.2;
      return {
        id: i,
        x1: seededRandom(seed) * 100,
        y1: seededRandom(seed + 1) * 100,
        x2: seededRandom(seed + 2) * 100,
        y2: seededRandom(seed + 3) * 100,
        duration: seededRandom(seed + 4) * 4 + 3,
      };
    });
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Partículas flutuantes */}
      <div className="absolute inset-0">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-cyan-400/20"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animation: `float ${particle.duration}s infinite ease-in-out`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Linhas de conexão (circuitos) */}
      <svg className="absolute inset-0 w-full h-full opacity-20">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.4" />
          </linearGradient>
        </defs>
        {lines.map((line) => (
          <line
            key={line.id}
            x1={`${line.x1}%`}
            y1={`${line.y1}%`}
            x2={`${line.x2}%`}
            y2={`${line.y2}%`}
            stroke="url(#lineGradient)"
            strokeWidth="1"
            opacity="0.3"
          >
            <animate
              attributeName="opacity"
              values="0.1;0.4;0.1"
              dur={`${line.duration}s`}
              repeatCount="indefinite"
            />
          </line>
        ))}
      </svg>

      {/* Ondas de energia */}
      <div className="absolute inset-0">
        <div
          className="absolute w-full h-full"
          style={{
            background: `radial-gradient(circle at 45% 40%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)`,
            animation: `pulse 9s infinite ease-in-out`,
          }}
        />
        <div
          className="absolute w-full h-full"
          style={{
            background: `radial-gradient(circle at 60% 60%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)`,
            animation: `pulse 11s infinite ease-in-out`,
            animationDelay: "2s",
          }}
        />
      </div>
    </div>
  );
}

