"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";

/**
 * Tipo que representa o tema disponível
 */
type Theme = "light" | "dark";

/**
 * Tipo das props do contexto de tema
 */
type ThemeContextProps = {
  theme: Theme; // Tema atual
  toggleTheme: () => void; // Função para alternar tema
  setTheme: (value: Theme) => void; // Função para definir tema diretamente
};

/**
 * Contexto React para gerenciar o tema da aplicação
 */
const ThemeContext = createContext<ThemeContextProps | null>(null);

/**
 * Função para obter o tema inicial
 * 
 * Verifica primeiro o localStorage, depois a preferência do sistema.
 * 
 * @returns Tema inicial a ser usado
 */
function getInitialTheme(): Theme {
  // Verifica se está no servidor (SSR)
  if (typeof window === "undefined") return "light";
  
  // Tenta obter do localStorage
  const stored = localStorage.getItem("theme");
  if (stored === "dark" || stored === "light") return stored;
  
  // Se não houver tema salvo, usa a preferência do sistema
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}

/**
 * Provider de tema - Componente que fornece o contexto de tema para toda a aplicação
 * 
 * Gerencia o estado do tema e persiste no localStorage.
 * Aplica o tema ao elemento HTML raiz.
 * 
 * @param children - Componentes filhos que terão acesso ao contexto de tema
 * @returns Provider do contexto de tema
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  // Estado do tema, inicializado com o tema obtido da função getInitialTheme
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme());

  // Efeito que aplica o tema ao HTML e salva no localStorage
  useEffect(() => {
    const root = document.documentElement;
    // Remove classes antigas
    root.classList.remove("light", "dark");
    // Adiciona a nova classe
    root.classList.add(theme);
    // Salva no localStorage
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Memoiza o valor do contexto para evitar re-renders desnecessários
  const value = useMemo(
    () => ({
      theme,
      setTheme,
      // Função para alternar entre claro e escuro
      toggleTheme: () => setTheme((prev) => (prev === "light" ? "dark" : "light")),
    }),
    [theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/**
 * Hook personalizado para usar o contexto de tema
 * 
 * @returns Objeto com theme, setTheme e toggleTheme
 * @throws Erro se usado fora do ThemeProvider
 */
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
