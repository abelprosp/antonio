import { redirect } from "next/navigation";

/**
 * Página inicial (Home) - Redireciona para login
 * 
 * Esta é a página raiz da aplicação (/).
 * Como a aplicação requer autenticação, ela simplesmente
 * redireciona o usuário para a página de login.
 * 
 * @returns Redirecionamento para /login
 */
export default function Home() {
  redirect("/login");
}