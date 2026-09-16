import React, { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import heroImg from '../HomePage/Images/Hero.jpg';

// ── Particle generator ──
function Particles({ count = 24 }) {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const size = Math.random() * 4 + 2;
      const left = Math.random() * 100;
      const delay = Math.random() * 12;
      const duration = Math.random() * 10 + 14;
      const isGreen = i % 5 === 0;
      return { id: i, size, left, delay, duration, isGreen };
    });
  }, [count]);

  return (
    <div className="lp-particles">
      {particles.map((p) => (
        <span
          key={p.id}
          className={`lp-particle ${p.isGreen ? 'lp-particle--green' : ''}`}
          style={{
            width: p.size + 'px',
            height: p.size + 'px',
            left: p.left + '%',
            bottom: '-10px',
            animationDuration: p.duration + 's',
            animationDelay: p.delay + 's',
          }}
        />
      ))}
    </div>
  );
}

// ── Word-by-word staggered reveal ──
const headlineWords = ['Smarter', 'decisions', 'for', 'every', 'harvest.'];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.3,
    },
  },
};

const wordVariants = {
  hidden: {
    opacity: 0,
    y: 45,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1], // expo-out
    },
  },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

export default function HeroLanding() {
  const prefersReduced = useReducedMotion();

  return (
    <section className="lp-section" style={{ minHeight: '100vh', justifyContent: 'center' }}>
      {/* Particles */}
      {!prefersReduced && <Particles />}

      {/* Ambient glows */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          left: '15%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212,160,83,0.07), transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '5%',
          right: '10%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(57,211,83,0.05), transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div className="lp-container" style={{ position: 'relative', zIndex: 1 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '3rem',
            alignItems: 'center',
          }}
          className="lp-hero-grid"
        >
          {/* ── Left: Text Column ── */}
          <div style={{ maxWidth: '680px' }}>
            {/* Badge */}
            <motion.div
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              custom={0}
              style={{ marginBottom: '1.5rem' }}
            >
              <span className="lp-label">KrishiRakshak • Smart Crop Advisory</span>
            </motion.div>

            {/* Headline — word-by-word stagger */}
            <motion.h1
              className="lp-headline"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0 0.35em',
                marginBottom: '1.5rem',
              }}
            >
              {headlineWords.map((word, i) => (
                <motion.span
                  key={i}
                  variants={wordVariants}
                  style={{
                    display: 'inline-block',
                    color: i === headlineWords.length - 1 ? 'var(--lp-accent)' : 'var(--lp-text)',
                  }}
                >
                  {word}
                </motion.span>
              ))}
            </motion.h1>

            {/* Subtext */}
            <motion.p
              className="lp-subhead"
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              custom={0.7}
              style={{ marginBottom: '2.5rem' }}
            >
              AI-powered crop disease detection, precision fertilizer advice, live mandi prices,
              and a multilingual farming assistant — built for Bharat's farmers.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              custom={1.0}
              style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}
            >
              <Link to="/PredictionIndex" className="lp-btn-primary">
                <span>🔬</span>
                <span>Scan Your Crop</span>
                <span>→</span>
              </Link>
              <Link to="/RecommendIndex" className="lp-btn-secondary">
                <span>🌾</span>
                <span>Try Crop ML</span>
              </Link>
            </motion.div>

            {/* Stats bar */}
            <motion.div
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              custom={1.3}
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1.5rem',
                marginTop: '3rem',
                paddingTop: '1.5rem',
                borderTop: '1px solid var(--lp-border)',
              }}
            >
              {[
                { val: '98%', label: 'Detection Accuracy' },
                { val: '38+', label: 'Crop Diseases' },
                { val: '4,800+', label: 'Mandis Tracked' },
                { val: '6', label: 'Languages' },
              ].map((stat, i) => (
                <div key={i} style={{ minWidth: '80px' }}>
                  <div
                    style={{
                      fontWeight: 800,
                      fontSize: '1.3rem',
                      color: 'var(--lp-accent)',
                      lineHeight: 1,
                    }}
                  >
                    {stat.val}
                  </div>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--lp-text-muted)',
                      marginTop: '0.3rem',
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── Right: Hero Image ── */}
          <motion.div
            initial={{ opacity: 0, scale: 1.15 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            style={{
              position: 'relative',
              borderRadius: 'var(--lp-radius)',
              overflow: 'hidden',
              border: '1px solid var(--lp-border)',
              boxShadow: '0 30px 100px rgba(0,0,0,0.6)',
              maxWidth: '560px',
              width: '100%',
              justifySelf: 'center',
            }}
          >
            <img
              src={heroImg}
              alt="Indian farmer inspecting crops in a lush green field"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                objectFit: 'cover',
                aspectRatio: '4/3',
              }}
            />
            {/* Gradient overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(to top, var(--lp-bg) 0%, transparent 40%)',
                pointerEvents: 'none',
              }}
            />
          </motion.div>
        </div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.0, duration: 1 }}
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.4rem',
        }}
      >
        <span style={{ fontSize: '0.7rem', color: 'var(--lp-text-muted)', letterSpacing: '0.1em' }}>
          SCROLL TO EXPLORE
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: '20px',
            height: '32px',
            borderRadius: '10px',
            border: '2px solid var(--lp-text-muted)',
            display: 'flex',
            justifyContent: 'center',
            paddingTop: '6px',
          }}
        >
          <div
            style={{
              width: '3px',
              height: '8px',
              borderRadius: '2px',
              background: 'var(--lp-accent)',
            }}
          />
        </motion.div>
      </motion.div>

      {/* Hero grid responsive override */}
      <style>{`
        @media (min-width: 1024px) {
          .lp-hero-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
