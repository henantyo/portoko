import React from 'react';
import { Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { Github, Linkedin, Instagram, ArrowRight, Download, Terminal, Briefcase, Award, Code, ChevronRight } from 'lucide-react';
import { usePortfolioData } from '../hooks/usePortfolioData';
import { useTypingEffect } from '../hooks/useTypingEffect';
import { CornerBrackets } from '../components/CornerBrackets';
import { GlowButton } from '../components/GlowButton';

export const Home: React.FC = () => {
  const { profile, projects, skills, experiences } = usePortfolioData();

  const typedTitle = useTypingEffect([
    profile.title,
    'Siswa RPL SMK PGRI Wlingi',
    'Tech Enthusiast',
    'Creative Web Developer'
  ], 80, 40, 2000);

  const featuredProjects = projects.filter(p => p.featured).slice(0, 3);

  // Quick stats
  const stats = [
    { label: 'COMPLETED PROJECTS', value: projects.length, icon: <Code className="w-4 h-4 text-[var(--accent-cyan)]" /> },
    { label: 'SKILLS MASTERED', value: skills.length, icon: <Award className="w-4 h-4 text-[var(--accent-pink)]" /> },
    { label: 'WORK EXP / STAGE', value: experiences.length, icon: <Briefcase className="w-4 h-4 text-violet-400" /> },
  ];

  // Framer Motion staggered child animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemLeftVariants = {
    hidden: { x: -80, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { type: 'spring' as const, stiffness: 80, damping: 15 }
    }
  };

  const itemRightVariants = {
    hidden: { x: 80, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { type: 'spring' as const, stiffness: 80, damping: 15 }
    }
  };

  const itemUpVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring' as const, stiffness: 100, damping: 15 }
    }
  };

  const badgeVariants = {
    hidden: { scale: 0.8, opacity: 0, y: -20 },
    visible: { 
      scale: 1, 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring' as const, stiffness: 120, damping: 12 }
    }
  };

  return (
    <div className="space-y-24 py-6 md:py-12 overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Left: Text Info */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 space-y-6 text-left"
        >
          {/* Badge */}
          <motion.div 
            variants={badgeVariants}
            className="inline-flex items-center gap-2 border border-[var(--border-strong)] bg-[var(--bg-accent)] px-3 py-1 font-mono text-[10px] tracking-widest text-[var(--accent-cyan)] uppercase"
            style={{ clipPath: 'polygon(4px 0%, 100% 0%, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0% 100%, 0% 4px)' }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span>// PORTFOLIO_V3.1 // PKL_STUDENT</span>
          </motion.div>

          {/* Name & Title */}
          <div className="space-y-3">
            <motion.h2 
              variants={itemLeftVariants}
              className="font-mono text-xs md:text-sm text-[var(--text-muted)] tracking-widest uppercase"
            >
              &gt;_ INITIALIZING IDENTIFICATION...
            </motion.h2>

            <motion.h1 
              variants={itemLeftVariants}
              className="font-rajdhani text-5xl sm:text-7xl font-bold tracking-tight text-[var(--text-primary)] uppercase leading-none"
            >
              Hi, I am <br />
              <motion.span 
                animate={{ 
                  textShadow: [
                    "0 0 4px rgba(34,211,238,0.2)",
                    "0 0 12px rgba(34,211,238,0.6)",
                    "0 0 4px rgba(34,211,238,0.2)"
                  ]
                }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-500 to-violet-500 font-extrabold"
              >
                {profile.name}
              </motion.span>
            </motion.h1>
            
            {/* Typing effect */}
            <motion.div 
              variants={itemLeftVariants}
              className="h-8 flex items-center font-mono text-sm sm:text-base text-[var(--accent-cyan)]/90 font-semibold"
            >
              <span>&gt;_ </span>
              <span className="ml-1.5">{typedTitle}</span>
              <span className="ml-1 w-2 h-4 bg-cyan-400 animate-pulse" />
            </motion.div>
          </div>

          {/* Bio */}
          <motion.p 
            variants={itemUpVariants}
            className="font-body text-sm sm:text-base text-[var(--text-tertiary)] max-w-lg leading-relaxed"
          >
            {profile.bio}
          </motion.p>

          {/* Social and CTA Buttons */}
          <motion.div 
            variants={itemUpVariants}
            className="flex flex-wrap items-center gap-4 pt-2"
          >
            <Link to="/projects">
              <GlowButton variant="cyan">
                <span>VIEW PROJECTS</span>
                <ArrowRight className="w-4 h-4" />
              </GlowButton>
            </Link>

            <a href={profile.cvUrl} download className="inline-block">
              <GlowButton variant="neutral">
                <Download className="w-4 h-4" />
                <span>DOWNLOAD CV</span>
              </GlowButton>
            </a>
          </motion.div>

          {/* Social Links */}
          <motion.div 
            variants={itemUpVariants}
            className="flex items-center gap-6 pt-4 text-[var(--text-tertiary)] font-mono text-xs border-t border-[var(--border-main)]"
          >
            <span className="opacity-40 uppercase tracking-widest">// CONNECT_WITH_ME:</span>
            <div className="flex items-center gap-4">
              {[
                { icon: <Github className="w-5 h-5" />, url: profile.github, label: 'GitHub' },
                { icon: <Linkedin className="w-5 h-5" />, url: profile.linkedin, label: 'LinkedIn' },
                { icon: <Instagram className="w-5 h-5" />, url: profile.instagram, label: 'Instagram' }
              ].map((soc, idx) => (
                <motion.a 
                  key={idx}
                  href={soc.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  whileHover={{ scale: 1.2, color: '#22d3ee', y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="hover:text-[var(--accent-cyan)] transition-colors"
                  aria-label={soc.label}
                >
                  {soc.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Right: HUD Photo Frame with Heavy Slide-in from Right */}
        <motion.div 
          initial={{ opacity: 0, x: 120, scale: 0.9, rotate: 3 }}
          animate={{ opacity: 1, x: 0, scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 60, damping: 15, delay: 0.3 }}
          className="relative flex-shrink-0 w-72 h-[512px] md:w-80 md:h-[569px]"
        >
          {/* Outer glowing frame */}
          <motion.div 
            whileHover={{ scale: 1.02, boxShadow: '0 0 25px rgba(34,211,238,0.2)' }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 border border-[var(--border-strong)] bg-[var(--bg-accent)] backdrop-blur-sm p-3 relative group overflow-hidden"
            style={{ clipPath: 'polygon(15px 0%, 100% 0%, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0% 100%, 0% 15px)' }}
          >
            <CornerBrackets colorClass="border-[var(--accent-cyan)]" size={12} />
            
            {/* Tech Label Overlays */}
            <div className="absolute top-4 right-4 font-mono text-[9px] text-[var(--accent-cyan)]/60 z-10 bg-[var(--bg-input)] px-1.5 py-0.5 border border-[var(--border-strong)]">
              ID: [001-AF]
            </div>
            
            <div className="absolute bottom-4 left-4 font-mono text-[9px] text-[var(--accent-pink)]/80 z-10 bg-[var(--bg-input)] px-1.5 py-0.5 border border-pink-500/20 animate-pulse">
              SYS_ACTIVE: TRUE
            </div>

            {/* Inner photo container */}
            <div className="w-full h-full relative overflow-hidden"
                 style={{ clipPath: 'polygon(12px 0%, 100% 0%, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0% 100%, 0% 12px)' }}>
              
              {/* Scanline overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
              
              <img 
                // gunakan profile.avatar (base64/localStorage). fallback ke file lokal public/images/profile.jpg
                src={profile.avatar || "/images/profile.jpg"} 
                alt={profile.name} 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
              />
            </div>
          </motion.div>

          {/* Decorative HUD circles and crosshairs in background */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
            className="absolute -top-6 -right-6 w-20 h-20 border border-dashed border-[var(--border-strong)] rounded-full pointer-events-none" 
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
            className="absolute -bottom-6 -left-6 w-24 h-24 border border-dashed border-pink-500/20 rounded-full pointer-events-none" 
          />
          <motion.div 
            animate={{ scale: [1, 1.1, 1], rotate: 45 }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute top-1/2 -right-12 w-8 h-8 border border-[var(--border-strong)] flex items-center justify-center pointer-events-none"
          >
            <span className="w-1.5 h-1.5 bg-cyan-400" />
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section with Staggered Scale-Up */}
      <section className="relative grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            whileHover={{ 
              scale: 1.03, 
              borderColor: 'rgba(34, 211, 238, 0.4)',
              boxShadow: '0 0 15px rgba(34, 211, 238, 0.1)'
            }}
            transition={{ duration: 0.4, type: 'spring', stiffness: 100 }}
            className="relative border border-[var(--border-main)] bg-[var(--bg-surface)] p-6 backdrop-blur-sm group transition-all"
            style={{ clipPath: 'polygon(8px 0%, 100% 0%, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0% 100%, 0% 8px)' }}
          >
            <CornerBrackets colorClass="border-[var(--border-strong)] group-hover:border-[var(--accent-cyan)]/60" size={6} />
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[10px] text-[var(--text-muted)] tracking-widest">// {stat.label}</span>
              <motion.div 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                {stat.icon}
              </motion.div>
            </div>
            <div className="font-rajdhani text-4xl font-extrabold text-[var(--text-primary)] tracking-wider flex items-center gap-1">
              <span className="text-[var(--accent-cyan)]/30 font-mono text-lg">[</span>
              <span>{String(stat.value).padStart(2, '0')}</span>
              <span className="text-[var(--accent-cyan)]/30 font-mono text-lg">]</span>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Featured Projects Section with Staggered Slide-up */}
      <section className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, type: 'spring' }}
            className="space-y-1 text-left"
          >
            <span className="font-mono text-xs text-[var(--accent-pink)] font-bold tracking-widest uppercase">// SELECTED_WORKS</span>
            <h2 className="font-rajdhani text-3xl font-bold text-[var(--text-primary)] tracking-wide uppercase flex items-center gap-2">
              <span className="text-[var(--accent-cyan)] animate-pulse">&gt;_</span> FEATURED PROJECTS
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, type: 'spring' }}
          >
            <Link to="/projects" className="text-xs font-mono text-[var(--accent-cyan)] hover:text-[var(--accent-pink)] transition-colors flex items-center gap-1 group">
              <span>EXPLORE_ALL_PROJECTS</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProjects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ 
                y: -5,
                borderColor: 'rgba(34, 211, 238, 0.4)',
                boxShadow: '0 0 20px rgba(34, 211, 238, 0.15)'
              }}
              transition={{ duration: 0.4, type: 'spring', stiffness: 100 }}
              className="relative border border-[var(--border-main)] bg-[var(--bg-surface)] overflow-hidden group transition-all"
              style={{ clipPath: 'polygon(10px 0%, 100% 0%, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0% 100%, 0% 10px)' }}
            >
              <CornerBrackets colorClass="border-[var(--border-strong)] group-hover:border-[var(--accent-cyan)]/50" size={8} />
              
              {/* Image Container with Scanlines */}
              <div className="h-44 overflow-hidden relative border-b border-[var(--border-main)] bg-[var(--bg-surface-strong)]">
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-surface-strong)] to-transparent z-10" />
                <div className="absolute inset-0 bg-[var(--bg-accent)] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10" />
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute bottom-3 left-4 z-20 font-mono text-[9px] text-[var(--accent-pink)] bg-[var(--bg-input)] px-1.5 py-0.5 border border-pink-500/20">
                  [{String(i + 1).padStart(3, '0')}]
                </div>
              </div>

              {/* Content */}
              <div className="p-5 space-y-3 text-left">
                <h3 className="font-rajdhani text-lg font-bold text-[var(--text-primary)] tracking-wide uppercase group-hover:text-[var(--accent-cyan)] transition-colors duration-300">
                  {project.title}
                </h3>
                <p className="font-body text-xs text-[var(--text-tertiary)] line-clamp-2 leading-relaxed">
                  {project.description}
                </p>

                {/* Tech Tags */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {project.techStack.slice(0, 3).map(tech => (
                    <span key={tech} className="font-mono text-[9px] text-[var(--accent-cyan)] bg-[var(--bg-accent)] px-1.5 py-0.5 border border-[var(--border-main)]">
                      {tech}
                    </span>
                  ))}
                  {project.techStack.length > 3 && (
                    <span className="font-mono text-[9px] text-[var(--text-muted)] px-1.5 py-0.5">
                      +{project.techStack.length - 3} MORE
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Quick Bio & Contact Section */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
        className="border border-[var(--border-main)] bg-[var(--bg-surface-strong)] p-8 relative"
        style={{ clipPath: 'polygon(15px 0%, 100% 0%, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0% 100%, 0% 15px)' }}
      >
        <CornerBrackets colorClass="border-[var(--accent-cyan)]/40" size={10} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4 text-left">
            <span className="font-mono text-xs text-[var(--accent-pink)] font-bold tracking-widest uppercase">// INQUIRIES_AND_COMMUNICATIONS</span>
            <h2 className="font-rajdhani text-2xl md:text-3xl font-bold text-[var(--text-primary)] tracking-wide uppercase">&gt;_ INITIATE TRANSMISSION</h2>
            <p className="font-body text-xs md:text-sm text-[var(--text-tertiary)] leading-relaxed">
              Tertarik bekerja sama atau ingin mendiskusikan peluang magang/PKL? Form kontak saya dirancang menyerupai terminal command-line untuk mensimulasikan transmisi data yang aman.
            </p>
            <div className="pt-2">
              <Link to="/contact">
                <GlowButton variant="magenta">
                  <span>OPEN TERMINAL</span>
                  <Terminal className="w-4 h-4" />
                </GlowButton>
              </Link>
            </div>
          </div>

          {/* Decorative Cyber Grid Graphic with Pulsing Nodes */}
          <div className="relative h-48 border border-dashed border-cyan-500/15 flex items-center justify-center overflow-hidden bg-[var(--bg-surface)]">
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'radial-gradient(circle, rgba(34,211,238,0.15) 1px, transparent 1px)',
                backgroundSize: '16px 16px'
              }}
            />
            
            {/* Animated signal line drawing itself */}
            <motion.div 
              animate={{ 
                x: [-150, 150],
                opacity: [0, 1, 0]
              }}
              transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
              className="absolute w-20 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent pointer-events-none"
            />

            <div className="relative z-10 text-center space-y-2 font-mono text-[10px] text-[var(--accent-cyan)]/70">
              <motion.div 
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="font-bold text-cyan-300"
              >
                SYS_GATEWAY: ACTIVE
              </motion.div>
              <div className="text-[var(--text-muted)]">IP: 192.168.1.100</div>
              <div className="text-[var(--text-muted)]">PORT: 443 // SSL_ENCRYPTED</div>
              <motion.div 
                animate={{ scale: [0.98, 1.02, 0.98] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="text-[9px] text-[var(--accent-pink)]/80 mt-4 border border-pink-500/30 px-2 py-0.5 inline-block bg-pink-950/20"
              >
                SMK PGRI WLINGI SECURE SERVER
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};
