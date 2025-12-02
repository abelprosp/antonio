"use client";

/**
 * Componente ScanLine - Linha de varredura animada
 * 
 * Cria uma linha horizontal que se move verticalmente pela tela,
 * simulando um efeito de varredura (scanline) como em monitores antigos.
 * 
 * @returns Componente de linha de varredura
 */
export default function ScanLine() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Linha com gradiente que se move verticalmente */}
      <div
        className="absolute w-full h-1 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"
        style={{
          animation: "scanlineMove 3s linear infinite", // Animação contínua
          boxShadow: "0 0 10px rgba(6, 182, 212, 0.5)", // Brilho ao redor da linha
        }}
      />
    </div>
  );
}
