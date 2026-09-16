import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

// ── Animated counter ──
function CountUp({ target, suffix = '', prefix = '', duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (!isInView) return;
    if (prefersReduced) {
      setCount(target);
      return;
    }

    const startTime = performance.now();

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out-expo
      const eased = 1 - Math.pow(1 - progress, 4);
      const current = Math.round(eased * target);
      setCount(current);
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }, [isInView, target, duration, prefersReduced]);

  return (
    <span ref={ref} className="lp-stat-number">
      {prefix}{count.toLocaleString('en-IN')}{suffix}
    </span>
  );
}

const stats = [
  {
    target: 90000,
    prefix: '₹',
    suffix: ' Cr',
    label: 'Annual crop losses due to pests & diseases across India',
  },
  {
    target: 68,
    suffix: '%',
    label: 'Farmers lack access to timely crop advisory services',
  },
  {
    target: 35,
    suffix: '%',
    label: 'Yield gap between potential and actual farm output',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.96 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      delay: i * 0.2,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

export default function ProblemStats() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: '-80px' });

  return (
    <section className="lp-section" style={{ background: 'var(--lp-bg)' }}>
      <div className="lp-container" ref={containerRef}>
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ textAlign: 'center', marginBottom: '1rem' }}
        >
          <span className="lp-label">The Problem</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="lp-headline"
          style={{
            textAlign: 'center',
            marginBottom: '1rem',
            fontSize: 'clamp(1.8rem, 4vw, 3rem)',
          }}
        >
          Indian farming faces a{' '}
          <span style={{ color: 'var(--lp-accent)' }}>silent crisis.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="lp-subhead"
          style={{ textAlign: 'center', margin: '0 auto 4rem' }}
        >
          Millions of small farmers lose crops every year — not from drought,
          but from the lack of timely, accurate agricultural intelligence.
        </motion.p>

        {/* Stat cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              className="lp-stat-card"
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
            >
              <CountUp
                target={stat.target}
                suffix={stat.suffix}
                prefix={stat.prefix || ''}
              />
              <p className="lp-stat-label">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
