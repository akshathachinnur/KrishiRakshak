import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

const steps = [
  {
    num: '1',
    title: 'Enter your farm data',
    body: 'Input your soil NPK values, pH level, temperature, humidity, and rainfall — or snap a photo of your crop leaf for instant diagnosis.',
  },
  {
    num: '2',
    title: 'Get ML-powered recommendation',
    body: 'Our machine learning models analyze your data against thousands of agronomic records to recommend the best crop, optimal fertilizer dosage, or identify the exact disease.',
  },
  {
    num: '3',
    title: 'Chat with Kisan AI for advice',
    body: 'Have follow-up questions? Ask Kisan AI in your language — Hindi, Marathi, Kannada, Telugu, Gujarati, or English. Get voice-enabled answers 24/7.',
  },
];

const stepVariants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

function TimelineStep({ step, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      className={`lp-timeline-step ${isInView ? 'lp-timeline-step--active' : ''}`}
      variants={stepVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      <div className="lp-timeline-dot">{step.num}</div>
      <h4 style={{ color: isInView ? 'var(--lp-text)' : 'var(--lp-text-dim)' }}>
        {step.title}
      </h4>
      <p>{step.body}</p>
    </motion.div>
  );
}

export default function HowItWorks() {
  const sectionRef = useRef(null);
  const timelineRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const prefersReduced = useReducedMotion();

  // Animate the timeline fill line based on scroll
  const [fillHeight, setFillHeight] = useState(0);

  useEffect(() => {
    if (prefersReduced || !timelineRef.current) return;

    function handleScroll() {
      const el = timelineRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const windowH = window.innerHeight;

      // How much of the timeline container is above the viewport center
      const scrolled = windowH * 0.6 - rect.top;
      const total = rect.height;
      const pct = Math.max(0, Math.min(1, scrolled / total));
      setFillHeight(pct * 100);
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prefersReduced]);

  return (
    <section className="lp-section" ref={sectionRef}>
      <div className="lp-container" style={{ maxWidth: '700px' }}>
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ textAlign: 'center', marginBottom: '1rem' }}
        >
          <span className="lp-label">How It Works</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="lp-headline"
          style={{
            textAlign: 'center',
            fontSize: 'clamp(1.8rem, 4vw, 3rem)',
            marginBottom: '4rem',
          }}
        >
          Three steps to a{' '}
          <span style={{ color: 'var(--lp-accent)' }}>better harvest.</span>
        </motion.h2>

        {/* Timeline */}
        <div className="lp-timeline" ref={timelineRef}>
          {/* Animated fill line */}
          <div
            className="lp-timeline-line-fill"
            style={{ height: `${fillHeight}%` }}
          />

          {steps.map((step, i) => (
            <TimelineStep key={i} step={step} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
