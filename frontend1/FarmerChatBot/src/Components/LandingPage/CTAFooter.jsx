import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function CTAFooter() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <>
      {/* ── CTA Section ── */}
      <section
        className="lp-section"
        ref={ref}
        style={{ minHeight: '70vh', justifyContent: 'center' }}
      >
        <div
          className="lp-container"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{ marginBottom: '1rem' }}
          >
            <span className="lp-label">Get Started</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lp-headline"
            style={{ marginBottom: '1.5rem' }}
          >
            Your farm deserves
            <br />
            <span style={{ color: 'var(--lp-accent)' }}>intelligence.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="lp-subhead"
            style={{ marginBottom: '3rem', textAlign: 'center' }}
          >
            Free. No sign-up required. Built with love for Bharat's farmers.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              justifyContent: 'center',
            }}
          >
            <Link to="/PredictionIndex" className="lp-btn-primary">
              <span>Start Scanning</span>
              <span>→</span>
            </Link>
            <Link to="/RecommendIndex" className="lp-btn-secondary">
              <span>🌾</span>
              <span>Try Crop ML</span>
            </Link>
          </motion.div>

          {/* Helpline */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.8 }}
            style={{
              marginTop: '3rem',
              padding: '1rem 2rem',
              borderRadius: '100px',
              background: 'var(--lp-surface)',
              border: '1px solid var(--lp-border)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>📞</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--lp-text-dim)' }}>
              Toll-Free Kisan Helpline:{' '}
              <a
                href="tel:18001801551"
                style={{
                  color: 'var(--lp-accent)',
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                1800-180-1551
              </a>
            </span>
          </motion.div>
        </div>
      </section>

      {/* ── Minimal Footer ── */}
      <footer className="lp-footer">
        <p className="lp-footer-text">
          Built for Bharat's Farmers •{' '}
          <strong style={{ color: 'var(--lp-text-dim)' }}>KrishiRakshak</strong>
          {' '}• 100% Free • No Ads
        </p>
        <p className="lp-footer-text" style={{ marginTop: '0.5rem' }}>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          {' • '}
          <Link to="/home-classic" style={{ color: 'var(--lp-accent)', textDecoration: 'none' }}>
            Classic Home
          </Link>
        </p>
      </footer>
    </>
  );
}
