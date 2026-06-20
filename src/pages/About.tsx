import React from 'react';
import { motion } from 'framer-motion';
import { usePortfolioData } from '../hooks/usePortfolioData';
import { CornerBrackets } from '../components/CornerBrackets';
import { School, MapPin, Code2, ShieldAlert } from 'lucide-react';

export const About: React.FC = () => {
  const { profile } = usePortfolioData();

  const stats = [
    { label: 'INSTITUSI', value: profile.school, sub: 'Jurusan RPL', icon: <School className="w-5 h-5 text-[var(--accent-cyan)]" /> },
    { label: 'KONSENTRASI', value: profile.major, sub: 'Web & Mobile Dev', icon: <Code2 className="w-5 h-5 text-[var(--accent-pink)]" /> },
    { label: 'LOKASI', value: 'Blitar, Indonesia', sub: 'Jawa Timur', icon: <MapPin className="w-5 h-5 text-violet-400" /> },
  ];

  const interests = [
    { name: 'Frontend Architecture', desc: 'Membangun antarmuka modern yang cepat, responsif, dan kaya animasi dengan React & Tailwind.' },
    { name: 'RESTful API Development', desc: 'Merancang arsitektur backend yang aman dan terdokumentasi menggunakan Node.js dan Laravel.' },
    { name: 'UI/UX Engineering', desc: 'Menerjemahkan ide kreatif menjadi wireframe interaktif dan desain visual yang futuristik.' },
    { name: 'Cyber Security Basics', desc: 'Mempelajari konsep keamanan web, enkripsi data dasar, dan praktik coding yang aman.' }
  ];

  // Animation variants
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 }
    }
  };

  const slideLeft = {
    hidden: { x: -60, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 80 } }
  };

  const slideRight = {
    hidden: { x: 60, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 80 } }
  };

  return (
    <div className="space-y-16 py-6 md:py-12 overflow-hidden">
      {/* Page Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-left space-y-1 border-b border-[var(--border-main)] pb-6"
      >
        <span className="font-mono text-xs text-[var(--accent-pink)] font-bold tracking-widest uppercase">// SYSTEM_DOSSIER</span>
        <h1 className="font-rajdhani text-3xl md:text-4xl font-bold text-[var(--text-primary)] tracking-wide uppercase">&gt;_ ABOUT ME</h1>
      </motion.div>

      {/* Main Bio Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Quick Profile Card */}
        <motion.div
          initial={{ opacity: 0, x: -100, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 60, damping: 14 }}
          className="lg:col-span-1 border border-[var(--border-strong)] bg-[var(--bg-surface)] p-6 relative flex flex-col items-center text-center"
          style={{ clipPath: 'polygon(12px 0%, 100% 0%, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0% 100%, 0% 12px)' }}
        >
          <CornerBrackets colorClass="border-[var(--accent-cyan)]/35" size={8} />

          {/* Profile Picture */}
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 2 }}
            className="w-32 h-32 rounded-full border border-cyan-500/30 p-1 bg-[var(--bg-accent)] relative group overflow-hidden mb-4"
          >
            <div className="w-full h-full rounded-full overflow-hidden">
              <img 
                src={profile.avatar || "/images/profile.jpg"} 
                alt={profile.name} 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
              />
            </div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-t from-cyan-500/10 to-transparent pointer-events-none" />
          </motion.div>

          <h2 className="font-rajdhani text-xl font-bold text-[var(--text-primary)] uppercase tracking-wider">{profile.name}</h2>
          <p className="font-mono text-[10px] text-[var(--accent-cyan)] font-semibold tracking-widest uppercase mt-1 mb-4">// {profile.title}</p>

          <div className="w-full border-t border-[var(--border-main)] pt-4 space-y-3 font-mono text-xs text-left">
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">ROLE:</span>
              <span className="text-[var(--text-secondary)]">PKL_STUDENT</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">SCHOOL:</span>
              <span className="text-[var(--text-secondary)]">SMK PGRI WLINGI</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">MAJOR:</span>
              <span className="text-[var(--text-secondary)]">RPL</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">STATUS:</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                ACTIVE
              </span>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Detailed Story */}
        <motion.div
          initial={{ opacity: 0, x: 100, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 60, damping: 14, delay: 0.1 }}
          className="lg:col-span-2 border border-[var(--border-main)] bg-[var(--bg-surface)] p-8 relative space-y-6 text-left"
          style={{ clipPath: 'polygon(15px 0%, 100% 0%, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0% 100%, 0% 15px)' }}
        >
          <CornerBrackets colorClass="border-[var(--accent-cyan)]/30" size={10} />

          <h3 className="font-rajdhani text-xl font-bold text-[var(--text-primary)] tracking-widest uppercase flex items-center gap-2">
            <span className="text-[var(--accent-cyan)] animate-pulse">&gt;_</span> DETAILED PROFILE DATA
          </h3>

          <p className="font-body text-sm text-[var(--text-secondary)] leading-relaxed">
            {profile.aboutLong}
          </p>

          <p className="font-body text-sm text-[var(--text-tertiary)] leading-relaxed">
            Sebagai siswa SMK PGRI Wlingi, program Praktek Kerja Lapangan (PKL) adalah gerbang awal saya untuk masuk ke industri profesional. Saya berkomitmen penuh untuk mengasah kemampuan teknis dan soft skills saya agar siap bersaing di industri teknologi global. Saya percaya bahwa kemauan belajar yang tinggi dikombinasikan dengan dedikasi adalah modal utama seorang developer.
          </p>

          {/* School Affiliation HUD */}
          <motion.div 
            animate={{ 
              borderColor: ['rgba(236,72,153,0.2)', 'rgba(236,72,153,0.4)', 'rgba(236,72,153,0.2)'] 
            }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="border border-pink-500/20 bg-pink-950/10 p-4 font-mono text-xs text-[var(--accent-pink)] flex items-start gap-3"
          >
            <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5 animate-bounce" />
            <div>
              <span className="font-bold tracking-wider">[AFFILIATION_NOTICE]:</span>
              <p className="text-[var(--text-secondary)] text-[11px] mt-1 leading-relaxed">
                Seluruh proyek dan aktivitas pembelajaran yang tercantum di portofolio ini diawasi dan didukung oleh bimbingan guru produktif RPL SMK PGRI Wlingi serta mentor industri tempat saya PKL.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Stats Cards Grid */}
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            variants={i % 2 === 0 ? slideLeft : slideRight}
            whileHover={{ y: -5, borderColor: 'rgba(34,211,238,0.3)' }}
            className="border border-[var(--border-main)] bg-[var(--bg-surface)] p-6 backdrop-blur-sm relative text-left group transition-colors"
            style={{ clipPath: 'polygon(8px 0%, 100% 0%, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0% 100%, 0% 8px)' }}
          >
            <CornerBrackets colorClass="border-[var(--border-strong)] group-hover:border-[var(--accent-cyan)]/40" size={6} />
            <div className="flex items-center gap-3 mb-3">
              <div className="border border-[var(--border-strong)] bg-[var(--bg-accent)] p-2 group-hover:bg-[var(--bg-accent-strong)] transition-colors">
                {stat.icon}
              </div>
              <span className="font-mono text-[10px] text-[var(--text-muted)] tracking-widest">{stat.label}</span>
            </div>
            <div className="font-rajdhani text-lg font-bold text-[var(--text-primary)] uppercase tracking-wide">
              {stat.value}
            </div>
            <div className="font-mono text-[10px] text-[var(--accent-cyan)]/60 mt-1">
              // {stat.sub}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Interests / Specializations */}
      <div className="space-y-6">
        <div className="text-left">
          <span className="font-mono text-xs text-[var(--accent-pink)] font-bold tracking-widest uppercase">// SPECIALIZATION_FIELDS</span>
          <h2 className="font-rajdhani text-2xl font-bold text-[var(--text-primary)] tracking-wide uppercase">&gt;_ AREA OF INTERESTS</h2>
        </div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {interests.map((interest, i) => (
            <motion.div
              key={interest.name}
              variants={slideLeft}
              whileHover={{ scale: 1.02, borderColor: 'rgba(34,211,238,0.3)' }}
              className="border border-[var(--border-main)] bg-[var(--bg-surface)] p-6 relative text-left group transition-all"
              style={{ clipPath: 'polygon(10px 0%, 100% 0%, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0% 100%, 0% 10px)' }}
            >
              <CornerBrackets colorClass="border-[var(--border-strong)] group-hover:border-[var(--accent-cyan)]/40" size={8} />
              
              <div className="flex items-start gap-4">
                <div className="font-mono text-xs text-[var(--accent-cyan)] bg-[var(--bg-accent)] border border-[var(--border-strong)] px-2 py-1 flex-shrink-0 animate-pulse">
                  [0{i+1}]
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-rajdhani text-base font-bold text-[var(--text-primary)] tracking-wide uppercase group-hover:text-[var(--accent-cyan)] transition-colors duration-300">
                    {interest.name}
                  </h4>
                  <p className="font-body text-xs text-[var(--text-tertiary)] leading-relaxed">
                    {interest.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
