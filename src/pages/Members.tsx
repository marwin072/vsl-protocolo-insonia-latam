import { Navigate } from 'react-router-dom';
import { useSession } from '../lib/useSession';
import { supabase } from '../lib/supabaseClient';

export default function Members() {
  const session = useSession();

  if (session === undefined) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-brand-blue text-brand-cream">
        <p className="text-brand-cream/60">Carregando...</p>
      </main>
    );
  }

  if (session === null) {
    return <Navigate to="/login" replace />;
  }

  return (
    <main className="min-h-screen bg-brand-blue text-brand-cream px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-2xl font-heading">Área de Membros</h1>
          <button
            onClick={() => supabase.auth.signOut()}
            className="text-sm text-brand-cream/60 hover:text-brand-cream transition-colors"
          >
            Sair
          </button>
        </div>

        <p className="text-brand-cream/80">
          Bem-vindo(a), {session.user.email}. O conteúdo do Protocolo Mente Desligada aparece aqui.
        </p>
      </div>
    </main>
  );
}
