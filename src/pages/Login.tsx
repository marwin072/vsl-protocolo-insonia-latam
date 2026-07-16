import { useState, type FormEvent } from 'react';
import { supabase } from '../lib/supabaseClient';

// Must match api/lib/env.ts's `publicSiteUrl` (used for the purchase-webhook invite
// email) so both redirect flows land on the same allow-listed Supabase Redirect URL.
// Falls back to the current origin only for local dev when the var isn't set yet.
const PUBLIC_SITE_URL = (import.meta.env.VITE_PUBLIC_SITE_URL as string | undefined) ?? window.location.origin;

export default function Login() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [sentTo, setSentTo] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus('sending');
    setErrorMessage('');

    const normalizedEmail = email.trim().toLowerCase();

    const { error } = await supabase.auth.signInWithOtp({
      email: normalizedEmail,
      options: {
        emailRedirectTo: `${PUBLIC_SITE_URL}/membros`,
        // This login only works for buyers already invited by the purchase webhook —
        // never silently create a new account for an arbitrary/unpurchased email.
        shouldCreateUser: false,
      },
    });

    if (error) {
      // Don't reveal whether this email is a registered buyer (avoids account
      // enumeration) — show the same generic "sent" confirmation either way.
      // `signup_disabled` shows up here too if the Supabase project also has "allow
      // new signups" turned off at the dashboard level — same non-existent-user case.
      if (error.code === 'user_not_found' || error.code === 'signup_disabled') {
        setSentTo(normalizedEmail);
        setStatus('sent');
        return;
      }
      setStatus('error');
      setErrorMessage(error.message);
      return;
    }
    setSentTo(normalizedEmail);
    setStatus('sent');
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-brand-blue text-brand-cream px-6">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-heading mb-2 text-center">Área de Membros</h1>
        <p className="text-brand-cream/70 text-sm text-center mb-8">
          Digite o email usado na compra para receber um link de acesso.
        </p>

        {status === 'sent' ? (
          <p className="text-center text-brand-cream/90 border border-brand-cream/20 rounded-lg p-4">
            Se <strong>{sentTo}</strong> já comprou o Protocolo, enviamos um link de acesso para esse email. Confira
            sua caixa de entrada (e o spam).
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full rounded-lg bg-white/5 border border-brand-cream/20 px-4 py-3 text-brand-cream placeholder:text-brand-cream/40 focus:outline-none focus:ring-2 focus:ring-brand-cream/40"
            />
            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full rounded-lg bg-brand-cream text-brand-blue font-medium py-3 disabled:opacity-50"
            >
              {status === 'sending' ? 'Enviando...' : 'Enviar link de acesso'}
            </button>
            {status === 'error' && <p className="text-red-300 text-sm text-center">{errorMessage}</p>}
          </form>
        )}
      </div>
    </main>
  );
}
