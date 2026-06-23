import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Profile } from '../types';
import { DEFAULT_PROFILE } from '../data/seed';
import { CornerBrackets } from '../components/CornerBrackets';
import { GlowButton } from '../components/GlowButton';
import { Terminal, Mail, Phone, MapPin } from 'lucide-react';
import emailjs from '@emailjs/browser';

export const Contact: React.FC = () => {
  const [profile] = useLocalStorage<Profile>('neo_profile', DEFAULT_PROFILE);
  
  // Terminal state
  const [step, setStep] = useState<number>(0); // 0: Name, 1: Email, 2: Message, 3: Confirm, 4: Sending, 5: Done
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<string[]>([
    '>> INITIALIZING ENCRYPTED UPLINK...',
    '>> SECURE PORT FORWARDING ESTABLISHED // PORT 443',
    '>> TARGET: ' + profile.email.toUpperCase(),
    '>> TYPE YOUR INFORMATION TO TRANSMIT A SECURE MESSAGE.',
    '-------------------------------------------------------'
  ]);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [history, step]);

  const scrollToBottom = () => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  // Auto-focus terminal on load
  useEffect(() => {
    focusInput();
  }, []);

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputVal.trim();
    if (!trimmed) return;

    if (step === 0) {
      setName(trimmed);
      setHistory((prev) => [
        ...prev,
        `guest@neo-arch:~$ name --set "${trimmed}"`,
        `>> Name registered: ${trimmed}`,
        `>> Please enter your EMAIL address:`
      ]);
      setStep(1);
    } else if (step === 1) {
      if (!trimmed.includes('@') || !trimmed.includes('.')) {
        setHistory((prev) => [
          ...prev,
          `guest@neo-arch:~$ email --set "${trimmed}"`,
          `[SYS_ERR] Invalid email format. Please try again.`
        ]);
      } else {
        setEmail(trimmed);
        setHistory((prev) => [
          ...prev,
          `guest@neo-arch:~$ email --set "${trimmed}"`,
          `>> Email registered: ${trimmed}`,
          `>> Please enter your MESSAGE:`
        ]);
        setStep(2);
      }
    } else if (step === 2) {
      setMessage(trimmed);
      setHistory((prev) => [
        ...prev,
        `guest@neo-arch:~$ message --write "${trimmed}"`,
        `>> Message recorded.`,
        `>> Ready to transmit? Type "YES" to send, or "RESET" to start over:`
      ]);
      setStep(3);
    } else if (step === 3) {
      if (trimmed.toUpperCase() === 'YES' || trimmed.toUpperCase() === 'Y') {
        setHistory((prev) => [
          ...prev,
          `guest@neo-arch:~$ transmit --send`,
          `>> COMPILING DATA PACKETS...`,
          `>> ENCRYPTING END-TO-END...`,
          `>> UPLOADING DATA TO GATEWAY...`
        ]);
        setStep(4);
        setInputVal('');
        
        // Send email via EmailJS
        const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
        const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
        const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

        emailjs.init(publicKey);
        emailjs.send(serviceId, templateId, {
          from_name: name,
          from_email: email,
          message: message,
        }).then(() => {
          setHistory((prev) => [
            ...prev,
            `>> TRANSMISSION SUCCESSFUL!`,
            `>> [SYS_OK] Message sent to ${profile.name} via Email API.`,
            `>> Thank you! ${profile.name} will reply shortly.`
          ]);
          setStep(5);
        }).catch((err) => {
          console.error('EmailJS error:', err);
          setHistory((prev) => [
            ...prev,
            `>> [SYS_ERR] TRANSMISSION FAILED: ${err?.text || err?.message || 'Unknown error'}`,
            `>> Please try again or contact directly via email.`
          ]);
          setStep(3);
        });
        return;
      } else if (trimmed.toUpperCase() === 'RESET' || trimmed.toUpperCase() === 'R') {
        setName('');
        setEmail('');
        setMessage('');
        setHistory((prev) => [
          ...prev,
          `guest@neo-arch:~$ reset`,
          `>> Buffer cleared.`,
          `>> Please enter your NAME:`
        ]);
        setStep(0);
      } else {
        setHistory((prev) => [
          ...prev,
          `guest@neo-arch:~$ ${trimmed}`,
          `>> Invalid command. Type "YES" to send, or "RESET" to start over:`
        ]);
      }
    }

    setInputVal('');
  };

  const resetTerminal = () => {
    setName('');
    setEmail('');
    setMessage('');
    setInputVal('');
    setStep(0);
    setHistory([
      '>> INITIALIZING ENCRYPTED UPLINK...',
      '>> SECURE PORT FORWARDING ESTABLISHED // PORT 443',
      '>> TARGET: ' + profile.email.toUpperCase(),
      '>> TYPE YOUR INFORMATION TO TRANSMIT A SECURE MESSAGE.',
      '-------------------------------------------------------',
      '>> Please enter your NAME:'
    ]);
  };

  return (
    <div className="space-y-16 py-6 md:py-12 overflow-hidden">
      {/* Page Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-left space-y-1 border-b border-[var(--border-main)] pb-6"
      >
        <span className="font-mono text-xs text-[var(--accent-pink)] font-bold tracking-widest uppercase">// COMMUNICATIONS_PORTAL</span>
        <h1 className="font-rajdhani text-3xl md:text-4xl font-bold text-[var(--text-primary)] tracking-wide uppercase">&gt;_ INITIATE TRANSMISSION</h1>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Traditional Contact Info */}
        <motion.div 
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: 'spring', stiffness: 80 }}
          className="lg:col-span-1 space-y-6 text-left"
        >
          <div className="border border-[var(--border-main)] bg-[var(--bg-surface)] p-6 relative space-y-6"
               style={{ clipPath: 'polygon(10px 0%, 100% 0%, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0% 100%, 0% 10px)' }}
          >
            <CornerBrackets colorClass="border-[var(--border-strong)]" size={6} />
            
            <h3 className="font-rajdhani text-lg font-bold text-[var(--text-primary)] uppercase tracking-wider">// DIRECT_CONTACT</h3>
            
            <div className="space-y-4 font-mono text-xs">
              {/* Email */}
              <div className="flex items-center gap-3 group">
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  className="border border-[var(--border-strong)] bg-[var(--bg-accent)] p-2 text-[var(--accent-cyan)] group-hover:border-[var(--accent-cyan)] transition-colors"
                >
                  <Mail className="w-4 h-4" />
                </motion.div>
                <div>
                  <div className="text-[var(--text-muted)] text-[10px]">EMAIL_ADDRESS</div>
                  <a href={`mailto:${profile.email}`} className="text-[var(--text-secondary)] hover:text-[var(--accent-cyan)] transition-colors">
                    {profile.email}
                  </a>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="flex items-center gap-3 group">
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  className="border border-pink-500/20 bg-pink-950/20 p-2 text-[var(--accent-pink)] group-hover:border-pink-400 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                </motion.div>
                <div>
                  <div className="text-[var(--text-muted)] text-[10px]">SECURE_WHATSAPP</div>
                  <a href={`https://wa.me/${profile.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-[var(--text-secondary)] hover:text-[var(--accent-pink)] transition-colors">
                    +{profile.whatsapp}
                  </a>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-3">
                <div className="border border-violet-500/20 bg-violet-950/20 p-2 text-violet-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[var(--text-muted)] text-[10px]">CURRENT_LOCATION</div>
                  <span className="text-[var(--text-secondary)]">Blitar, Jawa Timur, Indonesia</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-dashed border-[var(--border-main)] p-6 relative font-mono text-[11px] text-[var(--text-muted)] space-y-2">
            <div className="text-[var(--accent-cyan)]/80 font-bold uppercase">// TRANSMISSION STATUS</div>
            <div>GATEWAY: ONLINE</div>
            <div>SSL_CIPHER: TLS_AES_256_GCM_SHA384</div>
            <div>VERIFICATION: SMK_PGRI_WLG_NET</div>
          </div>
        </motion.div>

        {/* Right Column: Terminal Contact Form Simulation */}
        <motion.div 
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: 'spring', stiffness: 80, delay: 0.1 }}
          className="lg:col-span-2"
        >
          <div
            className="border border-[var(--border-strong)] bg-[#07090e]/90 shadow-[0_0_30px_rgba(34,211,238,0.05)] relative flex flex-col h-[450px]"
            style={{ clipPath: 'polygon(12px 0%, 100% 0%, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0% 100%, 0% 12px)' }}
          >
            <CornerBrackets colorClass="border-[var(--accent-cyan)]/40" size={10} />

            {/* Terminal Header Bar */}
            <div className="flex items-center justify-between border-b border-cyan-500/15 bg-[var(--bg-surface-strong)] px-4 py-2 flex-shrink-0">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-[var(--accent-cyan)]" />
                <span className="font-mono text-[10px] text-[var(--accent-cyan)] tracking-wider font-bold">TERMINAL // SECURE_TRANSMIT_CLIENT v1.0</span>
              </div>
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500/50 animate-pulse" />
                <span className="w-2 h-2 rounded-full bg-yellow-500/50" />
                <span className="w-2 h-2 rounded-full bg-green-500/50" />
              </div>
            </div>

            {/* Terminal Screen Area */}
            <div 
              onClick={focusInput}
              className="flex-1 p-5 overflow-y-auto font-mono text-xs text-[var(--accent-cyan)]/90 space-y-2 cursor-text text-left"
            >
              {history.map((line, idx) => (
                <div key={idx} className="whitespace-pre-wrap leading-relaxed">
                  {line}
                </div>
              ))}

              {/* Dynamic Prompts */}
              {step === 0 && (
                <div className="text-[var(--text-primary)] font-bold">
                  &gt;&gt; Please enter your NAME:
                </div>
              )}
              {step === 1 && (
                <div className="text-[var(--text-primary)] font-bold">
                  &gt;&gt; Please enter your EMAIL address:
                </div>
              )}
              {step === 2 && (
                <div className="text-[var(--text-primary)] font-bold">
                  &gt;&gt; Please enter your MESSAGE:
                </div>
              )}
              {step === 3 && (
                <div className="text-[var(--accent-pink)] font-bold animate-pulse">
                  &gt;&gt; Ready to transmit? Type "YES" to send, or "RESET" to start over:
                </div>
              )}

              {/* Active input prompt line */}
              {step < 4 && (
                <form onSubmit={handleCommandSubmit} className="flex items-center gap-1.5 pt-1">
                  <span className="text-[var(--accent-pink)] font-bold">guest@neo-arch:~$</span>
                  <span className="text-[var(--accent-cyan)]">
                    {step === 0 && 'name --set "'}
                    {step === 1 && 'email --set "'}
                    {step === 2 && 'message --write "'}
                    {step === 3 && ''}
                  </span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-[var(--text-primary)] font-mono text-xs focus:ring-0 p-0"
                    autoFocus
                  />
                  <span className="text-[var(--accent-cyan)]">
                    {step === 0 && '"'}
                    {step === 1 && '"'}
                    {step === 2 && '"'}
                  </span>
                </form>
              )}

              {step === 5 && (
                <div className="pt-4">
                  <GlowButton variant="cyan" onClick={resetTerminal} className="text-[10px] px-4 py-1.5">
                    <span>TRANSMIT AGAIN</span>
                  </GlowButton>
                </div>
              )}

              <div ref={terminalEndRef} />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
