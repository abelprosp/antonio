"use client";

import { useMemo, useEffect, useState } from "react";

/**
 * Função para gerar valores aleatórios determinísticos baseados em um seed
 * 
 * Esta função garante que os mesmos valores sejam gerados para o mesmo seed,
 * útil para criar animações consistentes entre renderizações.
 * 
 * @param seed - Valor numérico usado como semente para gerar o número aleatório
 * @returns Número pseudoaleatório entre 0 e 1
 */
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

/**
 * Componente AnimatedBackground - Fundo animado com efeitos tecnológicos
 * 
 * Cria um fundo animado com:
 * - Grid neural (pontos conectados simulando uma rede neural)
 * - Partículas flutuantes interativas (reagem ao movimento do mouse)
 * - Data streams (linhas de dados fluindo)
 * - Linhas de conexão (circuitos)
 * - Ondas de energia (gradientes radiais pulsantes)
 * - Scanline effect (efeito de varredura)
 * 
 * @returns Componente de fundo animado
 */
export default function AnimatedBackground() {
  // Posição do mouse para interatividade das partículas
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  // Estado para verificar se o componente foi montado (evita problemas de hidratação)
  const [isMounted, setIsMounted] = useState(false);

  // Efeito para marcar o componente como montado
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Efeito para rastrear o movimento do mouse
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    // Limpa o listener ao desmontar
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  /**
   * Gera partículas flutuantes com valores fixos baseados em índice
   * 
   * Cada partícula tem posição, tamanho, duração e delay únicos,
   * mas determinísticos (sempre os mesmos valores para o mesmo índice).
   */
  const particles = useMemo(() => {
    return Array.from({ length: 80 }).map((_, i) => {
      const seed = i * 0.1;
      return {
        id: i,
        size: seededRandom(seed) * 4 + 2, // Tamanho entre 2 e 6 pixels
        left: seededRandom(seed + 1) * 100, // Posição horizontal em porcentagem
        top: seededRandom(seed + 2) * 100, // Posição vertical em porcentagem
        duration: seededRandom(seed + 3) * 20 + 15, // Duração da animação
        delay: seededRandom(seed + 4) * 5, // Delay antes de começar a animação
      };
    });
  }, []);

  /**
   * Gera pontos do grid neural
   * 
   * Cria uma grade de pontos que serão conectados para simular uma rede neural.
   */
  const gridPoints = useMemo(() => {
    const cols = 15; // Número de colunas
    const rows = 10; // Número de linhas
    const points: Array<{ x: number; y: number; id: number }> = [];
    
    // Cria pontos distribuídos uniformemente na tela
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        points.push({
          x: (j / (cols - 1)) * 100, // Posição X em porcentagem
          y: (i / (rows - 1)) * 100, // Posição Y em porcentagem
          id: i * cols + j, // ID único
        });
      }
    }
    return points;
  }, []);

  /**
   * Gera conexões entre os pontos do grid neural
   * 
   * Conecta cada ponto com seus vizinhos (direita, abaixo e diagonalmente)
   * para criar uma rede neural visual.
   */
  const neuralConnections = useMemo(() => {
    const connections: Array<{ from: number; to: number; id: number }> = [];
    const cols = 15;
    const rows = 10;
    let id = 0;
    
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const current = i * cols + j;
        
        // Conectar com o ponto à direita
        if (j < cols - 1) {
          connections.push({ from: current, to: current + 1, id: id++ });
        }
        // Conectar com o ponto abaixo
        if (i < rows - 1) {
          connections.push({ from: current, to: current + cols, id: id++ });
        }
        // Conectar diagonalmente (opcional, apenas 30% das conexões)
        if (j < cols - 1 && i < rows - 1 && seededRandom(id * 0.1) > 0.7) {
          connections.push({ from: current, to: current + cols + 1, id: id++ });
        }
      }
    }
    return connections;
  }, []);

  /**
   * Gera linhas de dados fluindo (data streams)
   * 
   * Cria linhas animadas que simulam fluxo de dados.
   */
  const dataStreams = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => {
      const seed = i * 0.3;
      return {
        id: i,
        x: seededRandom(seed) * 100, // Posição X inicial
        y: seededRandom(seed + 1) * 100, // Posição Y inicial
        angle: seededRandom(seed + 2) * 360, // Ângulo de direção
        duration: seededRandom(seed + 3) * 8 + 4, // Duração da animação
        delay: seededRandom(seed + 4) * 3, // Delay inicial
      };
    });
  }, []);

  /**
   * Gera linhas de conexão originais (circuitos)
   * 
   * Linhas que conectam pontos aleatórios, criando um efeito de circuitos.
   */
  const lines = useMemo(() => {
    return Array.from({ length: 8 }).map((_, i) => {
      const seed = i * 0.2;
      return {
        id: i,
        x1: seededRandom(seed) * 100, // Ponto inicial X
        y1: seededRandom(seed + 1) * 100, // Ponto inicial Y
        x2: seededRandom(seed + 2) * 100, // Ponto final X
        y2: seededRandom(seed + 3) * 100, // Ponto final Y
        duration: seededRandom(seed + 4) * 4 + 3, // Duração da animação
      };
    });
  }, []);

  // Evita renderização no servidor para prevenir mismatch de hidratação
  // Retorna um div vazio durante o SSR
  if (!isMounted) {
    return <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" />;
  }

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Grid Neural - Pontos e conexões que simulam uma rede neural */}
      <svg className="absolute inset-0 w-full h-full opacity-15">
        <defs>
          {/* Gradiente para as linhas do grid neural */}
          <linearGradient id="neuralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        
        {/* Renderiza as conexões entre os pontos do grid */}
        {neuralConnections.map((conn) => {
          const fromPoint = gridPoints[conn.from];
          const toPoint = gridPoints[conn.to];
          if (!fromPoint || !toPoint) return null;
          
          return (
            <line
              key={conn.id}
              x1={`${fromPoint.x}%`}
              y1={`${fromPoint.y}%`}
              x2={`${toPoint.x}%`}
              y2={`${toPoint.y}%`}
              stroke="url(#neuralGradient)"
              strokeWidth="0.5"
              opacity="0.2"
            >
              {/* Animação de opacidade pulsante */}
              <animate
                attributeName="opacity"
                values="0.1;0.3;0.1"
                dur={`${3 + (conn.id % 5)}s`}
                repeatCount="indefinite"
                begin={`${(conn.id % 3)}s`}
              />
            </line>
          );
        })}
        
        {/* Renderiza os pontos do grid */}
        {gridPoints.map((point) => (
          <circle
            key={point.id}
            cx={`${point.x}%`}
            cy={`${point.y}%`}
            r="1.5"
            fill="#06b6d4"
            opacity="0.4"
          >
            {/* Animação de opacidade pulsante */}
            <animate
              attributeName="opacity"
              values="0.2;0.6;0.2"
              dur={`${4 + (point.id % 4)}s`}
              repeatCount="indefinite"
              begin={`${(point.id % 2)}s`}
            />
          </circle>
        ))}
      </svg>

      {/* Data Streams - Linhas de dados fluindo pela tela */}
      <svg className="absolute inset-0 w-full h-full opacity-10">
        <defs>
          {/* Gradiente para as linhas de dados */}
          <linearGradient id="streamGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0" />
            <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Renderiza cada linha de dados */}
        {dataStreams.map((stream) => {
          const length = 200; // Comprimento da linha
          const rad = (stream.angle * Math.PI) / 180; // Converte ângulo para radianos
          // Calcula o ponto final da linha baseado no ângulo
          const x2 = stream.x + Math.cos(rad) * length;
          const y2 = stream.y + Math.sin(rad) * length;
          
          return (
            <line
              key={stream.id}
              x1={`${stream.x}%`}
              y1={`${stream.y}%`}
              x2={`${x2}%`}
              y2={`${y2}%`}
              stroke="url(#streamGradient)"
              strokeWidth="1"
            >
              {/* Animações de movimento e opacidade */}
              <animate
                attributeName="x1"
                values={`${stream.x}%;${stream.x + 10}%;${stream.x}%`}
                dur={`${stream.duration}s`}
                repeatCount="indefinite"
                begin={`${stream.delay}s`}
              />
              <animate
                attributeName="y1"
                values={`${stream.y}%;${stream.y + 10}%;${stream.y}%`}
                dur={`${stream.duration}s`}
                repeatCount="indefinite"
                begin={`${stream.delay}s`}
              />
              <animate
                attributeName="opacity"
                values="0;0.6;0"
                dur={`${stream.duration}s`}
                repeatCount="indefinite"
                begin={`${stream.delay}s`}
              />
            </line>
          );
        })}
      </svg>

      {/* Partículas flutuantes interativas - Reagem ao movimento do mouse */}
      <div className="absolute inset-0">
        {particles.map((particle) => {
          // Calcula a distância entre a partícula e o mouse
          const particleX = (particle.left / 100) * 100;
          const particleY = (particle.top / 100) * 100;
          const mouseX = (mousePos.x / (typeof window !== 'undefined' ? window.innerWidth : 1920)) * 100;
          const mouseY = (mousePos.y / (typeof window !== 'undefined' ? window.innerHeight : 1080)) * 100;
          const distance = Math.sqrt(
            Math.pow(particleX - mouseX, 2) + Math.pow(particleY - mouseY, 2)
          );
          
          // Se o mouse estiver próximo, aumenta o tamanho da partícula
          const maxDistance = 15; // Distância máxima em porcentagem
          const scale = distance < maxDistance ? 1 + (1 - distance / maxDistance) * 0.5 : 1;
          
          return (
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
                transform: `scale(${scale})`,
                transition: "transform 0.3s ease-out",
              }}
            />
          );
        })}
      </div>

      {/* Linhas de conexão (circuitos) - Linhas que conectam pontos aleatórios */}
      <svg className="absolute inset-0 w-full h-full opacity-20">
        <defs>
          {/* Gradiente para as linhas de circuito */}
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.4" />
          </linearGradient>
        </defs>
        
        {/* Renderiza cada linha de circuito */}
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
            {/* Animação de opacidade pulsante */}
            <animate
              attributeName="opacity"
              values="0.1;0.4;0.1"
              dur={`${line.duration}s`}
              repeatCount="indefinite"
            />
          </line>
        ))}
      </svg>

      {/* Ondas de energia - Gradientes radiais pulsantes */}
      <div className="absolute inset-0">
        {/* Primeira onda de energia */}
        <div
          className="absolute w-full h-full"
          style={{
            background: `radial-gradient(circle at 45% 40%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)`,
            animation: `pulse 9s infinite ease-in-out`,
          }}
        />
        {/* Segunda onda de energia (com delay) */}
        <div
          className="absolute w-full h-full"
          style={{
            background: `radial-gradient(circle at 60% 60%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)`,
            animation: `pulse 11s infinite ease-in-out`,
            animationDelay: "2s",
          }}
        />
      </div>

      {/* Scanline effect - Efeito de varredura (como em monitores antigos) */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(6, 182, 212, 0.1) 2px,
            rgba(6, 182, 212, 0.1) 4px
          )`,
          animation: "scanline 8s linear infinite",
        }}
      />
    </div>
  );
}
