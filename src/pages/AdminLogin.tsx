import React, { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { CornerBrackets } from '../components/CornerBrackets';
import { GlowButton } from '../components/GlowButton';
import { Terminal, ShieldAlert, KeyRound, User } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const [auth, setAuth] = useLocalStorage<boolean>('neo_admin_auth', false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // If already authenticated, redirect to dashboard
    if (auth) {
      navigate({ to: '/admin' });
    }
  }, [auth, navigate]);

const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (username !== 'admin') {
      setError('ACCESS DENIED: INVALID USERNAME');
      return;
    }

    const savedPassword = localStorage.getItem('neo_admin_password') || 'admin123';

    if (password !== savedPassword) {
      setError('ACCESS DENIED: CRYPTOGRAPHIC DECRYPTION FAILED');
      return;
    }


    // Simulate futuristic login sequence
    setLoading(true);
    setLogs(['>> INITIALIZING CRYPTO DECRYPTION...']);

    setTimeout(() => {
      setLogs((prev) => [...prev, '>> COMPARING HASHES... OK']);
    }, 400);

    setTimeout(() => {
      setLogs((prev) => [...prev, '>> INITIATING ADMIN SESSION... OK']);
    }, 800);

    setTimeout(async () => {
      setLogs((prev) => [...prev, '>> ACCESS GRANTED. WELCOME ADMIN.']);

      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:4000'}/api/admin/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });

        const data = await res.json();

        if (!res.ok || !data?.success || !data?.token) {
          throw new Error(data?.message || 'Admin login failed');
        }

        localStorage.setItem('neo_admin_token', data.token);
        setAuth(true);
        navigate({ to: '/admin' });
      } catch (err) {
        setAuth(false);
        setLoading(false);
        const msg = err instanceof Error ? err.message : 'Admin login failed';
        setError(msg);
        setLogs((prev) => [...prev, `>> AUTH_FAILED: ${msg}`]);
      }
    }, 1200);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Title */}
        <div className="text-center space-y-1">
          <span className="font-mono text-xs text-[var(--accent-pink)] font-bold tracking-widest uppercase">// SECURE_PORTAL</span>
          <h1 className="font-rajdhani text-3xl font-extrabold text-[var(--text-primary)] tracking-widest uppercase">
            ADMIN GATEWAY
          </h1>
        </div>

        {/* Login Card */}
        <div 
          className="border border-[var(--border-strong)] bg-[#07090e]/95 p-8 relative shadow-[0_0_30px_rgba(34,211,238,0.05)]"
          style={{ clipPath: 'polygon(12px 0%, 100% 0%, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0% 100%, 0% 12px)' }}
        >
          <CornerBrackets colorClass="border-[var(--accent-cyan)]" size={10} />

          {loading ? (
            /* Booting logs */
            <div className="space-y-3 font-mono text-xs text-[var(--accent-cyan)] text-left min-h-[150px] flex flex-col justify-center">
              {logs.map((log, idx) => (
                <div key={idx}>{log}</div>
              ))}
              <div className="w-2 h-4 bg-cyan-400 animate-pulse inline-block" />
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-6 text-left">
              {/* Error Message */}
              {error && (
                <div className="border border-red-500/30 bg-red-950/20 p-3 font-mono text-xs text-red-400 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Username */}
              <div className="space-y-2">
                <label className="block font-mono text-[10px] text-[var(--text-muted)] tracking-widest uppercase">
                  &gt;_ USERNAME
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="ENTER USERNAME..."
                    className="w-full bg-[var(--bg-surface-strong)] border border-[var(--border-main)] px-4 py-2.5 pl-10 font-mono text-xs text-[var(--text-primary)] placeholder-slate-600 focus:outline-none focus:border-[var(--accent-cyan)]/50 transition-colors"
                    style={{ clipPath: 'polygon(4px 0%, 100% 0%, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0% 100%, 0% 4px)' }}
                  />
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-[var(--text-muted)]" />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="block font-mono text-[10px] text-[var(--text-muted)] tracking-widest uppercase">
                  &gt;_ CRYPTO_KEY (PASSWORD)
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="ENTER PASSWORD..."
                    className="w-full bg-[var(--bg-surface-strong)] border border-[var(--border-main)] px-4 py-2.5 pl-10 font-mono text-xs text-[var(--text-primary)] placeholder-slate-600 focus:outline-none focus:border-[var(--accent-cyan)]/50 transition-colors"
                    style={{ clipPath: 'polygon(4px 0%, 100% 0%, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0% 100%, 0% 4px)' }}
                  />
                  <KeyRound className="absolute left-3.5 top-3 w-4 h-4 text-[var(--text-muted)]" />
                </div>
              </div>

              <div className="pt-2">
                <GlowButton type="submit" variant="cyan" fullWidth>
                  <Terminal className="w-4 h-4" />
                  <span>AUTHORIZE DECRYPT</span>
                </GlowButton>
              </div>

              <div className="text-center pt-2">
                <span className="font-mono text-[9px] text-slate-600">
                  DEFAULT CREDENTIALS: admin // admin123
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
